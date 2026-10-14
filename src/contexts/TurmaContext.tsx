"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

type Turma = {
  id: string;
  nome: string;
  instrutor_id: string;
  created_at: string;
};

type TurmaContextType = {
  turmas: Turma[];
  turmaAtiva: Turma | null;
  aulasConcluidas: string[];
  isLoadingTurmas: boolean;
  selecionarTurma: (id: string) => void;
  criarTurma: (nome: string) => Promise<boolean>;
  alternarConclusaoAula: (moduloId: string, aulaId: string, isConcluida: boolean) => Promise<void>;
};

const TurmaContext = createContext<TurmaContextType | undefined>(undefined);

export function TurmaProvider({ children }: { children: React.ReactNode }) {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [turmaAtiva, setTurmaAtiva] = useState<Turma | null>(null);
  const [aulasConcluidas, setAulasConcluidas] = useState<string[]>([]);
  const [isLoadingTurmas, setIsLoadingTurmas] = useState(true);

  // 1. Carregar Turmas
  useEffect(() => {
    const supabase = createClient();
    async function carregarTurmas() {
      setIsLoadingTurmas(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsLoadingTurmas(false);
        return;
      }

      const { data, error } = await supabase
        .from("turmas")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setTurmas(data);
        if (data.length > 0) {
          setTurmaAtiva(data[0]);
        }
      }
      setIsLoadingTurmas(false);
    }
    carregarTurmas();
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
    if (turma) setTurmaAtiva(turma);
  };

  const criarTurma = async (nome: string) => {
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

  const alternarConclusaoAula = async (moduloId: string, aulaId: string, isConcluida: boolean) => {
    if (!turmaAtiva) return;
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
      turmaAtiva, 
      aulasConcluidas, 
      isLoadingTurmas, 
      selecionarTurma, 
      criarTurma,
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