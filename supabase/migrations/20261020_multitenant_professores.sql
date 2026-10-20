-- ==============================================================================
-- MIGRAÇÃO SUPABASE: MULTI-TENANCY DE TURMAS E AUTORIZAÇÃO DE PROFESSORES
-- Projeto: plataforma-v3
-- Data: 20/10/2026
-- ==============================================================================

-- 1. ESTRUTURA DA TABELA TURMAS
-- Garante a existência da coluna professor_email para rastreamento multi-tenant
ALTER TABLE IF EXISTS turmas 
ADD COLUMN IF NOT EXISTS professor_email TEXT;

-- Garante que instrutor_id exista como coluna com chave estrangeira
ALTER TABLE IF EXISTS turmas 
ADD COLUMN IF NOT EXISTS instrutor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. BACKFILL DE DADOS EXISTENTES
-- Vincula turmas antigas que não possuem e-mail ao instrutor original (Cleverson Leonardo)
UPDATE turmas 
SET professor_email = 'instrutorleonardosenai@gmail.com' 
WHERE professor_email IS NULL;

-- 3. TABELA DE PERFIS / ROLES (CASO O PROJETO ADOTE PROFILES)
-- Se existir tabela public.profiles ou public.usuarios, concede a role de 'professor'
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
    UPDATE public.profiles
    SET role = 'professor'
    WHERE email IN (
      'instrutorleonardosenai@gmail.com',
      'designtecnologia.2026@gmail.com',
      'engeletricojosue@gmail.com',
      'julioangeloxavier@gmail.com'
    );
  END IF;
END $$;

-- 4. ATIVAÇÃO DE ROW LEVEL SECURITY (RLS)
ALTER TABLE IF EXISTS turmas ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS progresso_turmas ENABLE ROW LEVEL SECURITY;

-- 5. LIMPEZA DE POLÍTICAS ANTERIORES PARA EVITAR CONFLITOS
DROP POLICY IF EXISTS "Professores e alunos podem ler turmas" ON turmas;
DROP POLICY IF EXISTS "Instrutores podem criar turmas" ON turmas;
DROP POLICY IF EXISTS "Instrutores podem atualizar turmas" ON turmas;
DROP POLICY IF EXISTS "Instrutores podem excluir turmas" ON turmas;
DROP POLICY IF EXISTS "Visualização de turmas isolada por professor ou acesso aluno" ON turmas;
DROP POLICY IF EXISTS "Instrutores inserem suas próprias turmas" ON turmas;
DROP POLICY IF EXISTS "Instrutores atualizam suas próprias turmas" ON turmas;
DROP POLICY IF EXISTS "Instrutores excluem suas próprias turmas" ON turmas;

-- 6. POLÍTICAS RLS PARA TABELA TURMAS

-- (A) SELECT (Leitura):
-- - Se o usuário autenticado for um dos professores autorizados, ele só enxerga as turmas que ele mesmo criou
-- - Se for um aluno autenticado (não listado como professor), ele visualiza as turmas para poder se matricular e selecionar
CREATE POLICY "Visualização de turmas isolada por professor ou acesso aluno"
ON turmas FOR SELECT
TO authenticated
USING (
  -- O professor dono da turma (por UUID ou e-mail)
  (auth.uid() = instrutor_id OR lower(auth.jwt()->>'email') = lower(professor_email))
  OR
  -- Alunos comuns têm permissão para ver turmas do catálogo
  (lower(auth.jwt()->>'email') NOT IN (
    'instrutorleonardosenai@gmail.com',
    'designtecnologia.2026@gmail.com',
    'engeletricojosue@gmail.com',
    'julioangeloxavier@gmail.com'
  ))
);

-- (B) INSERT (Criação):
-- Apenas professores autorizados podem criar turmas, gravando seu próprio ID ou e-mail
CREATE POLICY "Instrutores inserem suas próprias turmas"
ON turmas FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = instrutor_id 
  OR lower(auth.jwt()->>'email') = lower(professor_email)
  OR lower(auth.jwt()->>'email') IN (
    'instrutorleonardosenai@gmail.com',
    'designtecnologia.2026@gmail.com',
    'engeletricojosue@gmail.com',
    'julioangeloxavier@gmail.com'
  )
);

-- (C) UPDATE (Atualização):
-- Apenas o professor criador da turma pode atualizar os dados
CREATE POLICY "Instrutores atualizam suas próprias turmas"
ON turmas FOR UPDATE
TO authenticated
USING (
  auth.uid() = instrutor_id 
  OR lower(auth.jwt()->>'email') = lower(professor_email)
);

-- (D) DELETE (Exclusão):
-- Apenas o professor criador da turma pode excluí-la
CREATE POLICY "Instrutores excluem suas próprias turmas"
ON turmas FOR DELETE
TO authenticated
USING (
  auth.uid() = instrutor_id 
  OR lower(auth.jwt()->>'email') = lower(professor_email)
);

-- 7. POLÍTICAS RLS PARA PROGRESSO_TURMAS
DROP POLICY IF EXISTS "Progresso de turmas gerenciado pelo instrutor da turma" ON progresso_turmas;
DROP POLICY IF EXISTS "Leitura de progresso de turmas" ON progresso_turmas;

CREATE POLICY "Leitura de progresso de turmas"
ON progresso_turmas FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Progresso de turmas gerenciado pelo instrutor da turma"
ON progresso_turmas FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM turmas t
    WHERE t.id = progresso_turmas.turma_id
    AND (t.instrutor_id = auth.uid() OR lower(t.professor_email) = lower(auth.jwt()->>'email'))
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM turmas t
    WHERE t.id = progresso_turmas.turma_id
    AND (t.instrutor_id = auth.uid() OR lower(t.professor_email) = lower(auth.jwt()->>'email'))
  )
);
