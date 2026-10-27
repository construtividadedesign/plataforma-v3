"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
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
  alunos_solicitacoes?: any[];
};

export type AlunoSolicitacao = {
  id?: string;
  turmaId: string;
  turmaNome?: string;
  email: string;
  nome: string;
  status: "pendente" | "aprovado" | "rejeitado" | "excluido";
  professor_email?: string;
};

/**
 * Normaliza e verifica se uma solicitação pertence a uma determinada turma.
 * Trata espaços extras (ex: "Rosana / Teste "), maiúsculas/minúsculas e pareamento por ID ou Nome.
 */
export function matchesTurma(
  solTurmaId?: string,
  solTurmaNome?: string,
  turma?: Turma | null
): boolean {
  if (!turma) return false;
  const cleanTurmaId = String(turma.id || "").toLowerCase().trim();
  const cleanTurmaNome = String(turma.nome || "").toLowerCase().trim();

  if (solTurmaId) {
    const cleanId = String(solTurmaId).toLowerCase().trim();
    if (cleanId === cleanTurmaId || cleanId === cleanTurmaNome) return true;
  }

  if (solTurmaNome) {
    const cleanName = String(solTurmaNome).toLowerCase().trim();
    if (cleanName === cleanTurmaNome || cleanName === cleanTurmaId) return true;
  }

  return false;
}

/**
 * Retorna o status de aprovação de um aluno específico para a turma fornecida.
 */
