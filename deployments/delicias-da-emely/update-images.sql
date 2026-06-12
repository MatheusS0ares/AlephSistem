-- Update image_url for Delicias da Emely products
-- Run this in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/uhxbnleyfowhpdbnrdqc/sql/new

DO $$
DECLARE
  store_slug TEXT := 'delicias-da-emely';
  base_url   TEXT := 'https://uhxbnleyfowhpdbnrdqc.supabase.co/storage/v1/object/public/emely';
BEGIN

  UPDATE products SET image_url = base_url || '/jogo-ferrero.png'
  WHERE store_slug = store_slug AND name ILIKE '%Ferrero%';

  UPDATE products SET image_url = base_url || '/jogo-brigadeiro.png'
  WHERE store_slug = store_slug AND name ILIKE '%Brigadeiros Gourmet%' AND name ILIKE '%Jogo%';

  UPDATE products SET image_url = base_url || '/caixa-9.png'
  WHERE store_slug = store_slug AND name ILIKE '%Caixa 9%';

  UPDATE products SET image_url = base_url || '/caixa-16.png'
  WHERE store_slug = store_slug AND name ILIKE '%Caixa 16%';

  UPDATE products SET image_url = base_url || '/kit-romantico.png'
  WHERE store_slug = store_slug AND name ILIKE '%Rom%ntico%';

  UPDATE products SET image_url = base_url || '/kit-festa-50.png'
  WHERE store_slug = store_slug AND name ILIKE '%Festa%50%';

  UPDATE products SET image_url = base_url || '/kit-corporativo.png'
  WHERE store_slug = store_slug AND name ILIKE '%Corporativo%';

  UPDATE products SET image_url = base_url || '/trufas.png'
  WHERE store_slug = store_slug AND name ILIKE '%Trufa%';

  RAISE NOTICE 'Done — check with: SELECT name, image_url FROM products WHERE store_slug = ''%''', store_slug;
END $$;

-- Quick verification query:
-- SELECT name, image_url FROM products WHERE store_slug = 'delicias-da-emely' ORDER BY id;
