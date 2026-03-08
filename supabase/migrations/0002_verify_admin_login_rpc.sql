-- =====================================================
-- RPC per login admin - usa tabella admin_users
-- Scalabile: nessun CORS, esegue in DB, zero dipendenze esterne
-- Esegui in Supabase SQL Editor
-- =====================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION public.verify_admin_login(p_email text, p_password text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_admin record;
  v_result jsonb;
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

  IF crypt(p_password, v_admin.password_hash) != v_admin.password_hash THEN
    RETURN jsonb_build_object('error', 'Credenziali non valide');
  END IF;

  -- Aggiorna last_login
  UPDATE admin_users
  SET last_login = NOW()
  WHERE id = v_admin.id;

  RETURN jsonb_build_object(
    'adminUser', jsonb_build_object(
      'id', v_admin.id,
      'email', v_admin.email,
      'created_at', v_admin.created_at,
      'last_login', NOW()
    )
  );
END;
$$;

-- Consenti chiamata da anon (per login prima di essere autenticati)
GRANT EXECUTE ON FUNCTION public.verify_admin_login(text, text) TO anon;
GRANT EXECUTE ON FUNCTION public.verify_admin_login(text, text) TO authenticated;
