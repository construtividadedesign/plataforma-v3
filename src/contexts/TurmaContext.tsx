"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  solicitarAcessoAction,
  aprovarAlunoAction,
  rejeitarAlunoAction,
} from "@/app/actions/solicitacoes";

/**
 * Lista de e-mails autorizados com perfil de Instrutor / Administrador
 */
export const ADMIN_EMAILS: string[] = [
  "instrutorleonardosenai@gmail.com",
  "designtecnologia.2026@gmail.com",
  "engeletricojosue@gmail.com",
  "julioangeloxavier@gmail.com",
];

export function isProfessorEmail(email?: string | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase().trim());
}

export function getProfessorDisplayName(email?: string | null, name?: string | null): string {
  if (!email) return name ? `Prof. ${name}` : "Instrutor";
  const em = email.toLowerCase().trim();
  if (em.includes("josue")) return "Prof. Josué";
  if (em.includes("julio")) return "Prof. Júlio";
  if (em.includes("leonardo") || em.includes("designtecnologia")) return "Instrutor Leonardo";
  if (name && name !== "Utilizador") return `Prof. ${name}`;
  return "Instrutor";
}

export function getProfessorInitial(email?: string | null, name?: string | null): string {
  if (!email) return name ? name.charAt(0).toUpperCase() : "P";
  const em = email.toLowerCase().trim();
  if (em.includes("josue")) return "J";
  if (em.includes("julio")) return "J";
  if (em.includes("leonardo") || em.includes("designtecnologia")) return "L";
  return name ? name.charAt(0).toUpperCase() : "P";
}

export type AlunoSolicitacao = {
  id?: string;
  nome: string;
  email: string;
  status: "pendente" | "aprovado" | "rejeitado" | "excluido";
  data_solicitacao?: string;
  data_aprovacao?: string;
  turmaId?: string;
  turmaNome?: string;
  professor_email?: string;
};

