"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Trophy, Clock, Award, Activity, AlertCircle } from "lucide-react";
import { useTurma } from "@/contexts/TurmaContext";

const modulesDefinition = [
  { id: "mod-1", title: "Fundamentos de Climatização", totalHours: 16, totalLessons: 6 },
  { id: "mod-2", title: "Eletricidade Aplicada a Climatização", totalHours: 16, totalLessons: 4 },
  { id: "mod-3", title: "Instalação e Manutenção em Climatização", totalHours: 48, totalLessons: 12 }
];

export default function ProgressPage() {
  const { turmaAtiva, aulasConcluidas } = useTurma();

  // Se não houver turma selecionada, mostra um aviso em vez dos gráficos vazios
  if (!turmaAtiva) {
    return (
      <div className="flex flex-col p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Painel de Progresso</h1>
          <p className="text-gray-400 mt-2">Acompanhe o avanço técnico detalhado.</p>
        </div>
        <div className="bg-orange-500/10 border border-orange-500/20 text-orange-400 p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3">
          <AlertCircle className="w-10 h-10 mb-2" />
          <h3 className="text-lg font-semibold text-white">Nenhuma turma selecionada</h3>
          <p className="text-sm">Por favor, vá ao Painel Principal e selecione ou crie uma turma para visualizar os relatórios de progresso.</p>
        </div>
      </div>
    );
  }

  // Cálculos Globais da Turma Ativa
  const totalLessonsCount = modulesDefinition.reduce((acc, curr) => acc + curr.totalLessons, 0);
  const totalCourseHours = modulesDefinition.reduce((acc, curr) => acc + curr.totalHours, 0);
  
  const completedCount = aulasConcluidas.length;
  const overallPercentage = totalLessonsCount > 0 ? Math.round((completedCount / totalLessonsCount) * 100) : 0;
  const hoursCompleted = Math.round((completedCount / totalLessonsCount) * totalCourseHours) || 0;

  return (
    <div className="flex flex-col p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Painel de Progresso e Desempenho
          </h1>
          <p className="text-gray-400 mt-2 max-w-2xl text-sm">
            Acompanhe o avanço técnico detalhado ao longo dos módulos da Plataforma de Climatização.
          </p>
        </div>
        
        {/* Identificador da Turma Ativa */}
        <div className="bg-black/40 border border-white/10 px-4 py-2 rounded-lg backdrop-blur-md shrink-0">
          <span className="text-xs text-gray-500 block">A analisar progresso de:</span>
          <span className="text-sm font-semibold text-emerald-400">{turmaAtiva.nome}</span>
        </div>
      </div>

      {/* Cartões de Estatísticas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <Card className="bg-black/40 backdrop-blur-md border border-white/10 shadow-xl rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-white/5">
            <CardTitle className="text-sm font-medium text-gray-400">Progresso Global</CardTitle>
            <Trophy className="w-5 h-5 text-red-500" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-bold text-white">{overallPercentage}%</div>
            <p className="text-xs text-gray-500 mt-1">
              {completedCount} de {totalLessonsCount} aulas concluídas
            </p>
            <div className="w-full bg-black/50 border border-white/5 rounded-full h-2 mt-4 overflow-hidden">
              <div className="bg-red-600 h-2 transition-all duration-1000 ease-out" style={{ width: `${overallPercentage}%` }} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-md border border-white/10 shadow-xl rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-white/5">
            <CardTitle className="text-sm font-medium text-gray-400">Carga Horária Concluída</CardTitle>
            <Clock className="w-5 h-5 text-emerald-500" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-bold text-white">{hoursCompleted}h</div>
            <p className="text-xs text-gray-500 mt-1">
              De um total estimado de {totalCourseHours} horas
            </p>
            <div className="w-full bg-black/50 border border-white/5 rounded-full h-2 mt-4 overflow-hidden">
              <div className="bg-emerald-500 h-2 transition-all duration-1000 ease-out" style={{ width: `${(hoursCompleted / totalCourseHours) * 100}%` }} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-md border border-white/10 shadow-xl rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-white/5">
            <CardTitle className="text-sm font-medium text-gray-400">Status do Certificado</CardTitle>
            <Award className="w-5 h-5 text-sky-400" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-white">
              {overallPercentage >= 100 ? "Elegível" : "Em Curso"}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {overallPercentage >= 100 ? "Parabéns! Concluiu todas as aulas." : "Complete 100% para desbloquear"}
            </p>
            <div className="mt-4">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                overallPercentage >= 100 
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                  : "bg-orange-500/10 text-orange-400 border-orange-500/20"
              }`}>
                {overallPercentage >= 100 ? "Certificado Disponível" : "Formação Ativa"}
              </span>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Progresso Detalhado por Módulo */}
      <Card className="bg-black/40 backdrop-blur-md border border-white/10 shadow-xl rounded-2xl">
        <CardHeader className="border-b border-white/5 pb-6">
          <CardTitle className="text-xl flex items-center gap-2 text-white">
            <Activity className="w-5 h-5 text-red-500" />
            <span>Desempenho por Módulo</span>
          </CardTitle>
          <CardDescription className="text-gray-400 text-sm mt-1">
            Análise individual do avanço em cada uma das frentes técnicas do curso.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {modulesDefinition.map((mod) => {
            // Conta quantas aulas *deste módulo específico* a turma concluiu
            const modCompletedCount = aulasConcluidas.filter(id => id.startsWith(mod.id)).length;
            const modPercentage = Math.round((modCompletedCount / mod.totalLessons) * 100);

            return (
              <div key={mod.id} className="p-5 rounded-xl border border-white/5 bg-black/30 space-y-4 hover:bg-black/50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-white text-base">{mod.title}</h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {modCompletedCount} de {mod.totalLessons} aulas concluídas • {mod.totalHours} horas estimadas
                    </p>
                  </div>
                  <span className="text-sm font-bold text-red-400 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-md self-start sm:self-auto">
                    {modPercentage}%
                  </span>
                </div>
                
                <div className="w-full bg-black/60 border border-white/5 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-red-600 h-2 transition-all duration-1000 ease-out" 
                    style={{ width: `${modPercentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

    </div>
  );
}