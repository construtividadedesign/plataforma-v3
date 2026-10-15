"use client";

import { useState } from "react";
import { useTurma } from "@/contexts/TurmaContext";
import { hvacComponentsData } from "@/data/hvacComponents";
import { Search, Lock, Unlock, Cpu, Wrench } from "lucide-react";
import { toast } from "sonner";

export default function ComponentsPage() {
  const { turmaAtiva, isProfessor } = useTurma();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Estado local para o professor liberar ou bloquear o conteúdo para a turma
  const [isLiberadoTurma, setIsLiberadoTurma] = useState(true);

  const handleToggleLiberacao = () => {
    setIsLiberadoTurma(!isLiberadoTurma);
    if (!isLiberadoTurma) {
      toast.success("Guia de Componentes liberado para a turma!");
    } else {
      toast.info("Guia de Componentes ocultado da turma.");
    }
  };

  // Filtragem dos componentes por nome ou descrição
  const filteredCategories = hvacComponentsData.map(cat => {
    const filteredItems = cat.items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
    return { ...cat, items: filteredItems };
  }).filter(cat => cat.items.length > 0);

  // Se for aluno e o professor tiver bloqueado/ocultado a visualização
  if (!isProfessor && !isLiberadoTurma) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-[70vh] p-6 text-center animate-in fade-in duration-700">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4 text-red-500">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Conteúdo em Breve</h2>
        <p className="text-gray-400 max-w-md text-sm leading-relaxed">
          O Guia Técnico de Componentes ainda não foi liberado pelo Instrutor para esta turma. Aguarde a liberação em aula.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      
      {/* Cabeçalho e Controlo do Professor */}
      <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300 mb-3">
            <Cpu className="w-3.5 h-3.5 text-red-500" />
            <span>Material Técnico Oficial • Split Hi-Wall Inverter</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Guia de Componentes do Sistema</h2>
          <p className="text-gray-300 max-w-3xl text-sm leading-relaxed">
            Consulte a lista completa de peças, desde compressores inverter e válvulas EEV até placas eletrónicas, sensores NTC e tubulações.
          </p>
        </div>

        {/* Controlo exclusivo do Professor para Liberar/Bloquear */}
        {isProfessor && (
          <div className="flex flex-col items-end gap-2 shrink-0 w-full md:w-auto">
            <span className="text-xs text-gray-400">Controlo do Instrutor:</span>
            <button
              onClick={handleToggleLiberacao}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border w-full md:w-auto ${
                isLiberadoTurma 
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30" 
                  : "bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30"
              }`}
            >
              {isLiberadoTurma ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              {isLiberadoTurma ? "Liberado para a Turma" : "Bloqueado (Oculto)"}
            </button>
          </div>
        )}
      </div>

      {/* Barra de Pesquisa */}
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
          <Search className="w-5 h-5" />
        </span>
        <input
          type="text"
          placeholder="Pesquisar por peça (Ex: Compressor, NTC, EEV, Serpentina...)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-black/50 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600/50 focus:border-red-500 transition-all shadow-lg"
        />
      </div>

      {/* Listagem por Categorias */}
      <div className="space-y-8">
        {filteredCategories.map((category, idx) => (
          <div key={idx} className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl">
            <div className="border-b border-white/5 pb-4 mb-6">
              <h3 className="text-xl font-bold text-white">{category.categoryName}</h3>
              <p className="text-sm text-gray-400 mt-1">{category.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.items.map((item) => (
                <div key={item.id} className="bg-white/5 border border-white/5 rounded-xl p-4 hover:border-red-500/30 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                        #{item.id}
                      </span>
                      <span className="text-[11px] text-gray-500 uppercase tracking-wider">{item.category}</span>
                    </div>
                    <h4 className="text-white font-semibold text-sm mb-1">{item.name}</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}