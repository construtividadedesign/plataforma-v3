import { NextResponse, type NextRequest } from 'next/server';
import {
  solicitarAcessoAction,
  aprovarAlunoAction,
  rejeitarAlunoAction,
  carregarSolicitacoesAction
} from '@/app/actions/solicitacoes';

export async function GET(request: NextRequest) {
  try {
    const result = await carregarSolicitacoesAction();
    if (!result.success) {
      return NextResponse.json({ error: result.error || "Erro ao carregar solicitações" }, { status: 500 });
    }
    return NextResponse.json({ solicitacoes: result.solicitacoes });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, turmaId, turmaNome, emailAluno, nomeAluno, professorEmail } = body;

    if (action === "solicitar") {
      const res = await solicitarAcessoAction({
        turmaId,
        turmaNome,
        nome: nomeAluno,
        email: emailAluno,
        professorEmail,
      });

      if (!res.success) {
        return NextResponse.json({ error: res.error || "Erro ao registrar solicitação" }, { status: 400 });
      }

      return NextResponse.json({ success: true, data: res.data });
    }

    if (action === "aprovar") {
      const res = await aprovarAlunoAction({
        turmaId,
        email: emailAluno,
      });

      if (!res.success) {
        return NextResponse.json({ error: res.error || "Erro ao aprovar aluno" }, { status: 400 });
      }

      return NextResponse.json({ success: true });
    }

    if (action === "rejeitar" || action === "excluir" || action === "revogar") {
      const res = await rejeitarAlunoAction({
        turmaId,
        email: emailAluno,
      });

      if (!res.success) {
        return NextResponse.json({ error: res.error || "Erro ao revogar aluno" }, { status: 400 });
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Ação inválida" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