export type Turma = {
  id: string;
  nome: string;
  instrutor_id: string;
  professor_email?: string;
  created_at: string;
  status?: "ativa" | "arquivada";
  componentes_liberados?: boolean;
  alunos_solicitacoes?: AlunoSolicitacao[];
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
  alunoStatusAprovacao: "pendente" | "aprovado" | "rejeitado" | "excluido" | "nao_solicitado";
  alunosPendentes: AlunoSolicitacao[];
  alunosAprovados: AlunoSolicitacao[];
  selecionarTurma: (id: string) => void;
  solicitarAcessoTurma: (turmaId: string) => Promise<{ success: boolean; error?: string }>;
  aprovarAluno: (email: string, turmaId: string) => Promise<{ success: boolean; error?: string }>;
  rejeitarAluno: (email: string, turmaId: string) => Promise<{ success: boolean; error?: string }>;
  removerAlunoAprovado: (email: string, turmaId: string) => Promise<{ success: boolean; error?: string }>;
  criarTurma: (nome: string) => Promise<boolean>;
  arquivarTurma: (turmaId: string) => void;
  excluirTurma: (turmaId: string) => Promise<void>;
  alternarConclusaoAula: (moduloId: string, aulaId: string, isConcluida: boolean) => Promise<void>;
  alternarLiberacaoComponentes: (turmaId: string, liberado: boolean) => Promise<boolean>;
  recarregarDados: () => Promise<void>;
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

  // Refs de controle para estabilidade de renderização
  const isInitialLoadDoneRef = useRef(false);

  // 1. Carregar Utilizador, Turmas com coluna JSONB alunos_solicitacoes
  const carregarDados = useCallback(async (isBackground = false) => {
    if (!isBackground && !isInitialLoadDoneRef.current) {
      setIsLoadingTurmas(true);
    }

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        if (!isInitialLoadDoneRef.current) {
          setIsLoadingTurmas(false);
          isInitialLoadDoneRef.current = true;
        }
        return;
      }

      const emailAtual = user.email?.toLowerCase().trim() || null;
      setUserEmail(prev => (prev === emailAtual ? prev : emailAtual));
      const nomeAtual = user.user_metadata?.full_name || user.email?.split("@")[0] || "Utilizador";
      setUserName(prev => (prev === nomeAtual ? prev : nomeAtual));

      const ehProf = isProfessorEmail(emailAtual);
      setIsProfessor(prev => (prev === ehProf ? prev : ehProf));

      // Carrega turmas do Supabase com query multi-tenant
      let query = supabase
        .from("turmas")
        .select("*")
        .order("created_at", { ascending: false });

      if (ehProf && user) {
        query = query.or(`instrutor_id.eq.${user.id},professor_email.eq.${emailAtual}`);
      }

      let { data, error } = await query;

      if (error && ehProf && user) {
        const fallbackRes = await supabase
          .from("turmas")
          .select("*")
          .eq("instrutor_id", user.id)
          .order("created_at", { ascending: false });
        data = fallbackRes.data;
        error = fallbackRes.error;
      }

      if (error) {
        const fallbackAll = await supabase
          .from("turmas")
          .select("*")
          .order("created_at", { ascending: false });
        data = fallbackAll.data;
        error = fallbackAll.error;
      }

      if (!error && data) {
        let turmasFiltradas: Turma[] = data.map((t: any) => ({
          ...t,
          id: String(t.id).trim(),
          nome: String(t.nome || "").trim(),
          alunos_solicitacoes: Array.isArray(t.alunos_solicitacoes) ? t.alunos_solicitacoes : [],
        }));

        if (ehProf) {
          turmasFiltradas = turmasFiltradas.filter((t: Turma) => {
            const matchId = t.instrutor_id === user.id;
            const matchEmail = Boolean(
              t.professor_email && emailAtual && t.professor_email.toLowerCase().trim() === emailAtual
            );
            return matchId || matchEmail;
          });
        }

        const storageKeyArquivadas = `hvac_turmas_arquivadas_${emailAtual || "default"}`;
        const arquivadasIds = JSON.parse(
          localStorage.getItem(storageKeyArquivadas) ||
          localStorage.getItem("hvac_turmas_arquivadas") ||
          "[]"
        );

        const ativasList = turmasFiltradas.filter((t: Turma) => !arquivadasIds.includes(t.id));
        const arquivadasList = turmasFiltradas.filter((t: Turma) => arquivadasIds.includes(t.id));

        setTurmas(prev => {
          if (JSON.stringify(prev) === JSON.stringify(ativasList)) {
            return prev;
          }
          return ativasList;
        });

        setTurmasArquivadas(prev => {
          if (JSON.stringify(prev) === JSON.stringify(arquivadasList)) {
            return prev;
          }
          return arquivadasList;
        });

        // Atualização da turma ativa: detecta alterações na coluna alunos_solicitacoes
        setTurmaAtiva(prev => {
          if (ativasList.length === 0) return null;
          if (!prev) return ativasList[0];

          const found = ativasList.find(t => t.id === prev.id);
          if (found) {
            const solicitacoesIguais =
              JSON.stringify(found.alunos_solicitacoes) === JSON.stringify(prev.alunos_solicitacoes);

            if (
              solicitacoesIguais &&
              found.nome === prev.nome &&
              found.componentes_liberados === prev.componentes_liberados &&
              found.professor_email === prev.professor_email
            ) {
              return prev; // Mesma referência, evita re-render desnecessário
            }
            return found; // Atualiza com os novos dados de alunos_solicitacoes!
          }

          const foundByName = ativasList.find(
            t => t.nome.toLowerCase().trim() === prev.nome.toLowerCase().trim()
          );
          if (foundByName) return foundByName;

          return ativasList[0];
        });
      }
    } catch (e) {
      console.warn("Aviso ao carregar turmas:", e);
    } finally {
      if (!isInitialLoadDoneRef.current) {
        setIsLoadingTurmas(false);
        isInitialLoadDoneRef.current = true;
      }
    }
  }, []);

  // Efeito de montagem inicial único
  useEffect(() => {
    carregarDados(false);
  }, [carregarDados]);

  // Polling automático em segundo plano a cada 5 segundos e ao focar na janela
  useEffect(() => {
    const interval = setInterval(() => {
      carregarDados(true);
    }, 5000);

    const handleFocus = () => {
      carregarDados(true);
    };
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, [carregarDados]);

  // 2. Carregar Progresso da Turma Ativa
  useEffect(() => {
    if (!turmaAtiva) {
      setAulasConcluidas([]);
      return;
    }

    const turmaId = turmaAtiva.id;
    const supabase = createClient();

    async function carregarProgresso() {
      try {
        const { data, error } = await supabase
          .from("progresso_turmas")
          .select("aula_id")
          .eq("turma_id", turmaId)
          .eq("concluida", true);

        if (!error && data) {
          setAulasConcluidas(data.map(p => p.aula_id));
        }
      } catch {}
    }
    carregarProgresso();
  }, [turmaAtiva?.id]);

  const selecionarTurma = (id: string) => {
    const cleanId = id.trim().toLowerCase();
    const turma = turmas.find(t => 
      t.id.toLowerCase().trim() === cleanId ||
      t.nome.toLowerCase().trim() === cleanId
    );
    if (turma) {
      setTurmaAtiva(turma);
    }
  };

  /**
   * ETAPA 2: Fonte Única de Verdade (Single Source of Truth)
   * Alunos Pendentes e Aprovados derivados exclusivamente da coluna alunos_solicitacoes de turmaAtiva.
   */
  const listaAlunosTurmaAtiva: AlunoSolicitacao[] = Array.isArray(turmaAtiva?.alunos_solicitacoes)
    ? turmaAtiva.alunos_solicitacoes
    : [];

  const alunosPendentes = listaAlunosTurmaAtiva.filter(a => a.status === "pendente");
  const alunosAprovados = listaAlunosTurmaAtiva.filter(a => a.status === "aprovado");

  /**
   * Status do Aluno derivado em tempo real da turma ativa
   */
  const alunoStatusAprovacao: "pendente" | "aprovado" | "rejeitado" | "excluido" | "nao_solicitado" = (() => {
    if (!userEmail || isProfessor || !turmaAtiva) return "nao_solicitado";
    const cleanEmail = userEmail.toLowerCase().trim();
    const aluno = listaAlunosTurmaAtiva.find(
      a => String(a.email || "").toLowerCase().trim() === cleanEmail
    );
    if (!aluno) return "nao_solicitado";
    return aluno.status || "pendente";
  })();

  /**
   * Solicitar Acesso à Turma
   */
  const solicitarAcessoTurma = async (turmaId: string): Promise<{ success: boolean; error?: string }> => {
    if (!userEmail || isProfessor) {
      return { success: false, error: "Apenas alunos podem solicitar acesso à turma." };
    }
    const cleanInput = turmaId.trim().toLowerCase();
    const turmaAlvo = turmas.find(t => 
      t.id.toLowerCase().trim() === cleanInput ||
      t.nome.toLowerCase().trim() === cleanInput
    );

    const cleanTurmaId = turmaAlvo ? turmaAlvo.id.trim() : turmaId.trim();
    const cleanTurmaNome = turmaAlvo ? turmaAlvo.nome.trim() : (turmaAtiva?.nome || turmaId).trim();
    const cleanEmail = userEmail.toLowerCase().trim();
    const cleanName = userName || "Aluno";
    const profEmail = turmaAlvo?.professor_email || turmaAtiva?.professor_email;

    try {
      // 1. Executa a Server Action com bypass seguro de RLS
      const res = await solicitarAcessoAction({
        turmaId: cleanTurmaId,
        turmaNome: cleanTurmaNome,
        nome: cleanName,
        email: cleanEmail,
        professorEmail: profEmail,
      });

      let updatedSolicitacoes = res.alunos_solicitacoes;
      let realTurmaId = res.turmaId || cleanTurmaId;
      let realTurmaNome = res.turmaNome || cleanTurmaNome;

      if (!res.success) {
        // Fallback para rota de API
        const apiRes = await fetch("/api/solicitacoes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "solicitar",
            turmaId: cleanTurmaId,
            turmaNome: cleanTurmaNome,
            emailAluno: cleanEmail,
            nomeAluno: cleanName,
            professorEmail: profEmail,
          }),
        });

        if (!apiRes.ok) {
          const errData = await apiRes.json().catch(() => ({}));
          return {
            success: false,
            error: errData.error || res.error || "Não foi possível registrar a solicitação no banco.",
          };
        }

        const json = await apiRes.json();
        updatedSolicitacoes = json.alunos_solicitacoes;
        realTurmaId = json.turmaId || realTurmaId;
        realTurmaNome = json.turmaNome || realTurmaNome;
      }

      // SUCESSO: Atualiza imediatamente a turma ativa e a lista de turmas
      if (Array.isArray(updatedSolicitacoes)) {
        setTurmas(prev => {
          const exists = prev.some(
            t => t.id === realTurmaId || t.nome.toLowerCase().trim() === realTurmaNome.toLowerCase().trim()
          );
          if (exists) {
            return prev.map(t =>
              t.id === realTurmaId || t.nome.toLowerCase().trim() === realTurmaNome.toLowerCase().trim()
                ? { ...t, id: realTurmaId, nome: realTurmaNome || t.nome, alunos_solicitacoes: updatedSolicitacoes }
                : t
            );
          }
          const nova: Turma = {
            id: realTurmaId,
            nome: realTurmaNome || cleanTurmaId,
            instrutor_id: "",
            professor_email: profEmail,
            created_at: new Date().toISOString(),
            componentes_liberados: true,
            alunos_solicitacoes: updatedSolicitacoes,
          };
          return [nova, ...prev];
        });

        setTurmaAtiva(prev => {
          if (!prev) return null;
          return {
            ...prev,
            id: realTurmaId,
            nome: realTurmaNome || prev.nome,
            alunos_solicitacoes: updatedSolicitacoes,
          };
        });
      }

      return { success: true };
    } catch (err: any) {
      console.error("Erro na solicitação de acesso:", err);
      return { success: false, error: err.message || "Erro de conexão com o servidor." };
    }
  };

  /**
   * Aprovar Aluno na Turma Ativa
   */
  const aprovarAluno = async (email: string, turmaId: string): Promise<{ success: boolean; error?: string }> => {
    if (!isProfessor) return { success: false, error: "Ação restrita ao Instrutor." };
    const cleanEmail = email.toLowerCase().trim();
    const cleanTurmaId = turmaId.trim();
    const cleanTurmaNome = turmaAtiva?.nome || "";

    try {
      const res = await aprovarAlunoAction({
        turmaId: cleanTurmaId,
        turmaNome: cleanTurmaNome,
        email: cleanEmail
      });
      let updatedSolicitacoes = res.alunos_solicitacoes;
      let realTurmaId = res.turmaId || cleanTurmaId;

      if (!res.success) {
        const apiRes = await fetch("/api/solicitacoes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "aprovar",
            turmaId: cleanTurmaId,
            turmaNome: cleanTurmaNome,
            emailAluno: cleanEmail,
          }),
        });

        if (!apiRes.ok) {
          const errData = await apiRes.json().catch(() => ({}));
          return {
            success: false,
            error: errData.error || res.error || "Erro ao aprovar aluno no banco.",
          };
        }

        const json = await apiRes.json();
        updatedSolicitacoes = json.alunos_solicitacoes;
        realTurmaId = json.turmaId || realTurmaId;
      }

      if (Array.isArray(updatedSolicitacoes)) {
        setTurmas(prev =>
          prev.map(t => (t.id === realTurmaId || t.id === cleanTurmaId ? { ...t, alunos_solicitacoes: updatedSolicitacoes } : t))
        );
        setTurmaAtiva(prev =>
          prev && (prev.id === realTurmaId || prev.id === cleanTurmaId) ? { ...prev, alunos_solicitacoes: updatedSolicitacoes } : prev
        );
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Erro de conexão ao aprovar aluno." };
    }
  };

  /**
   * Rejeitar Aluno na Turma Ativa
   */
  const rejeitarAluno = async (email: string, turmaId: string): Promise<{ success: boolean; error?: string }> => {
    if (!isProfessor) return { success: false, error: "Ação restrita ao Instrutor." };
    const cleanEmail = email.toLowerCase().trim();
    const cleanTurmaId = turmaId.trim();
    const cleanTurmaNome = turmaAtiva?.nome || "";

    try {
      const res = await rejeitarAlunoAction({
        turmaId: cleanTurmaId,
        turmaNome: cleanTurmaNome,
        email: cleanEmail
      });
      let updatedSolicitacoes = res.alunos_solicitacoes;
      let realTurmaId = res.turmaId || cleanTurmaId;

      if (!res.success) {
        const apiRes = await fetch("/api/solicitacoes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "rejeitar",
            turmaId: cleanTurmaId,
            turmaNome: cleanTurmaNome,
            emailAluno: cleanEmail,
          }),
        });

        if (!apiRes.ok) {
          const errData = await apiRes.json().catch(() => ({}));
          return {
            success: false,
            error: errData.error || res.error || "Erro ao recusar aluno no banco.",
          };
        }

        const json = await apiRes.json();
        updatedSolicitacoes = json.alunos_solicitacoes;
        realTurmaId = json.turmaId || realTurmaId;
      }

      if (Array.isArray(updatedSolicitacoes)) {
        setTurmas(prev =>
          prev.map(t => (t.id === realTurmaId || t.id === cleanTurmaId ? { ...t, alunos_solicitacoes: updatedSolicitacoes } : t))
        );
        setTurmaAtiva(prev =>
          prev && (prev.id === realTurmaId || prev.id === cleanTurmaId) ? { ...prev, alunos_solicitacoes: updatedSolicitacoes } : prev
        );
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Erro de conexão ao recusar aluno." };
    }
  };

  const removerAlunoAprovado = async (
    email: string,
    turmaId: string
  ): Promise<{ success: boolean; error?: string }> => {
    return rejeitarAluno(email, turmaId);
  };

  const criarTurma = async (nome: string) => {
    if (!isProfessor) return false;

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const emailAtual = user.email?.toLowerCase().trim() || "";

    let { data, error } = await supabase
      .from("turmas")
      .insert([{ 
        nome: nome.trim(), 
        instrutor_id: user.id,
        professor_email: emailAtual,
        alunos_solicitacoes: []
      }])
      .select()
      .single();

    if (error && (error.message?.includes("professor_email") || error.code === "PGRST204" || error.code === "42703")) {
      const fallback = await supabase
        .from("turmas")
        .insert([{ 
          nome: nome.trim(), 
          instrutor_id: user.id,
          alunos_solicitacoes: []
        }])
        .select()
        .single();
      data = fallback.data;
      error = fallback.error;
    }

    if (!error && data) {
      const turmaCompleta: Turma = {
        ...data,
        id: String(data.id).trim(),
        nome: String(data.nome || "").trim(),
        professor_email: data.professor_email || emailAtual,
        alunos_solicitacoes: Array.isArray(data.alunos_solicitacoes) ? data.alunos_solicitacoes : []
      };
      setTurmas(prev => [turmaCompleta, ...prev]);
      setTurmaAtiva(turmaCompleta);
      return true;
    }
    return false;
  };

  const arquivarTurma = (turmaId: string) => {
    if (!isProfessor) return;
    const cleanId = turmaId.trim();
    const turmaParaArquivar = turmas.find(t => t.id === cleanId);
    if (!turmaParaArquivar) return;

    const novasAtivas = turmas.filter(t => t.id !== cleanId);
    const novasArquivadas = [turmaParaArquivar, ...turmasArquivadas];

    setTurmas(novasAtivas);
    setTurmasArquivadas(novasArquivadas);

    const arquivadasIds = novasArquivadas.map(t => t.id);
    const emailAtual = userEmail?.toLowerCase().trim();
    if (emailAtual) {
      localStorage.setItem(`hvac_turmas_arquivadas_${emailAtual}`, JSON.stringify(arquivadasIds));
    }
    localStorage.setItem("hvac_turmas_arquivadas", JSON.stringify(arquivadasIds));

    if (turmaAtiva?.id === cleanId) {
      setTurmaAtiva(novasAtivas.length > 0 ? novasAtivas[0] : null);
    }
  };

  const excluirTurma = async (turmaId: string) => {
    if (!isProfessor) return;
    const cleanId = turmaId.trim();
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let deleteQuery = supabase.from("turmas").delete().eq("id", cleanId);
    if (user?.id) {
      deleteQuery = deleteQuery.eq("instrutor_id", user.id);
    }
    const { error } = await deleteQuery;

    if (!error) {
      setTurmas(prev => prev.filter(t => t.id !== cleanId));
      setTurmasArquivadas(prev => prev.filter(t => t.id !== cleanId));

      if (turmaAtiva?.id === cleanId) {
        setTurmaAtiva(prev => {
          const restantes = turmas.filter(t => t.id !== cleanId);
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
    const cleanId = turmaId.trim();

    setTurmas(prev => prev.map(t => t.id === cleanId ? { ...t, componentes_liberados: liberado } : t));
    if (turmaAtiva?.id === cleanId) {
      setTurmaAtiva(prev => prev ? { ...prev, componentes_liberados: liberado } : null);
    }

    const supabase = createClient();
    try {
      const { error } = await supabase
        .from("turmas")
        .update({ componentes_liberados: liberado })
        .eq("id", cleanId);

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

  const recarregarDados = async () => {
    await carregarDados(true);
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
      alunosAprovados,
      selecionarTurma, 
      solicitarAcessoTurma,
      aprovarAluno,
      rejeitarAluno,
      removerAlunoAprovado,
      criarTurma,
      arquivarTurma,
      excluirTurma,
      alternarConclusaoAula,
      alternarLiberacaoComponentes,
      recarregarDados
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
