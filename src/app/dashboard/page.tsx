"use client";

import Link from "next/link";
import { Zap, Pin, Plus, ShieldCheck, CheckCircle2, XCircle, Clock, Archive, Trash2, Lock, RefreshCw, UserCheck } from "lucide-react";
import { useState } from "react";
import { useTurma, getProfessorDisplayName } from "@/contexts/TurmaContext";
import { toast } from "sonner";

export default function DashboardPage() {
  const {
    turmas,
    turmasArquivadas,
    turmaAtiva,
    aulasConcluidas,
    isLoadingTurmas,
    isProfessor,
    userName,
    userEmail,
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
    recarregarDados,
  } = useTurma();

  const [isCreating, setIsCreating] = useState(false);
  const [novaTurmaNome, setNovaTurmaNome] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const isAprovado = alunoStatusAprovacao === "aprovado";

  const handleCriarTurma = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaTurmaNome.trim() || !isProfessor) return;

    setIsSaving(true);
    const sucesso = await criarTurma(novaTurmaNome);
    setIsSaving(false);

    if (sucesso) {
      setIsCreating(false);
      setNovaTurmaNome("");
      toast.success("Turma criada com sucesso!");
    } else {
      toast.error("Erro ao criar a turma.");
    }
  };

  const handleExcluir = async (turmaId: string, nomeTurma: string) => {
    if (!isProfessor) {
      toast.error("Ação restrita ao Instrutor.");
      return;
    }
    if (confirm(`Tem certeza que deseja excluir permanentemente a turma "${nomeTurma}"? O acesso de todos os alunos vinculados será revogado imediatamente.`)) {
      await excluirTurma(turmaId);
      toast.success("Turma excluída com sucesso.");
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await recarregarDados();
    setIsRefreshing(false);
    toast.info("Dados e aprovações atualizados.");
  };

  // Cálculos Dinâmicos da Turma
  const totalAulasCurso = 22;
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
            <span>{isProfessor ? "Painel do Instrutor" : "Ambiente do Aluno"}</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {isProfessor ? `Olá, ${getProfessorDisplayName(userEmail, userName)}! 👋` : `Olá, ${userName || "Aluno"}! 👋`}
          </h2>
          <p className="text-gray-300 max-w-2xl text-sm leading-relaxed">
            {isProfessor
              ? "Gerencie as turmas, aprove os acessos dos alunos e acompanhe o progresso geral da climatização."
              : isAprovado
                ? "Seu acesso está aprovado nesta turma! Você pode navegar por todos os módulos, diagnósticos e materiais."
                : "Selecione a sua turma e solicite a liberação de acesso com o Instrutor para visualizar as aulas e guias."}
          </p>
        </div>

        {isProfessor || isAprovado ? (
          <Link
            href="/dashboard/modules"
            className="w-full md:w-auto text-center bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shrink-0 shadow-lg shadow-red-900/30"
          >
            Acessar os Módulos
          </Link>
        ) : (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 text-xs sm:text-sm font-medium shrink-0">
            <Lock className="w-4 h-4 text-amber-500" />
            <span>Aguardando Aprovação do Instrutor</span>
          </div>
        )}
      </div>

      {/* AVISO DE APROVAÇÃO PARA ALUNOS */}
      {!isProfessor && turmaAtiva && !isAprovado && (
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-6 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold">
                {alunoStatusAprovacao === "pendente"
                  ? "Acesso Pendente de Aprovação"
                  : alunoStatusAprovacao === "excluido" || alunoStatusAprovacao === "rejeitado"
                    ? "Acesso Não Autorizado / Revogado"
                    : "Solicitar Acesso à Turma"}
              </h3>
              <p className="text-sm text-gray-300 mt-0.5">
                {alunoStatusAprovacao === "pendente"
                  ? `Sua solicitação para a turma "${turmaAtiva.nome}" foi enviada e aguarda liberação do Instrutor.`
                  : alunoStatusAprovacao === "excluido" || alunoStatusAprovacao === "rejeitado"
                    ? `Seu vínculo com a turma "${turmaAtiva.nome}" foi revogado. Caso necessário, solicite acesso novamente.`
                    : `Clique no botão ao lado para solicitar o seu acesso oficial à turma "${turmaAtiva.nome}".`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {alunoStatusAprovacao === "pendente" ? (
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-gray-200 text-xs font-medium rounded-xl transition-colors cursor-pointer border border-white/10"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
                Verificar Status
              </button>
            ) : (
              <button
                onClick={async () => {
                  const res = await solicitarAcessoTurma(turmaAtiva.id);
                  if (res.success) {
                    toast.success("Solicitação enviada ao instrutor!");
                  } else {
                    toast.error(res.error || "Não foi possível enviar a solicitação. Tente novamente.");
                  }
                }}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-xl transition-colors cursor-pointer shadow-lg shadow-red-900/30"
              >
                Solicitar Acesso
              </button>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* Coluna Esquerda: Turma e Acesso Rápido */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          
          {/* GESTÃO DE TURMA ATIVA */}
          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white mb-1">Turma Ativa</h3>
                  <button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    title="Atualizar lista de turmas e alunos"
                    className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
                  </button>
                </div>

                {isLoadingTurmas ? (
                  <p className="text-sm text-gray-400">Carregando turmas...</p>
                ) : turmas.length > 0 ? (
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-2">
                    <select
                      value={turmaAtiva?.id || ""}
                      onChange={(e) => selecionarTurma(e.target.value)}
                      className="bg-black/50 border border-white/20 text-gray-200 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full max-w-sm p-2.5 outline-none appearance-none cursor-pointer"
                    >
                      {turmas.map((t) => (
                        <option key={t.id} value={t.id} className="bg-gray-900 text-white">
                          {t.nome}
                        </option>
                      ))}
                    </select>

                    {/* Botões de Ação do Professor na Turma Ativa */}
                    {isProfessor && turmaAtiva && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            arquivarTurma(turmaAtiva.id);
                            toast.info("Turma arquivada com sucesso.");
                          }}
                          title="Arquivar Turma"
                          className="px-3 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Archive className="w-3.5 h-3.5" /> Arquivar
                        </button>
                        <button
                          onClick={() => handleExcluir(turmaAtiva.id, turmaAtiva.nome)}
                          title="Excluir Turma"
                          className="px-3 py-2 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Excluir
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-red-400 mt-1">
                    {isProfessor ? "Ainda não tem turmas cadastradas." : "Nenhuma turma ativa disponível."}
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
              <form onSubmit={handleCriarTurma} className="p-4 bg-black/50 border border-white/5 rounded-xl flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Ex: Instalação Split - Noturno"
                  value={novaTurmaNome}
                  onChange={(e) => setNovaTurmaNome(e.target.value)}
                  className="flex-1 bg-transparent border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button type="submit" disabled={isSaving || !novaTurmaNome.trim()} className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer">
                    {isSaving ? "Salvando..." : "Salvar"}
                  </button>
                  <button type="button" onClick={() => setIsCreating(false)} className="px-4 py-2 bg-transparent border border-white/10 text-gray-300 hover:text-white text-sm rounded-lg transition-colors cursor-pointer">
                    Cancelar
                  </button>
                </div>
              </form>
            )}

            {/* PAINEL DE APROVAÇÃO DE ALUNOS (EXCLUSIVO PARA O PROFESSOR) */}
            {isProfessor && turmaAtiva && (
              <div className="border-t border-white/5 pt-4 space-y-4">
                
                {/* 1. Solicitantes Pendentes */}
                <div>
                  <h4 className="text-sm font-semibold text-white mb-3 flex items-center justify-between">
                    <span>Alunos Solicitantes Pendentes</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 font-medium">
                      {alunosPendentes.length} pendente(s)
                    </span>
                  </h4>

                  {alunosPendentes.length > 0 ? (
                    <div className="space-y-2">
                      {alunosPendentes.map((aluno, i) => (
                        <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between bg-black/50 border border-white/5 p-3 rounded-xl gap-3">
                          <div>
                            <p className="text-white text-sm font-medium">{aluno.nome}</p>
                            <p className="text-xs text-gray-400">{aluno.email}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={async () => {
                                const res = await aprovarAluno(aluno.email, turmaAtiva.id);
                                if (res.success) {
                                  toast.success(`Aluno ${aluno.nome} aprovado com sucesso!`);
                                } else {
                                  toast.error(res.error || "Erro ao aprovar aluno.");
                                }
                              }}
                              className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                              title="Aprovar Aluno"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" /> Aprovar
                            </button>
                            <button
                              onClick={async () => {
                                const res = await rejeitarAluno(aluno.email, turmaAtiva.id);
                                if (res.success) {
                                  toast.info("Solicitação recusada.");
                                } else {
                                  toast.error(res.error || "Erro ao recusar solicitação.");
                                }
                              }}
                              className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                              title="Rejeitar"
                            >
                              <XCircle className="w-3.5 h-3.5" /> Recusar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 italic">Nenhum aluno pendente de aprovação nesta turma no momento.</p>
                  )}
                </div>

                {/* 2. Alunos Aprovados na Turma */}
                <div className="border-t border-white/5 pt-4">
                  <h4 className="text-sm font-semibold text-white mb-3 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-emerald-400" />
                      Alunos Aprovados na Turma
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-medium">
                      {alunosAprovados.length} aprovado(s)
                    </span>
                  </h4>

                  {alunosAprovados.length > 0 ? (
                    <div className="space-y-2">
                      {alunosAprovados.map((aluno, i) => (
                        <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between bg-black/50 border border-white/5 p-3 rounded-xl gap-3">
                          <div>
                            <p className="text-white text-sm font-medium">{aluno.nome}</p>
                            <p className="text-xs text-gray-400">{aluno.email}</p>
                          </div>
                          <button
                            onClick={async () => {
                              if (confirm(`Deseja revogar o acesso do aluno ${aluno.nome} (${aluno.email}) a esta turma?`)) {
                                const res = await removerAlunoAprovado(aluno.email, turmaAtiva.id);
                                if (res.success) {
                                  toast.info(`Acesso de ${aluno.nome} revogado.`);
                                } else {
                                  toast.error(res.error || "Erro ao revogar acesso do aluno.");
                                }
                              }
                            }}
                            className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
                            title="Revogar Acesso"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Revogar Acesso
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 italic">Nenhum aluno aprovado nesta turma ainda.</p>
                  )}
                </div>

              </div>
            )}

            {/* ESTATÍSTICAS DA TURMA */}
            {turmaAtiva ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-black/40 border border-white/5 rounded-xl p-5">
                  <p className="text-sm text-gray-400 mb-1">Carga Horária Concluída</p>
                  <p className="text-2xl font-bold text-white">{horasFeitas}h <span className="text-sm font-normal text-gray-500">/ {totalHorasCurso}h</span></p>
                </div>
                <div className="bg-black/40 border border-white/5 rounded-xl p-5">
                  <p className="text-sm text-gray-400 mb-1">Aulas Registradas</p>
                  <p className="text-2xl font-bold text-white">{aulasFeitas} <span className="text-sm font-normal text-gray-500">/ {totalAulasCurso}</span></p>
                </div>
              </div>
            ) : !isCreating && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5 text-center">
                <p className="text-sm text-red-400 font-medium">Crie a sua primeira turma para começar.</p>
              </div>
            )}
          </div>

          {/* TURMAS ARQUIVADAS (Se houver e for Professor) */}
          {isProfessor && turmasArquivadas.length > 0 && (
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Archive className="w-5 h-5 text-gray-400" /> Turmas Arquivadas ({turmasArquivadas.length})
              </h3>
              <div className="space-y-3">
                {turmasArquivadas.map(t => (
                  <div key={t.id} className="flex items-center justify-between bg-black/50 border border-white/5 p-3.5 rounded-xl">
                    <span className="text-sm text-gray-300 font-medium">{t.nome}</span>
                    <button
                      onClick={() => handleExcluir(t.id, t.nome)}
                      className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Excluir Definitivamente
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Acesso Rápido */}
          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-white mb-1">Acesso Rápido</h3>
            <p className="text-sm text-gray-400 mb-6">Navegue para o conteúdo técnico para continuar.</p>
            
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

              {isProfessor || isAprovado ? (
                <Link href="/dashboard/modules" className="px-4 py-2 border border-white/20 rounded-lg text-sm text-white hover:bg-white/10 transition-colors text-center">
                  Ver Módulos
                </Link>
              ) : (
                <span className="px-4 py-2 border border-white/10 text-gray-500 rounded-lg text-sm select-none opacity-40 cursor-not-allowed flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" /> Bloqueado
                </span>
              )}
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
