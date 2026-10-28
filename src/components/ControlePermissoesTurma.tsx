"use client";

import React, { useState } from "react";
import { useTurma } from "@/contexts/TurmaContext";
import { COURSE_MODULES, COURSE_TOOLS } from "@/data/courseStructure";
import {
  SlidersHorizontal,
  CheckCircle2,
  Lock,
  Unlock,
  ChevronDown,
  ChevronUp,
  Cpu,
  Wind,
  Stethoscope,
  Calculator,
  BookOpen,
  Sparkles,
  Layers,
  Wrench,
  CheckSquare,
  Square,
  ShieldAlert
} from "lucide-react";
import { toast } from "sonner";

export default function ControlePermissoesTurma() {
  const { turmaAtiva, isProfessor, atualizarPermissaoTurma } = useTurma();
  const [activeTab, setActiveTab] = useState<"ferramentas" | "aulas">("ferramentas");
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    "mod-1": true,
    "mod-2": false,
    "mod-3": false,
  });
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  if (!isProfessor || !turmaAtiva) return null;

  const perms = turmaAtiva.permissoes_conteudo || {};
  const permsFerramentas = perms.ferramentas || {};
  const permsAulas = perms.aulas || {};
  const permsModulos = perms.modulos || {};

  const toggleExpandModule = (modId: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [modId]: !prev[modId],
    }));
  };

  const handleToggleFerramenta = async (toolId: string, currentStatus: boolean, toolName: string) => {
    setIsUpdating(toolId);
    const novoStatus = !currentStatus;
    const ok = await atualizarPermissaoTurma(turmaAtiva.id, toolId, novoStatus, "ferramenta");
    setIsUpdating(null);

    if (ok) {
      if (novoStatus) {
        toast.success(`"${toolName}" liberado para a turma ${turmaAtiva.nome}!`);
      } else {
        toast.info(`"${toolName}" bloqueado para os alunos da turma.`);
      }
    } else {
      toast.error("Erro ao atualizar permissão no banco.");
    }
  };

  const handleToggleModulo = async (modId: string, currentStatus: boolean, modTitle: string) => {
    setIsUpdating(modId);
    const novoStatus = !currentStatus;
    const ok = await atualizarPermissaoTurma(turmaAtiva.id, modId, novoStatus, "modulo");
    setIsUpdating(null);

    if (ok) {
      if (novoStatus) {
        toast.success(`Módulo "${modTitle}" liberado para a turma!`);
      } else {
        toast.info(`Módulo "${modTitle}" bloqueado temporariamente.`);
      }
    } else {
      toast.error("Erro ao atualizar permissão no banco.");
    }
  };

  const handleToggleAula = async (aulaId: string, currentStatus: boolean, aulaTitle: string) => {
    setIsUpdating(aulaId);
    const novoStatus = !currentStatus;
    const ok = await atualizarPermissaoTurma(turmaAtiva.id, aulaId, novoStatus, "aula");
    setIsUpdating(null);

    if (ok) {
      if (novoStatus) {
        toast.success(`Aula liberada com sucesso!`);
      } else {
        toast.info(`Aula bloqueada para a turma.`);
      }
    } else {
      toast.error("Erro ao atualizar permissão no banco.");
    }
  };

  const handleLiberarTodasAulasModulo = async (modId: string) => {
    const modulo = COURSE_MODULES.find((m) => m.id === modId);
    if (!modulo) return;

    setIsUpdating(`batch-${modId}`);
    for (const aula of modulo.lessons) {
      await atualizarPermissaoTurma(turmaAtiva.id, aula.id, true, "aula");
    }
    await atualizarPermissaoTurma(turmaAtiva.id, modId, true, "modulo");
    setIsUpdating(null);
    toast.success(`Todas as aulas de ${modulo.title} foram liberadas!`);
  };

  const handleBloquearTodasAulasModulo = async (modId: string) => {
    const modulo = COURSE_MODULES.find((m) => m.id === modId);
    if (!modulo) return;

    setIsUpdating(`batch-${modId}`);
    for (const aula of modulo.lessons) {
      await atualizarPermissaoTurma(turmaAtiva.id, aula.id, false, "aula");
    }
    setIsUpdating(null);
    toast.info(`Todas as aulas de ${modulo.title} foram bloqueadas.`);
  };

  const getToolIcon = (id: string) => {
    switch (id) {
      case "seguranca_sst":
        return <ShieldAlert className="w-5 h-5 text-amber-500" />;
      case "climatizacao":
        return <Wind className="w-5 h-5 text-sky-400" />;
      case "componentes":
        return <Cpu className="w-5 h-5 text-amber-400" />;
      case "diagnostico":
        return <Stethoscope className="w-5 h-5 text-red-400" />;
      case "dimensionamento":
        return <Calculator className="w-5 h-5 text-emerald-400" />;
      default:
        return <Wrench className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl space-y-6 animate-in fade-in duration-500">
      {/* Cabeçalho do Bloco de Controle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-xs text-red-400 font-medium mb-2">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Painel Pedagógico do Instrutor</span>
          </div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            Controle de Liberação de Conteúdos da Turma
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Defina em tempo real quais ferramentas e aulas estão disponíveis para os alunos de{" "}
            <span className="text-white font-medium">"{turmaAtiva.nome}"</span>.
          </p>
        </div>

        {/* Abas de Navegação Ferramentas vs Aulas */}
        <div className="flex items-center gap-1.5 p-1 bg-white/5 border border-white/10 rounded-xl self-start sm:self-auto shrink-0">
          <button
            onClick={() => setActiveTab("ferramentas")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "ferramentas"
                ? "bg-red-600 text-white shadow-md shadow-red-900/30"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            Ferramentas & Seções
          </button>
          <button
            onClick={() => setActiveTab("aulas")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "aulas"
                ? "bg-red-600 text-white shadow-md shadow-red-900/30"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Módulos & Aulas
          </button>
        </div>
      </div>

      {/* ABA 1: FERRAMENTAS E SEÇÕES ESPECIAIS */}
      {activeTab === "ferramentas" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COURSE_TOOLS.map((tool) => {
              const isLiberada =
                tool.id === "componentes"
                  ? permsFerramentas.componentes !== false && turmaAtiva.componentes_liberados !== false
                  : permsFerramentas[tool.id] !== false;

              const isUpdatingThis = isUpdating === tool.id;

              return (
                <div
                  key={tool.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-4 ${
                    isLiberada
                      ? "bg-white/[0.03] border-white/10 hover:border-white/20"
                      : "bg-red-500/[0.03] border-red-500/20"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                        {getToolIcon(tool.id)}
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider block">
                          {tool.badge}
                        </span>
                        <h4 className="text-sm font-semibold text-white">{tool.title}</h4>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${
                        isLiberada
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                          : "bg-red-500/10 border-red-500/20 text-red-400"
                      }`}
                    >
                      {isLiberada ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                      {isLiberada ? "Liberado" : "Bloqueado"}
                    </span>
                  </div>

                  <p className="text-xs text-gray-400 leading-relaxed">{tool.description}</p>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {isLiberada ? "Alunos têm acesso liberado" : "Acesso bloqueado com aviso"}
                    </span>

                    <button
                      disabled={isUpdatingThis}
                      onClick={() => handleToggleFerramenta(tool.id, isLiberada, tool.title)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                        isLiberada
                          ? "bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"
                          : "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-900/20"
                      }`}
                    >
                      {isLiberada ? (
                        <>
                          <Lock className="w-3.5 h-3.5" />
                          Bloquear Acesso
                        </>
                      ) : (
                        <>
                          <Unlock className="w-3.5 h-3.5" />
                          Liberar para a Turma
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ABA 2: MÓDULOS E AULAS INDIVIDUAIS */}
      {activeTab === "aulas" && (
        <div className="space-y-5">
          {COURSE_MODULES.map((modulo) => {
            const isModuleLiberado = permsModulos[modulo.id] !== false;
            const isExpanded = Boolean(expandedModules[modulo.id]);

            // Conta quantas aulas deste módulo estão liberadas
            const aulasLiberadasCount = modulo.lessons.filter(
              (aula) => permsAulas[aula.id] !== false
            ).length;

            return (
              <div
                key={modulo.id}
                className="bg-black/30 border border-white/10 rounded-xl overflow-hidden transition-all"
              >
                {/* Cabeçalho do Módulo */}
                <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/[0.02]">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleExpandModule(modulo.id)}
                      className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer mt-0.5"
                      title={isExpanded ? "Recolher aulas" : "Expandir aulas"}
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-300">
                          {modulo.duration} • {modulo.lessonCount} Aulas
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium border ${
                            aulasLiberadasCount === modulo.lessonCount
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : aulasLiberadasCount === 0
                              ? "bg-red-500/10 text-red-400 border-red-500/20"
                              : "bg-orange-500/10 text-orange-400 border-orange-500/20"
                          }`}
                        >
                          {aulasLiberadasCount} de {modulo.lessonCount} liberadas
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-white mt-1">{modulo.title}</h4>
                      <p className="text-xs text-gray-400 mt-0.5">{modulo.description}</p>
                    </div>
                  </div>

                  {/* Controles do Módulo */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                    <button
                      onClick={() => handleLiberarTodasAulasModulo(modulo.id)}
                      disabled={isUpdating === `batch-${modulo.id}`}
                      className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-medium border border-white/10 transition-colors cursor-pointer flex items-center gap-1"
                      title="Liberar todas as aulas deste módulo"
                    >
                      <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                      Liberar Todas
                    </button>
                    <button
                      onClick={() => handleBloquearTodasAulasModulo(modulo.id)}
                      disabled={isUpdating === `batch-${modulo.id}`}
                      className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-medium border border-white/10 transition-colors cursor-pointer flex items-center gap-1"
                      title="Bloquear todas as aulas deste módulo"
                    >
                      <Square className="w-3.5 h-3.5 text-red-400" />
                      Bloquear Todas
                    </button>
                    <button
                      onClick={() => handleToggleModulo(modulo.id, isModuleLiberado, modulo.title)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 border ${
                        isModuleLiberado
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                          : "bg-red-500/20 text-red-300 border-red-500/30"
                      }`}
                    >
                      {isModuleLiberado ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                      {isModuleLiberado ? "Módulo Ativo" : "Módulo Trancado"}
                    </button>
                  </div>
                </div>

                {/* Lista de Aulas do Módulo (Expandível) */}
                {isExpanded && (
                  <div className="border-t border-white/5 divide-y divide-white/5 bg-black/40 p-2 sm:p-4 space-y-1">
                    {modulo.lessons.map((aula) => {
                      const isAulaLiberada = permsAulas[aula.id] !== false && isModuleLiberado;
                      const isUpdatingAula = isUpdating === aula.id;

                      return (
                        <div
                          key={aula.id}
                          className="flex items-center justify-between p-2.5 sm:p-3 rounded-lg hover:bg-white/[0.02] transition-colors gap-3"
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              id={`check-${aula.id}`}
                              checked={isAulaLiberada}
                              disabled={isUpdatingAula}
                              onChange={() => handleToggleAula(aula.id, isAulaLiberada, aula.title)}
                              className="w-4 h-4 rounded text-red-600 bg-black/50 border-white/20 focus:ring-red-500 cursor-pointer"
                            />
                            <label
                              htmlFor={`check-${aula.id}`}
                              className="text-xs sm:text-sm text-gray-200 cursor-pointer font-medium"
                            >
                              {aula.title}
                            </label>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[11px] text-gray-500">{aula.duration}</span>
                            <span
                              className={`text-[11px] px-2 py-0.5 rounded font-medium ${
                                isAulaLiberada
                                  ? "bg-emerald-500/10 text-emerald-400"
                                  : "bg-red-500/10 text-red-400"
                              }`}
                            >
                              {isAulaLiberada ? "Liberada" : "Bloqueada"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
