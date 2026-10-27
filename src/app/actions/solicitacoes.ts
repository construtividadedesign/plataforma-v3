'use server';

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const ADMIN_EMAILS: string[] = [
  "instrutorleonardosenai@gmail.com",
  "designtecnologia.2026@gmail.com",
  "engeletricojosue@gmail.com",
  "julioangeloxavier@gmail.com",
];

function isProfessorEmail(email?: string | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase().trim());
}

/**
 * Cria cliente administrativo do Supabase com Service Role Key para bypass do RLS.
 */
function getSupabaseAdminClient() {
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    process.env.SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_ADMIN_KEY;

  if (!serviceKey) {
    console.warn("SUPABASE_SERVICE_ROLE_KEY não encontrada nas variáveis de ambiente. Usando anon key como fallback.");
    return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/**
 * Cria cliente Supabase com sessão/cookies do usuário.
 */
async function getSupabaseUserClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {}
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch {}
        },
      },
    }
  );
}

export type ActionResponse = {
  success: boolean;
  error?: string;
  turmaId?: string;
  turmaNome?: string;
  alunos_solicitacoes?: any[];
};

/**
 * Busca flexível de turmas em memória (evita erros de UUID do Postgres)
 * + Auto-Healing (Auto-Upsert) se a turma não existir no banco de dados.
 */
async function localizarOuCriarTurma(
  adminClient: any,
  turmaId?: string,
  turmaNome?: string,
  novoAluno?: any,
  professorEmailPadrao?: string
): Promise<{ turma: any; isNew: boolean; error?: string }> {
  const cleanId = String(turmaId || "").trim().toLowerCase();
  const cleanNome = String(turmaNome || "").trim().toLowerCase();

  // 1. Busca todas as turmas cadastradas (sem filtrar por id no SQL para não gerar erro de sintaxe UUID)
  const { data: todasTurmas, error: fetchErr } = await adminClient
    .from("turmas")
    .select("*");

  if (fetchErr) {
    console.warn("Aviso ao buscar todas as turmas:", fetchErr.message);
  }

  // 2. Localiza em memória com normalização flexível (id, nome ou cruzado)
  let turmaEncontrada = (todasTurmas || []).find((t: any) => {
    const tId = String(t.id || "").trim().toLowerCase();
    const tNome = String(t.nome || "").trim().toLowerCase();

    const matchId = cleanId && (tId === cleanId || tNome === cleanId);
    const matchNome = cleanNome && (tNome === cleanNome || tId === cleanNome);

    return Boolean(matchId || matchNome);
  });

  if (turmaEncontrada) {
    return { turma: turmaEncontrada, isNew: false };
  }

  // 3. AUTO-HEALING: Se não encontrou, cria a turma automaticamente no banco
  const nomeFinal = (turmaNome || turmaId || "Turma").trim();
  const profEmail = (professorEmailPadrao || ADMIN_EMAILS[0]).toLowerCase().trim();
  const initialArray = novoAluno ? [novoAluno] : [];

  const { data: novaTurma, error: insertErr } = await adminClient
    .from("turmas")
    .insert([
      {
        nome: nomeFinal,
        professor_email: profEmail,
        alunos_solicitacoes: initialArray,
        componentes_liberados: true,
      },
    ])
    .select()
    .single();

  if (insertErr) {
    console.warn("Aviso na auto-criação com professor_email, tentando fallback simples:", insertErr.message);
    const { data: fallbackTurma, error: fallbackErr } = await adminClient
      .from("turmas")
      .insert([
        {
          nome: nomeFinal,
          alunos_solicitacoes: initialArray,
        },
      ])
      .select()
      .single();

    if (fallbackErr) {
      return { turma: null, isNew: false, error: fallbackErr.message };
    }
    return { turma: fallbackTurma, isNew: true };
  }

  return { turma: novaTurma, isNew: true };
}

/**
 * ETAPA 1: Solicitar Acesso à Turma
 * Fonte única de verdade: coluna alunos_solicitacoes (JSONB) na tabela turmas.
 */
