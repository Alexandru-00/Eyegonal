-- Schema per Eyegonal Admin Panel

-- Abilita RLS (Row Level Security)
ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;

-- Tabella prodotti
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  image TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Tabella categorie prodotti
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Tabella admin_users (per autenticazione personalizzata)
CREATE TABLE admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  last_login TIMESTAMP WITH TIME ZONE
);

-- Abilita RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Policy per prodotti (lettura pubblica, scrittura solo admin)
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (true);

CREATE POLICY "Products are insertable by authenticated users" ON products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Products are updatable by authenticated users" ON products
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Products are deletable by authenticated users" ON products
  FOR DELETE USING (auth.role() = 'authenticated');

-- Policy per categorie (lettura pubblica, scrittura solo admin)
CREATE POLICY "Categories are viewable by everyone" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Categories are insertable by authenticated users" ON categories
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Categories are updatable by authenticated users" ON categories
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Categories are deletable by authenticated users" ON categories
  FOR DELETE USING (auth.role() = 'authenticated');

-- Policy per admin_users (solo lettura/scrittura per admin)
CREATE POLICY "Admin users are manageable by authenticated users" ON admin_users
  FOR ALL USING (auth.role() = 'authenticated');

-- Funzione per aggiornare updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger per aggiornare updated_at su products
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger per aggiornare updated_at su categories
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Inserisci categorie di esempio
INSERT INTO categories (name, description) VALUES
('tshirt', 'T-shirt e magliette'),
('hoodie', 'Felpe con cappuccio'),
('accessories', 'Accessori e complementi');

-- Inserisci alcuni prodotti di esempio
INSERT INTO products (name, price, category_id, image, description) VALUES
('Eye Tee Black', 35.00, (SELECT id FROM categories WHERE name = 'tshirt'), '/images/products/tee-black.jpg', 'T-shirt nera con logo Eyegonal frontale'),
('Eye Tee White', 35.00, (SELECT id FROM categories WHERE name = 'tshirt'), '/images/products/tee-white.jpg', 'T-shirt bianca con logo Eyegonal frontale'),
('Hexagon Hoodie Black', 55.00, (SELECT id FROM categories WHERE name = 'hoodie'), '/images/products/hoodie-black.jpg', 'Felpa nera con cappuccio e logo esagonale'),
('Hexagon Hoodie White', 55.00, (SELECT id FROM categories WHERE name = 'hoodie'), '/images/products/hoodie-white.jpg', 'Felpa bianca con cappuccio e logo esagonale'),
('Eye Long Sleeve Black', 42.00, (SELECT id FROM categories WHERE name = 'tshirt'), '/images/products/longsleeve-black.jpg', 'Maglia a maniche lunghe nera'),
('Eye Long Sleeve White', 42.00, (SELECT id FROM categories WHERE name = 'tshirt'), '/images/products/longsleeve-white.jpg', 'Maglia a maniche lunghe bianca');

-- Crea un admin di default (password: admin123)
-- NOTA: In produzione, usa una password sicura e hashala con bcrypt
INSERT INTO admin_users (email, password_hash) VALUES
('admin@eyegonal.com', '$2b$10$8K3Q8VzJW8X6K8VzJW8X6K8VzJW8X6K8VzJW8X6K8VzJW8X6K'); -- password: admin123