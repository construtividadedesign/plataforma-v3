"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * Lista de e-mails autorizados com perfil de Instrutor / Administrador
 * Contém o criador original (Cleverson Leonardo) e os novos instrutores (Prof. Josué e Prof. Júlio)
 */
export const ADMIN_EMAILS: string[] = [
  "instrutorleonardosenai@gmail.com",
  "designtecnologia.2026@gmail.com",
  "engeletricojosue@gmail.com",
  "julioangeloxavier@gmail.com",
];

/**
 * Verifica se um determinado e-mail possui permissões de Instrutor
 */
export function isProfessorEmail(email?: string | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase().trim());
}

/**
 * Retorna a saudação/título personalizado para cada professor
 */
export function getProfessorDisplayName(email?: string | null, name?: string | null): string {
  if (!email) return name ? `Prof. ${name}` : "Instrutor";
  const em = email.toLowerCase().trim();
  if (em.includes("josue")) return "Prof. Josué";
  if (em.includes("julio")) return "Prof. Júlio";
  if (em.includes("leonardo") || em.includes("designtecnologia")) return "Instrutor Leonardo";
  if (name && name !== "Utilizador") return `Prof. ${name}`;
  return "Instrutor";
}

/**
 * Retorna a letra inicial para o avatar do professor
 */
export function getProfessorInitial(email?: string | null, name?: string | null): string {
  if (!email) return name ? name.charAt(0).toUpperCase() : "P";
  const em = email.toLowerCase().trim();
  if (em.includes("josue")) return "J";
  if (em.includes("julio")) return "J";
  if (em.includes("leonardo") || em.includes("designtecnologia")) return "L";
  return name ? name.charAt(0).toUpperCase() : "P";
}

export type Turma = {
  id: string;
  nome: string;
  instrutor_id: string;
  professor_email?: string;
  created_at: string;
  status?: "ativa" | "arquivada";
};

