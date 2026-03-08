-- =====================================================
-- EYEGONAL - Fix database (copia e incolla in Supabase SQL Editor)
-- Dashboard: https://supabase.com/dashboard > tuo progetto > SQL Editor
-- =====================================================

-- Crea categories se non esiste
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

INSERT INTO categories (name, description) VALUES
  ('tshirt', 'T-shirt e magliette'),
  ('hoodie', 'Felpe con cappuccio'),
  ('accessories', 'Accessori e complementi')
ON CONFLICT (name) DO NOTHING;

-- Aggiungi category_id a products se manca
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='products' AND column_name='category_id') THEN
    NULL; -- colonna già presente
  ELSIF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='products') THEN
    ALTER TABLE products ADD COLUMN category_id UUID REFERENCES categories(id);
    UPDATE products SET category_id = (SELECT id FROM categories WHERE name = 'tshirt' LIMIT 1) WHERE category_id IS NULL;
    ALTER TABLE products ALTER COLUMN category_id SET NOT NULL;
  END IF;
END $$;

-- RLS: prodotti e categorie leggibili da tutti
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "products_select_public" ON products;
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
CREATE POLICY "products_select_public" ON products FOR SELECT USING (true);

DROP POLICY IF EXISTS "categories_select_public" ON categories;
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON categories;
CREATE POLICY "categories_select_public" ON categories FOR SELECT USING (true);
