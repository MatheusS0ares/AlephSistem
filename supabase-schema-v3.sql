-- ===========================
-- REINO IMPERIAL — Schema v3
-- Cole este SQL no Supabase > SQL Editor > Run
-- ===========================

-- Garante que as duas lojas existem
INSERT INTO stores (name, slug, active)
SELECT 'Reino Imperial', 'reino-imperial', true
WHERE NOT EXISTS (SELECT 1 FROM stores WHERE slug = 'reino-imperial');

INSERT INTO stores (name, slug, active)
SELECT 'Personalize+', 'personalize', true
WHERE NOT EXISTS (SELECT 1 FROM stores WHERE slug = 'personalize');

-- Adiciona coluna de itens (lista de produtos por pedido) se não existir
ALTER TABLE orders ADD COLUMN IF NOT EXISTS items jsonb DEFAULT '[]';

-- Adiciona coluna de data do pedido se não existir
ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_date date;

-- Garante que a coluna price_num existe em products
ALTER TABLE products ADD COLUMN IF NOT EXISTS price_num numeric(10,2);

-- Atualiza settings para suportar store_id null quando store_id é do tipo uuid
-- (garante que o unique constraint aceita múltiplos null com store_id diferente)
-- Já deve estar correto pelo schema v1, mas confirmamos:
-- unique (store_id, key)  ← já existe

-- Desabilita RLS nas tabelas usadas pelo admin (caso tenham sido habilitadas)
ALTER TABLE customers    DISABLE ROW LEVEL SECURITY;
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders       DISABLE ROW LEVEL SECURITY;
ALTER TABLE products     DISABLE ROW LEVEL SECURITY;
ALTER TABLE settings     DISABLE ROW LEVEL SECURITY;
ALTER TABLE stores       DISABLE ROW LEVEL SECURITY;
