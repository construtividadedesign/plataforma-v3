"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

const ADMIN_EMAILS = [
  "instrutorleonardosenai@gmail.com",
  "designtecnologia.2026@gmail.com",
];

type Turma = {
  id: string;
  nome: string;
  instrutor_id: string;
  created_at: string;
  status?: "ativa" | "arquivada";
};

type AlunoSolicitacao = {
  turmaId: string;
  email: string;
  nome: string;
  status: "pendente" | "aprovado";
};

type TurmaContextType = {
  turmas: Turma[];
  turmasArquivadas: Turma[];
  turmaAtiva: Turma | null;
  aulasConcluidas: string[];
  isLoadingTurmas: boolean;
  isProfessor: boolean;
  userEmail: string | null;
  userName: string | null;
  alunoStatusAprovacao: "pendente" | "aprovado" | "nao_solicitado";
  alunosPendentes: AlunoSolicitacao[];
  selecionarTurma: (id: string) => void;
  solicitarAcessoTurma: (turmaId: string) => void;
  aprovarAluno: (email: string, turmaId: string) => void;
  rejeitarAluno: (email: string, turmaId: string) => void;
  criarTurma: (nome: string) => Promise<boolean>;
  arquivarTurma: (turmaId: string) => void;
  excluirTurma: (turmaId: string) => Promise<void>;
  alternarConclusaoAula: (moduloId: string, aulaId: string, isConcluida: boolean) => Promise<void>;
};

const TurmaContext = createContext<TurmaContextType | undefined>(undefined);

