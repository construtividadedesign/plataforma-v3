"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTurma } from "@/contexts/TurmaContext";
import { AlertCircle } from "lucide-react";

export default function ModulesPage() {
  const { turmaAtiva, aulasConcluidas } = useTurma();

  // Dados base dos módulos (sem o status estático)
  const modulesData = [
    {
      id: "mod-1",
      title: "Fundamentos de Climatização",
      description: "Conceitos de calor, temperatura, pressão, ciclo frigorífico e manuseio seguro de fluidos.",
      duration: "16 Horas",
      lessonCount: 6,
    },
    {
      id: "mod-2",
      title: "Eletricidade Aplicada a Climatização",
      description: "Fundamentos elétricos, uso de instrumentos de medição, testes e diagramas elétricos.",
      duration: "16 Horas",
      lessonCount: 4,
    },
    {
      id: "mod-3",
      title: "Instalação e Manutenção em Climatização",
      description: "Procedimentos de carga de fluido, vácuo, interligação elétrica e mecânica, e manutenção preventiva.",
      duration: "48 Horas",
      lessonCount: 11,
    }
  ];

  return (
    <div className="flex flex-col p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Módulos do Curso
          </h1>
          <p className="text-gray-400 mt-2 max-w-2xl text-sm">
            Explore todos os módulos disponíveis, acompanhe o progresso técnico e aceda às aulas práticas.
          </p>
        </div>
        
        {/* Identificador da Turma Ativa */}
        {turmaAtiva && (
          <div className="bg-black/40 border border-white/10 px-4 py-2 rounded-lg backdrop-blur-md">
            <span className="text-xs text-gray-500 block">A registar progresso em:</span>
            <span className="text-sm font-semibold text-red-500">{turmaAtiva.nome}</span>
          </div>
        )}
      </div>

      {/* Aviso se não houver turma selecionada */}
      {!turmaAtiva && (
        <div className="bg-orange-500/10 border border-orange-500/20 text-orange-400 p-4 rounded-xl flex items-center gap-3 text-sm font-medium">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>Por favor, selecione ou crie uma turma no Painel Principal antes de iniciar os módulos para que o seu progresso seja guardado.</span>
        </div>
      )}

      {/* Grelha de Módulos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {modulesData.map((module, index) => {
          // LÓGICA DINÂMICA DE PROGRESSO
          // Conta quantas aulas deste módulo específico estão concluídas
          const completedLessons = aulasConcluidas.filter(id => id.startsWith(module.id)).length;
          const isCompleted = completedLessons >= module.lessonCount;
          const isStarted = completedLessons > 0;

          // Define as cores e textos com base no progresso
          let status = "Disponível";
          let badgeColor = "bg-white/5 text-gray-300 border-white/10"; // Cinza (Padrão)

          if (isCompleted) {
            status = "Concluído";
            badgeColor = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"; // Verde
          } else if (isStarted) {
            status = `${completedLessons} / ${module.lessonCount} Aulas`;
            badgeColor = "bg-orange-500/10 text-orange-400 border-orange-500/20"; // Laranja
          }

          return (
            <Card key={module.id} className="bg-black/40 backdrop-blur-md border border-white/10 shadow-xl flex flex-col hover:border-red-500/30 transition-colors rounded-2xl">
              <CardHeader className="border-b border-white/5 pb-5">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-medium bg-black/50 text-gray-300 border border-white/10 px-2.5 py-1 rounded-md">
                    {module.duration} • {module.lessonCount} Aulas
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${badgeColor}`}>
                    {status}
                  </span>
                </div>
                <CardTitle className="text-xl text-white">{module.title}</CardTitle>
                <CardDescription className="pt-2 text-sm text-gray-400 leading-relaxed">
                  {module.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow" />
              <CardFooter className="pt-5 pb-5 flex justify-between items-center mt-auto">
                <span className="text-sm text-gray-500 font-medium">
                  Módulo 0{index + 1} de 03
                </span>
                <Button 
                  asChild 
                  disabled={!turmaAtiva}
                  className={`cursor-pointer border-0 shadow-lg ${
                    !turmaAtiva 
                      ? "bg-gray-800 text-gray-500" 
                      : "bg-red-600 text-white hover:bg-red-700 shadow-red-900/20"
                  }`}
                >
                  <Link href={`/dashboard/modules/${module.id}`}>
                    Entrar no Módulo
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

    </div>
  );
}