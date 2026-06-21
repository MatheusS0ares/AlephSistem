-- ═══════════════════════════════════════════════════════
-- SDE Dance — Esquema do banco de dados
-- Cole este SQL no Supabase → SQL Editor → Run
-- ═══════════════════════════════════════════════════════

-- ── Tipos ──────────────────────────────────────────────

create type tipo_usuario as enum ('aluno', 'professor', 'admin');
create type status_matricula as enum ('ativa', 'inativa', 'pendente');
create type tipo_lancamento as enum ('mensalidade', 'matricula_taxa');
create type status_financeiro as enum ('pendente', 'pago', 'atrasado');

-- ── Profiles ───────────────────────────────────────────
-- Extensão da tabela auth.users do Supabase

create table profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  tipo       tipo_usuario not null default 'aluno',
  nome       text not null,
  whatsapp   text,
  foto_url   text,
  ativo      boolean not null default true,
  created_at timestamptz not null default now()
);

-- Auto-cria profile quando usuário se registra
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, nome, tipo)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nome', split_part(new.email, '@', 1)),
    coalesce((new.raw_user_meta_data->>'tipo')::tipo_usuario, 'aluno')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ── Turmas ─────────────────────────────────────────────

create table turmas (
  id           uuid primary key default gen_random_uuid(),
  nome         text not null,
  modalidade   text not null,
  dias_semana  text not null,
  hora         text not null,
  professor_id uuid references profiles(id) on delete set null,
  vagas_total  int not null default 20,
  ativo        boolean not null default true,
  created_at   timestamptz not null default now()
);

-- ── Matrículas ─────────────────────────────────────────

create table matriculas (
  id          uuid primary key default gen_random_uuid(),
  aluno_id    uuid not null references profiles(id) on delete cascade,
  turma_id    uuid not null references turmas(id) on delete cascade,
  status      status_matricula not null default 'pendente',
  data_inicio date not null default current_date,
  created_at  timestamptz not null default now(),
  unique(aluno_id, turma_id)
);

-- ── Financeiro ─────────────────────────────────────────

create table financeiro (
  id             uuid primary key default gen_random_uuid(),
  aluno_id       uuid not null references profiles(id) on delete cascade,
  matricula_id   uuid references matriculas(id) on delete set null,
  tipo           tipo_lancamento not null,
  valor          numeric(10,2) not null,
  vencimento     date not null,
  pago_em        date,
  status         status_financeiro not null default 'pendente',
  mes_referencia text,          -- ex: "2026-01"
  observacao     text,
  created_at     timestamptz not null default now()
);

-- Auto-atualiza status para 'atrasado' se vencido e não pago
create or replace function atualizar_status_financeiro()
returns void language sql security definer as $$
  update financeiro
  set status = 'atrasado'
  where status = 'pendente'
    and vencimento < current_date;
$$;

-- ── Links de Matrícula ─────────────────────────────────

create table links_matricula (
  id          uuid primary key default gen_random_uuid(),
  turma_id    uuid not null references turmas(id) on delete cascade,
  criado_por  uuid not null references profiles(id),
  token       text unique not null default encode(gen_random_bytes(12), 'hex'),
  ativo       boolean not null default true,
  validade    timestamptz,
  usos        int not null default 0,
  created_at  timestamptz not null default now()
);

-- ═══════════════════════════════════════════════════════
-- Row Level Security (RLS)
-- ═══════════════════════════════════════════════════════

alter table profiles       enable row level security;
alter table turmas         enable row level security;
alter table matriculas     enable row level security;
alter table financeiro     enable row level security;
alter table links_matricula enable row level security;

-- ── Função auxiliar ──

create or replace function meu_tipo()
returns tipo_usuario language sql security definer stable as $$
  select tipo from profiles where id = auth.uid()
$$;

-- ── Policies: profiles ──

create policy "Vejo meu próprio perfil"
  on profiles for select using (id = auth.uid());

create policy "Admin vê todos os profiles"
  on profiles for select using (meu_tipo() = 'admin');

create policy "Professor vê alunos de suas turmas"
  on profiles for select using (
    meu_tipo() = 'professor'
    and exists (
      select 1 from matriculas m
      join turmas t on t.id = m.turma_id
      where m.aluno_id = profiles.id
        and t.professor_id = auth.uid()
    )
  );

create policy "Atualizo meu próprio perfil"
  on profiles for update using (id = auth.uid());

create policy "Admin atualiza qualquer perfil"
  on profiles for update using (meu_tipo() = 'admin');

-- ── Policies: turmas ──

create policy "Qualquer autenticado vê turmas ativas"
  on turmas for select using (ativo = true and auth.uid() is not null);

create policy "Admin vê todas as turmas"
  on turmas for select using (meu_tipo() = 'admin');

create policy "Admin gerencia turmas"
  on turmas for all using (meu_tipo() = 'admin');

create policy "Professor vê suas turmas"
  on turmas for select using (professor_id = auth.uid());

-- ── Policies: matrículas ──

create policy "Aluno vê suas matrículas"
  on matriculas for select using (aluno_id = auth.uid());

create policy "Professor vê matrículas de suas turmas"
  on matriculas for select using (
    exists (
      select 1 from turmas t
      where t.id = matriculas.turma_id
        and t.professor_id = auth.uid()
    )
  );

create policy "Admin vê todas as matrículas"
  on matriculas for select using (meu_tipo() = 'admin');

create policy "Admin gerencia matrículas"
  on matriculas for all using (meu_tipo() = 'admin');

create policy "Aluno se matricula via link"
  on matriculas for insert with check (aluno_id = auth.uid());

-- ── Policies: financeiro ──

create policy "Aluno vê seu financeiro"
  on financeiro for select using (aluno_id = auth.uid());

create policy "Admin vê todo financeiro"
  on financeiro for select using (meu_tipo() = 'admin');

create policy "Admin gerencia financeiro"
  on financeiro for all using (meu_tipo() = 'admin');

-- ── Policies: links_matricula ──

create policy "Links ativos são públicos para leitura"
  on links_matricula for select using (ativo = true);

create policy "Professor cria links de suas turmas"
  on links_matricula for insert with check (
    criado_por = auth.uid()
    and meu_tipo() in ('professor', 'admin')
  );

create policy "Professor desativa seus links"
  on links_matricula for update using (criado_por = auth.uid());

create policy "Admin gerencia todos os links"
  on links_matricula for all using (meu_tipo() = 'admin');

-- ═══════════════════════════════════════════════════════
-- Dados iniciais (opcional — ajuste conforme necessário)
-- ═══════════════════════════════════════════════════════

-- Crie primeiro a conta da Camila em Authentication → Users,
-- depois rode o UPDATE abaixo substituindo o e-mail dela:
--
-- update profiles
-- set tipo = 'admin', nome = 'Camila Graner'
-- where id = (select id from auth.users where email = 'camila@sdedance.com.br');
