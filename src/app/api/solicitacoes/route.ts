import { NextResponse, type NextRequest } from 'next/server';
import {
  solicitarAcessoAction,
  aprovarAlunoAction,
  rejeitarAlunoAction,
  carregarSolicitacoesAction,
  atualizarPermissoesTurmaAction
} from '@/app/actions/solicitacoes';

export async function GET(request: NextRequest) {
  try {
    const result = await carregarSolicitacoesAction();
    if (!result.success) {
      return NextResponse.json({ error: result.error || "Erro ao consultar solicitações" }, { status: 500 });
    }
    return NextResponse.json({ solicitacoes: result.solicitacoes }, { status: 200 });
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
        return NextResponse.json({ error: res.error || "Erro ao processar solicitação de acesso" }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        turmaId: res.turmaId,
        turmaNome: res.turmaNome,
        alunos_solicitacoes: res.alunos_solicitacoes
      }, { status: 200 });
    }

    if (action === "aprovar") {
      const res = await aprovarAlunoAction({
        turmaId,
        turmaNome,
        email: emailAluno,
      });

      if (!res.success) {
        return NextResponse.json({ error: res.error || "Erro ao aprovar aluno no banco" }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        turmaId: res.turmaId,
        turmaNome: res.turmaNome,
        alunos_solicitacoes: res.alunos_solicitacoes
      }, { status: 200 });
    }

    if (action === "rejeitar" || action === "excluir" || action === "revogar") {
      const res = await rejeitarAlunoAction({
        turmaId,
        turmaNome,
        email: emailAluno,
      });

      if (!res.success) {
        return NextResponse.json({ error: res.error || "Erro ao revogar aluno no banco" }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        turmaId: res.turmaId,
        turmaNome: res.turmaNome,
        alunos_solicitacoes: res.alunos_solicitacoes
      }, { status: 200 });
    }

    if (action === "atualizar_permissoes") {
      const res = await atualizarPermissoesTurmaAction({
        turmaId,
        permissoes: body.permissoes,
      });

      if (!res.success) {
        return NextResponse.json({ error: res.error || "Erro ao atualizar permissões da turma" }, { status: 500 });
      }

      return NextResponse.json({ success: true }, { status: 200 });
    }

    return NextResponse.json({ error: "Ação inválida" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
