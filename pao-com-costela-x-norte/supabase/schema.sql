-- ═══════════════════════════════════════════════════════════════
-- Pão com Costela — X Norte
-- Cole este SQL no Supabase (projeto DEDICADO a este cliente,
-- separado de qualquer outro projeto do AlephSistem) → SQL Editor → Run
--
-- Este schema é autocontido: nenhuma tabela aqui é compartilhada com
-- outro app do monorepo. Rodar num projeto Supabase próprio garante
-- isolamento total de dados e de RLS entre clientes.
-- ═══════════════════════════════════════════════════════════════

-- ── Admins ─────────────────────────────────────────────
-- Quem pode logar no painel (magic link). Popular manualmente
-- após o primeiro login: insert into admins (id, nome) values ('<uuid do auth.users>', 'Nome').

create table admins (
  id         uuid primary key references auth.users(id) on delete cascade,
  nome       text not null,
  criado_em  timestamptz not null default now()
);

create or replace function is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from admins where id = auth.uid());
$$;

-- ── Trigger genérico de atualizado_em ──────────────────

create or replace function set_atualizado_em()
returns trigger language plpgsql as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$;

-- ============ CATÁLOGO ============

create table paes (
  id            uuid primary key default gen_random_uuid(),
  nome          text not null,
  descricao     text,
  preco_base    numeric(10,2) check (preco_base >= 0), -- null = preço não definido ainda
  foto_url      text,
  ordem         int not null default 0,
  ativo         boolean not null default true,   -- existe no cardápio
  disponivel    boolean not null default true,   -- tem hoje
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create table carnes (
  id            uuid primary key default gen_random_uuid(),
  nome          text not null,
  descricao     text,                            -- ex: "frango / toscana"
  ajuste        numeric(10,2) not null default 0,-- soma ao preço base do pão
  composta      boolean not null default false,  -- true no "misto"
  qtd_escolhas  int not null default 0,          -- 2 no "misto", 0 nas demais
  foto_url      text,
  ordem         int not null default 0,
  ativo         boolean not null default true,
  disponivel    boolean not null default true,
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create table molhos (
  id            uuid primary key default gen_random_uuid(),
  nome          text not null,
  cor_hex       text,                            -- bolinha de cor no cardápio
  ordem         int not null default 0,
  ativo         boolean not null default true,
  disponivel    boolean not null default true,
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

-- sobrescrita de célula da matriz, quando a regra base+ajuste não vale
create table precos_excecao (
  pao_id        uuid not null references paes(id) on delete cascade,
  carne_id      uuid not null references carnes(id) on delete cascade,
  preco         numeric(10,2) not null check (preco >= 0),
  atualizado_em timestamptz not null default now(),
  primary key (pao_id, carne_id)
);

create table combos (
  id                   uuid primary key default gen_random_uuid(),
  nome                 text not null,            -- ex: "Trio Mini Baguete"
  pao_id               uuid references paes(id),
  quantidade           int not null check (quantidade > 1),
  preco                numeric(10,2) not null,
  permite_variar_carne boolean not null default true,
  ordem                int not null default 0,
  ativo                boolean not null default true,
  disponivel           boolean not null default true
);

create table promocoes (
  id           uuid primary key default gen_random_uuid(),
  titulo       text not null,                    -- "Promoção do dia"
  pao_id       uuid references paes(id),
  carne_id     uuid references carnes(id),
  preco        numeric(10,2) not null,
  inicio       date not null,
  fim          date,                             -- null = sem prazo
  ativo        boolean not null default true
);

-- log genérico de alteração de preço/cardápio, com autor e data,
-- usado para o "desfazer última alteração" do painel
create table log_alteracoes (
  id             uuid primary key default gen_random_uuid(),
  tabela         text not null,
  registro_id    uuid not null,
  campo          text not null,
  valor_anterior text,
  valor_novo     text,
  autor_id       uuid references auth.users(id),
  desfeito       boolean not null default false,
  criado_em      timestamptz not null default now()
);

-- ============ OPERAÇÃO ============

create table turnos (
  id             uuid primary key default gen_random_uuid(),
  aberto_por     uuid references auth.users(id),
  aberto_em      timestamptz not null default now(),
  fechado_em     timestamptz,
  total_vendas   numeric(10,2) not null default 0,
  total_dinheiro numeric(10,2) not null default 0,
  total_pix      numeric(10,2) not null default 0,
  total_cartao   numeric(10,2) not null default 0,
  observacao     text
);

-- garante no máximo um turno aberto por vez
create unique index turno_aberto_unico on turnos ((fechado_em is null)) where fechado_em is null;

create table pedidos (
  id               uuid primary key default gen_random_uuid(),
  codigo           text not null unique,          -- sequencial curto do dia: "042"
  turno_id         uuid references turnos(id),
  canal            text not null check (canal in ('balcao','whatsapp','site')),
  tipo             text not null default 'retirada' check (tipo in ('retirada','entrega')),
  cliente_nome     text,
  cliente_telefone text,
  endereco         text,
  taxa_entrega     numeric(10,2) not null default 0,
  subtotal         numeric(10,2) not null default 0,
  total            numeric(10,2) not null default 0,
  forma_pagamento  text check (forma_pagamento in ('dinheiro','pix','cartao')),
  status           text not null default 'aberto'
                   check (status in ('aberto','preparando','pronto','entregue','cancelado')),
  observacao       text,
  criado_por       uuid references auth.users(id),
  criado_em        timestamptz not null default now(),
  fechado_em       timestamptz
);

-- snapshot: nomes e valores gravados no momento da venda, nunca por referência
-- (garante que alterar preço hoje não muda pedido já registrado — critério de aceite #6)
create table pedido_itens (
  id                 uuid primary key default gen_random_uuid(),
  pedido_id          uuid not null references pedidos(id) on delete cascade,
  pao_nome           text not null,
  carne_nome         text not null,
  carnes_composicao  text[],                       -- preenchido quando misto
  molho_nome         text,
  quantidade         int not null default 1 check (quantidade > 0),
  preco_unitario     numeric(10,2) not null,
  preco_total        numeric(10,2) not null,
  observacao         text
);

-- ── Triggers de atualizado_em ───────────────────────────

create trigger trg_paes_atualizado before update on paes
  for each row execute function set_atualizado_em();
create trigger trg_carnes_atualizado before update on carnes
  for each row execute function set_atualizado_em();
create trigger trg_molhos_atualizado before update on molhos
  for each row execute function set_atualizado_em();
create trigger trg_excecao_atualizado before update on precos_excecao
  for each row execute function set_atualizado_em();

-- ── Código sequencial do pedido (por dia) ───────────────

create or replace function gerar_codigo_pedido()
returns trigger language plpgsql as $$
declare
  proximo int;
begin
  if new.codigo is null or new.codigo = '' then
    select count(*) + 1 into proximo
      from pedidos
     where criado_em::date = current_date;
    new.codigo := lpad(proximo::text, 3, '0');
  end if;
  return new;
end;
$$;

create trigger trg_pedido_codigo before insert on pedidos
  for each row execute function gerar_codigo_pedido();

-- ── Resolução de preço ───────────────────────────────────

create or replace function preco_resolvido(p_pao uuid, p_carne uuid)
returns numeric language sql stable as $$
  select coalesce(
    (select preco from precos_excecao e
      where e.pao_id = p_pao and e.carne_id = p_carne),
    (select p.preco_base + c.ajuste
       from paes p, carnes c
      where p.id = p_pao and c.id = p_carne and p.preco_base is not null)
  );
$$;

-- aplica promoção ativa na leitura, sem nunca sobrescrever preco_base;
-- se a promoção for removida, o preço volta sozinho e o histórico de
-- vendas (pedido_itens, já gravado como snapshot) permanece correto
create or replace function preco_final(p_pao uuid, p_carne uuid, p_data date default current_date)
returns numeric language sql stable as $$
  select coalesce(
    (select pr.preco from promocoes pr
      where pr.ativo and pr.pao_id = p_pao and pr.carne_id = p_carne
        and pr.inicio <= p_data and (pr.fim is null or pr.fim >= p_data)
      order by pr.inicio desc
      limit 1),
    preco_resolvido(p_pao, p_carne)
  );
$$;

-- ── RLS ──────────────────────────────────────────────────

alter table paes            enable row level security;
alter table carnes          enable row level security;
alter table molhos          enable row level security;
alter table precos_excecao  enable row level security;
alter table combos          enable row level security;
alter table promocoes       enable row level security;
alter table log_alteracoes  enable row level security;
alter table turnos          enable row level security;
alter table pedidos         enable row level security;
alter table pedido_itens    enable row level security;
alter table admins          enable row level security;

-- catálogo: leitura pública só do que está ativo; admin vê tudo e escreve
create policy paes_leitura_publica on paes for select
  to anon, authenticated using (ativo = true);
create policy paes_leitura_admin on paes for select
  to authenticated using (is_admin());
create policy paes_escrita_admin on paes for all
  to authenticated using (is_admin()) with check (is_admin());

create policy carnes_leitura_publica on carnes for select
  to anon, authenticated using (ativo = true);
create policy carnes_leitura_admin on carnes for select
  to authenticated using (is_admin());
create policy carnes_escrita_admin on carnes for all
  to authenticated using (is_admin()) with check (is_admin());

create policy molhos_leitura_publica on molhos for select
  to anon, authenticated using (ativo = true);
create policy molhos_leitura_admin on molhos for select
  to authenticated using (is_admin());
create policy molhos_escrita_admin on molhos for all
  to authenticated using (is_admin()) with check (is_admin());

create policy excecao_leitura_publica on precos_excecao for select
  to anon, authenticated using (true);
create policy excecao_escrita_admin on precos_excecao for all
  to authenticated using (is_admin()) with check (is_admin());

create policy combos_leitura_publica on combos for select
  to anon, authenticated using (ativo = true);
create policy combos_leitura_admin on combos for select
  to authenticated using (is_admin());
create policy combos_escrita_admin on combos for all
  to authenticated using (is_admin()) with check (is_admin());

create policy promocoes_leitura_publica on promocoes for select
  to anon, authenticated using (ativo = true);
create policy promocoes_leitura_admin on promocoes for select
  to authenticated using (is_admin());
create policy promocoes_escrita_admin on promocoes for all
  to authenticated using (is_admin()) with check (is_admin());

-- log: só admin lê; escrita sempre via service role (server action)
create policy log_leitura_admin on log_alteracoes for select
  to authenticated using (is_admin());

-- turnos: só admin lê e escreve
create policy turnos_leitura_admin on turnos for select
  to authenticated using (is_admin());
create policy turnos_escrita_admin on turnos for all
  to authenticated using (is_admin()) with check (is_admin());

-- pedidos e pedido_itens: nenhuma policy de insert para anon — pedido vindo
-- do site público só é gravado via service role dentro de uma server action
-- (nunca com a chave anon direto do browser). Admin autenticado (canal
-- balcão) pode inserir/ler/atualizar porque passou pelo login com magic link.
create policy pedidos_leitura_admin on pedidos for select
  to authenticated using (is_admin());
create policy pedidos_insert_admin on pedidos for insert
  to authenticated with check (is_admin());
create policy pedidos_update_admin on pedidos for update
  to authenticated using (is_admin()) with check (is_admin());

create policy pedido_itens_leitura_admin on pedido_itens for select
  to authenticated using (is_admin());
create policy pedido_itens_insert_admin on pedido_itens for insert
  to authenticated with check (
    exists (select 1 from pedidos p where p.id = pedido_id and is_admin())
  );

-- admins: cada admin só enxerga a própria linha
create policy admins_leitura_propria on admins for select
  to authenticated using (id = auth.uid());

-- ── Storage — fotos do cardápio ─────────────────────────
-- Bucket público (as fotos aparecem no site), upload restrito a admin.

insert into storage.buckets (id, name, public)
values ('cardapio', 'cardapio', true)
on conflict (id) do nothing;

create policy cardapio_fotos_leitura_publica on storage.objects for select
  to anon, authenticated using (bucket_id = 'cardapio');
create policy cardapio_fotos_escrita_admin on storage.objects for insert
  to authenticated with check (bucket_id = 'cardapio' and is_admin());
create policy cardapio_fotos_update_admin on storage.objects for update
  to authenticated using (bucket_id = 'cardapio' and is_admin());
create policy cardapio_fotos_delete_admin on storage.objects for delete
  to authenticated using (bucket_id = 'cardapio' and is_admin());

-- ============ SEED ============
-- Só a linha do pão bola está confirmada com o cliente (brief seção 11).
-- Os demais pães entram com preco_base = null ("preço não definido"),
-- e o ajuste de carne foi cadastrado apenas para a combinação já validada.
-- NÃO assumir os demais valores — o painel deve sinalizar "preço não definido"
-- em vez de herdar um número chutado.

insert into paes (nome, preco_base, ordem) values
  ('Pão Bola', 15.00, 1),
  ('Mini Baguete 17cm', null, 2),
  ('Pão Francês', null, 3);

-- "Contra filé" é a carne de referência (ajuste 0 = preço base do pão),
-- confirmado pelo cliente: pão bola + contra filé = R$ 15,00 (a "carne padrão"
-- do brief). Ajuste da linguiça ainda não foi confirmado (seção 11, pergunta 3);
-- entra como 0 por padrão do schema — sinalizar para o cliente revisar.
insert into carnes (nome, descricao, ajuste, composta, qtd_escolhas, ordem) values
  ('Contra filé', null, 0, false, 0, 1),
  ('Costela', null, -3.00, false, 0, 2),
  ('Linguiça', null, 0, false, 0, 3),
  ('Misto', 'escolha 2 carnes', 1.00, true, 2, 4);

insert into molhos (nome, cor_hex, ordem) values
  ('Alho', '#F2C230', 1),
  ('BBQ', '#E2451F', 2),
  ('Vinagrete', '#1B62A8', 3);
