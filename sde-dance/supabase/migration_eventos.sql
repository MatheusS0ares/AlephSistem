-- Eventos / Espetáculos
-- Execute no SQL Editor do Supabase

CREATE TABLE IF NOT EXISTS sde_dance.eventos (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  nome         TEXT        NOT NULL,
  tipo         TEXT        NOT NULL DEFAULT 'espetaculo',
  data_evento  DATE,
  horario      TEXT,
  local        TEXT,
  descricao    TEXT,
  vagas        INTEGER,
  ativo        BOOLEAN     NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sde_dance.evento_inscricoes (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  evento_id  UUID        NOT NULL REFERENCES sde_dance.eventos(id)  ON DELETE CASCADE,
  aluno_id   UUID        NOT NULL REFERENCES sde_dance.profiles(id) ON DELETE CASCADE,
  turma_id   UUID        REFERENCES sde_dance.turmas(id),
  confirmado BOOLEAN     NOT NULL DEFAULT false,
  observacao TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(evento_id, aluno_id)
);

CREATE INDEX IF NOT EXISTS idx_evento_inscricoes_evento ON sde_dance.evento_inscricoes(evento_id);
CREATE INDEX IF NOT EXISTS idx_evento_inscricoes_aluno  ON sde_dance.evento_inscricoes(aluno_id);

ALTER TABLE sde_dance.eventos           ENABLE ROW LEVEL SECURITY;
ALTER TABLE sde_dance.evento_inscricoes ENABLE ROW LEVEL SECURITY;

-- Admins: acesso total
CREATE POLICY "admin_eventos_all" ON sde_dance.eventos
  FOR ALL USING (
    EXISTS (SELECT 1 FROM sde_dance.profiles p WHERE p.id = auth.uid() AND p.tipo = 'admin')
  );

CREATE POLICY "admin_evento_inscricoes_all" ON sde_dance.evento_inscricoes
  FOR ALL USING (
    EXISTS (SELECT 1 FROM sde_dance.profiles p WHERE p.id = auth.uid() AND p.tipo = 'admin')
  );

-- Professores: leitura de eventos + gerenciar inscrições
CREATE POLICY "prof_eventos_read" ON sde_dance.eventos
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM sde_dance.profiles p WHERE p.id = auth.uid() AND p.tipo IN ('professor', 'admin'))
  );

CREATE POLICY "prof_inscricoes_select" ON sde_dance.evento_inscricoes
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM sde_dance.profiles p WHERE p.id = auth.uid() AND p.tipo IN ('professor', 'admin'))
  );

CREATE POLICY "prof_inscricoes_insert" ON sde_dance.evento_inscricoes
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM sde_dance.profiles p WHERE p.id = auth.uid() AND p.tipo IN ('professor', 'admin'))
  );

CREATE POLICY "prof_inscricoes_update" ON sde_dance.evento_inscricoes
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM sde_dance.profiles p WHERE p.id = auth.uid() AND p.tipo IN ('professor', 'admin'))
  );

-- Alunos: ver suas próprias inscrições
CREATE POLICY "aluno_inscricoes_read" ON sde_dance.evento_inscricoes
  FOR SELECT USING (aluno_id = auth.uid());