export function getAlunoStatusNaTurma(
  solicitacoes: AlunoSolicitacao[],
  email: string | null | undefined,
  turma: Turma | null | undefined
): "pendente" | "aprovado" | "rejeitado" | "excluido" | "nao_solicitado" {
  if (!email || !turma) return "nao_solicitado";
  const cleanEmail = email.toLowerCase().trim();

  const match = solicitacoes.find(s => {
    if (s.email.toLowerCase().trim() !== cleanEmail) return false;
    return matchesTurma(s.turmaId, s.turmaNome, turma);
  });

  return match ? match.status : "nao_solicitado";
}

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
  solicitarAcessoTurma: (turmaId: string) => Promise<void>;
  aprovarAluno: (email: string, turmaId: string) => Promise<void>;
  rejeitarAluno: (email: string, turmaId: string) => Promise<void>;
  removerAlunoAprovado: (email: string, turmaId: string) => Promise<void>;
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

  const [alunoStatusAprovacao, setAlunoStatusAprovacao] = useState<
    "pendente" | "aprovado" | "rejeitado" | "excluido" | "nao_solicitado"
  >("nao_solicitado");
  const [todasSolicitacoes, setTodasSolicitacoes] = useState<AlunoSolicitacao[]>([]);

  // Carrega e sincroniza todas as solicitações (com redundância entre Supabase direto e API Route)
  const carregarSolicitacoes = useCallback(async (turmasRef?: Turma[], emailRef?: string | null) => {
    const supabase = createClient();
    let solicitacoes: AlunoSolicitacao[] = [];

    // 1. Tenta carregar da tabela dedicada no Supabase
    try {
      const { data: solData, error: solError } = await supabase
        .from("solicitacoes_alunos")
        .select("*")
        .order("created_at", { ascending: false });

      if (!solError && solData && solData.length > 0) {
        solicitacoes = solData.map((s: any) => ({
          id: s.id,
          turmaId: String(s.turma_id || "").trim(),
          turmaNome: s.turma_nome ? String(s.turma_nome).trim() : undefined,
          email: String(s.email || "").toLowerCase().trim(),
          nome: String(s.nome || "").trim(),
          status: s.status as any,
          professor_email: s.professor_email ? String(s.professor_email).toLowerCase().trim() : undefined,
        }));
      }
    } catch (err) {
      console.warn("Aviso ao ler solicitacoes_alunos via Supabase client:", err);
    }

    // 2. Se a tabela não respondeu ou estava vazia, consulta a API Route do Next.js
    if (solicitacoes.length === 0) {
      try {
        const res = await fetch("/api/solicitacoes", { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json.solicitacoes) && json.solicitacoes.length > 0) {
            solicitacoes = json.solicitacoes.map((s: any) => ({
              id: s.id,
              turmaId: String(s.turma_id || s.turmaId || "").trim(),
              turmaNome: s.turma_nome || s.turmaNome ? String(s.turma_nome || s.turmaNome).trim() : undefined,
              email: String(s.email || "").toLowerCase().trim(),
              nome: String(s.nome || "").trim(),
              status: s.status as any,
              professor_email: s.professor_email ? String(s.professor_email).toLowerCase().trim() : undefined,
            }));
          }
        }
      } catch (apiErr) {
        console.warn("Aviso ao ler via /api/solicitacoes:", apiErr);
      }
    }

    // 3. Fallback adicional via campo alunos_solicitacoes em turmas
    if (solicitacoes.length === 0 && turmasRef) {
      for (const t of turmasRef) {
        if (Array.isArray(t.alunos_solicitacoes)) {
          for (const s of t.alunos_solicitacoes) {
            solicitacoes.push({
              turmaId: String(s.turmaId || t.id).trim(),
              turmaNome: String(s.turmaNome || t.nome).trim(),
              email: String(s.email || "").toLowerCase().trim(),
              nome: String(s.nome || "").trim(),
              status: s.status as any,
              professor_email: s.professor_email ? String(s.professor_email).toLowerCase().trim() : undefined,
            });
          }
        }
      }
    }

    setTodasSolicitacoes(solicitacoes);

    // Atualiza status do aluno ativo para a turma ativa
    const targetEmail = (emailRef || userEmail)?.toLowerCase().trim();
    if (targetEmail && !isProfessorEmail(targetEmail)) {
      const activeT = turmaAtiva || (turmasRef && turmasRef.length > 0 ? turmasRef[0] : null);
      if (activeT) {
        const status = getAlunoStatusNaTurma(solicitacoes, targetEmail, activeT);
        setAlunoStatusAprovacao(status);
      }
    }

    return solicitacoes;
  }, [userEmail, turmaAtiva]);

  // 1. Carregar Utilizador, Turmas com Isolamento Multi-Tenant e Estado de Aprovação
  const carregarDados = useCallback(async () => {
    const supabase = createClient();
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
      query = query.or(`instrutor_id.eq.${user.id},professor_email.eq.${emailAtual}`);
    }

    let { data, error } = await query;

    // Fallback de compatibilidade
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

    let ativasList: Turma[] = [];

    if (!error && data) {
      let turmasFiltradas = data.map((t: any) => ({
        ...t,
        id: String(t.id).trim(),
        nome: String(t.nome || "").trim(),
      }));

      // Se for professor, isola estritamente em memória
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

      ativasList = turmasFiltradas.filter((t: Turma) => !arquivadasIds.includes(t.id));
      const arquivadasList = turmasFiltradas.filter((t: Turma) => arquivadasIds.includes(t.id));

      setTurmas(ativasList);
      setTurmasArquivadas(arquivadasList);

      if (ativasList.length > 0) {
        setTurmaAtiva(prev => {
          if (!prev) return ativasList[0];
          const exists = ativasList.find(t => t.id === prev.id);
          return exists || ativasList[0];
        });
      } else {
        setTurmaAtiva(null);
      }
    }

    // Carrega solicitações sincronizadas
    await carregarSolicitacoes(ativasList, emailAtual);

    setIsLoadingTurmas(false);
  }, [carregarSolicitacoes]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  // Polling automático e sincronização ao focar na aba
  useEffect(() => {
    const interval = setInterval(() => {
      carregarSolicitacoes(turmas, userEmail);
    }, 5000);

    const handleFocus = () => {
      carregarSolicitacoes(turmas, userEmail);
    };
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, [carregarSolicitacoes, turmas, userEmail]);

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
    const cleanId = id.trim().toLowerCase();
    const turma = turmas.find(t => 
      t.id.toLowerCase().trim() === cleanId ||
      t.nome.toLowerCase().trim() === cleanId
    );
    if (turma) {
      setTurmaAtiva(turma);
      if (!isProfessor && userEmail) {
        const status = getAlunoStatusNaTurma(todasSolicitacoes, userEmail, turma);
        setAlunoStatusAprovacao(status);
      }
    }
  };

  const solicitarAcessoTurma = async (turmaId: string) => {
    if (!userEmail || isProfessor) return;
    const cleanInput = turmaId.trim().toLowerCase();
    const turmaAlvo = turmas.find(t => 
      t.id.toLowerCase().trim() === cleanInput ||
      t.nome.toLowerCase().trim() === cleanInput
    );

    const cleanTurmaId = turmaAlvo ? turmaAlvo.id.trim() : turmaId.trim();
    const cleanTurmaNome = turmaAlvo ? turmaAlvo.nome.trim() : "";
    const cleanEmail = userEmail.toLowerCase().trim();
    const cleanName = userName || "Aluno";

    const novaSolicitacao: AlunoSolicitacao = {
      turmaId: cleanTurmaId,
      turmaNome: cleanTurmaNome,
      email: cleanEmail,
      nome: cleanName,
      status: "pendente",
      professor_email: turmaAlvo?.professor_email?.toLowerCase().trim()
    };

    setTodasSolicitacoes(prev => [
      ...prev.filter(s => !(s.email.toLowerCase().trim() === cleanEmail && matchesTurma(s.turmaId, s.turmaNome, turmaAlvo))),
      novaSolicitacao
    ]);
    setAlunoStatusAprovacao("pendente");

    // 1. Grava no Supabase via cliente autenticado
    const supabase = createClient();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      await supabase
        .from("solicitacoes_alunos")
        .upsert({
          turma_id: cleanTurmaId,
          turma_nome: cleanTurmaNome,
          user_id: user?.id,
          email: cleanEmail,
          nome: cleanName,
          status: "pendente",
          professor_email: turmaAlvo?.professor_email?.toLowerCase().trim(),
          updated_at: new Date().toISOString()
        }, { onConflict: "turma_id, email" });
    } catch (e) {
      console.warn("Aviso upsert supabase cliente:", e);
    }

    // 2. Grava via API Route /api/solicitacoes (garante persistência mesmo com RLS/tabela ausente)
    try {
      await fetch("/api/solicitacoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "solicitar",
          turmaId: cleanTurmaId,
          turmaNome: cleanTurmaNome,
          nomeAluno: cleanName,
          professorEmail: turmaAlvo?.professor_email
        })
      });
    } catch (apiErr) {
      console.warn("Aviso POST /api/solicitacoes:", apiErr);
    }
  };

  const aprovarAluno = async (email: string, turmaId: string) => {
    if (!isProfessor) return;
    const cleanEmail = email.toLowerCase().trim();
    const cleanTurmaId = turmaId.trim();

    setTodasSolicitacoes(prev => prev.map(s => {
      const matchEmail = s.email.toLowerCase().trim() === cleanEmail;
      const matchTurma = s.turmaId.toLowerCase().trim() === cleanTurmaId.toLowerCase() ||
        (s.turmaNome && turmaAtiva && s.turmaNome.toLowerCase().trim() === turmaAtiva.nome.toLowerCase().trim());
      if (matchEmail && matchTurma) {
        return { ...s, status: "aprovado" as const };
      }
      return s;
    }));

    const supabase = createClient();
    try {
      await supabase
        .from("solicitacoes_alunos")
        .update({ status: "aprovado", updated_at: new Date().toISOString() })
        .eq("turma_id", cleanTurmaId)
        .eq("email", cleanEmail);
    } catch {}

    try {
      await fetch("/api/solicitacoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "aprovar",
          turmaId: cleanTurmaId,
          emailAluno: cleanEmail
        })
      });
    } catch {}
  };

  const rejeitarAluno = async (email: string, turmaId: string) => {
    if (!isProfessor) return;
    const cleanEmail = email.toLowerCase().trim();
    const cleanTurmaId = turmaId.trim();

    setTodasSolicitacoes(prev => prev.filter(s => {
      const matchEmail = s.email.toLowerCase().trim() === cleanEmail;
      const matchTurma = s.turmaId.toLowerCase().trim() === cleanTurmaId.toLowerCase() ||
        (s.turmaNome && turmaAtiva && s.turmaNome.toLowerCase().trim() === turmaAtiva.nome.toLowerCase().trim());
      return !(matchEmail && matchTurma);
    }));

    const supabase = createClient();
    try {
      await supabase
        .from("solicitacoes_alunos")
        .delete()
        .eq("turma_id", cleanTurmaId)
        .eq("email", cleanEmail);
    } catch {}

    try {
      await fetch("/api/solicitacoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "rejeitar",
          turmaId: cleanTurmaId,
          emailAluno: cleanEmail
        })
      });
    } catch {}
  };

  const removerAlunoAprovado = async (email: string, turmaId: string) => {
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
        professor_email: emailAtual 
      }])
      .select()
      .single();

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
        id: String(data.id).trim(),
        nome: String(data.nome || "").trim(),
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

    // Remove solicitações em cascata
    try {
      await supabase.from("solicitacoes_alunos").delete().eq("turma_id", cleanId);
    } catch {}

    let deleteQuery = supabase.from("turmas").delete().eq("id", cleanId);
    if (user?.id) {
      deleteQuery = deleteQuery.eq("instrutor_id", user.id);
    }
    const { error } = await deleteQuery;

    if (!error) {
      setTurmas(prev => prev.filter(t => t.id !== cleanId));
      setTurmasArquivadas(prev => prev.filter(t => t.id !== cleanId));
      setTodasSolicitacoes(prev => prev.filter(s => s.turmaId !== cleanId));

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

  // Separa alunos pendentes e aprovados para a turma ativa
  const alunosPendentes = turmaAtiva 
    ? todasSolicitacoes.filter(s => matchesTurma(s.turmaId, s.turmaNome, turmaAtiva) && s.status === "pendente")
    : [];

  const alunosAprovados = turmaAtiva
    ? todasSolicitacoes.filter(s => matchesTurma(s.turmaId, s.turmaNome, turmaAtiva) && s.status === "aprovado")
    : [];

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
      recarregarDados: carregarDados
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