export async function solicitarAcessoAction(params: {
  turmaId: string;
  turmaNome?: string;
  nome?: string;
  email?: string;
  professorEmail?: string;
}): Promise<ActionResponse> {
  try {
    const userClient = await getSupabaseUserClient();
    const { data: { user } } = await userClient.auth.getUser();

    const studentEmail = (user?.email || params.email || "").toLowerCase().trim();
    if (!studentEmail) {
      return { success: false, error: "Usuário não autenticado. Faça login para solicitar acesso." };
    }

    const studentName = (
      params.nome ||
      user?.user_metadata?.full_name ||
      studentEmail.split("@")[0] ||
      "Aluno"
    ).trim();

    const adminClient = getSupabaseAdminClient();

    const novoObjetoAluno = {
      id: crypto.randomUUID(),
      nome: studentName,
      email: studentEmail,
      status: "pendente",
      data_solicitacao: new Date().toISOString(),
    };

    // Localiza ou auto-cria a turma com a solicitação incluída
    const { turma, isNew, error } = await localizarOuCriarTurma(
      adminClient,
      params.turmaId,
      params.turmaNome,
      novoObjetoAluno,
      params.professorEmail
    );

    if (!turma) {
      return { success: false, error: error || "Não foi possível localizar ou criar a turma no banco." };
    }

    // Se foi criada agora (Auto-Healing), a solicitação já está gravada
    if (isNew) {
      return {
        success: true,
        turmaId: turma.id,
        turmaNome: turma.nome,
        alunos_solicitacoes: [novoObjetoAluno],
      };
    }

    // Se a turma já existia, faz o append com substituição de registros antigos deste mesmo aluno
    const currentArray: any[] = Array.isArray(turma.alunos_solicitacoes)
      ? turma.alunos_solicitacoes
      : [];

    const filtered = currentArray.filter(
      (a: any) => String(a.email || "").toLowerCase().trim() !== studentEmail
    );
    const updatedArray = [...filtered, novoObjetoAluno];

    const { error: updateErr } = await adminClient
      .from("turmas")
      .update({ alunos_solicitacoes: updatedArray })
      .eq("id", turma.id);

    if (updateErr) {
      console.error("Erro ao atualizar alunos_solicitacoes em turmas:", updateErr);
      return { success: false, error: updateErr.message };
    }

    return {
      success: true,
      turmaId: turma.id,
      turmaNome: turma.nome,
      alunos_solicitacoes: updatedArray,
    };
  } catch (err: any) {
    console.error("Exceção em solicitarAcessoAction:", err);
    return { success: false, error: err.message || "Erro interno do servidor." };
  }
}

/**
 * ETAPA 3: Aprovação de Aluno
 * Atualiza status para 'aprovado' dentro do array JSONB da turma.
 */
export async function aprovarAlunoAction(params: {
  turmaId: string;
  turmaNome?: string;
  email: string;
}): Promise<ActionResponse> {
  try {
    const adminClient = getSupabaseAdminClient();
    const userClient = await getSupabaseUserClient();
    const { data: { user } } = await userClient.auth.getUser();

    const callerEmail = user?.email?.toLowerCase().trim() || "";
    const isProf = isProfessorEmail(callerEmail);

    if (!isProf && !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return { success: false, error: "Apenas instrutores autorizados podem aprovar alunos." };
    }

    const { turma, error } = await localizarOuCriarTurma(adminClient, params.turmaId, params.turmaNome);
    if (!turma) {
      return { success: false, error: error || "Turma não encontrada." };
    }

    const currentArray: any[] = Array.isArray(turma.alunos_solicitacoes)
      ? turma.alunos_solicitacoes
      : [];

    const targetEmail = String(params.email || "").toLowerCase().trim();

    const updatedArray = currentArray.map((a: any) => {
      if (String(a.email || "").toLowerCase().trim() === targetEmail) {
        return {
          ...a,
          status: "aprovado",
          data_aprovacao: new Date().toISOString(),
        };
      }
      return a;
    });

    const { error: updateErr } = await adminClient
      .from("turmas")
      .update({ alunos_solicitacoes: updatedArray })
      .eq("id", turma.id);

    if (updateErr) {
      console.error("Erro ao aprovar aluno no JSONB da turma:", updateErr);
      return { success: false, error: updateErr.message };
    }

    return {
      success: true,
      turmaId: turma.id,
      turmaNome: turma.nome,
      alunos_solicitacoes: updatedArray,
    };
  } catch (err: any) {
    return { success: false, error: err.message || "Erro interno ao aprovar aluno." };
  }
}

