-- =====================================================
-- Session-based admin auth per CRUD prodotti/categorie
-- Scalabile: no dipendenza da Supabase Auth / Anonymous
-- Esegui in Supabase SQL Editor
-- =====================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Tabella sessioni admin (token breve, scadenza 24h)
CREATE TABLE IF NOT EXISTS admin_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '24 hours'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires ON admin_sessions(expires_at);

ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS admin_sessions_no_direct_access ON admin_sessions;
CREATE POLICY admin_sessions_no_direct_access ON admin_sessions FOR ALL USING (false);

-- Aggiorna verify_admin_login: crea sessione e restituisce sessionToken
CREATE OR REPLACE FUNCTION public.verify_admin_login(p_email text, p_password text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_admin record;
  v_token text;
BEGIN
  IF p_email IS NULL OR p_email = '' OR p_password IS NULL OR p_password = '' THEN
    RETURN jsonb_build_object('error', 'Email e password sono richiesti');
  END IF;

  SELECT id, email, password_hash, created_at, last_login
  INTO v_admin
  FROM admin_users
  WHERE email = LOWER(TRIM(p_email))
  LIMIT 1;

  IF v_admin IS NULL THEN
    RETURN jsonb_build_object('error', 'Credenziali non valide');
  END IF;

  IF extensions.crypt(p_password, v_admin.password_hash) != v_admin.password_hash THEN
    RETURN jsonb_build_object('error', 'Credenziali non valide');
  END IF;

  UPDATE admin_users SET last_login = NOW() WHERE id = v_admin.id;

  v_token := encode(gen_random_bytes(32), 'hex');
  INSERT INTO admin_sessions (admin_id, token, expires_at)
  VALUES (v_admin.id, v_token, NOW() + INTERVAL '24 hours');

  RETURN jsonb_build_object(
    'adminUser', jsonb_build_object(
      'id', v_admin.id,
      'email', v_admin.email,
      'created_at', v_admin.created_at,
      'last_login', NOW()
    ),
    'sessionToken', v_token
  );
END;
$$;

-- Verifica sessione admin (usata dalle RPC)
CREATE OR REPLACE FUNCTION public.admin_verify_session(p_token text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_admin_id uuid;
BEGIN
  IF p_token IS NULL OR p_token = '' THEN
    RETURN NULL;
  END IF;

  DELETE FROM admin_sessions WHERE expires_at < NOW();

  SELECT admin_id INTO v_admin_id
  FROM admin_sessions
  WHERE token = p_token AND expires_at > NOW()
  LIMIT 1;

  RETURN v_admin_id;
END;
$$;

-- RPC: insert product
CREATE OR REPLACE FUNCTION public.admin_insert_product(
  p_session_token text,
  p_name text,
  p_price numeric,
  p_category_id uuid,
  p_image text DEFAULT NULL,
  p_description text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_admin_id uuid;
  v_row products%ROWTYPE;
BEGIN
  v_admin_id := admin_verify_session(p_session_token);
  IF v_admin_id IS NULL THEN
    RETURN jsonb_build_object('error', 'Sessione non valida o scaduta');
  END IF;

  INSERT INTO products (name, price, category_id, image, description)
  VALUES (p_name, p_price, p_category_id, NULLIF(p_image, ''), NULLIF(p_description, ''))
  RETURNING * INTO v_row;

  RETURN (SELECT to_jsonb(p) || jsonb_build_object('category',
    (SELECT to_jsonb(c) FROM categories c WHERE c.id = p.category_id))
    FROM products p WHERE p.id = v_row.id);
END;
$$;

-- RPC: update product
CREATE OR REPLACE FUNCTION public.admin_update_product(
  p_session_token text,
  p_id uuid,
  p_name text,
  p_price numeric,
  p_category_id uuid,
  p_image text DEFAULT NULL,
  p_description text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_admin_id uuid;
BEGIN
  v_admin_id := admin_verify_session(p_session_token);
  IF v_admin_id IS NULL THEN
    RETURN jsonb_build_object('error', 'Sessione non valida o scaduta');
  END IF;

  UPDATE products
  SET name = p_name, price = p_price, category_id = p_category_id,
      image = NULLIF(p_image, ''), description = NULLIF(p_description, ''),
      updated_at = NOW()
  WHERE id = p_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'Prodotto non trovato');
  END IF;

  RETURN (SELECT to_jsonb(p) || jsonb_build_object('category',
    (SELECT to_jsonb(c) FROM categories c WHERE c.id = p.category_id))
    FROM products p WHERE p.id = p_id);
END;
$$;

-- RPC: delete product
CREATE OR REPLACE FUNCTION public.admin_delete_product(p_session_token text, p_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_admin_id uuid;
BEGIN
  v_admin_id := admin_verify_session(p_session_token);
  IF v_admin_id IS NULL THEN
    RETURN jsonb_build_object('error', 'Sessione non valida o scaduta');
  END IF;

  DELETE FROM products WHERE id = p_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'Prodotto non trovato');
  END IF;

  RETURN jsonb_build_object('success', true);
END;
$$;

-- RPC: insert category
CREATE OR REPLACE FUNCTION public.admin_insert_category(
  p_session_token text,
  p_name text,
  p_description text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_admin_id uuid;
  v_row categories%ROWTYPE;
BEGIN
  v_admin_id := admin_verify_session(p_session_token);
  IF v_admin_id IS NULL THEN
    RETURN jsonb_build_object('error', 'Sessione non valida o scaduta');
  END IF;

  INSERT INTO categories (name, description)
  VALUES (p_name, NULLIF(p_description, ''))
  RETURNING * INTO v_row;

  RETURN to_jsonb(v_row);
END;
$$;

-- RPC: update category
CREATE OR REPLACE FUNCTION public.admin_update_category(
  p_session_token text,
  p_id uuid,
  p_name text,
  p_description text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_admin_id uuid;
  v_row categories%ROWTYPE;
BEGIN
  v_admin_id := admin_verify_session(p_session_token);
  IF v_admin_id IS NULL THEN
    RETURN jsonb_build_object('error', 'Sessione non valida o scaduta');
  END IF;

  UPDATE categories
  SET name = p_name, description = NULLIF(p_description, ''), updated_at = NOW()
  WHERE id = p_id
  RETURNING * INTO v_row;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'Categoria non trovata');
  END IF;

  RETURN to_jsonb(v_row);
END;
$$;

-- RPC: delete category
CREATE OR REPLACE FUNCTION public.admin_delete_category(p_session_token text, p_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_admin_id uuid;
BEGIN
  v_admin_id := admin_verify_session(p_session_token);
  IF v_admin_id IS NULL THEN
    RETURN jsonb_build_object('error', 'Sessione non valida o scaduta');
  END IF;

  DELETE FROM categories WHERE id = p_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'Categoria non trovata');
  END IF;

  RETURN jsonb_build_object('success', true);
END;
$$;

-- Revoca sessione al logout (opzionale - chiamabile dal client)
CREATE OR REPLACE FUNCTION public.admin_revoke_session(p_token text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM admin_sessions WHERE token = p_token;
END;
$$;

-- Grant execute
GRANT EXECUTE ON FUNCTION public.verify_admin_login(text, text) TO anon;
GRANT EXECUTE ON FUNCTION public.verify_admin_login(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_insert_product(text, text, numeric, uuid, text, text) TO anon;
GRANT EXECUTE ON FUNCTION public.admin_insert_product(text, text, numeric, uuid, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_update_product(text, uuid, text, numeric, uuid, text, text) TO anon;
GRANT EXECUTE ON FUNCTION public.admin_update_product(text, uuid, text, numeric, uuid, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_delete_product(text, uuid) TO anon;
GRANT EXECUTE ON FUNCTION public.admin_delete_product(text, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_insert_category(text, text, text) TO anon;
GRANT EXECUTE ON FUNCTION public.admin_insert_category(text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_update_category(text, uuid, text, text) TO anon;
GRANT EXECUTE ON FUNCTION public.admin_update_category(text, uuid, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_delete_category(text, uuid) TO anon;
GRANT EXECUTE ON FUNCTION public.admin_delete_category(text, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_revoke_session(text) TO anon;
GRANT EXECUTE ON FUNCTION public.admin_revoke_session(text) TO authenticated;
