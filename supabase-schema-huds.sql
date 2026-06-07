-- ====================================================
-- Barbearia HUD'S — Schema de Agendamentos
-- ====================================================

-- Tabela de serviços da barbearia
create table if not exists services (
  id               uuid default gen_random_uuid() primary key,
  store_id         text,
  name             text not null,
  category         text,
  description      text,
  price            numeric(10,2),
  duration_minutes integer default 60,
  image_url        text,
  icon             text,
  active           boolean default true,
  order_index      integer default 0,
  created_at       timestamptz default now()
);

-- Tabela de profissionais (barbeiros)
create table if not exists professionals (
  id          uuid default gen_random_uuid() primary key,
  store_id    text,
  name        text not null,
  role        text default 'Barbeiro',
  bio         text,
  photo_url   text,
  whatsapp    text,
  instagram   text,
  active      boolean default true,
  created_at  timestamptz default now()
);

-- Tabela de agendamentos
create table if not exists appointments (
  id                 uuid default gen_random_uuid() primary key,
  store_id           text,
  customer_id        uuid references customers(id) on delete set null,
  customer_name      text not null,
  customer_whatsapp  text,
  service_id         uuid references services(id) on delete set null,
  service_name       text,
  professional_id    uuid references professionals(id) on delete set null,
  professional_name  text,
  appointment_date   date not null,
  appointment_time   time not null,
  duration_minutes   integer default 60,
  price              numeric(10,2),
  status             text default 'agendado'
                       check (status in ('agendado','confirmado','em_atendimento','concluido','cancelado')),
  notes              text,
  created_at         timestamptz default now()
);

-- Índices para performance
create index if not exists idx_appointments_store_date
  on appointments(store_id, appointment_date);

create index if not exists idx_appointments_status
  on appointments(status);

create index if not exists idx_services_store
  on services(store_id, active);

create index if not exists idx_professionals_store
  on professionals(store_id, active);

-- RLS (Row Level Security) — adaptar conforme sua config
alter table appointments enable row level security;
alter table services enable row level security;
alter table professionals enable row level security;

-- Políticas abertas para uso com service_role (ajustar para auth real)
create policy "Allow all for service role" on appointments
  using (true) with check (true);

create policy "Allow all for service role" on services
  using (true) with check (true);

create policy "Allow all for service role" on professionals
  using (true) with check (true);

-- ==============================
-- Dados iniciais — Serviços HUD'S
-- ==============================
insert into services (name, category, description, price, duration_minutes, icon, active, order_index) values
  ('Corte Clássico',         'Corte',      'Corte tradicional com tesoura e pente.',              45.00, 40,  '✂',  true, 1),
  ('Degradê / Fade',         'Corte',      'Degradê moderno com máquina.',                        50.00, 45,  '⚡', true, 2),
  ('Barba Completa',         'Barba',      'Modelagem e acabamento com navalha.',                 35.00, 30,  '🪒', true, 3),
  ('Corte + Barba',          'Combo',      'Combo perfeito: corte e barba.',                      75.00, 70,  '👑', true, 4),
  ('Hidratação Capilar',     'Tratamento', 'Tratamento profundo para nutrir os fios.',            40.00, 30,  '💧', true, 5),
  ('Sobrancelha Masculina',  'Acabamento', 'Modelagem de sobrancelha com linha e pinça.',         20.00, 15,  '✦', true, 6)
on conflict do nothing;
