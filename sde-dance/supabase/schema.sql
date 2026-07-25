-- =============================================================
--  SDE DANCE — Schema isolado no Supabase compartilhado
--  Execute este arquivo no SQL Editor do Supabase
-- =============================================================

-- 1. Criar o schema
CREATE SCHEMA IF NOT EXISTS sde_dance;

-- 2. Permissões para as roles do Supabase
GRANT USAGE ON SCHEMA sde_dance TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA sde_dance
  GRANT ALL ON TABLES    TO authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA sde_dance
  GRANT ALL ON SEQUENCES TO authenticated, service_role;

-- =============================================================
--  TABELAS
-- =============================================================

-- Perfis de usuário (espelha auth.users)
CREATE TABLE sde_dance.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome        TEXT        NOT NULL,
  tipo        TEXT        NOT NULL DEFAULT 'aluno'
                CHECK (tipo IN ('admin','professor','aluno')),
  whatsapp    TEXT,
  foto_url    TEXT,
  ativo       BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Professores (gerenciado pelo admin, independente de login)
CREATE TABLE sde_dance.professores (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  nome        TEXT        NOT NULL,
  papel       TEXT        NOT NULL DEFAULT '',
  modalidades TEXT[]      NOT NULL DEFAULT '{}',
  bio         TEXT,
  citacao     TEXT,
  foto_url    TEXT,
  instagram   TEXT,
  ordem       INT         NOT NULL DEFAULT 0,
  destaque    BOOLEAN     NOT NULL DEFAULT TRUE,
  ativo       BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Turmas (aulas)
CREATE TABLE sde_dance.turmas (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  nome         TEXT        NOT NULL,
  modalidade   TEXT        NOT NULL,
  dias_semana  TEXT        NOT NULL DEFAULT '',
  hora         TEXT        NOT NULL DEFAULT '',
  professor_id UUID        REFERENCES sde_dance.profiles(id) ON DELETE SET NULL,
  vagas_total  INT         NOT NULL DEFAULT 20,
  ativo        BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Matrículas (aluno ↔ turma)
CREATE TABLE sde_dance.matriculas (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  aluno_id     UUID        NOT NULL REFERENCES sde_dance.profiles(id)  ON DELETE CASCADE,
  turma_id     UUID        NOT NULL REFERENCES sde_dance.turmas(id)    ON DELETE CASCADE,
  status       TEXT        NOT NULL DEFAULT 'pendente'
                 CHECK (status IN ('ativa','inativa','pendente')),
  data_inicio  DATE        NOT NULL DEFAULT CURRENT_DATE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (aluno_id, turma_id)
);

-- Financeiro (mensalidades + taxa de matrícula)
CREATE TABLE sde_dance.financeiro (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  aluno_id        UUID          NOT NULL REFERENCES sde_dance.profiles(id)   ON DELETE CASCADE,
  matricula_id    UUID          REFERENCES sde_dance.matriculas(id)           ON DELETE SET NULL,
  tipo            TEXT          NOT NULL DEFAULT 'mensalidade'
                    CHECK (tipo IN ('mensalidade','matricula_taxa')),
  valor           NUMERIC(10,2) NOT NULL,
  vencimento      DATE          NOT NULL,
  pago_em         DATE,
  status          TEXT          NOT NULL DEFAULT 'pendente'
                    CHECK (status IN ('pendente','pago','atrasado')),
  mes_referencia  DATE,
  observacao      TEXT,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Presenças por aula
CREATE TABLE sde_dance.presencas (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  turma_id    UUID        NOT NULL REFERENCES sde_dance.turmas(id)   ON DELETE CASCADE,
  aluno_id    UUID        NOT NULL REFERENCES sde_dance.profiles(id) ON DELETE CASCADE,
  data_aula   DATE        NOT NULL,
  presente    BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (turma_id, aluno_id, data_aula)
);

-- Links de matrícula
CREATE TABLE sde_dance.links_matricula (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  turma_id    UUID        NOT NULL REFERENCES sde_dance.turmas(id) ON DELETE CASCADE,
  criado_por  UUID        NOT NULL REFERENCES sde_dance.profiles(id),
  token       TEXT        NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  ativo       BOOLEAN     NOT NULL DEFAULT TRUE,
  validade    TIMESTAMPTZ,
  usos        INT         NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================
--  TRIGGER: criar profile automaticamente no cadastro
-- =============================================================

CREATE OR REPLACE FUNCTION sde_dance.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = sde_dance
AS $$
BEGIN
  INSERT INTO sde_dance.profiles (id, nome, tipo)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'tipo', 'aluno')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_sde_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION sde_dance.handle_new_user();

-- =============================================================
--  ROW LEVEL SECURITY
-- =============================================================

ALTER TABLE sde_dance.profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE sde_dance.professores     ENABLE ROW LEVEL SECURITY;
ALTER TABLE sde_dance.turmas          ENABLE ROW LEVEL SECURITY;
ALTER TABLE sde_dance.matriculas      ENABLE ROW LEVEL SECURITY;
ALTER TABLE sde_dance.financeiro      ENABLE ROW LEVEL SECURITY;
ALTER TABLE sde_dance.presencas       ENABLE ROW LEVEL SECURITY;
ALTER TABLE sde_dance.links_matricula ENABLE ROW LEVEL SECURITY;

-- Helper: verifica se o usuário logado tem o tipo desejado
CREATE OR REPLACE FUNCTION sde_dance.is_tipo(t TEXT)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = sde_dance
AS $$
  SELECT EXISTS (
    SELECT 1 FROM sde_dance.profiles
    WHERE id = auth.uid() AND tipo = t AND ativo = TRUE
  );
$$;

-- PROFILES
CREATE POLICY "profiles_select_own"
  ON sde_dance.profiles FOR SELECT
  USING (auth.uid() = id OR sde_dance.is_tipo('admin'));

CREATE POLICY "profiles_insert_trigger"
  ON sde_dance.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update"
  ON sde_dance.profiles FOR UPDATE
  USING (auth.uid() = id OR sde_dance.is_tipo('admin'));

CREATE POLICY "profiles_delete_admin"
  ON sde_dance.profiles FOR DELETE
  USING (sde_dance.is_tipo('admin'));

-- PROFESSORES: leitura pública para ativos, escrita apenas admin
CREATE POLICY "professores_select"
  ON sde_dance.professores FOR SELECT
  USING (ativo = TRUE OR sde_dance.is_tipo('admin'));

CREATE POLICY "professores_write_admin"
  ON sde_dance.professores FOR ALL
  USING (sde_dance.is_tipo('admin'));

-- TURMAS
CREATE POLICY "turmas_select"
  ON sde_dance.turmas FOR SELECT
  USING (ativo = TRUE OR sde_dance.is_tipo('admin') OR sde_dance.is_tipo('professor'));

CREATE POLICY "turmas_write_admin"
  ON sde_dance.turmas FOR ALL
  USING (sde_dance.is_tipo('admin'));

-- MATRICULAS
CREATE POLICY "matriculas_select"
  ON sde_dance.matriculas FOR SELECT
  USING (
    auth.uid() = aluno_id
    OR sde_dance.is_tipo('admin')
    OR sde_dance.is_tipo('professor')
  );

CREATE POLICY "matriculas_write_admin"
  ON sde_dance.matriculas FOR ALL
  USING (sde_dance.is_tipo('admin'));

-- FINANCEIRO
CREATE POLICY "financeiro_select"
  ON sde_dance.financeiro FOR SELECT
  USING (auth.uid() = aluno_id OR sde_dance.is_tipo('admin'));

CREATE POLICY "financeiro_write_admin"
  ON sde_dance.financeiro FOR ALL
  USING (sde_dance.is_tipo('admin'));

-- PRESENCAS
CREATE POLICY "presencas_select"
  ON sde_dance.presencas FOR SELECT
  USING (
    auth.uid() = aluno_id
    OR sde_dance.is_tipo('admin')
    OR sde_dance.is_tipo('professor')
  );

CREATE POLICY "presencas_write"
  ON sde_dance.presencas FOR ALL
  USING (sde_dance.is_tipo('admin') OR sde_dance.is_tipo('professor'));

-- LINKS_MATRICULA
CREATE POLICY "links_select_admin"
  ON sde_dance.links_matricula FOR SELECT
  USING (sde_dance.is_tipo('admin'));

CREATE POLICY "links_write_admin"
  ON sde_dance.links_matricula FOR ALL
  USING (sde_dance.is_tipo('admin'));

-- =============================================================
--  ÍNDICES
-- =============================================================

CREATE INDEX idx_sde_professores_ordem  ON sde_dance.professores (ordem);
CREATE INDEX idx_sde_matriculas_aluno   ON sde_dance.matriculas  (aluno_id);
CREATE INDEX idx_sde_matriculas_turma   ON sde_dance.matriculas  (turma_id);
CREATE INDEX idx_sde_financeiro_aluno   ON sde_dance.financeiro  (aluno_id);
CREATE INDEX idx_sde_financeiro_status  ON sde_dance.financeiro  (status);
CREATE INDEX idx_sde_financeiro_mes     ON sde_dance.financeiro  (mes_referencia);
CREATE INDEX idx_sde_presencas_turma    ON sde_dance.presencas   (turma_id, data_aula);
CREATE INDEX idx_sde_presencas_aluno    ON sde_dance.presencas   (aluno_id);
