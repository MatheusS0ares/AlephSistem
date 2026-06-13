-- ============================================================
-- DELICIAS DA EMELY — Setup Completo (banco do zero)
-- Cole no: Supabase Dashboard > SQL Editor > Run
-- ============================================================

-- ── 1. CRIAR TABELAS ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS stores (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  slug          text unique not null,
  tagline       text,
  whatsapp      text not null,
  instagram     text,
  instagram_url text,
  address       text,
  active        boolean default true,
  created_at    timestamptz default now()
);

CREATE TABLE IF NOT EXISTS products (
  id          uuid primary key default gen_random_uuid(),
  store_id    uuid references stores(id) on delete cascade,
  name        text not null,
  category    text not null,
  description text,
  price       text,
  icon        text default '🎁',
  image_url   text,
  active      boolean default true,
  order_index integer default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

CREATE TABLE IF NOT EXISTS orders (
  id               uuid primary key default gen_random_uuid(),
  store_id         uuid references stores(id) on delete cascade,
  customer_name    text not null,
  whatsapp         text not null,
  product_interest text,
  message          text,
  image_url        text,
  status           text default 'novo' check (status in ('novo','em_andamento','concluido','cancelado')),
  created_at       timestamptz default now()
);

CREATE TABLE IF NOT EXISTS testimonials (
  id         uuid primary key default gen_random_uuid(),
  store_id   uuid references stores(id) on delete cascade,
  name       text not null,
  role       text,
  text       text not null,
  stars      integer default 5 check (stars between 1 and 5),
  featured   boolean default false,
  active     boolean default true,
  created_at timestamptz default now()
);

CREATE TABLE IF NOT EXISTS settings (
  id         uuid primary key default gen_random_uuid(),
  store_id   uuid references stores(id) on delete cascade,
  key        text not null,
  value      text,
  updated_at timestamptz default now(),
  unique (store_id, key)
);

-- ── 2. DESABILITAR RLS ────────────────────────────────────────

ALTER TABLE stores       DISABLE ROW LEVEL SECURITY;
ALTER TABLE products     DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders       DISABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials DISABLE ROW LEVEL SECURITY;
ALTER TABLE settings     DISABLE ROW LEVEL SECURITY;

-- ── 3. INSERIR A LOJA ─────────────────────────────────────────

INSERT INTO stores (name, slug, tagline, whatsapp, instagram, instagram_url, address, active)
VALUES (
  'Delicias da Emely',
  'delicias-da-emely',
  'Brigadeiros gourmet e doces especiais',
  '5561992235201',
  '@deliciasdaemely',
  'https://instagram.com/deliciasdaemely',
  'Brasília - DF',
  true
)
ON CONFLICT (slug) DO UPDATE SET
  name          = EXCLUDED.name,
  tagline       = EXCLUDED.tagline,
  whatsapp      = EXCLUDED.whatsapp,
  instagram     = EXCLUDED.instagram,
  instagram_url = EXCLUDED.instagram_url,
  address       = EXCLUDED.address,
  active        = EXCLUDED.active;

-- ── 4. INSERIR SETTINGS ───────────────────────────────────────

DO $$
DECLARE store_uuid uuid;
BEGIN
  SELECT id INTO store_uuid FROM stores WHERE slug = 'delicias-da-emely';

  INSERT INTO settings (store_id, key, value) VALUES
    (store_uuid, 'store_type',          'confeitaria'),
    (store_uuid, 'hero_eyebrow',        '✦ Confeitaria artesanal feita com amor ✦'),
    (store_uuid, 'hero_title',          'Celebre cada momento com uma doce lembrança'),
    (store_uuid, 'hero_desc',           'Brigadeiros gourmet, kits presente e caixas especiais para cada ocasião. Feito por encomenda, entregue com carinho.'),
    (store_uuid, 'hero_wpp_text',       'Olá Emely! Quero fazer um pedido 🍫'),
    (store_uuid, 'banner_ativo',        '1'),
    (store_uuid, 'banner_texto',        '🍫 Dia dos Namorados! Últimas vagas disponíveis — peça agora pelo WhatsApp.'),
    (store_uuid, 'banner_cor',          'd4006e'),
    (store_uuid, 'sobre_text1',         'A Delicias da Emely é uma confeitaria artesanal especializada em brigadeiros gourmet, kits presente e encomendas para festas e eventos em Brasília.'),
    (store_uuid, 'sobre_text2',         'Cada doce é feito com ingredientes selecionados e muito carinho. Nossa missão é transformar cada pedido em uma experiência inesquecível.'),
    (store_uuid, 'clientes_total',      '200+'),
    (store_uuid, 'pedidos_total',       '500+'),
    (store_uuid, 'anos_exp',            '3+'),
    (store_uuid, 'categorias_json',     '[{"icon":"🍫","title":"Brigadeiros","desc":"Gourmet nos melhores sabores: Ninho, Pistache, Morango e muito mais.","cat":"brigadeiros"},{"icon":"🎁","title":"Kits Presente","desc":"Caixas montadas com capricho para presentear com amor.","cat":"kits-presente"},{"icon":"🎂","title":"Festas","desc":"Doces artesanais para aniversários, chás e comemorações.","cat":"festas"},{"icon":"❤️","title":"Dia dos Namorados","desc":"Kits especiais: Jogo do Prazer, Ferrero Rocher e caixinhas surpresa.","cat":"namorados"},{"icon":"🏢","title":"Corporativo","desc":"Brindes personalizados e kits para eventos empresariais.","cat":"corporativo"},{"icon":"🍬","title":"Chocolates","desc":"Trufas, bombons e kits de chocolates artesanais premium.","cat":"chocolates"}]'),
    (store_uuid, 'como_funciona_steps', '[{"num":"01","icon":"📲","title":"Escolha seus doces","desc":"Veja o cardápio, escolha os sabores, quantidades e embalagem ideal para a ocasião."},{"num":"02","icon":"💬","title":"Peça pelo WhatsApp","desc":"Confirme o pedido, endereço e forma de pagamento direto com a Emely."},{"num":"03","icon":"🍫","title":"Receba com amor","desc":"Entregamos ou você retira. Feito na hora, com ingredientes frescos e muito carinho."}]')
  ON CONFLICT (store_id, key) DO UPDATE SET value = EXCLUDED.value;
END $$;

-- ── 5. INSERIR PRODUTOS ───────────────────────────────────────

DO $$
DECLARE store_uuid uuid;
BEGIN
  SELECT id INTO store_uuid FROM stores WHERE slug = 'delicias-da-emely';

  INSERT INTO products (store_id, name, category, description, price, icon, active, order_index) VALUES
    (store_uuid, 'Jogo do Prazer — Ferrero Rocher',      'festas',  '12 Ferrero Rocher + 2 dados do prazer. Pedido sob encomenda.',                                      'R$ 95,00',  '🍫', true, 1),
    (store_uuid, 'Jogo do Prazer — Brigadeiros Gourmet', 'festas',  '12 brigadeiros nos sabores Ninho, Castanho, Brigadeiro e Morango + 2 dados do prazer.',             'R$ 80,00',  '❤️', true, 2),
    (store_uuid, 'Caixa 9 Brigadeiros Gourmet',          'presentes','Caixa com 9 brigadeiros sortidos: Ninho, Pistache, Morango, Chocolate Belga e mais.',              'R$ 45,00',  '🎁', true, 3),
    (store_uuid, 'Caixa 16 Brigadeiros Gourmet',         'presentes','Caixa com 16 brigadeiros sortidos. Perfeita para presentes e celebrações.',                        'R$ 75,00',  '🍫', true, 4),
    (store_uuid, 'Kit Presente Romântico',               'presentes','Caixa personalizada com 12 doces sortidos, embalagem premium e cartão personalizado.',             'R$ 90,00',  '🎁', true, 5),
    (store_uuid, 'Kit Festa 50 unidades',                'festas',  '50 brigadeiros sortidos para festas e eventos. Embalagem individual com tag personalizada.',        'R$ 180,00', '🎂', true, 6),
    (store_uuid, 'Kit Corporativo 30 caixinhas',         'festas',  '30 caixinhas com 4 brigadeiros cada, embalagem personalizada com logotipo da empresa.',             'R$ 210,00', '🏢', true, 7),
    (store_uuid, 'Trufas Artesanais (caixa 12)',         'presentes','Trufas artesanais recheadas: Dark, Ao Leite, Limão Siciliano e Maracujá. Embalagem presenteável.', 'R$ 70,00',  '🍬', true, 8)
  ON CONFLICT DO NOTHING;
END $$;

-- ── 6. INSERIR DEPOIMENTOS ────────────────────────────────────

DO $$
DECLARE store_uuid uuid;
BEGIN
  SELECT id INTO store_uuid FROM stores WHERE slug = 'delicias-da-emely';

  INSERT INTO testimonials (store_id, name, role, text, stars, featured, active) VALUES
    (store_uuid, 'Juliana Ferreira',  'Aniversário 🎂', 'Pedi os brigadeiros gourmet para o aniversário da minha filha e foi um sucesso! Todos perguntaram onde comprei. Já pedi mais duas vezes!', 5, true,  true),
    (store_uuid, 'Carlos & Patrícia', 'Casal 💑',        'Presenteamos com o Jogo do Prazer no Dia dos Namorados e foi a melhor ideia! Embalagem linda, brigadeiros deliciosos e chegou no prazo.',  5, false, true),
    (store_uuid, 'TechBrasília',      'Corporativo 🏢', 'Pedimos 80 caixinhas para nosso evento. Atendimento impecável, qualidade incrível e entrega pontual. Parceira oficial da empresa!',         5, false, true)
  ON CONFLICT DO NOTHING;
END $$;

-- ── VERIFICAÇÃO ───────────────────────────────────────────────
-- Rode para confirmar que tudo foi criado:
SELECT 'Loja:' as tipo, name, slug FROM stores WHERE slug = 'delicias-da-emely'
UNION ALL
SELECT 'Produtos: ' || count(*)::text, '', '' FROM products WHERE store_id = (SELECT id FROM stores WHERE slug = 'delicias-da-emely')
UNION ALL
SELECT 'Settings: ' || count(*)::text, '', '' FROM settings WHERE store_id = (SELECT id FROM stores WHERE slug = 'delicias-da-emely')
UNION ALL
SELECT 'Depoimentos: ' || count(*)::text, '', '' FROM testimonials WHERE store_id = (SELECT id FROM stores WHERE slug = 'delicias-da-emely');
