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
  componentes_liberados?: boolean;
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
  alternarLiberacaoComponentes: (turmaId: string, liberado: boolean) => Promise<boolean>;
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

      let ativasList: Turma[] = [];

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
        
        ativasList = turmasFiltradas.filter((t: Turma) => !arquivadasIds.includes(t.id));
        const arquivadasList = turmasFiltradas.filter((t: Turma) => arquivadasIds.includes(t.id));

        setTurmas(ativasList);
        setTurmasArquivadas(arquivadasList);

        if (ativasList.length > 0) {
          setTurmaAtiva(ativasList[0]);
        } else {
          setTurmaAtiva(null);
        }
      }

      // Carrega solicitações de alunos persistidas no Supabase
      try {
        const { data: solData, error: solError } = await supabase
          .from("solicitacoes_alunos")
          .select("*");

        if (!solError && solData) {
          const formatadas: AlunoSolicitacao[] = solData.map((s: any) => ({
            turmaId: s.turma_id,
            email: s.email,
            nome: s.nome,
            status: s.status as "pendente" | "aprovado",
            professor_email: s.professor_email,
          }));
          setAlunosPendentes(formatadas);

          if (!ehProf && emailAtual && ativasList.length > 0) {
            const primeiraId = ativasList[0].id;
            const meuVinculo = formatadas.find(
              (s: AlunoSolicitacao) => s.email.toLowerCase() === emailAtual.toLowerCase() && s.turmaId === primeiraId
            );
            if (meuVinculo) {
              setAlunoStatusAprovacao(meuVinculo.status);
            } else {
              setAlunoStatusAprovacao("nao_solicitado");
            }
          }
        }
      } catch (err) {
        console.error("Erro ao carregar solicitações de alunos do Supabase:", err);
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
        const meuVinculo = alunosPendentes.find(
          (s: AlunoSolicitacao) => s.email.toLowerCase() === userEmail.toLowerCase() && s.turmaId === id
        );
        if (meuVinculo) {
          setAlunoStatusAprovacao(meuVinculo.status);
        } else {
          setAlunoStatusAprovacao("nao_solicitado");
        }
      }
    }
  };

  const solicitarAcessoTurma = async (turmaId: string) => {
    if (!userEmail || isProfessor) return;
    const turmaAlvo = turmas.find(t => t.id === turmaId);
    const novaSolicitacao: AlunoSolicitacao = {
      turmaId,
      email: userEmail,
      nome: userName || "Aluno",
      status: "pendente",
      professor_email: turmaAlvo?.professor_email
    };

    setAlunosPendentes(prev => [
      ...prev.filter(s => !(s.email.toLowerCase() === userEmail.toLowerCase() && s.turmaId === turmaId)),
      novaSolicitacao
    ]);
    setAlunoStatusAprovacao("pendente");

    // Persistência segura no Supabase
    const supabase = createClient();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      await supabase
        .from("solicitacoes_alunos")
        .upsert({
          turma_id: turmaId,
          user_id: user?.id,
          email: userEmail.toLowerCase().trim(),
          nome: userName || "Aluno",
          status: "pendente",
          professor_email: turmaAlvo?.professor_email
        }, { onConflict: "turma_id, email" });
    } catch (e) {
      console.error("Erro ao solicitar acesso no Supabase:", e);
    }
  };

  const aprovarAluno = async (email: string, turmaId: string) => {
    if (!isProfessor) return;
    const emailLimpo = email.toLowerCase().trim();
    setAlunosPendentes(prev => prev.map(s => {
      if (s.email.toLowerCase().trim() === emailLimpo && s.turmaId === turmaId) {
        return { ...s, status: "aprovado" as const };
      }
      return s;
    }));

    // Persistência segura no Supabase
    const supabase = createClient();
    try {
      await supabase
        .from("solicitacoes_alunos")
        .update({ status: "aprovado", updated_at: new Date().toISOString() })
        .eq("turma_id", turmaId)
        .eq("email", emailLimpo);
    } catch (e) {
      console.error("Erro ao aprovar aluno no Supabase:", e);
    }
  };

  const rejeitarAluno = async (email: string, turmaId: string) => {
    if (!isProfessor) return;
    const emailLimpo = email.toLowerCase().trim();
    setAlunosPendentes(prev => prev.filter(s => !(s.email.toLowerCase().trim() === emailLimpo && s.turmaId === turmaId)));

    // Exclusão segura no Supabase
    const supabase = createClient();
    try {
      await supabase
        .from("solicitacoes_alunos")
        .delete()
        .eq("turma_id", turmaId)
        .eq("email", emailLimpo);
    } catch (e) {
      console.error("Erro ao rejeitar aluno no Supabase:", e);
    }
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

  const alternarLiberacaoComponentes = async (turmaId: string, liberado: boolean): Promise<boolean> => {
    if (!isProfessor) return false;

    // Atualização otimista no estado local
    setTurmas(prev => prev.map(t => t.id === turmaId ? { ...t, componentes_liberados: liberado } : t));
    if (turmaAtiva?.id === turmaId) {
      setTurmaAtiva(prev => prev ? { ...prev, componentes_liberados: liberado } : null);
    }

    const supabase = createClient();
    try {
      const { error } = await supabase
        .from("turmas")
        .update({ componentes_liberados: liberado })
        .eq("id", turmaId);

      if (error) {
        console.error("Erro ao gravar liberação de componentes no Supabase:", error);
        return false;
      }
      return true;
    } catch (e) {
      console.error("Exceção ao gravar liberação no Supabase:", e);
      return false;
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
      alternarConclusaoAula,
      alternarLiberacaoComponentes
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
