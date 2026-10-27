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

  if (!serviceKey) return null;

  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/**
 * Cria cliente Supabase de servidor com a sessão/cookies do usuário.
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
  data?: any;
};

/**
 * Solicitar acesso à turma com bypass seguro de RLS via Service Role Key
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

    // Determina dados do aluno
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

    const studentUserId = user?.id || null;

    // Seleciona o cliente: prioriza Service Role Key para bypass de RLS
    const adminClient = getSupabaseAdminClient();
    const clientToUse = adminClient || userClient;

    const rawTurmaId = String(params.turmaId || "").trim();
    const rawTurmaNome = String(params.turmaNome || "").trim();

    // Localiza a turma de forma precisa para garantir UUID válido
    let targetTurmaId = rawTurmaId;
    let targetTurmaNome = rawTurmaNome;
    let targetProfEmail = (params.professorEmail || "").toLowerCase().trim();
    let turmaRowFound: any = null;

    try {
      // Tenta buscar por ID ou Nome na tabela turmas
      let query = clientToUse.from("turmas").select("id, nome, professor_email, alunos_solicitacoes");
      if (rawTurmaId) {
        query = query.or(`id.eq.${rawTurmaId},nome.ilike.%${rawTurmaNome || rawTurmaId}%`);
      } else if (rawTurmaNome) {
        query = query.ilike("nome", `%${rawTurmaNome}%`);
      }

      const { data: found } = await query.limit(1).maybeSingle();
      if (found) {
        turmaRowFound = found;
        targetTurmaId = String(found.id).trim();
        targetTurmaNome = String(found.nome || "").trim();
        if (found.professor_email) {
          targetProfEmail = String(found.professor_email).toLowerCase().trim();
        }
      }
    } catch (e) {
      console.warn("Aviso na busca da turma para solicitação:", e);
    }

    const payload = {
      turma_id: targetTurmaId,
      turma_nome: targetTurmaNome,
      user_id: studentUserId,
      email: studentEmail,
      nome: studentName,
      status: "pendente",
      professor_email: targetProfEmail,
      updated_at: new Date().toISOString(),
    };

    let inserted = false;
    let lastError: string | null = null;

    // 1. Tenta gravar na tabela solicitacoes_alunos
    try {
      const { error: solErr } = await clientToUse
        .from("solicitacoes_alunos")
        .upsert(payload, { onConflict: "turma_id, email" });

      if (!solErr) {
        inserted = true;
      } else {
        lastError = solErr.message;
        console.warn("Aviso ao inserir em solicitacoes_alunos:", solErr.message);
      }
    } catch (solEx: any) {
      lastError = solEx.message;
    }

    // 2. Tenta espelhar no JSONB alunos_solicitacoes da turma
    if (targetTurmaId) {
      try {
        let currentSolicitacoes: any[] = [];
        if (turmaRowFound && Array.isArray(turmaRowFound.alunos_solicitacoes)) {
          currentSolicitacoes = turmaRowFound.alunos_solicitacoes;
        } else {
          const { data: tRow } = await clientToUse
            .from("turmas")
            .select("alunos_solicitacoes")
            .eq("id", targetTurmaId)
            .maybeSingle();
          if (tRow && Array.isArray(tRow.alunos_solicitacoes)) {
            currentSolicitacoes = tRow.alunos_solicitacoes;
          }
        }

        const updated = [
          ...currentSolicitacoes.filter((s: any) => String(s.email).toLowerCase().trim() !== studentEmail),
          {
            turmaId: targetTurmaId,
            turmaNome: targetTurmaNome,
            email: studentEmail,
            nome: studentName,
            status: "pendente",
            professor_email: targetProfEmail,
            updated_at: new Date().toISOString(),
          },
        ];

        const { error: updErr } = await clientToUse
          .from("turmas")
          .update({ alunos_solicitacoes: updated })
          .eq("id", targetTurmaId);

        if (!updErr) {
          inserted = true;
        } else if (!inserted) {
          lastError = updErr.message;
        }
      } catch (jsonbEx: any) {
        console.warn("Aviso ao espelhar JSONB na turma:", jsonbEx);
        if (!inserted) lastError = jsonbEx.message;
      }
    }

    if (!inserted) {
      return {
        success: false,
        error: lastError || "Não foi possível registrar a solicitação no banco de dados.",
      };
    }

    return { success: true, data: payload };
  } catch (err: any) {
    console.error("Exceção em solicitarAcessoAction:", err);
    return { success: false, error: err.message || "Erro interno do servidor ao processar solicitação." };
  }
}

/**
 * Aprovar solicitação de aluno
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

    if (!isProf && adminClient === null) {
      return { success: false, error: "Apenas instrutores autorizados podem aprovar alunos." };
    }

    const clientToUse = adminClient || userClient;
    const targetEmail = String(params.email || "").toLowerCase().trim();
    const targetTurmaId = String(params.turmaId || "").trim();

    let updated = false;
    let lastError: string | null = null;

    // 1. Atualiza na tabela solicitacoes_alunos
    try {
      const { error: solErr } = await clientToUse
        .from("solicitacoes_alunos")
        .update({ status: "aprovado", updated_at: new Date().toISOString() })
        .eq("turma_id", targetTurmaId)
        .eq("email", targetEmail);

      if (!solErr) {
        updated = true;
      } else {
        lastError = solErr.message;
      }
    } catch (e: any) {
      lastError = e.message;
    }

    // 2. Atualiza no JSONB alunos_solicitacoes da turma
    try {
      const { data: turmaRow } = await clientToUse
        .from("turmas")
        .select("alunos_solicitacoes")
        .eq("id", targetTurmaId)
        .maybeSingle();

      if (turmaRow && Array.isArray(turmaRow.alunos_solicitacoes)) {
        const list = turmaRow.alunos_solicitacoes.map((s: any) =>
          String(s.email).toLowerCase().trim() === targetEmail
            ? { ...s, status: "aprovado", updated_at: new Date().toISOString() }
            : s
        );

        const { error: updErr } = await clientToUse
          .from("turmas")
          .update({ alunos_solicitacoes: list })
          .eq("id", targetTurmaId);

        if (!updErr) updated = true;
      }
    } catch (e: any) {
      if (!updated) lastError = e.message;
    }

    if (!updated) {
      return { success: false, error: lastError || "Não foi possível aprovar o aluno no banco." };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Erro interno ao aprovar aluno." };
  }
}

/**
 * Rejeitar ou revogar acesso de aluno
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

    if (!isProf && adminClient === null) {
      return { success: false, error: "Apenas instrutores autorizados podem rejeitar/revogar alunos." };
    }

    const clientToUse = adminClient || userClient;
    const targetEmail = String(params.email || "").toLowerCase().trim();
    const targetTurmaId = String(params.turmaId || "").trim();

    let deleted = false;
    let lastError: string | null = null;

    // 1. Remove ou atualiza em solicitacoes_alunos
    try {
      const { error: solErr } = await clientToUse
        .from("solicitacoes_alunos")
        .delete()
        .eq("turma_id", targetTurmaId)
        .eq("email", targetEmail);

      if (!solErr) {
        deleted = true;
      } else {
        lastError = solErr.message;
      }
    } catch (e: any) {
      lastError = e.message;
    }

    // 2. Remove do JSONB alunos_solicitacoes da turma
    try {
      const { data: turmaRow } = await clientToUse
        .from("turmas")
        .select("alunos_solicitacoes")
        .eq("id", targetTurmaId)
        .maybeSingle();

      if (turmaRow && Array.isArray(turmaRow.alunos_solicitacoes)) {
        const list = turmaRow.alunos_solicitacoes.filter(
          (s: any) => String(s.email).toLowerCase().trim() !== targetEmail
        );

        const { error: updErr } = await clientToUse
          .from("turmas")
          .update({ alunos_solicitacoes: list })
          .eq("id", targetTurmaId);

        if (!updErr) deleted = true;
      }
    } catch (e: any) {
      if (!deleted) lastError = e.message;
    }

    if (!deleted) {
      return { success: false, error: lastError || "Não foi possível revogar o aluno no banco." };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Erro interno ao revogar aluno." };
  }
}

/**
 * Carregar todas as solicitações de alunos com dados consolidados
 */