export function TurmaProvider({ children }: { children: React.ReactNode }) {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [turmasArquivadas, setTurmasArquivadas] = useState<Turma[]>([]);
  const [turmaAtiva, setTurmaAtiva] = useState<Turma | null>(null);
  const [aulasConcluidas, setAulasConcluidas] = useState<string[]>([]);
  const [isLoadingTurmas, setIsLoadingTurmas] = useState(true);
  const [isProfessor, setIsProfessor] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  const [alunoStatusAprovacao, setAlunoStatusAprovacao] = useState<"pendente" | "aprovado" | "nao_solicitado">("nao_solicitado");
  const [alunosPendentes, setAlunosPendentes] = useState<AlunoSolicitacao[]>([]);

  // 1. Carregar Utilizador, Turmas e Estado de Aprovação
  useEffect(() => {
    const supabase = createClient();
    async function carregarDados() {
      setIsLoadingTurmas(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsLoadingTurmas(false);
        return;
      }

      const emailAtual = user.email?.toLowerCase() || null;
      setUserEmail(emailAtual);
      const nomeAtual = user.user_metadata?.full_name || user.email?.split("@")[0] || "Utilizador";
      setUserName(nomeAtual);

      const ehProf = emailAtual ? ADMIN_EMAILS.includes(emailAtual) : false;
      setIsProfessor(ehProf);

      // Carrega turmas do Supabase
      const { data, error } = await supabase
        .from("turmas")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        // Separa ativas e arquivadas (salvas no localStorage por simplicidade robusta)
        const arquivadasIds = JSON.parse(localStorage.getItem("hvac_turmas_arquivadas") || "[]");
        
        const ativasList = data.filter(t => !arquivadasIds.includes(t.id));
        const arquivadasList = data.filter(t => arquivadasIds.includes(t.id));

        setTurmas(ativasList);
        setTurmasArquivadas(arquivadasList);

        if (ativasList.length > 0) {
          setTurmaAtiva(ativasList[0]);
        }
      }

      // Carrega solicitações de alunos salvas
      const savedPendentes = JSON.parse(localStorage.getItem("hvac_alunos_solicitacoes") || "[]");
      setAlunosPendentes(savedPendentes);

      if (!ehProf && emailAtual) {
        const meuVinculo = savedPendentes.find((s: AlunoSolicitacao) => s.email === emailAtual);
        if (meuVinculo) {
          setAlunoStatusAprovacao(meuVinculo.status);
        } else {
          setAlunoStatusAprovacao("nao_solicitado");
        }
      }

      setIsLoadingTurmas(false);
    }
    carregarDados();
  }, []);

  // 2. Carregar Progresso da Turma Ativa
  useEffect(() => {
    if (!turmaAtiva) {
      setAulasConcluidas([]);
      return;
    }

    const turmaId = turmaAtiva.id;
    const supabase = createClient();

    async function carregarProgresso() {
      const { data, error } = await supabase
        .from("progresso_turmas")
        .select("aula_id")
        .eq("turma_id", turmaId)
        .eq("concluida", true);

      if (!error && data) {
        setAulasConcluidas(data.map(p => p.aula_id));
      }
    }
    carregarProgresso();
  }, [turmaAtiva]);

  const selecionarTurma = (id: string) => {
    const turma = turmas.find(t => t.id === id);
    if (turma) {
      setTurmaAtiva(turma);
      if (!isProfessor && userEmail) {
        const savedPendentes = JSON.parse(localStorage.getItem("hvac_alunos_solicitacoes") || "[]");
        const meuVinculo = savedPendentes.find((s: AlunoSolicitacao) => s.email === userEmail && s.turmaId === id);
        if (meuVinculo) {
          setAlunoStatusAprovacao(meuVinculo.status);
        } else {
          setAlunoStatusAprovacao("nao_solicitado");
        }
      }
    }
  };

  const solicitarAcessoTurma = (turmaId: string) => {
    if (!userEmail || isProfessor) return;
    const novaSolicitacao: AlunoSolicitacao = {
      turmaId,
      email: userEmail,
      nome: userName || "Aluno",
      status: "pendente"
    };

    const atualizadas = [...alunosPendentes.filter(s => s.email !== userEmail), novaSolicitacao];
    setAlunosPendentes(atualizadas);
    localStorage.setItem("hvac_alunos_solicitacoes", JSON.stringify(atualizadas));
    setAlunoStatusAprovacao("pendente");
  };

  const aprovarAluno = (email: string, turmaId: string) => {
    if (!isProfessor) return;
    const atualizadas = alunosPendentes.map(s => {
      if (s.email === email && s.turmaId === turmaId) {
        return { ...s, status: "aprovado" as const };
      }
      return s;
    });
    setAlunosPendentes(atualizadas);
    localStorage.setItem("hvac_alunos_solicitacoes", JSON.stringify(atualizadas));
  };

  const rejeitarAluno = (email: string, turmaId: string) => {
    if (!isProfessor) return;
    const atualizadas = alunosPendentes.filter(s => !(s.email === email && s.turmaId === turmaId));
    setAlunosPendentes(atualizadas);
    localStorage.setItem("hvac_alunos_solicitacoes", JSON.stringify(atualizadas));
  };

  const criarTurma = async (nome: string) => {
    if (!isProfessor) return false;

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from("turmas")
      .insert([{ nome, instrutor_id: user.id }])
      .select()
      .single();

    if (!error && data) {
      setTurmas([data, ...turmas]);
      setTurmaAtiva(data);
      return true;
    }
    return false;
  };

  const arquivarTurma = (turmaId: string) => {
    if (!isProfessor) return;
    const turmaParaArquivar = turmas.find(t => t.id === turmaId);
    if (!turmaParaArquivar) return;

    const novasAtivas = turmas.filter(t => t.id !== turmaId);
    const novasArquivadas = [turmaParaArquivar, ...turmasArquivadas];

    setTurmas(novasAtivas);
    setTurmasArquivadas(novasArquivadas);

    const arquivadasIds = novasArquivadas.map(t => t.id);
    localStorage.setItem("hvac_turmas_arquivadas", JSON.stringify(arquivadasIds));

    if (turmaAtiva?.id === turmaId) {
      setTurmaAtiva(novasAtivas.length > 0 ? novasAtivas[0] : null);
    }
  };

  const excluirTurma = async (turmaId: string) => {
    if (!isProfessor) return;
    const supabase = createClient();

    // Apaga do Supabase
    const { error } = await supabase.from("turmas").delete().eq("id", turmaId);

    if (!error) {
      setTurmas(turmas.filter(t => t.id !== turmaId));
      setTurmasArquivadas(turmasArquivadas.filter(t => t.id !== turmaId));

      if (turmaAtiva?.id === turmaId) {
        const restantes = turmas.filter(t => t.id !== turmaId);
        setTurmaAtiva(restantes.length > 0 ? restantes[0] : null);
      }
    }
  };

  const alternarConclusaoAula = async (moduloId: string, aulaId: string, isConcluida: boolean) => {
    if (!turmaAtiva || !isProfessor) return;
    const turmaId = turmaAtiva.id;

    if (isConcluida) {
      setAulasConcluidas(prev => [...prev, aulaId]);
    } else {
      setAulasConcluidas(prev => prev.filter(id => id !== aulaId));
    }

    const supabase = createClient();
    const { error } = await supabase
      .from("progresso_turmas")
      .upsert({
        turma_id: turmaId,
        modulo_id: moduloId,
        aula_id: aulaId,
        concluida: isConcluida
      }, { 
        onConflict: 'turma_id, modulo_id, aula_id' 
      });

    if (error) {
      console.error("Erro ao gravar progresso:", error);
      if (isConcluida) {
        setAulasConcluidas(prev => prev.filter(id => id !== aulaId));
      } else {
        setAulasConcluidas(prev => [...prev, aulaId]);
      }
    }
  };

  return (
    <TurmaContext.Provider value={{ 
      turmas, 
      turmasArquivadas,
      turmaAtiva, 
      aulasConcluidas, 
      isLoadingTurmas,
      isProfessor,
      userEmail,
      userName,
      alunoStatusAprovacao,
      alunosPendentes,
      selecionarTurma, 
      solicitarAcessoTurma,
      aprovarAluno,
      rejeitarAluno,
      criarTurma,
      arquivarTurma,
      excluirTurma,
      alternarConclusaoAula 
    }}>
      {children}
    </TurmaContext.Provider>
  );
}

export function useTurma() {
  const context = useContext(TurmaContext);
  if (context === undefined) {
    throw new Error("useTurma deve ser usado dentro de um TurmaProvider");
  }
  return context;
}