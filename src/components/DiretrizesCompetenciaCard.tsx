"use client";

import React, { useState } from "react";
import {
  Award,
  ChevronDown,
  ChevronUp,
  Target,
  Wrench,
  HeartHandshake,
  BookOpen,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { CompetenciasData } from "@/data/competenciasData";

interface DiretrizesCompetenciaCardProps {
  data: CompetenciasData;
  defaultExpanded?: boolean;
  className?: string;
}

export default function DiretrizesCompetenciaCard({
  data,
  defaultExpanded = false,
  className = "",
}: DiretrizesCompetenciaCardProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);

  return (
    <div
      className={`bg-black/40 backdrop-blur-md border border-white/10 hover:border-white/20 rounded-2xl shadow-xl transition-all duration-300 overflow-hidden ${className}`}
    >
      {/* CABEÇALHO DO ACCORDION (SEMPRE VISÍVEL) */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left cursor-pointer transition-colors hover:bg-white/[0.02]"
        aria-expanded={isExpanded}
      >
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-red-600/20 to-amber-600/20 border border-red-500/30 text-red-400 shrink-0 shadow-inner">
            <Award className="w-5 h-5 text-red-500" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-600/10 border border-red-500/20 px-2 py-0.5 rounded">
                Matriz Pedagógica
              </span>
              <span className="text-xs text-gray-400 font-medium">
                {data.metodologiaUIPainel}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-white mt-1 flex items-center gap-2">
              <span>Diretrizes de Competência Profissional</span>
              <span className="hidden md:inline-block text-xs font-normal text-gray-400">
                • {data.moduloTitulo}
              </span>
            </h3>
          </div>
        </div>

        {/* Badges e Botão de Alternância */}
        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 self-stretch sm:self-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
          <span className="text-[11px] font-semibold text-gray-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">
            {data.capacidadesTecnicas.length} Técnicas • {data.capacidadesSocioemocionais.length} Socioemocionais
          </span>

          <div className="flex items-center gap-1.5 text-xs font-bold text-red-400 group-hover:text-red-300">
            <span>{isExpanded ? "Ocultar Diretrizes" : "Ver Matriz Completa"}</span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-red-500 transition-transform duration-200" />
            ) : (
              <ChevronDown className="w-4 h-4 text-red-500 transition-transform duration-200" />
            )}
          </div>
        </div>
      </button>

      {/* CONTEÚDO EXPANSÍVEL (MATRIZ COMPLETA DE COMPETÊNCIAS) */}
      {isExpanded && (
        <div className="p-4 sm:p-6 border-t border-white/10 space-y-6 bg-black/20 animate-in fade-in duration-300">
          
          {/* 1. COMPETÊNCIA GERAL */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
              <Target className="w-4 h-4 text-amber-400" />
              <span>Competência Geral do Módulo</span>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-red-500/5 to-transparent border border-amber-500/20 text-gray-200 text-xs sm:text-sm leading-relaxed font-medium">
              {data.competenciaGeral}
            </div>
          </div>

          {/* 2. CAPACIDADES TÉCNICAS (SABER-FAZER) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                <Wrench className="w-4 h-4 text-emerald-400" />
                <span>Capacidades Técnicas Obrigatórias ({data.capacidadesTecnicas.length})</span>
              </div>
              <span className="text-[10px] text-gray-500 uppercase font-mono">
                Padrão de Bancada & Campo
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {data.capacidadesTecnicas.map((cap, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-all flex items-start gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-xs text-gray-300 leading-relaxed">
                    {cap}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. CAPACIDADES SOCIOEMOCIONAIS (SABER-SER & SABER-CONVIVER) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-400">
                <HeartHandshake className="w-4 h-4 text-sky-400" />
                <span>Capacidades Socioemocionais & Atitudinais ({data.capacidadesSocioemocionais.length})</span>
              </div>
              <span className="text-[10px] text-gray-500 uppercase font-mono">
                Ética, Postura & Segurança
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {data.capacidadesSocioemocionais.map((socio, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-sky-500/30 transition-all flex items-start gap-2.5"
                >
                  <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <span className="text-xs text-gray-300 leading-relaxed">
                    {socio}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 4. DIRETRIZES TÉCNICAS E NORMAS DE REFERÊNCIA */}
          {data.normasReferencia && data.normasReferencia.length > 0 && (
            <div className="pt-2 border-t border-white/5 flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-gray-400" />
                <span>Normas & Regulamentos:</span>
              </span>
              {data.normasReferencia.map((norma, idx) => (
                <span
                  key={idx}
                  className="text-[11px] font-mono text-gray-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded"
                >
                  {norma}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
