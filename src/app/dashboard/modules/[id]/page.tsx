"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, FileDown, Loader2, PlayCircle, BookOpen, AlertCircle, Clock, Printer, Sparkles, Users, Lock } from "lucide-react";
import { toast } from "sonner";
import { useTurma } from "@/contexts/TurmaContext";
import { module1MaterialsData, Lesson, LessonMaterial } from "@/data/module1Materials";
import { module1ChallengeData } from "@/data/module1Challenge";
import { module2MaterialsData, module2ChallengeData } from "@/data/module2Materials";
import { module3MaterialsData, module3ChallengeData } from "@/data/module3Materials";
import PrintableLessonModal from "@/components/PrintableLessonModal";
import PrintableChallengeModal from "@/components/PrintableChallengeModal";
import ConteudoBloqueadoCard from "@/components/ConteudoBloqueadoCard";
import DiretrizesCompetenciaCard from "@/components/DiretrizesCompetenciaCard";
import { COMPETENCIAS_MODULOS } from "@/data/competenciasData";

const modulesInfo = {
  "mod-1": { title: "Fundamentos de Climatização", description: "Conceitos de calor, temperatura, pressão, ciclo frigorífico e manuseio seguro de fluidos." },
  "mod-2": { title: "Eletricidade Aplicada a Climatização", description: "Fundamentos elétricos, uso de instrumentos de medição, testes e diagramas elétricos." },
  "mod-3": { title: "Instalação e Manutenção em Climatização", description: "Procedimentos de carga de fluido, vácuo, interligação elétrica e mecânica, e manutenção." }
};

