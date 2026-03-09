-- =====================================================
-- Fix verify_admin_login: usa search_path corretto per crypt
-- Esegui in Supabase SQL Editor
-- =====================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION public.verify_admin_login(p_email text, p_password text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_admin record;
  v_token text;
BEGIN
  IF p_email IS NULL OR trim(p_email) = '' OR p_password IS NULL THEN
    RETURN jsonb_build_object('error', 'Email e password sono richiesti');
  END IF;

  SELECT id, email, password_hash, created_at, last_login
  INTO v_admin
  FROM admin_users
  WHERE email = lower(trim(p_email))
  LIMIT 1;

  IF v_admin IS NULL THEN
    RETURN jsonb_build_object('error', 'Credenziali non valide');
  END IF;

  IF crypt(trim(p_password), v_admin.password_hash) IS DISTINCT FROM v_admin.password_hash THEN
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
