-- ===========================
-- REINO IMPERIAL — SUPABASE SCHEMA (Multi-Loja)
-- Cole este SQL no Supabase > SQL Editor > Run
-- ===========================

-- LOJAS
create table if not exists stores (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  tagline text,
  whatsapp text not null,
  instagram text,
  instagram_url text,
  address text,
  active boolean default true,
  created_at timestamptz default now()
);

-- PRODUTOS (compartilhados entre lojas, pode filtrar por store_id se quiser)
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  store_id uuid references stores(id) on delete cascade,  -- null = compartilhado
  name text not null,
  category text not null check (category in ('festas','bebes','presentes','aniversario','maternidade','corporativo')),
  description text,
  price text,
  icon text default '🎁',
  active boolean default true,
  order_index integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- PEDIDOS (por loja)
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  store_id uuid references stores(id) on delete cascade,
  customer_name text not null,
  whatsapp text not null,
  product_interest text,
  message text,
  status text default 'novo' check (status in ('novo','em_andamento','concluido','cancelado')),
  created_at timestamptz default now()
);

-- DEPOIMENTOS (por loja ou compartilhados)
create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  store_id uuid references stores(id) on delete cascade,  -- null = compartilhado
  name text not null,
  role text,
  text text not null,
  stars integer default 5 check (stars between 1 and 5),
  featured boolean default false,
  active boolean default true,
  created_at timestamptz default now()
);

-- CONFIGURAÇÕES (por loja)
create table if not exists settings (
  id uuid primary key default gen_random_uuid(),
  store_id uuid references stores(id) on delete cascade,
  key text not null,
  value text,
  updated_at timestamptz default now(),
  unique (store_id, key)
);

-- ===========================
-- DADOS INICIAIS
-- ===========================

-- Inserir as duas lojas
insert into stores (name, slug, tagline, whatsapp, instagram, instagram_url, address, active) values
  ('Reino Imperial', 'reino-imperial', 'Personalizados exclusivos para você', '5500000000001', '@reinoimperial', 'https://instagram.com/reinoimperial', 'Endereço da Loja Reino Imperial', true),
  ('Personalize',    'personalize',    'Sua identidade em cada detalhe',      '5500000000002', '@personalize',   'https://instagram.com/personalize',   'Endereço da Loja Personalize',    true)
on conflict (slug) do nothing;

-- Produtos compartilhados (store_id = null)
insert into products (store_id, name, category, description, price, icon, order_index) values
  (null, 'Kit Festa Personalizado',      'festas',     'Convite + Topper + Tag + Banner completo',             'A partir de R$ 59,90', '🎉', 1),
  (null, 'Kit Chá de Bebê',              'bebes',      'Convites + Lembrancinhas + Decoração completa',         'A partir de R$ 89,90', '🍼', 2),
  (null, 'Caixa Surpresa Personalizada', 'presentes',  'Caixa especial com itens personalizados',               'A partir de R$ 49,90', '🎁', 3),
  (null, 'Topper de Bolo Personalizado', 'aniversario','Topper exclusivo no tema e cor da sua escolha',         'A partir de R$ 19,90', '🎂', 4),
  (null, 'Convite Digital Animado',      'festas',     'Convite em vídeo para WhatsApp e Instagram',           'A partir de R$ 29,90', '📋', 5),
  (null, 'Tag de Maternidade',           'bebes',      'Tags personalizadas para o nascimento do bebê',        'A partir de R$ 24,90', '👶', 6),
  (null, 'Kit Mimo Personalizado',       'presentes',  'Conjunto de mimos com mensagem exclusiva',              'A partir de R$ 34,90', '✉️', 7),
  (null, 'Painel de Aniversário',        'aniversario','Painel temático impresso com arte exclusiva',           'A partir de R$ 45,90', '🎈', 8),
  (null, 'Kit Lembrancinhas',            'festas',     'Lembranças personalizadas para seus convidados',        'A partir de R$ 39,90', '🌟', 9)
on conflict do nothing;

-- Depoimentos compartilhados
insert into testimonials (store_id, name, role, text, stars, featured, active) values
  (null, 'Ana Carolina',  'Mamãe do Theo 👶',  'Fiz meu chá de bebê com os produtos do Reino Imperial e ficou lindo demais! Tudo personalizado e entregue antes do prazo. Super recomendo!', 5, false, true),
  (null, 'Juliana Mendes','Aniversariante 🎂', 'Melhor investimento para minha festa! Os convites personalizados impressionaram todos os convidados. Atendimento maravilhoso e muito caprichoso!', 5, true, true),
  (null, 'Marina Santos', 'Cliente fiel 💛',   'Comprei como presente para minha amiga e ela adorou! A caixa veio linda, toda personalizada com o nome dela. Com certeza vou comprar mais!', 5, false, true)
on conflict do nothing;

-- Configurações globais compartilhadas (store_id = null)
insert into settings (store_id, key, value) values
  (null, 'hero_title',    'Cada detalhe conta uma história única'),
  (null, 'hero_desc',     'Personalizados exclusivos para festas, presentes e bebês.'),
  (null, 'sobre_text1',   'No Reino Imperial, acreditamos que cada produto personalizado carrega uma emoção especial.'),
  (null, 'sobre_text2',   'Do convite ao painel de bolo, tudo é pensado com cuidado para que seu evento seja inesquecível.'),
  (null, 'clientes_total','500+'),
  (null, 'pedidos_total', '1k+'),
  (null, 'anos_exp',      '3+')
on conflict (store_id, key) do nothing;

-- ===========================
-- DESABILITAR RLS (simples para projetos pequenos)
-- ===========================
alter table stores       disable row level security;
alter table products     disable row level security;
alter table orders       disable row level security;
alter table testimonials disable row level security;
alter table settings     disable row level security;
