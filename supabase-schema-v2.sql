-- ===========================
-- REINO IMPERIAL — SCHEMA V2 (Cole no SQL Editor do Supabase)
-- ===========================

-- CLIENTES (CRM)
create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  store_id uuid references stores(id) on delete cascade,
  name text not null,
  whatsapp text not null,
  notes text,
  vip boolean default false,
  created_at timestamptz default now()
);

-- Novos campos em PEDIDOS
alter table orders add column if not exists customer_id uuid references customers(id);
alter table orders add column if not exists product_name text;
alter table orders add column if not exists quantity integer default 1;
alter table orders add column if not exists total numeric(10,2) default 0;
alter table orders add column if not exists sinal numeric(10,2) default 0;
alter table orders add column if not exists payment_method text default 'pix';
alter table orders add column if not exists delivery_date date;

-- Atualizar status dos pedidos (drop antiga constraint, adicionar nova)
alter table orders drop constraint if exists orders_status_check;
alter table orders add constraint orders_status_check
  check (status in ('orcamento','confirmado','encomendado','chegou','entregue','cancelado'));
update orders set status = 'orcamento' where status in ('novo','em_andamento');
update orders set status = 'entregue' where status = 'concluido';

-- Novos campos em PRODUTOS
alter table products add column if not exists image_url text;
alter table products add column if not exists brand text;
alter table products add column if not exists price_num numeric(10,2) default 0;
alter table products add column if not exists sold_count integer default 0;

-- TRANSAÇÕES FINANCEIRAS
create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  store_id uuid references stores(id) on delete cascade,
  type text not null check (type in ('entrada', 'saida')),
  amount numeric(10,2) not null,
  description text,
  category text,
  order_id uuid references orders(id),
  created_at timestamptz default now()
);

-- RLS desabilitado
alter table customers    disable row level security;
alter table transactions disable row level security;