export type AlunoSolicitacao = {
  turmaId: string;
  email: string;
  nome: string;
  status: "pendente" | "aprovado";
  professor_email?: string;
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

  // 1. Carregar Utilizador, Turmas com Isolamento Multi-Tenant e Estado de Aprovação
  useEffect(() => {
    const supabase = createClient();
    async function carregarDados() {
      setIsLoadingTurmas(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsLoadingTurmas(false);
        return;
      }

      const emailAtual = user.email?.toLowerCase().trim() || null;
      setUserEmail(emailAtual);
      const nomeAtual = user.user_metadata?.full_name || user.email?.split("@")[0] || "Utilizador";
      setUserName(nomeAtual);

      const ehProf = isProfessorEmail(emailAtual);
      setIsProfessor(ehProf);

      // Carrega turmas do Supabase com query multi-tenant
      let query = supabase
        .from("turmas")
        .select("*")
        .order("created_at", { ascending: false });

      if (ehProf && user) {
        // Se for professor, busca apenas as turmas pertencentes a este instrutor
        query = query.or(`instrutor_id.eq.${user.id},professor_email.eq.${emailAtual}`);
      }

      let { data, error } = await query;

      // Fallback de compatibilidade caso a coluna professor_email ainda não exista no schema remoto
      if (error && ehProf && user) {
        const fallbackRes = await supabase
          .from("turmas")
          .select("*")
          .eq("instrutor_id", user.id)
          .order("created_at", { ascending: false });
        data = fallbackRes.data;
        error = fallbackRes.error;
      }

      // Se ainda der erro, busca genérica para posterior filtragem segura em memória
      if (error) {
        const fallbackAll = await supabase
          .from("turmas")
          .select("*")
          .order("created_at", { ascending: false });
        data = fallbackAll.data;
        error = fallbackAll.error;
      }

      if (!error && data) {
        let turmasFiltradas = data;

        // Se for professor, isola estritamente em memória: cada professor vê APENAS as suas turmas
        if (ehProf) {
          turmasFiltradas = data.filter((t: Turma) => {
            const matchId = t.instrutor_id === user.id;
            const matchEmail = Boolean(
              t.professor_email && emailAtual && t.professor_email.toLowerCase().trim() === emailAtual
            );
            return matchId || matchEmail;
          });
        }

        // Separa ativas e arquivadas (salvas no localStorage isoladas pelo e-mail do professor)
        const storageKeyArquivadas = `hvac_turmas_arquivadas_${emailAtual || "default"}`;
        const arquivadasIds = JSON.parse(
          localStorage.getItem(storageKeyArquivadas) ||
          localStorage.getItem("hvac_turmas_arquivadas") ||
          "[]"
        );
        
        const ativasList = turmasFiltradas.filter((t: Turma) => !arquivadasIds.includes(t.id));
        const arquivadasList = turmasFiltradas.filter((t: Turma) => arquivadasIds.includes(t.id));

        setTurmas(ativasList);
        setTurmasArquivadas(arquivadasList);

        if (ativasList.length > 0) {
          setTurmaAtiva(ativasList[0]);
        } else {
          setTurmaAtiva(null);
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
        setAulasConcluidas(data.map((p: any) => p.aula_id));
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
    const turmaAlvo = turmas.find(t => t.id === turmaId);
    const novaSolicitacao: AlunoSolicitacao = {
      turmaId,
      email: userEmail,
      nome: userName || "Aluno",
      status: "pendente",
      professor_email: turmaAlvo?.professor_email
    };

    const atualizadas = [...alunosPendentes.filter(s => !(s.email === userEmail && s.turmaId === turmaId)), novaSolicitacao];
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

    const emailAtual = user.email?.toLowerCase().trim() || "";

    // Tenta inserir vinculando tanto o instrutor_id (UUID) quanto o professor_email
    let { data, error } = await supabase
      .from("turmas")
      .insert([{ 
        nome: nome.trim(), 
        instrutor_id: user.id,
        professor_email: emailAtual 
      }])
      .select()
      .single();

    // Fallback gracioso caso a coluna professor_email ainda não tenha sido criada no banco
    if (error && (error.message?.includes("professor_email") || error.code === "PGRST204" || error.code === "42703")) {
      const fallback = await supabase
        .from("turmas")
        .insert([{ 
          nome: nome.trim(), 
          instrutor_id: user.id 
        }])
        .select()
        .single();
      data = fallback.data;
      error = fallback.error;
    }

    if (!error && data) {
      const turmaCompleta: Turma = {
        ...data,
        professor_email: data.professor_email || emailAtual
      };
      setTurmas(prev => [turmaCompleta, ...prev]);
      setTurmaAtiva(turmaCompleta);
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
    const emailAtual = userEmail?.toLowerCase().trim();
    if (emailAtual) {
      localStorage.setItem(`hvac_turmas_arquivadas_${emailAtual}`, JSON.stringify(arquivadasIds));
    }
    localStorage.setItem("hvac_turmas_arquivadas", JSON.stringify(arquivadasIds));

    if (turmaAtiva?.id === turmaId) {
      setTurmaAtiva(novasAtivas.length > 0 ? novasAtivas[0] : null);
    }
  };

  const excluirTurma = async (turmaId: string) => {
    if (!isProfessor) return;
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Apaga do Supabase garantindo que só exclui a turma do próprio professor
    let deleteQuery = supabase.from("turmas").delete().eq("id", turmaId);
    if (user?.id) {
      deleteQuery = deleteQuery.eq("instrutor_id", user.id);
    }
    const { error } = await deleteQuery;

    if (!error) {
      setTurmas(prev => prev.filter(t => t.id !== turmaId));
      setTurmasArquivadas(prev => prev.filter(t => t.id !== turmaId));

      if (turmaAtiva?.id === turmaId) {
        setTurmaAtiva(prev => {
          const restantes = turmas.filter(t => t.id !== turmaId);
          return restantes.length > 0 ? restantes[0] : null;
        });
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