export default function ModuleDetailsPage() {
  const params = useParams();
  const moduleId = (params?.id as string) || "mod-1";
  const currentModuleInfo = modulesInfo[moduleId as keyof typeof modulesInfo] || modulesInfo["mod-1"];

  const supabase = createClient();
  
  const { turmaAtiva, aulasConcluidas, isProfessor, alternarConclusaoAula, isConteudoLiberado } = useTurma();
  
  const [lessons, setLessons] = useState<any[]>([]);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingProgress, setIsUpdatingProgress] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false);

  // Verificação granular de permissão do módulo e das aulas
  const isModuloLiberado = isConteudoLiberado(moduleId, "modulo");

  const getLessonKey = (lesson: any) => {
    if (lesson?.id && String(lesson.id).startsWith("mod-")) return lesson.id;
    return `${moduleId}-aula-${lesson?.lesson_order}`;
  };

  const isLessonLiberada = (lesson: any) => {
    if (isProfessor) return true;
    if (!isModuloLiberado) return false;
    return isConteudoLiberado(getLessonKey(lesson), "aula");
  };

  const isCurrentLessonLiberada = activeLesson ? isLessonLiberada(activeLesson) : true;

  useEffect(() => {
    async function fetchLessons() {
      setIsLoading(true);
      const { data: lessonsData } = await supabase
        .from('lessons')
        .select('*')
        .eq('module_id', moduleId)
        .order('lesson_order', { ascending: true });

      if (lessonsData && lessonsData.length > 0) {
        setLessons(lessonsData);
        setActiveLesson(lessonsData[0]);
      }
      setIsLoading(false);
    }
    fetchLessons();
  }, [moduleId, supabase]);

  const handleToggleComplete = async () => {
    if (!activeLesson || isUpdatingProgress || !isProfessor) return;
    
    if (!turmaAtiva) {
      toast.error("Selecione ou crie uma turma no painel principal primeiro.");
      return;
    }
    
    setIsUpdatingProgress(true);
    const isCurrentlyCompleted = aulasConcluidas.includes(activeLesson.id);

    try {
      await alternarConclusaoAula(moduleId, activeLesson.id, !isCurrentlyCompleted);
      
      if (isCurrentlyCompleted) {
        toast.info("Aula marcada como pendente.");
      } else {
        toast.success("Parabéns! Aula concluída com sucesso.");
      }
    } catch (error) {
      toast.error("Erro ao atualizar o progresso.");
    } finally {
      setIsUpdatingProgress(false);
    }
  };

  const getEmbedUrl = (url: string) => {
    if (url.includes('watch?v=')) {
      const videoId = url.split('watch?v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  // Lógica Robusta de Mapeamento de Materiais
  const currentMaterial: LessonMaterial | null = (() => {
    if (!activeLesson) return null;
    
    let materialsSource: LessonMaterial[] | null = null;
    
    if (moduleId === "mod-1") materialsSource = module1MaterialsData;
    if (moduleId === "mod-2") materialsSource = module2MaterialsData;
    if (moduleId === "mod-3") materialsSource = module3MaterialsData;

    if (!materialsSource) return null;

    // Busca pela Ordem Numérica da Aula (INFALÍVEL)
    const byOrder = materialsSource.find(
      (m) => m.lessonOrder === Number(activeLesson.lesson_order)
    );
    if (byOrder) return byOrder;

    return null; // Se não achar pela ordem, não força erro
  })();

  const activeChallengeData =
    moduleId === "mod-1"
      ? module1ChallengeData
      : moduleId === "mod-2"
      ? module2ChallengeData
      : moduleId === "mod-3"
      ? module3ChallengeData
      : null;

  const isCurrentLessonCompleted = activeLesson ? aulasConcluidas.includes(activeLesson.id) : false;
  const moduleCompletedLessons = lessons.filter(l => aulasConcluidas.includes(l.id)).length;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-[60vh] text-gray-400">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-red-500" />
        <p>Carregando aulas...</p>
      </div>
    );
  }

  if (lessons.length === 0 || !activeLesson) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-[60vh] text-gray-400">
        <AlertCircle className="w-10 h-10 mb-4 text-orange-500" />
        <p>Ainda não existem aulas cadastradas neste módulo.</p>
      </div>
    );
  }

  const effectiveVideoUrl = activeLesson.video_url || currentMaterial?.videoUrl;
  const hasEffectiveVideo = Boolean(effectiveVideoUrl && effectiveVideoUrl.trim() !== "");
  const isYouTube = Boolean(effectiveVideoUrl && (effectiveVideoUrl.includes('youtube.com') || effectiveVideoUrl.includes('youtu.be')));
  const videoDisplayTitle = currentMaterial?.videoTitle || activeLesson.title;

  return (
    <div className="flex flex-col p-4 md:p-6 lg:p-8 w-full max-w-[1400px] mx-auto space-y-6 animate-in fade-in duration-700">
      
      {!turmaAtiva && (
        <div className="bg-orange-500/10 border border-orange-500/20 text-orange-400 p-4 rounded-xl flex items-center gap-3 text-sm font-medium">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>
            {isProfessor
              ? "Atenção: Não há nenhuma turma selecionada. O progresso não será salvo."
              : "Atenção: Selecione a sua turma no menu lateral para acompanhar o progresso das aulas."}
          </span>
        </div>
      )}

      <div className="mb-2">
        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-400 mb-2">
          <span>Módulos de Aulas</span>
          <span>/</span>
          <span className="text-white font-medium">{currentModuleInfo.title}</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">{currentModuleInfo.title}</h1>
            <p className="text-gray-400 mt-1 max-w-3xl text-sm md:text-base">{currentModuleInfo.description}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {activeChallengeData && (
              <button
                onClick={() => setIsChallengeModalOpen(true)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-500 text-sm font-bold rounded-lg transition-all shadow-lg shadow-amber-900/10 cursor-pointer"
              >
                <Users className="w-4 h-4" />
                Desafio das 4 Equipes
              </button>
            )}

            {turmaAtiva && (
              <div className="bg-black/40 border border-white/10 px-4 py-2 rounded-lg backdrop-blur-md self-start md:self-auto">
                <span className="text-xs text-gray-500 block">Turma atual:</span>
                <span className="text-sm font-semibold text-red-500">{turmaAtiva.nome}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Diretrizes de Competência Profissional (Matriz MSEP) */}
      {COMPETENCIAS_MODULOS[moduleId] && (
        <DiretrizesCompetenciaCard data={COMPETENCIAS_MODULOS[moduleId]} defaultExpanded={false} />
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* COLUNA ESQUERDA */}
        <div className="flex-1 space-y-6 min-w-0">
          
          <div className="relative w-full aspect-video bg-black/80 rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex flex-col items-center justify-center group">
            
            {/* Se o conteúdo estiver bloqueado para o aluno */}
            {!isProfessor && (!isModuloLiberado || !isCurrentLessonLiberada) ? (
              <div className="w-full h-full p-6 sm:p-10 flex items-center justify-center bg-black/80">
                <ConteudoBloqueadoCard
                  titulo={
                    !isModuloLiberado
                      ? currentModuleInfo.title
                      : `Aula ${activeLesson.lesson_order}: ${activeLesson.title}`
                  }
                  categoria={!isModuloLiberado ? "modulo" : "aula"}
                  compacto={false}
                />
              </div>
            ) : hasEffectiveVideo ? (
              isYouTube ? (
                <iframe
                  className="w-full h-full border-0"
                  src={getEmbedUrl(effectiveVideoUrl!)}
                  title={videoDisplayTitle}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video 
                  controls 
                  controlsList="nodownload"
                  className="w-full h-full object-cover"
                  src={effectiveVideoUrl!}
                >
                  O seu navegador não suporta a reprodução de vídeo.
                </video>
              )
            ) : currentMaterial ? (
              <div className="flex flex-col justify-between h-full w-full p-5 sm:p-8 bg-gradient-to-br from-zinc-950 via-zinc-900/95 to-red-950/20 overflow-y-auto">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Resumo Técnico de Aula • Material de Apoio Oficial</span>
                  </div>
                  <h2 className="text-lg sm:text-2xl font-bold text-white">
                    Aula {activeLesson.lesson_order}: {activeLesson.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-200 leading-relaxed bg-black/40 border-l-4 border-red-600 p-3.5 rounded-r-xl">
                    {currentMaterial.shortSummary}
                  </p>
                </div>

                <div className="my-4 space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Pontos-Chave de Estudo:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {currentMaterial.keyPoints.map((pt, index) => (
                      <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-2.5 text-xs text-gray-300 flex items-start gap-2">
                        <span className="text-red-500 font-bold">•</span>
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10">
                  <span className="text-xs text-gray-400">
                    Documento completo com diagramas técnicos, tabelas e normas pronto para impressão.
                  </span>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer shadow-lg shadow-red-900/30"
                  >
                    <Printer className="w-4 h-4" />
                    Abrir Apostila Imprimível (PDF)
                  </button>
                </div>
              </div>
            ) : activeLesson.has_video ? (
              <div className="flex flex-col items-center justify-center h-full p-4">
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 pointer-events-none" />
                <PlayCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500/70 z-20 transition-transform group-hover:scale-110 duration-300" />
                <p className="z-20 mt-4 text-white font-medium text-base sm:text-lg text-center px-4">
                  Aula {activeLesson.lesson_order}: {activeLesson.title}
                </p>
                <p className="z-20 mt-2 px-3 py-1 bg-white/10 border border-white/10 text-gray-300 text-xs rounded-full backdrop-blur-md">
                  Aguardando link do vídeo no Banco de Dados
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center text-gray-400 w-full h-full justify-center p-6 text-center">
                <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 mb-4 text-red-500/50" />
                <h3 className="text-base sm:text-lg font-medium text-white">Aula Teórica / Prática</h3>
                <p className="text-xs sm:text-sm mt-1">Utilize o material de apoio em anexo para acompanhar a leitura.</p>
              </div>
            )}
            
          </div>

          <Card className="bg-black/40 backdrop-blur-md border border-white/10 shadow-xl rounded-2xl">
            <CardContent className="p-5 sm:p-6 flex flex-col gap-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">{activeLesson.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1 flex items-center gap-2">
                    <span>Carga Horária: {activeLesson.duration}</span>
                    <span>•</span>
                    <span>Aula {activeLesson.lesson_order} de {lessons.length}</span>
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                  {!isProfessor && (!isModuloLiberado || !isCurrentLessonLiberada) ? (
                    <Button
                      variant="outline"
                      disabled
                      className="w-full sm:w-auto bg-white/5 border border-white/10 text-gray-500 cursor-not-allowed opacity-60"
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      Material Bloqueado
                    </Button>
                  ) : currentMaterial ? (
                    <Button
                      variant="outline"
                      onClick={() => setIsModalOpen(true)}
                      className="w-full sm:w-auto bg-white/5 border border-red-500/40 text-white hover:bg-red-600 hover:border-red-600 cursor-pointer transition-all"
                    >
                      <BookOpen className="w-4 h-4 mr-2 text-red-400" />
                      Apostila Técnica (PDF)
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      className="w-full sm:w-auto bg-transparent border border-white/20 text-gray-300 hover:text-white hover:bg-white/10 cursor-pointer transition-colors"
                      disabled={!activeLesson.pdf_url}
                      onClick={() => activeLesson.pdf_url && window.open(activeLesson.pdf_url, '_blank')}
                    >
                      <FileDown className="w-4 h-4 mr-2" />
                      {activeLesson.pdf_url ? "Baixar Manual" : "Sem Manual"}
                    </Button>
                  )}
                  
                  {isProfessor ? (
                    <Button 
                      onClick={handleToggleComplete}
                      disabled={isUpdatingProgress || !turmaAtiva}
                      className={`w-full sm:w-auto cursor-pointer transition-all duration-300 border-0 ${
                        !turmaAtiva 
                          ? "bg-gray-800 text-gray-500" 
                          : isCurrentLessonCompleted 
                            ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30 shadow-lg shadow-emerald-900/20" 
                            : "bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-900/30"
                      }`}
                    >
                      {isUpdatingProgress ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Salvando...</>
                      ) : isCurrentLessonCompleted ? (
                        <><CheckCircle2 className="w-4 h-4 mr-2" /> Concluída</>
                      ) : (
                        <><Circle className="w-4 h-4 mr-2" /> Marcar Conclusão</>
                      )}
                    </Button>
                  ) : !isCurrentLessonLiberada ? (
                    <div className="inline-flex items-center justify-center px-4 py-2 rounded-md text-xs sm:text-sm font-medium border bg-amber-500/10 text-amber-400 border-amber-500/30">
                      <Lock className="w-4 h-4 mr-2" /> Bloqueada pelo Instrutor
                    </div>
                  ) : (
                    <div
                      className={`inline-flex items-center justify-center px-4 py-2 rounded-md text-xs sm:text-sm font-medium border select-none ${
                        isCurrentLessonCompleted
                          ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                          : "bg-white/5 text-gray-400 border-white/10"
                      }`}
                    >
                      {isCurrentLessonCompleted ? (
                        <><CheckCircle2 className="w-4 h-4 mr-2 text-emerald-400" /> Aula Ministrada</>
                      ) : (
                        <><Clock className="w-4 h-4 mr-2 text-gray-400" /> Aguardando Instrutor</>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Informações detalhadas da aula apenas se liberada para o aluno ou se for professor */}
              {(isProfessor || isCurrentLessonLiberada) && currentMaterial && (
                <div className="border-t border-white/10 pt-4 space-y-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-red-400 mb-1">
                      Conceito Técnico Fundamental:
                    </p>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {currentMaterial.shortSummary}
                    </p>
                  </div>

                  {currentMaterial.videoTitle && (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-gray-300">
                      <div className="flex items-center gap-1.5 text-red-400 font-semibold mb-1">
                        <PlayCircle className="w-3.5 h-3.5" />
                        <span>Vídeo Técnico Recomendado:</span>
                      </div>
                      <p className="text-white font-medium text-xs sm:text-sm">
                        {currentMaterial.videoTitle}
                      </p>
                      {currentMaterial.videoDescription && (
                        <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                          {currentMaterial.videoDescription}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* COLUNA DIREITA */}
        <div className="w-full lg:w-[380px] shrink-0">
          <Card className="bg-black/40 backdrop-blur-md border border-white/10 shadow-xl h-full flex flex-col rounded-2xl">
            <CardHeader className="pb-4 border-b border-white/5">
              <CardTitle className="text-lg text-white">Conteúdo do Módulo</CardTitle>
              <CardDescription className="text-gray-400">
                {moduleCompletedLessons} de {lessons.length} aulas concluídas
              </CardDescription>
              <div className="w-full bg-black/50 border border-white/5 rounded-full h-2 mt-3 overflow-hidden">
                <div 
                  className="bg-emerald-500 h-2 transition-all duration-500 rounded-full" 
                  style={{ width: `${(moduleCompletedLessons / lessons.length) * 100}%` }}
                />
              </div>
            </CardHeader>
            
            <CardContent className="p-0 flex-1 overflow-y-auto max-h-[420px] lg:max-h-[500px]">
              <div className="flex flex-col divide-y divide-white/5">
                {lessons.map((lesson) => {
                  const isActive = activeLesson?.id === lesson.id;
                  const isCompleted = aulasConcluidas.includes(lesson.id);
                  const isLiberada = isLessonLiberada(lesson);
                  
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => setActiveLesson(lesson)}
                      className={`
                        w-full text-left p-4 flex items-start gap-3 transition-all cursor-pointer
                        ${isActive 
                          ? 'bg-red-500/10 border-l-4 border-l-red-500' 
                          : 'hover:bg-white/5 border-l-4 border-l-transparent'}
                        ${!isProfessor && !isLiberada ? 'opacity-70' : ''}
                      `}
                    >
                      <div className="mt-0.5 shrink-0">
                        {!isProfessor && !isLiberada ? (
                          <Lock className="w-5 h-5 text-amber-500" />
                        ) : isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        ) : isActive ? (
                          <PlayCircle className="w-5 h-5 text-red-500 animate-pulse" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-600" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`text-sm font-medium leading-snug ${isActive ? 'text-white font-semibold' : 'text-gray-400'}`}>
                            {lesson.lesson_order}. {lesson.title}
                          </p>
                          {!isProfessor && !isLiberada && (
                            <span className="shrink-0 text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              Bloqueada
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                          <span>{lesson.has_video ? '📺 Vídeo' : '📄 Leitura'}</span>
                          <span>•</span>
                          <span>{lesson.duration}</span>
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

      </div>

      {/* Modais */}
      {isModalOpen && currentMaterial && (
        <PrintableLessonModal
          material={currentMaterial}
          moduleTitle={currentModuleInfo.title}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {isChallengeModalOpen && activeChallengeData && (
        <PrintableChallengeModal
          isOpen={isChallengeModalOpen}
          challengeData={activeChallengeData}
          onClose={() => setIsChallengeModalOpen(false)}
        />
      )}
    </div>
  );
}
