-- ==============================================================================
-- MIGRAÇÃO SUPABASE: HARDENING DE SEGURANÇA (APPSEC)
-- Tabelas e Políticas RLS para Gestão Centralizada de Alunos e Liberação de Catálogo
-- ==============================================================================

-- 1. ADIÇÃO DE CONTROLE DE COMPONENTES NA TABELA TURMAS
ALTER TABLE IF EXISTS turmas 
ADD COLUMN IF NOT EXISTS componentes_liberados BOOLEAN DEFAULT true;

-- 2. CRIAÇÃO DA TABELA DE SOLICITAÇÕES E APROVAÇÕES DE ALUNOS
CREATE TABLE IF NOT EXISTS solicitacoes_alunos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  turma_id UUID NOT NULL REFERENCES turmas(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  nome TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovado', 'rejeitado')),
  professor_email TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(turma_id, email)
);

-- 3. HABILITAÇÃO DE ROW LEVEL SECURITY (RLS)
ALTER TABLE IF EXISTS solicitacoes_alunos ENABLE ROW LEVEL SECURITY;

-- Limpeza de políticas prévias
DROP POLICY IF EXISTS "Alunos podem solicitar acesso a turmas" ON solicitacoes_alunos;
DROP POLICY IF EXISTS "Leitura de solicitacoes por aluno ou professor responsavel" ON solicitacoes_alunos;
DROP POLICY IF EXISTS "Professores gerenciam status de solicitacoes" ON solicitacoes_alunos;
DROP POLICY IF EXISTS "Professores podem excluir solicitacoes" ON solicitacoes_alunos;

-- (A) INSERT: Aluno autenticado solicita acesso registrando seu próprio e-mail
CREATE POLICY "Alunos podem solicitar acesso a turmas"
ON solicitacoes_alunos FOR INSERT
TO authenticated
WITH CHECK (
  lower(auth.jwt()->>'email') = lower(email)
);

-- (B) SELECT: Aluno visualiza suas solicitações; Professores visualizam as de suas turmas
CREATE POLICY "Leitura de solicitacoes por aluno ou professor responsavel"
ON solicitacoes_alunos FOR SELECT
TO authenticated
USING (
  lower(auth.jwt()->>'email') = lower(email)
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

-- (C) UPDATE: Apenas instrutores autorizados podem alterar o status (aprovar/rejeitar)
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

-- (D) DELETE: Instrutores autorizados podem excluir solicitações
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
