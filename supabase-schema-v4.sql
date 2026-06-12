-- Migration v4: add missing columns to customers table
ALTER TABLE customers ADD COLUMN IF NOT EXISTS notes      text;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS vip        boolean DEFAULT false;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS store_id   uuid REFERENCES stores(id) ON DELETE SET NULL;

-- Make sure settings table supports per-store keys (needed for nf_* and msg_* per store)
ALTER TABLE settings ADD COLUMN IF NOT EXISTS store_id uuid REFERENCES stores(id) ON DELETE CASCADE;

-- Unique constraint so upsert works correctly
ALTER TABLE settings DROP CONSTRAINT IF EXISTS settings_store_id_key_unique;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'settings_store_id_key_unique'
  ) THEN
    ALTER TABLE settings ADD CONSTRAINT settings_store_id_key_unique UNIQUE (store_id, key);
  END IF;
END $$;

-- Disable RLS on all tables (development mode)
ALTER TABLE customers  DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders     DISABLE ROW LEVEL SECURITY;
ALTER TABLE products   DISABLE ROW LEVEL SECURITY;
ALTER TABLE settings   DISABLE ROW LEVEL SECURITY;
ALTER TABLE stores     DISABLE ROW LEVEL SECURITY;
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
