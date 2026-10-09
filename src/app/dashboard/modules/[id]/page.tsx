"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, FileDown, Loader2, PlayCircle, BookOpen, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useTurma } from "@/contexts/TurmaContext";

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
  
  // Usamos o nosso Cérebro para gerir o progresso
  const { turmaAtiva, aulasConcluidas, alternarConclusaoAula } = useTurma();
  
  const [lessons, setLessons] = useState<any[]>([]);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingProgress, setIsUpdatingProgress] = useState(false);

  useEffect(() => {
    async function fetchLessons() {
      setIsLoading(true);
      // Vamos buscar apenas as aulas (o progresso já vem do TurmaContext)
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
    if (!activeLesson || isUpdatingProgress) return;
    
    if (!turmaAtiva) {
      toast.error("Selecione ou crie uma turma no painel principal primeiro.");
      return;
    }
    
    setIsUpdatingProgress(true);
    const isCurrentlyCompleted = aulasConcluidas.includes(activeLesson.id);

    try {
      // Chama a função mágica do nosso contexto
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

  const isCurrentLessonCompleted = activeLesson ? aulasConcluidas.includes(activeLesson.id) : false;
  
  // Conta apenas as aulas deste módulo específico que estão concluídas
  const moduleCompletedLessons = lessons.filter(l => aulasConcluidas.includes(l.id)).length;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-[60vh] text-gray-400">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-red-500" />
        <p>A carregar aulas...</p>
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

  const isYouTube = activeLesson.video_url && (activeLesson.video_url.includes('youtube.com') || activeLesson.video_url.includes('youtu.be'));

  return (
    <div className="flex flex-col p-4 md:p-6 lg:p-8 w-full max-w-[1400px] mx-auto space-y-6 animate-in fade-in duration-700">
      
      {/* Aviso de Turma (Aparece se não houver turma selecionada) */}
      {!turmaAtiva && (
        <div className="bg-orange-500/10 border border-orange-500/20 text-orange-400 p-4 rounded-xl flex items-center gap-3 text-sm font-medium">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>Atenção: Não tem nenhuma turma selecionada. O seu progresso não será guardado.</span>
        </div>
      )}

      <div className="mb-2">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
          <span>Módulos de Aulas</span>
          <span>/</span>
          <span className="text-white font-medium">{currentModuleInfo.title}</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">{currentModuleInfo.title}</h1>
            <p className="text-gray-400 mt-1 max-w-3xl">{currentModuleInfo.description}</p>
          </div>
          {turmaAtiva && (
            <div className="bg-black/40 border border-white/10 px-4 py-2 rounded-lg backdrop-blur-md shrink-0">
              <span className="text-xs text-gray-500 block">Turma atual:</span>
              <span className="text-sm font-semibold text-red-500">{turmaAtiva.nome}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* COLUNA ESQUERDA: Reprodutor e Detalhes */}
        <div className="flex-1 space-y-6">
          
          <div className="relative w-full aspect-video bg-black/80 rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex flex-col items-center justify-center group">
            
            {activeLesson.has_video ? (
              activeLesson.video_url ? (
                isYouTube ? (
                  <iframe
                    className="w-full h-full border-0"
                    src={getEmbedUrl(activeLesson.video_url)}
                    title={activeLesson.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video 
                    controls 
                    controlsList="nodownload"
                    className="w-full h-full object-cover"
                    src={activeLesson.video_url}
                  >
                    O seu navegador não suporta a reprodução de vídeo.
                  </video>
                )
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 pointer-events-none" />
                  <PlayCircle className="w-16 h-16 text-red-500/70 z-20 transition-transform group-hover:scale-110 duration-300" />
                  <p className="z-20 mt-4 text-white font-medium text-lg text-center px-4">
                    Aula {activeLesson.lesson_order}: {activeLesson.title}
                  </p>
                  <p className="z-20 mt-2 px-3 py-1 bg-white/10 border border-white/10 text-gray-300 text-xs rounded-full backdrop-blur-md">
                    A aguardar link do vídeo na Base de Dados
                  </p>
                </div>
              )
            ) : (
              <div className="flex flex-col items-center text-gray-400 w-full h-full justify-center p-6 text-center">
                <BookOpen className="w-16 h-16 mb-4 text-red-500/50" />
                <h3 className="text-lg font-medium text-white">Aula Teórica / Prática</h3>
                <p className="text-sm mt-1">Utilize o material de apoio em anexo para acompanhar a leitura.</p>
              </div>
            )}
            
          </div>

          <Card className="bg-black/40 backdrop-blur-md border border-white/10 shadow-xl rounded-2xl">
            <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white">{activeLesson.title}</h3>
                <p className="text-sm text-gray-400 mt-1 flex items-center gap-2">
                  <span>Carga Horária: {activeLesson.duration}</span>
                  <span>•</span>
                  <span>Aula {activeLesson.lesson_order} de {lessons.length}</span>
                </p>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Button 
                  variant="outline" 
                  className="bg-transparent border border-white/20 text-gray-300 hover:text-white hover:bg-white/10 cursor-pointer transition-colors"
                  disabled={!activeLesson.pdf_url}
                  onClick={() => activeLesson.pdf_url && window.open(activeLesson.pdf_url, '_blank')}
                >
                  <FileDown className="w-4 h-4 mr-2" />
                  {activeLesson.pdf_url ? "Baixar Manual" : "Sem Manual"}
                </Button>
                
                <Button 
                  onClick={handleToggleComplete}
                  disabled={isUpdatingProgress || !turmaAtiva}
                  className={`cursor-pointer transition-all duration-300 border-0 ${
                    !turmaAtiva 
                      ? "bg-gray-800 text-gray-500" 
                      : isCurrentLessonCompleted 
                        ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30 shadow-lg shadow-emerald-900/20" 
                        : "bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-900/30"
                  }`}
                >
                  {isUpdatingProgress ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> A guardar...</>
                  ) : isCurrentLessonCompleted ? (
                    <><CheckCircle2 className="w-4 h-4 mr-2" /> Concluída</>
                  ) : (
                    <><Circle className="w-4 h-4 mr-2" /> Marcar Conclusão</>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* COLUNA DIREITA: Playlist */}
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
            
            <CardContent className="p-0 flex-1 overflow-y-auto max-h-[500px]">
              <div className="flex flex-col divide-y divide-white/5">
                {lessons.map((lesson) => {
                  const isActive = activeLesson?.id === lesson.id;
                  const isCompleted = aulasConcluidas.includes(lesson.id);
                  
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => setActiveLesson(lesson)}
                      className={`
                        w-full text-left p-4 flex items-start gap-3 transition-all cursor-pointer
                        ${isActive 
                          ? 'bg-red-500/10 border-l-4 border-l-red-500' 
                          : 'hover:bg-white/5 border-l-4 border-l-transparent'}
                      `}
                    >
                      <div className="mt-0.5 shrink-0">
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        ) : isActive ? (
                          <PlayCircle className="w-5 h-5 text-red-500 animate-pulse" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-600" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium leading-snug ${isActive ? 'text-white font-semibold' : 'text-gray-400'}`}>
                          {lesson.lesson_order}. {lesson.title}
                        </p>
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
    </div>
  );
}