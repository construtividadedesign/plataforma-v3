import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const ADMIN_EMAILS = [
  "instrutorleonardosenai@gmail.com",
  "designtecnologia.2026@gmail.com",
  "engeletricojosue@gmail.com",
  "julioangeloxavier@gmail.com",
];

async function getSupabaseServerClient() {
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

function getSupabaseAdminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
  if (!serviceKey) return null;
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey);
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const email = user.email?.toLowerCase().trim() || "";
    const isProf = ADMIN_EMAILS.includes(email);
    const adminClient = getSupabaseAdminClient();
    const clientToUse = adminClient || supabase;

    // Tenta buscar da tabela solicitacoes_alunos
    const { data, error } = await clientToUse
      .from("solicitacoes_alunos")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      return NextResponse.json({ solicitacoes: data });
    }

    // Fallback: se a tabela solicitacoes_alunos não existir, extrai de turmas.alunos_solicitacoes
    const { data: turmasData } = await clientToUse.from("turmas").select("id, nome, alunos_solicitacoes");
    const solicitacoesExtraidas: any[] = [];
    if (turmasData) {
      for (const t of turmasData) {
        if (Array.isArray(t.alunos_solicitacoes)) {
          for (const s of t.alunos_solicitacoes) {
            solicitacoesExtraidas.push({
              ...s,
              turma_id: s.turmaId || t.id,
              turma_nome: s.turmaNome || t.nome
            });
          }
        }
      }
    }

    return NextResponse.json({ solicitacoes: solicitacoesExtraidas, fallback: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const email = user.email?.toLowerCase().trim() || "";
    const isProf = ADMIN_EMAILS.includes(email);
    const body = await request.json();
    const { action, turmaId, turmaNome, emailAluno, nomeAluno, professorEmail } = body;

    const adminClient = getSupabaseAdminClient();
    const clientToUse = adminClient || supabase;

    if (action === "solicitar") {
      const targetTurmaId = String(turmaId || "").trim();
      const targetTurmaNome = String(turmaNome || "").trim();
      const studentEmail = email.toLowerCase().trim();
      const studentName = (nomeAluno || user.user_metadata?.full_name || email.split("@")[0] || "Aluno").trim();

      const payload = {
        turma_id: targetTurmaId,
        turma_nome: targetTurmaNome,
        user_id: user.id,
        email: studentEmail,
        nome: studentName,
        status: "pendente",
        professor_email: (professorEmail || "").toLowerCase().trim(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await clientToUse
        .from("solicitacoes_alunos")
        .upsert(payload, { onConflict: "turma_id, email" })
        .select();

      if (error) {
        console.warn("Aviso ao persistir em solicitacoes_alunos:", error.message);
      }

      // Se temos o admin client, espelha também no campo alunos_solicitacoes da turma
      if (adminClient && targetTurmaId) {
        try {
          const { data: turmaRow } = await adminClient
            .from("turmas")
            .select("alunos_solicitacoes")
            .eq("id", targetTurmaId)
            .single();

          const existing: any[] = Array.isArray(turmaRow?.alunos_solicitacoes) ? turmaRow.alunos_solicitacoes : [];
          const updated = [
            ...existing.filter(s => s.email?.toLowerCase().trim() !== studentEmail),
            {
              turmaId: targetTurmaId,
              turmaNome: targetTurmaNome,
              email: studentEmail,
              nome: studentName,
              status: "pendente",
              professor_email: payload.professor_email
            }
          ];

          await adminClient
            .from("turmas")
            .update({ alunos_solicitacoes: updated })
            .eq("id", targetTurmaId);
        } catch (syncErr) {
          console.warn("Aviso ao espelhar na turma:", syncErr);
        }
      }

      return NextResponse.json({ success: true, payload });
    }

    if (action === "aprovar") {
      if (!isProf) {
        return NextResponse.json({ error: "Restrito ao instrutor" }, { status: 403 });
      }

      const targetEmail = String(emailAluno || "").toLowerCase().trim();
      const targetTurmaId = String(turmaId || "").trim();

      await clientToUse
        .from("solicitacoes_alunos")
        .update({ status: "aprovado", updated_at: new Date().toISOString() })
        .eq("turma_id", targetTurmaId)
        .eq("email", targetEmail);

      // Espelha no registro da turma
      if (adminClient && targetTurmaId) {
        try {
          const { data: turmaRow } = await adminClient
            .from("turmas")
            .select("alunos_solicitacoes")
            .eq("id", targetTurmaId)
            .single();

          if (Array.isArray(turmaRow?.alunos_solicitacoes)) {
            const updated = turmaRow.alunos_solicitacoes.map((s: any) =>
              s.email?.toLowerCase().trim() === targetEmail ? { ...s, status: "aprovado" } : s
            );
            await adminClient
              .from("turmas")
              .update({ alunos_solicitacoes: updated })
              .eq("id", targetTurmaId);
          }
        } catch {}
      }

      return NextResponse.json({ success: true });
    }

    if (action === "rejeitar" || action === "excluir" || action === "revogar") {
      if (!isProf) {
        return NextResponse.json({ error: "Restrito ao instrutor" }, { status: 403 });
      }

      const targetEmail = String(emailAluno || "").toLowerCase().trim();
      const targetTurmaId = String(turmaId || "").trim();

      // Deleta ou atualiza status para excluido
      await clientToUse
        .from("solicitacoes_alunos")
        .delete()
        .eq("turma_id", targetTurmaId)
        .eq("email", targetEmail);

      if (adminClient && targetTurmaId) {
        try {
          const { data: turmaRow } = await adminClient
            .from("turmas")
            .select("alunos_solicitacoes")
            .eq("id", targetTurmaId)
            .single();

          if (Array.isArray(turmaRow?.alunos_solicitacoes)) {
            const updated = turmaRow.alunos_solicitacoes.filter(
              (s: any) => s.email?.toLowerCase().trim() !== targetEmail
            );
            await adminClient
              .from("turmas")
              .update({ alunos_solicitacoes: updated })
              .eq("id", targetTurmaId);
          }
        } catch {}
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Ação inválida" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
