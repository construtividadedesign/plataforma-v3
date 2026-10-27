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
    process.env.SUPABASE_SECRET_KEY;

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
  alunos_solicitacoes?: any[];
};

/**
 * Localiza a turma no banco por ID (UUID) ou Nome
 */
async function buscarTurma(adminClient: any, turmaId: string, turmaNome?: string) {
  const cleanId = String(turmaId || "").trim();
  const cleanNome = String(turmaNome || "").trim();

  if (cleanId) {
    const { data } = await adminClient
      .from("turmas")
      .select("id, nome, professor_email, alunos_solicitacoes")
      .eq("id", cleanId)
      .maybeSingle();

    if (data) return data;
  }

  const queryName = cleanNome || cleanId;
  if (queryName) {
    const { data } = await adminClient
      .from("turmas")
      .select("id, nome, professor_email, alunos_solicitacoes")
      .ilike("nome", queryName)
      .maybeSingle();

    if (data) return data;
  }

  return null;
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
    const turma = await buscarTurma(adminClient, params.turmaId, params.turmaNome);

    if (!turma) {
      return { success: false, error: "Turma não encontrada no banco de dados." };
    }

    const currentArray: any[] = Array.isArray(turma.alunos_solicitacoes)
      ? turma.alunos_solicitacoes
      : [];

    const novoObjetoAluno = {
      id: crypto.randomUUID(),
      nome: studentName,
      email: studentEmail,
      status: "pendente",
      data_solicitacao: new Date().toISOString(),
    };

    // Remove qualquer solicitação prévia deste aluno e adiciona o novo pedido (append)
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

    const turma = await buscarTurma(adminClient, params.turmaId);
    if (!turma) {
      return { success: false, error: "Turma não encontrada." };
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

    const turma = await buscarTurma(adminClient, params.turmaId);
    if (!turma) {
      return { success: false, error: "Turma não encontrada." };
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
