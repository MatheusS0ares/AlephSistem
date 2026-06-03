-- Migration v5: add image_url to orders/products + create storage buckets

-- 1. Add image_url columns
ALTER TABLE orders   ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url text;

-- 2. Create storage buckets (or create manually in Supabase Dashboard > Storage)
INSERT INTO storage.buckets (id, name, public) VALUES ('order-images',   'order-images',   true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true) ON CONFLICT (id) DO NOTHING;

-- 3. Storage policies (allow public read + upload since RLS is disabled on objects)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'order-images public read' AND tablename = 'objects') THEN
    EXECUTE 'CREATE POLICY "order-images public read" ON storage.objects FOR SELECT USING (bucket_id = ''order-images'')';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'order-images public insert' AND tablename = 'objects') THEN
    EXECUTE 'CREATE POLICY "order-images public insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = ''order-images'')';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'order-images public update' AND tablename = 'objects') THEN
    EXECUTE 'CREATE POLICY "order-images public update" ON storage.objects FOR UPDATE USING (bucket_id = ''order-images'')';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'order-images public delete' AND tablename = 'objects') THEN
    EXECUTE 'CREATE POLICY "order-images public delete" ON storage.objects FOR DELETE USING (bucket_id = ''order-images'')';
  END IF;
END $$;
