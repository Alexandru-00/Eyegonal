-- =====================================================
-- MIGRAZIONE EYEGONAL - Fix schema e RLS
-- Esegui in Supabase SQL Editor (Supabase Dashboard > SQL Editor)
-- =====================================================

-- 1. CREA tabella categories se non esiste (PRIMA delle altre operazioni)
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 2. RIMUOVI policy esistenti
DROP POLICY IF EXISTS "Products are insertable by authenticated users" ON products;
DROP POLICY IF EXISTS "Products are updatable by authenticated users" ON products;
DROP POLICY IF EXISTS "Products are deletable by authenticated users" ON products;
DROP POLICY IF EXISTS "products_select_public" ON products;
DROP POLICY IF EXISTS "products_insert_authenticated" ON products;
DROP POLICY IF EXISTS "products_update_authenticated" ON products;
DROP POLICY IF EXISTS "products_delete_authenticated" ON products;
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON categories;
DROP POLICY IF EXISTS "Categories are insertable by authenticated users" ON categories;
DROP POLICY IF EXISTS "Categories are updatable by authenticated users" ON categories;
DROP POLICY IF EXISTS "Categories are deletable by authenticated users" ON categories;
DROP POLICY IF EXISTS "categories_select_public" ON categories;
DROP POLICY IF EXISTS "categories_insert_authenticated" ON categories;
DROP POLICY IF EXISTS "categories_update_authenticated" ON categories;
DROP POLICY IF EXISTS "categories_delete_authenticated" ON categories;
DROP POLICY IF EXISTS "Admin users are manageable by authenticated users" ON admin_users;
DROP POLICY IF EXISTS "admin_users_no_anon_access" ON admin_users;

-- 3. Inserisci categorie se la tabella è vuota
INSERT INTO categories (name, description) VALUES
  ('tshirt', 'T-shirt e magliette'),
  ('hoodie', 'Felpe con cappuccio'),
  ('accessories', 'Accessori e complementi')
ON CONFLICT (name) DO NOTHING;

-- 4. Se products esiste ma non ha category_id, aggiungilo
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'products') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'category_id') THEN
      ALTER TABLE products ADD COLUMN category_id UUID REFERENCES categories(id);
      -- Assegna categoria di default ai prodotti esistenti
      UPDATE products SET category_id = (SELECT id FROM categories WHERE name = 'tshirt' LIMIT 1) WHERE category_id IS NULL;
      ALTER TABLE products ALTER COLUMN category_id SET NOT NULL;
    END IF;
  END IF;
END $$;

-- 5. Crea tabella products se non esiste (schema completo)
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  image TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Se products esisteva già con struttura diversa, la sezione sopra gestisce category_id

-- 6. Abilita RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- 7. POLICY: Products - lettura PUBBLICA (anon + authenticated)
CREATE POLICY "products_select_public" ON products
  FOR SELECT USING (true);

CREATE POLICY "products_insert_authenticated" ON products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "products_update_authenticated" ON products
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "products_delete_authenticated" ON products
  FOR DELETE USING (auth.role() = 'authenticated');

-- 8. POLICY: Categories - lettura PUBBLICA
CREATE POLICY "categories_select_public" ON categories
  FOR SELECT USING (true);

CREATE POLICY "categories_insert_authenticated" ON categories
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "categories_update_authenticated" ON categories
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "categories_delete_authenticated" ON categories
  FOR DELETE USING (auth.role() = 'authenticated');

-- 9. POLICY: Admin_users - nessun accesso via anon (solo Edge Function con service_role)
-- La tabella admin_users NON deve essere leggibile con anon key
-- L'Edge Function usa service_role che bypassa RLS
CREATE POLICY "admin_users_no_anon_access" ON admin_users
  FOR ALL USING (false);

-- Alternativa: permetti solo a service_role (utente postgres) - RLS non blocca service_role
-- Con la policy above (false), nessun client può accedere; l'Edge Function con service_role bypassa RLS

-- 10. Trigger per updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 11. Esponi le tabelle all'API REST (PostgREST)
-- Le tabelle public sono esposte di default

-- 12. Inserisci prodotti di esempio se la tabella è vuota
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM products LIMIT 1) THEN
    INSERT INTO products (name, price, category_id, image, description)
    SELECT 'Eye Tee Black', 35.00, c.id, '/images/products/tee-black.jpg', 'T-shirt nera con logo Eyegonal'
    FROM categories c WHERE c.name = 'tshirt' LIMIT 1;
  END IF;
END $$;
