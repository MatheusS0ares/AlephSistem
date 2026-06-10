-- ============================================================
--  ALEPH CONTROLE — Schema de clientes e pagamentos da Aleph
--  Execute no Supabase SQL Editor
-- ============================================================

-- Tabela de clientes contratantes da Aleph
CREATE TABLE IF NOT EXISTS aleph_clients (
  id               uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  name             text        NOT NULL,
  contact_name     text,
  contact_whatsapp text,
  contact_email    text,
  segment          text        DEFAULT 'Outro',
  site_url         text,
  admin_url        text,
  store_slug       text,
  monthly_fee      numeric(10,2) DEFAULT 0,
  setup_fee        numeric(10,2) DEFAULT 0,
  contract_start   date,
  contract_renewal date,
  payment_day      integer     DEFAULT 10,
  payment_status   text        DEFAULT 'em_dia',
  notes            text,
  active           boolean     DEFAULT true,
  created_at       timestamptz DEFAULT now()
);

-- Histórico de pagamentos
CREATE TABLE IF NOT EXISTS aleph_payments (
  id               uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id        uuid        REFERENCES aleph_clients(id) ON DELETE CASCADE,
  amount           numeric(10,2) NOT NULL,
  reference_month  text        NOT NULL,   -- formato YYYY-MM
  due_date         date,
  paid_date        date,
  status           text        DEFAULT 'pendente',  -- pendente | pago | atrasado | cancelado
  notes            text,
  created_at       timestamptz DEFAULT now()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_aleph_payments_client_id ON aleph_payments(client_id);
CREATE INDEX IF NOT EXISTS idx_aleph_payments_reference_month ON aleph_payments(reference_month);
CREATE INDEX IF NOT EXISTS idx_aleph_clients_active ON aleph_clients(active);

-- Row Level Security
ALTER TABLE aleph_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE aleph_payments ENABLE ROW LEVEL SECURITY;

-- Política aberta (acesso controlado via senha no frontend)
CREATE POLICY "aleph_clients_all" ON aleph_clients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "aleph_payments_all" ON aleph_payments FOR ALL USING (true) WITH CHECK (true);
