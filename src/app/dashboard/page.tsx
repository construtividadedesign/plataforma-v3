"use client";

import Link from "next/link";
import { Zap, Pin, Plus, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useTurma } from "@/contexts/TurmaContext";

export default function DashboardPage() {
  const {
    turmas,
    turmaAtiva,
    aulasConcluidas,
    isLoadingTurmas,
    isProfessor,
    userName,
    selecionarTurma,
    criarTurma,
  } = useTurma();

  const [isCreating, setIsCreating] = useState(false);
  const [novaTurmaNome, setNovaTurmaNome] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleCriarTurma = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaTurmaNome.trim() || !isProfessor) return;

    setIsSaving(true);
    const sucesso = await criarTurma(novaTurmaNome);
    setIsSaving(false);

    if (sucesso) {
      setIsCreating(false);
      setNovaTurmaNome("");
    }
  };

  // Cálculos Dinâmicos da Turma
  const totalAulasCurso = 22; // 6 (mod1) + 4 (mod2) + 12 (mod3)
  const totalHorasCurso = 80;

  const aulasFeitas = aulasConcluidas.length;
  const horasFeitas = Math.round((aulasFeitas / totalAulasCurso) * totalHorasCurso);

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-700">
      {/* Cartão de Boas-vindas */}
      <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300 mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-red-500" />
            <span>{isProfessor ? "Painel do Instrutor" : "Ambiente do Aluno (Consulta)"}</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {isProfessor ? "Olá, Prof.! 👋" : `Olá, ${userName || "Aluno"}! 👋`}
          </h2>
          <p className="text-gray-300 max-w-2xl text-sm leading-relaxed">
            {isProfessor
              ? "Bem-vindo ao seu painel de controlo. Aqui tem uma visão geral do progresso da sua turma atual."
              : "Bem-vindo ao painel da sua turma. Acompanhe abaixo o andamento das aulas ministradas pelo Instrutor Leonardo e acesse o material técnico."}
          </p>
        </div>
        <Link
          href="/dashboard/modules"
          className="w-full md:w-auto text-center bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shrink-0 shadow-lg shadow-red-900/30"
        >
          Aceder aos Módulos
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Coluna Esquerda: Turma e Acesso Rápido */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          {/* GESTÃO DE TURMA ATIVA */}
          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">Turma Ativa</h3>

                {isLoadingTurmas ? (
                  <p className="text-sm text-gray-400">A carregar turmas...</p>
                ) : turmas.length > 0 ? (
                  <select
                    value={turmaAtiva?.id || ""}
                    onChange={(e) => selecionarTurma(e.target.value)}
                    className="bg-black/50 border border-white/20 text-gray-200 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full max-w-sm p-2.5 mt-2 outline-none appearance-none cursor-pointer"
                  >
                    {turmas.map((t) => (
                      <option key={t.id} value={t.id} className="bg-gray-900 text-white">
                        {t.nome}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-sm text-red-400 mt-1">
                    {isProfessor
                      ? "Ainda não tem turmas cadastradas."
                      : "Nenhuma turma ativa disponível no momento."}
                  </p>
                )}
              </div>

              {isProfessor && !isCreating && (
                <button
                  onClick={() => setIsCreating(true)}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-lg text-xs font-medium transition-colors shrink-0 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Nova Turma
                </button>
              )}
            </div>

            {isProfessor && isCreating && (
              <form
                onSubmit={handleCriarTurma}
                className="mb-6 p-4 bg-black/50 border border-white/5 rounded-xl flex flex-col sm:flex-row gap-3"
              >
                <input
                  type="text"
                  placeholder="Ex: Instalação Split - Noturno"
                  value={novaTurmaNome}
                  onChange={(e) => setNovaTurmaNome(e.target.value)}
                  className="flex-1 bg-transparent border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isSaving || !novaTurmaNome.trim()}
                    className="flex-1 sm:flex-none px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
                  >
                    {isSaving ? "A guardar..." : "Guardar"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCreating(false)}
                    className="flex-1 sm:flex-none px-4 py-2 bg-transparent border border-white/10 text-gray-300 hover:text-white text-sm rounded-lg transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}

            {/* ESTATÍSTICAS DINÂMICAS DA TURMA */}
            {turmaAtiva ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-black/40 border border-white/5 rounded-xl p-5">
                  <p className="text-sm text-gray-400 mb-1">Carga Horária Concluída</p>
                  <p className="text-2xl font-bold text-white">
                    {horasFeitas}h{" "}
                    <span className="text-sm font-normal text-gray-500">/ {totalHorasCurso}h</span>
                  </p>
                </div>
                <div className="bg-black/40 border border-white/5 rounded-xl p-5">
                  <p className="text-sm text-gray-400 mb-1">Aulas Registadas</p>
                  <p className="text-2xl font-bold text-white">
                    {aulasFeitas}{" "}
                    <span className="text-sm font-normal text-gray-500">/ {totalAulasCurso}</span>
                  </p>
                </div>
              </div>
            ) : (
              !isCreating && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5 text-center">
                  <p className="text-sm text-red-400 font-medium">
                    {isProfessor
                      ? "Crie a sua primeira turma para começar a registar progresso."
                      : "Aguarde o instrutor ativar a turma no sistema."}
                  </p>
                </div>
              )
            )}
          </div>

          {/* Próximo Passo Recomendado */}
          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-white mb-1">Acesso Rápido</h3>
            <p className="text-sm text-gray-400 mb-6">
              {isProfessor
                ? "Navegue para o conteúdo técnico para continuar a registar o avanço da turma."
                : "Acesse o conteúdo técnico, apostilas interativas e guias práticos das aulas."}
            </p>

            <div className="bg-black/40 border border-white/5 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
                  <Zap className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Módulos de Formação</h4>
                  <p className="text-sm text-gray-400 mt-0.5">Gestão de aulas e manuais técnicos</p>
                </div>
              </div>
              <Link
                href="/dashboard/modules"
                className="px-4 py-2 border border-white/20 rounded-lg text-sm text-white hover:bg-white/10 transition-colors whitespace-nowrap text-center"
              >
                Ver Módulos
              </Link>
            </div>
          </div>
        </div>

        {/* Coluna Direita: Mural de Avisos */}
        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl h-fit">
          <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
            <Pin className="w-5 h-5 text-red-500" />
            <h3 className="text-lg font-semibold text-white">Mural de Avisos</h3>
          </div>

          <div className="space-y-6">
            <div className="border-l-2 border-red-500 pl-4 relative">
              <h4 className="text-white font-medium text-sm">Equipamentos de Segurança</h4>
              <p className="text-sm text-gray-400 mt-1 mb-2 leading-relaxed">
                Relembramos que o uso de EPIs é estritamente obrigatório nas aulas práticas de vácuo e carga de fluido.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}