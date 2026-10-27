-- ==============================================================================
-- MIGRAÇÃO SUPABASE DEFINITIVA: HARDENING DE SEGURANÇA E AUTORIZAÇÃO (APPSEC)
-- Tabelas, RLS e ON DELETE CASCADE para Alunos e Turmas
-- ==============================================================================

-- 1. COLUNAS DE CONTROLE NA TABELA TURMAS
ALTER TABLE IF EXISTS turmas 
ADD COLUMN IF NOT EXISTS componentes_liberados BOOLEAN DEFAULT true;

ALTER TABLE IF EXISTS turmas 
ADD COLUMN IF NOT EXISTS alunos_solicitacoes JSONB DEFAULT '[]'::jsonb;

-- 2. CRIAÇÃO DA TABELA DEDICADA DE SOLICITAÇÕES E VÍNCULOS DE ALUNOS
CREATE TABLE IF NOT EXISTS solicitacoes_alunos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  turma_id UUID NOT NULL REFERENCES turmas(id) ON DELETE CASCADE,
  turma_nome TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  nome TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovado', 'rejeitado', 'excluido')),
  professor_email TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(turma_id, email)
);

-- Garante coluna turma_nome se a tabela já existia
ALTER TABLE IF EXISTS solicitacoes_alunos 
ADD COLUMN IF NOT EXISTS turma_nome TEXT;

-- 3. HABILITAÇÃO DE ROW LEVEL SECURITY (RLS)
ALTER TABLE IF EXISTS solicitacoes_alunos ENABLE ROW LEVEL SECURITY;

-- Limpeza de políticas prévias
DROP POLICY IF EXISTS "Alunos podem solicitar acesso a turmas" ON solicitacoes_alunos;
DROP POLICY IF EXISTS "Alunos podem atualizar sua própria solicitação" ON solicitacoes_alunos;
DROP POLICY IF EXISTS "Leitura de solicitacoes por aluno ou professor responsavel" ON solicitacoes_alunos;
DROP POLICY IF EXISTS "Professores gerenciam status de solicitacoes" ON solicitacoes_alunos;
DROP POLICY IF EXISTS "Professores podem excluir solicitacoes" ON solicitacoes_alunos;

-- (A) INSERT: Aluno autenticado solicita acesso registrando seu próprio e-mail
CREATE POLICY "Alunos podem solicitar acesso a turmas"
ON solicitacoes_alunos FOR INSERT
TO authenticated
WITH CHECK (
  lower(auth.jwt()->>'email') = lower(email)
  OR auth.uid() = user_id
);

-- (B) UPDATE por Aluno (para reenviar/atualizar dados):
CREATE POLICY "Alunos podem atualizar sua própria solicitação"
ON solicitacoes_alunos FOR UPDATE
TO authenticated
USING (
  lower(auth.jwt()->>'email') = lower(email)
  OR auth.uid() = user_id
);

-- (C) SELECT: Aluno visualiza suas solicitações; Professores visualizam as de suas turmas
CREATE POLICY "Leitura de solicitacoes por aluno ou professor responsavel"
ON solicitacoes_alunos FOR SELECT
TO authenticated
USING (
  lower(auth.jwt()->>'email') = lower(email)
  OR auth.uid() = user_id
  OR lower(auth.jwt()->>'email') = lower(professor_email)
  OR lower(auth.jwt()->>'email') IN (
    'instrutorleonardosenai@gmail.com',
    'designtecnologia.2026@gmail.com',
    'engeletricojosue@gmail.com',
    'julioangeloxavier@gmail.com'
  )
  OR EXISTS (
    SELECT 1 FROM turmas t
    WHERE t.id = solicitacoes_alunos.turma_id
    AND (t.instrutor_id = auth.uid() OR lower(t.professor_email) = lower(auth.jwt()->>'email'))
  )
);

-- (D) UPDATE por Professores (aprovar, rejeitar ou revogar)
CREATE POLICY "Professores gerenciam status de solicitacoes"
ON solicitacoes_alunos FOR UPDATE
TO authenticated
USING (
  lower(auth.jwt()->>'email') = lower(professor_email)
  OR lower(auth.jwt()->>'email') IN (
    'instrutorleonardosenai@gmail.com',
    'designtecnologia.2026@gmail.com',
    'engeletricojosue@gmail.com',
    'julioangeloxavier@gmail.com'
  )
  OR EXISTS (
    SELECT 1 FROM turmas t
    WHERE t.id = solicitacoes_alunos.turma_id
    AND (t.instrutor_id = auth.uid() OR lower(t.professor_email) = lower(auth.jwt()->>'email'))
  )
);

-- (E) DELETE por Professores
CREATE POLICY "Professores podem excluir solicitacoes"
ON solicitacoes_alunos FOR DELETE
TO authenticated
USING (
  lower(auth.jwt()->>'email') = lower(professor_email)
  OR lower(auth.jwt()->>'email') IN (
    'instrutorleonardosenai@gmail.com',
    'designtecnologia.2026@gmail.com',
    'engeletricojosue@gmail.com',
    'julioangeloxavier@gmail.com'
  )
  OR EXISTS (
    SELECT 1 FROM turmas t
    WHERE t.id = solicitacoes_alunos.turma_id
    AND (t.instrutor_id = auth.uid() OR lower(t.professor_email) = lower(auth.jwt()->>'email'))
  )
);
