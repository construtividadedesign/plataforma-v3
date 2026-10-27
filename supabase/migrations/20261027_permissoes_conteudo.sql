-- ==============================================================================
-- MIGRAÇÃO SUPABASE: CONTROLE GRANULAR DE PERMISSÕES PEDAGÓGICAS POR TURMA
-- Permite ao professor liberar/bloquear Aulas, Módulos e Ferramentas Técnicas
-- ==============================================================================

ALTER TABLE IF EXISTS turmas 
ADD COLUMN IF NOT EXISTS permissoes_conteudo JSONB DEFAULT '{
  "aulas": {},
  "modulos": {
    "mod-1": true,
    "mod-2": true,
    "mod-3": true
  },
  "ferramentas": {
    "climatizacao": true,
    "componentes": true,
    "diagnostico": true,
    "dimensionamento": true
  }
}'::jsonb;
