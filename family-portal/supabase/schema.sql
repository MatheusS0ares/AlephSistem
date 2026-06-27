-- ============================================================
-- Casa Portal — Schema Supabase
-- Execute este arquivo no SQL Editor do Supabase
-- ============================================================

-- Extensões
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- FAMÍLIAS
-- ============================================================
CREATE TABLE families (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE family_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id UUID REFERENCES families(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(family_id, user_id)
);

-- ============================================================
-- FINANCEIRO
-- ============================================================
CREATE TABLE finance_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id UUID REFERENCES families(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'circle',
  color TEXT NOT NULL DEFAULT '#6b7280',
  type TEXT NOT NULL CHECK (type IN ('income', 'expense', 'both')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE credit_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id UUID REFERENCES families(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  last_digits CHAR(4),
  card_limit NUMERIC(10, 2) NOT NULL DEFAULT 0,
  closing_day INTEGER CHECK (closing_day BETWEEN 1 AND 31),
  due_day INTEGER CHECK (due_day BETWEEN 1 AND 31),
  color TEXT DEFAULT '#6366f1',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id UUID REFERENCES families(id) ON DELETE CASCADE,
  member_id UUID REFERENCES family_members(id),
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  amount NUMERIC(10, 2) NOT NULL,
  description TEXT NOT NULL,
  category_id UUID REFERENCES finance_categories(id),
  payment_method TEXT CHECK (payment_method IN ('cash', 'debit', 'credit_card', 'pix', 'transfer')),
  credit_card_id UUID REFERENCES credit_cards(id),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence TEXT CHECK (recurrence IN ('daily', 'weekly', 'monthly', 'yearly')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- DOCUMENTOS
-- ============================================================
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id UUID REFERENCES families(id) ON DELETE CASCADE,
  owner_member_id UUID REFERENCES family_members(id),
  name TEXT NOT NULL,
  type TEXT DEFAULT 'other' CHECK (type IN ('rg', 'cpf', 'cnh', 'passport', 'birth_certificate', 'marriage', 'other')),
  file_url TEXT NOT NULL,
  file_size INTEGER,
  file_name TEXT,
  expires_at DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- MANTIMENTOS
-- ============================================================
CREATE TABLE pantry_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id UUID REFERENCES families(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Outros',
  unit TEXT NOT NULL DEFAULT 'unid',
  current_quantity NUMERIC(10, 2) DEFAULT 0,
  min_quantity NUMERIC(10, 2) DEFAULT 1,
  emoji TEXT DEFAULT '🛒',
  added_by UUID REFERENCES family_members(id),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- LISTA DE COMPRAS
-- ============================================================
CREATE TABLE shopping_lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id UUID REFERENCES families(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Lista de compras',
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'shopping', 'done')),
  store TEXT,
  created_by UUID REFERENCES family_members(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  finished_at TIMESTAMPTZ
);

CREATE TABLE shopping_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  list_id UUID REFERENCES shopping_lists(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  quantity NUMERIC(10, 2) DEFAULT 1,
  unit TEXT DEFAULT 'unid',
  estimated_price NUMERIC(10, 2),
  actual_price NUMERIC(10, 2),
  category TEXT DEFAULT 'Outros',
  emoji TEXT DEFAULT '🛒',
  checked BOOLEAN DEFAULT FALSE,
  checked_by UUID REFERENCES family_members(id),
  checked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TAREFAS
-- ============================================================
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id UUID REFERENCES families(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  assigned_to UUID REFERENCES family_members(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'done')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  due_date DATE,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence TEXT CHECK (recurrence IN ('daily', 'weekly', 'monthly')),
  points INTEGER DEFAULT 5,
  emoji TEXT DEFAULT '✅',
  completed_by UUID REFERENCES family_members(id),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CALENDÁRIO
-- ============================================================
CREATE TABLE calendar_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id UUID REFERENCES families(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  all_day BOOLEAN DEFAULT TRUE,
  color TEXT DEFAULT '#22c55e',
  created_by UUID REFERENCES family_members(id),
  notify_all BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SAÚDE
-- ============================================================
CREATE TABLE health_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id UUID REFERENCES families(id) ON DELETE CASCADE,
  member_id UUID REFERENCES family_members(id),
  type TEXT NOT NULL CHECK (type IN ('appointment', 'medication', 'vaccine', 'exam')),
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  doctor TEXT,
  location TEXT,
  file_url TEXT,
  next_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE medications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id UUID REFERENCES families(id) ON DELETE CASCADE,
  member_id UUID REFERENCES family_members(id),
  name TEXT NOT NULL,
  dosage TEXT,
  schedule TEXT,
  stock INTEGER DEFAULT 0,
  refill_alert INTEGER DEFAULT 10,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- VEÍCULOS
-- ============================================================
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id UUID REFERENCES families(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  brand TEXT,
  model TEXT,
  year INTEGER,
  plate TEXT,
  color TEXT DEFAULT '#1e40af',
  fuel_type TEXT CHECK (fuel_type IN ('gasoline', 'ethanol', 'diesel', 'electric', 'hybrid', 'flex')),
  ipva_due DATE,
  insurance_due DATE,
  next_revision DATE,
  current_km INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE vehicle_maintenances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  km INTEGER,
  cost NUMERIC(10, 2),
  workshop TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CONTATOS DE EMERGÊNCIA
-- ============================================================
CREATE TABLE emergency_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id UUID REFERENCES families(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  relation TEXT,
  phone TEXT NOT NULL,
  email TEXT,
  category TEXT DEFAULT 'Outros',
  priority INTEGER DEFAULT 3,
  emoji TEXT DEFAULT '📞',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE families ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE pantry_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_maintenances ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;

-- Função auxiliar para pegar o family_id do usuário logado
CREATE OR REPLACE FUNCTION get_user_family_id()
RETURNS UUID AS $$
  SELECT family_id FROM family_members WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

-- Políticas: somente membros da mesma família podem ver e alterar dados

CREATE POLICY "family_members_select" ON family_members FOR SELECT USING (family_id = get_user_family_id());
CREATE POLICY "family_members_insert" ON family_members FOR INSERT WITH CHECK (family_id = get_user_family_id() OR user_id = auth.uid());
CREATE POLICY "family_members_update" ON family_members FOR UPDATE USING (family_id = get_user_family_id());

CREATE POLICY "families_select" ON families FOR SELECT USING (id = get_user_family_id());
CREATE POLICY "families_insert" ON families FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "families_update" ON families FOR UPDATE USING (id = get_user_family_id());

-- Macro para criar políticas CRUD por family_id
DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['finance_categories','credit_cards','transactions','documents','pantry_items','shopping_lists','tasks','calendar_events','health_records','medications','vehicles','emergency_contacts']
  LOOP
    EXECUTE format('CREATE POLICY "%s_select" ON %s FOR SELECT USING (family_id = get_user_family_id())', t, t);
    EXECUTE format('CREATE POLICY "%s_insert" ON %s FOR INSERT WITH CHECK (family_id = get_user_family_id())', t, t);
    EXECUTE format('CREATE POLICY "%s_update" ON %s FOR UPDATE USING (family_id = get_user_family_id())', t, t);
    EXECUTE format('CREATE POLICY "%s_delete" ON %s FOR DELETE USING (family_id = get_user_family_id())', t, t);
  END LOOP;
END $$;

-- Shopping items (via list)
CREATE POLICY "shopping_items_select" ON shopping_items FOR SELECT
  USING (list_id IN (SELECT id FROM shopping_lists WHERE family_id = get_user_family_id()));
CREATE POLICY "shopping_items_insert" ON shopping_items FOR INSERT
  WITH CHECK (list_id IN (SELECT id FROM shopping_lists WHERE family_id = get_user_family_id()));
CREATE POLICY "shopping_items_update" ON shopping_items FOR UPDATE
  USING (list_id IN (SELECT id FROM shopping_lists WHERE family_id = get_user_family_id()));
CREATE POLICY "shopping_items_delete" ON shopping_items FOR DELETE
  USING (list_id IN (SELECT id FROM shopping_lists WHERE family_id = get_user_family_id()));

-- Vehicle maintenances (via vehicle)
CREATE POLICY "vehicle_maintenances_select" ON vehicle_maintenances FOR SELECT
  USING (vehicle_id IN (SELECT id FROM vehicles WHERE family_id = get_user_family_id()));
CREATE POLICY "vehicle_maintenances_insert" ON vehicle_maintenances FOR INSERT
  WITH CHECK (vehicle_id IN (SELECT id FROM vehicles WHERE family_id = get_user_family_id()));
CREATE POLICY "vehicle_maintenances_update" ON vehicle_maintenances FOR UPDATE
  USING (vehicle_id IN (SELECT id FROM vehicles WHERE family_id = get_user_family_id()));
CREATE POLICY "vehicle_maintenances_delete" ON vehicle_maintenances FOR DELETE
  USING (vehicle_id IN (SELECT id FROM vehicles WHERE family_id = get_user_family_id()));

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================
-- Execute no Dashboard do Supabase > Storage > New Bucket:
-- 1. "family-documents" (privado) — para documentos da família
-- 2. "avatars" (público) — para fotos de perfil

-- ============================================================
-- DADOS INICIAIS (categorias padrão — inserir após criar família)
-- ============================================================
-- Exemplo de seed de categorias (chamar no código após criar família):
-- INSERT INTO finance_categories (family_id, name, icon, color, type) VALUES
-- ('{family_id}', 'Alimentação', 'restaurant', '#22c55e', 'expense'),
-- ('{family_id}', 'Transporte', 'car', '#3b82f6', 'expense'),
-- ('{family_id}', 'Saúde', 'favorite', '#ef4444', 'expense'),
-- ('{family_id}', 'Lazer', 'sports_esports', '#8b5cf6', 'expense'),
-- ('{family_id}', 'Casa', 'home', '#f59e0b', 'expense'),
-- ('{family_id}', 'Educação', 'school', '#06b6d4', 'expense'),
-- ('{family_id}', 'Roupas', 'checkroom', '#ec4899', 'expense'),
-- ('{family_id}', 'Salário', 'account_balance', '#22c55e', 'income'),
-- ('{family_id}', 'Freelance', 'work', '#3b82f6', 'income');