/**
 * ETAPA 3: Revogação / Rejeição de Aluno
 * Remove o aluno do array JSONB da turma.
 */
export async function rejeitarAlunoAction(params: {
  turmaId: string;
  turmaNome?: string;
  email: string;
}): Promise<ActionResponse> {
  try {
    const adminClient = getSupabaseAdminClient();
    const userClient = await getSupabaseUserClient();
    const { data: { user } } = await userClient.auth.getUser();

    const callerEmail = user?.email?.toLowerCase().trim() || "";
    const isProf = isProfessorEmail(callerEmail);

    if (!isProf && !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return { success: false, error: "Apenas instrutores autorizados podem revogar alunos." };
    }

    const { turma, error } = await localizarOuCriarTurma(adminClient, params.turmaId, params.turmaNome);
    if (!turma) {
      return { success: false, error: error || "Turma não encontrada." };
    }

    const currentArray: any[] = Array.isArray(turma.alunos_solicitacoes)
      ? turma.alunos_solicitacoes
      : [];

    const targetEmail = String(params.email || "").toLowerCase().trim();

    const updatedArray = currentArray.filter(
      (a: any) => String(a.email || "").toLowerCase().trim() !== targetEmail
    );

    const { error: updateErr } = await adminClient
      .from("turmas")
      .update({ alunos_solicitacoes: updatedArray })
      .eq("id", turma.id);

    if (updateErr) {
      console.error("Erro ao revogar aluno no JSONB da turma:", updateErr);
      return { success: false, error: updateErr.message };
    }

    return {
      success: true,
      turmaId: turma.id,
      turmaNome: turma.nome,
      alunos_solicitacoes: updatedArray,
    };
  } catch (err: any) {
    return { success: false, error: err.message || "Erro interno ao revogar aluno." };
  }
}

/**
 * Consulta todas as solicitações extraídas da coluna alunos_solicitacoes da tabela turmas
 */
export async function carregarSolicitacoesAction(): Promise<{
  success: boolean;
  solicitacoes: any[];
  error?: string;
}> {
  try {
    const adminClient = getSupabaseAdminClient();
    const { data: turmas, error } = await adminClient
      .from("turmas")
      .select("id, nome, professor_email, alunos_solicitacoes");

    if (error) {
      return { success: false, solicitacoes: [], error: error.message };
    }

    const todas: any[] = [];
    if (turmas) {
      for (const t of turmas) {
        if (Array.isArray(t.alunos_solicitacoes)) {
          for (const a of t.alunos_solicitacoes) {
            todas.push({
              ...a,
              turmaId: t.id,
              turmaNome: t.nome,
              professor_email: t.professor_email,
            });
          }
        }
      }
    }

    return { success: true, solicitacoes: todas };
  } catch (err: any) {
    return { success: false, solicitacoes: [], error: err.message };
  }
}

/**
 * ETAPA 1: Atualizar Permissões de Conteúdo (Aulas, Módulos e Ferramentas) da Turma
 */
export async function atualizarPermissoesTurmaAction(params: {
  turmaId: string;
  permissoes: any;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const adminClient = getSupabaseAdminClient();
    const userClient = await getSupabaseUserClient();
    const { data: { user } } = await userClient.auth.getUser();

    const callerEmail = user?.email?.toLowerCase().trim() || "";
    const isProf = isProfessorEmail(callerEmail);

    if (!isProf && !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return { success: false, error: "Apenas instrutores autorizados podem alterar permissões." };
    }

    const clientToUse = adminClient || userClient;

    const { error } = await clientToUse
      .from("turmas")
      .update({
        permissoes_conteudo: params.permissoes,
        ...(params.permissoes?.ferramentas?.componentes !== undefined
          ? { componentes_liberados: params.permissoes.ferramentas.componentes }
          : {}),
      })
      .eq("id", params.turmaId);

    if (error) {
      console.error("Erro ao atualizar permissoes_conteudo:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
