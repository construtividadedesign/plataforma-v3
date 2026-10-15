"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useTurma } from "@/contexts/TurmaContext";
import { Trophy, Clock, Award, CheckCircle2, Loader2, AlertCircle } from "lucide-react";

export default function ProgressPage() {
  const { turmaAtiva, aulasConcluidas } = useTurma();
  const supabase = createClient();

  const [modulesWithLessons, setModulesWithLessons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Módulos oficiais do curso com informações de carga horária
  const modulesMeta = [
    { id: "mod-1", title: "Fundamentos de Climatização", hours: 16 },
    { id: "mod-2", title: "Eletricidade Aplicada a Climatização", hours: 16 },
    { id: "mod-3", title: "Instalação e Manutenção em Climatização", hours: 48 },
  ];

  useEffect(() => {
    async function fetchAllLessons() {
      setIsLoading(true);
      const { data: lessonsData } = await supabase
        .from("lessons")
        .select("*")
        .order("lesson_order", { ascending: true });

      if (lessonsData) {
        const assembled = modulesMeta.map((mod) => {
          const modLessons = lessonsData.filter((l) => l.module_id === mod.id);
          return {
            ...mod,
            lessons: modLessons,
          };
        });
        setModulesWithLessons(assembled);
      }
      setIsLoading(false);
    }
    fetchAllLessons();
  }, [supabase]);

  // Cálculo Global
  const totalAulasGeral = modulesWithLessons.reduce((acc, m) => acc + m.lessons.length, 0);
  const totalConcluidasGeral = modulesWithLessons.reduce(
    (acc, m) => acc + m.lessons.filter((l: any) => aulasConcluidas.includes(l.id)).length,
    0
  );
  const progressoGlobalPercentual = totalAulasGeral > 0 ? Math.round((totalConcluidasGeral / totalAulasGeral) * 100) : 0;
  
  const totalHorasCurso = 80;
  const horasConcluidas = totalAulasGeral > 0 ? Math.round((totalConcluidasGeral / totalAulasGeral) * totalHorasCurso) : 0;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-[60vh] text-gray-400">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-red-500" />
        <p>Carregando progresso...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-700">
      
      {/* Cabeçalho */}
      <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300 mb-3">
            <Trophy className="w-3.5 h-3.5 text-red-500" />
            <span>Painel Oficial de Desempenho</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Painel de Progresso e Desempenho</h2>
          <p className="text-gray-300 max-w-2xl text-sm leading-relaxed">
            Acompanhe o avanço técnico detalhado ao longo dos módulos da Plataforma de Climatização.
          </p>
        </div>
        {turmaAtiva && (
          <div className="bg-black/50 border border-white/10 px-4 py-2.5 rounded-xl backdrop-blur-md shrink-0">
            <span className="text-xs text-gray-500 block">Turma em análise:</span>
            <span className="text-sm font-semibold text-red-500">{turmaAtiva.nome}</span>
          </div>
        )}
      </div>

      {/* Cartões de Estatísticas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Progresso Global */}
        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-400">Progresso Global</span>
              <Trophy className="w-5 h-5 text-red-500" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">{progressoGlobalPercentual}%</div>
            <p className="text-xs text-gray-400 mb-4">{totalConcluidasGeral} de {totalAulasGeral || 22} aulas concluídas</p>
          </div>
          <div className="w-full bg-black/60 border border-white/5 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-red-600 h-2 transition-all duration-500 rounded-full" 
              style={{ width: `${progressoGlobalPercentual}%` }}
            />
          </div>
        </div>

        {/* Carga Horária Concluída */}
        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-400">Carga Horária Concluída</span>
              <Clock className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">{horasConcluidas}h</div>
            <p className="text-xs text-gray-400 mb-4">De um total estimado de {totalHorasCurso} horas</p>
          </div>
          <div className="w-full bg-black/60 border border-white/5 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-emerald-500 h-2 transition-all duration-500 rounded-full" 
              style={{ width: `${(horasConcluidas / totalHorasCurso) * 100}%` }}
            />
          </div>
        </div>

        {/* Status do Certificado */}
        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-400">Status do Certificado</span>
              <Award className="w-5 h-5 text-amber-500" />
            </div>
            <div className="text-2xl font-bold text-white mb-2">
              {progressoGlobalPercentual === 100 ? "Disponível 🎉" : "Em Curso"}
            </div>
            <p className="text-xs text-gray-400 mb-4">
              {progressoGlobalPercentual === 100 ? "Parabéns! Certificado pronto para emissão." : "Complete 100% para desbloquear"}
            </p>
          </div>
          <div className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-amber-400 w-fit">
            {progressoGlobalPercentual === 100 ? "Certificado Liberado" : "Formação Ativa"}
          </div>
        </div>

      </div>

      {/* Desempenho por Módulo (Dinâmico e Corrigido) */}
      <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl space-y-6">
        <div className="border-b border-white/5 pb-4">
          <h3 className="text-xl font-bold text-white">Desempenho por Módulo</h3>
          <p className="text-sm text-gray-400 mt-1">Análise individual do avanço em cada uma das frentes técnicas do curso.</p>
        </div>

        <div className="space-y-6">
          {modulesWithLessons.map((mod) => {
            const totalModAulas = mod.lessons.length;
            const concluidasModAulas = mod.lessons.filter((l: any) => aulasConcluidas.includes(l.id)).length;
            const percentualMod = totalModAulas > 0 ? Math.round((concluidasModAulas / totalModAulas) * 100) : 0;

            return (
              <div key={mod.id} className="bg-white/5 border border-white/5 rounded-xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-white font-semibold text-base">{mod.title}</h4>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {concluidasModAulas} de {totalModAulas} aulas concluídas • {mod.hours} horas estimadas
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-lg text-xs font-bold w-fit ${
                    percentualMod === 100 
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
                      : percentualMod > 0 
                        ? "bg-orange-500/20 text-orange-400 border border-orange-500/30" 
                        : "bg-black/50 text-gray-400 border border-white/10"
                  }`}>
                    {percentualMod}%
                  </div>
                </div>

                <div className="w-full bg-black/60 border border-white/5 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-red-600 h-2.5 transition-all duration-500 rounded-full" 
                    style={{ width: `${percentualMod}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
