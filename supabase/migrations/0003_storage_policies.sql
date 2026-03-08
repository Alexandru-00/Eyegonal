-- =====================================================
-- Storage policies per bucket products
-- Esegui DOPO aver creato il bucket 'products' in Storage
-- Dashboard: Storage > New bucket > products (Public)
-- =====================================================

-- Rimuovi policy esistenti per evitare duplicati
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Products images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete product images" ON storage.objects;

-- Lettura pubblica (immagini visibili a tutti)
CREATE POLICY "storage_products_select_public"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'products');

-- Insert/Update/Delete per utenti autenticati (admin dopo signInAnonymously)
CREATE POLICY "storage_products_insert_authenticated"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'products' AND auth.role() = 'authenticated');

CREATE POLICY "storage_products_update_authenticated"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'products' AND auth.role() = 'authenticated');

CREATE POLICY "storage_products_delete_authenticated"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'products' AND auth.role() = 'authenticated');
