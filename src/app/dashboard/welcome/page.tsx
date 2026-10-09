"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Target, CheckCircle2, ListChecks, BookOpen, GraduationCap, AlertTriangle, PenTool } from "lucide-react";

export default function WelcomePage() {
  const courseDetails = {
    title: "Serviços de Instalação e Manutenção em Condicionadores de Ar tipo Split",
    area: "SISTEMAS DE ENERGIA - Refrigeração",
    hours: "80 Horas",
    objective: "O Curso de Serviços de Instalação e Manutenção em Condicionadores de Ar tipo Split têm por objetivo o desenvolvimento de competências relativas às técnicas de Instalação e manutenção de condicionadores de ar tipo split de acordo com procedimentos de fabricantes, normas ambientais e de segurança.",
    prerequisites: [
      "O aluno deverá, no início do curso, ter no mínimo 18 anos de idade.",
      "O aluno deverá ter completado a 6ª série/ano do Nível Fundamental."
    ],
    modules: [
      {
        title: "A - Fundamentos de Climatização",
        topics: [
          "Calor", "Temperatura", "Pressão", "Ciclo frigorífico", 
          "Procedimentos de segurança para recolhimento, armazenagem e carga de fluido refrigerante", 
          "Fluidos refrigerantes alternativos"
        ]
      },
      {
        title: "B - Eletricidade Aplicada a Climatização",
        topics: [
          "Fundamentos de eletricidade", "Instrumentos de medição", 
          "Testes dos componentes elétricos", "Diagrama elétrico básico de condicionador de ar tipo split"
        ]
      },
      {
        title: "C - Instalação e Manutenção em Climatização",
        topics: [
          "Procedimentos de carga de fluido refrigerante", "Superaquecimento e subresfriamento", 
          "Teste de estanqueidade", "Vácuo", "Interligação elétrica e mecânica entre as unidades", 
          "Sistema de sifão", "Desnível entre as unidades", "Sistema de dreno", 
          "Procedimento de starup do equipamento", "Teste de componentes e acessórios", 
          "Substituição de componentes e acessórios", "Manutenção preventiva"
        ]
      }
    ]
  };

  return (
    <div className="flex flex-col p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      
      {/* Cabeçalho de Boas-Vindas */}
      <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
        {/* Elemento decorativo de fundo */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-gray-300 mb-6">
              <GraduationCap className="w-4 h-4 text-red-500" />
              <span>{courseDetails.area}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
              {courseDetails.title}
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              Bem-vindo à plataforma oficial do curso. Aqui encontrará todo o material de apoio, módulos interativos e acompanhamento do seu progresso técnico.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-base rounded-xl shadow-lg shadow-red-900/30 transition-all">
                <Link href="/dashboard/modules">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Aceder aos Módulos
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Coluna Principal: Objetivo e Conteúdo */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Objetivo do Curso */}
          <Card className="bg-black/40 backdrop-blur-md border border-white/10 shadow-xl rounded-2xl">
            <CardHeader className="border-b border-white/5 pb-5">
              <CardTitle className="text-xl flex items-center gap-2 text-white">
                <Target className="w-6 h-6 text-red-500" />
                <span>Objetivo do Curso</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-gray-300 leading-relaxed text-base">
                {courseDetails.objective}
              </p>
            </CardContent>
          </Card>

          {/* Plano Curricular */}
          <Card className="bg-black/40 backdrop-blur-md border border-white/10 shadow-xl rounded-2xl">
            <CardHeader className="border-b border-white/5 pb-5">
              <CardTitle className="text-xl flex items-center gap-2 text-white">
                <ListChecks className="w-6 h-6 text-red-500" />
                <span>Conteúdo Programático</span>
              </CardTitle>
              <CardDescription className="text-gray-400 mt-1">
                O que será abordado ao longo dos 3 módulos.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-8">
              {courseDetails.modules.map((module, index) => (
                <div key={index} className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 text-sm">
                      M{index + 1}
                    </div>
                    {module.title}
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-10">
                    {module.topics.map((topic, tIndex) => (
                      <li key={tIndex} className="flex items-start gap-2 text-sm text-gray-400">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500/70 shrink-0 mt-0.5" />
                        <span className="leading-tight">{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>

        </div>

        {/* Coluna Lateral: Informações Rápidas e Requisitos */}
        <div className="space-y-8">
          
          {/* Informações Rápidas */}
          <div className="grid grid-cols-1 gap-4">
            <Card className="bg-black/40 backdrop-blur-md border border-white/10 shadow-xl rounded-2xl">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 font-medium">Carga Horária Total</p>
                  <p className="text-2xl font-bold text-white">{courseDetails.hours}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/40 backdrop-blur-md border border-white/10 shadow-xl rounded-2xl">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
                  <PenTool className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 font-medium">Modalidade</p>
                  <p className="text-xl font-bold text-white">Teórico e Prático</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pré-Requisitos */}
          <Card className="bg-black/40 backdrop-blur-md border border-white/10 shadow-xl rounded-2xl border-l-4 border-l-yellow-500/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2 text-white">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                <span>Pré-Requisitos</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {courseDetails.prerequisites.map((req, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-gray-300 bg-white/5 p-3 rounded-lg border border-white/5">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5 shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

        </div>
      </div>

    </div>
  );
}