export async function carregarSolicitacoesAction(): Promise<{
  success: boolean;
  solicitacoes: any[];
  error?: string;
}> {
  try {
    const adminClient = getSupabaseAdminClient();
    const userClient = await getSupabaseUserClient();
    const clientToUse = adminClient || userClient;

    let solicitacoes: any[] = [];

    // 1. Consulta solicitacoes_alunos
    try {
      const { data, error } = await clientToUse
        .from("solicitacoes_alunos")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        solicitacoes = data;
      }
    } catch (e) {
      console.warn("Aviso ao ler solicitacoes_alunos:", e);
    }

    // 2. Consolida com turmas.alunos_solicitacoes
    try {
      const { data: turmasData } = await clientToUse
        .from("turmas")
        .select("id, nome, alunos_solicitacoes");

      if (turmasData) {
        for (const t of turmasData) {
          if (Array.isArray(t.alunos_solicitacoes)) {
            for (const s of t.alunos_solicitacoes) {
              const solEmail = String(s.email || "").toLowerCase().trim();
              const solTurmaId = String(s.turmaId || t.id).trim().toLowerCase();

              const alreadyExists = solicitacoes.some(
                item =>
                  String(item.email || "").toLowerCase().trim() === solEmail &&
                  String(item.turma_id || item.turmaId || "").toLowerCase().trim() === solTurmaId
              );

              if (!alreadyExists) {
                solicitacoes.push({
                  ...s,
                  turma_id: s.turmaId || t.id,
                  turma_nome: s.turmaNome || t.nome,
                });
              }
            }
          }
        }
      }
    } catch (e) {
      console.warn("Aviso ao consolidar JSONB das turmas:", e);
    }

    return { success: true, solicitacoes };
  } catch (err: any) {
    return { success: false, solicitacoes: [], error: err.message };
  }
}
