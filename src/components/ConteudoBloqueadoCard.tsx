import React from "react";
import { Lock } from "lucide-react";

interface ConteudoBloqueadoCardProps {
  titulo?: string;
  mensagem?: string;
  subtitulo?: string;
  categoria?: "aula" | "ferramenta" | "modulo" | string;
  descricaoDetalhada?: string;
  compacto?: boolean;
}

export default function ConteudoBloqueadoCard({
  titulo = "Conteúdo Bloqueado Temporariamente",
  mensagem = "Conteúdo bloqueado temporariamente pelo Instrutor. Conclua as etapas anteriores para desbloquear.",
  subtitulo = "Aguarde a liberação pedagógica pelo Instrutor na sua turma.",
  categoria,
  descricaoDetalhada,
  compacto = false,
}: ConteudoBloqueadoCardProps) {
  if (compacto) {
    return (
      <div className="flex flex-col items-center justify-center p-6 sm:p-8 bg-black/40 border border-white/10 rounded-2xl text-center my-4 animate-in fade-in duration-300">
        <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-3 text-amber-500 shadow-lg shadow-amber-500/10">
          <Lock className="w-6 h-6" />
        </div>
        <h4 className="text-lg font-bold text-white mb-1.5">{titulo}</h4>
        {descricaoDetalhada && (
          <p className="text-xs text-gray-500 mb-2 max-w-sm">{descricaoDetalhada}</p>
        )}
        <p className="text-gray-400 max-w-md text-xs sm:text-sm leading-relaxed mb-4">{mensagem}</p>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-400 font-medium">
          <span>{subtitulo}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[60vh] p-6 text-center animate-in fade-in duration-500">
      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4 text-amber-500 shadow-lg shadow-amber-500/10">
        <Lock className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">{titulo}</h2>
      {descricaoDetalhada && (
        <p className="text-sm text-gray-400 mb-3 max-w-lg">{descricaoDetalhada}</p>
      )}
      <p className="text-gray-300 max-w-md text-sm leading-relaxed mb-6 bg-amber-500/5 border border-amber-500/20 p-4 rounded-xl">
        {mensagem}
      </p>
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-400 font-medium">
        <span>{subtitulo}</span>
      </div>
    </div>
  );
}
