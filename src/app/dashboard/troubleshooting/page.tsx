"use client";

import { useState, useMemo } from "react";
import { hvacErrorCodesData, ErrorDiagnosticItem } from "@/data/hvacErrorCodes";
import { useTurma } from "@/contexts/TurmaContext";
import ConteudoBloqueadoCard from "@/components/ConteudoBloqueadoCard";
import {
  Search,
  AlertTriangle,
  Wrench,
  CheckCircle2,
  Stethoscope,
  Activity,
  Layers,
  Sparkles,
  Maximize2,
  X,
  ChevronRight,
  ChevronLeft,
  SlidersHorizontal,
  Info
} from "lucide-react";

export default function TroubleshootingPage() {
  const { isProfessor, isConteudoLiberado } = useTurma();
  const isLiberado = isConteudoLiberado("diagnostico", "ferramenta");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string>("Todas");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("Todas");
  const [modalItem, setModalItem] = useState<ErrorDiagnosticItem | null>(null);

  // Lista de marcas únicas presentes na base
  const brands = useMemo(() => {
    const list = Array.from(new Set(hvacErrorCodesData.map((item) => item.brand)));
    return ["Todas", ...list];
  }, []);

  const severities = ["Todas", "Crítico", "Moderado", "Preventivo"];

  // Filtragem dinâmica
  const filteredCodes = useMemo(() => {
    return hvacErrorCodesData.filter((item) => {
      // Filtro por marca
      if (selectedBrand !== "Todas" && item.brand !== selectedBrand) {
        return false;
      }

      // Filtro por severidade
      if (selectedSeverity !== "Todas") {
        if (!item.severity.toLowerCase().includes(selectedSeverity.toLowerCase())) {
          return false;
        }
      }

      // Filtro por termo de pesquisa
      if (searchTerm.trim() !== "") {
        const query = searchTerm.toLowerCase();
        const matchesCode = item.errorCode.toLowerCase().includes(query);
        const matchesTitle = item.faultTitle.toLowerCase().includes(query);
        const matchesWhat = item.whatToAnalyze.toLowerCase().includes(query);
        const matchesDiag = item.diagnosticStep.toLowerCase().includes(query);
        const matchesCorrective = item.correctiveAction.toLowerCase().includes(query);
        const matchesBrand = item.brand.toLowerCase().includes(query);

        return (
          matchesCode ||
          matchesTitle ||
          matchesWhat ||
          matchesDiag ||
          matchesCorrective ||
          matchesBrand
        );
      }

      return true;
    });
  }, [searchTerm, selectedBrand, selectedSeverity]);

  // Navegação no Modal de Projeção
  const handleNextModal = () => {
    if (!modalItem || filteredCodes.length === 0) return;
    const currentIndex = filteredCodes.findIndex((i) => i.id === modalItem.id);
    const nextIndex = (currentIndex + 1) % filteredCodes.length;
    setModalItem(filteredCodes[nextIndex]);
  };

  const handlePrevModal = () => {
    if (!modalItem || filteredCodes.length === 0) return;
    const currentIndex = filteredCodes.findIndex((i) => i.id === modalItem.id);
    const prevIndex = (currentIndex - 1 + filteredCodes.length) % filteredCodes.length;
    setModalItem(filteredCodes[prevIndex]);
  };

  if (!isProfessor && !isLiberado) {
    return (
      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
        <ConteudoBloqueadoCard
          titulo="Diagnóstico e Falhas (Troubleshooting)"
          categoria="ferramenta"
          descricaoDetalhada="Central de códigos de erro, sintomas e procedimentos de reparo prático em bancada."
        />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      
      {/* Cabeçalho da Central de Diagnóstico */}
      <div className="bg-white/80 dark:bg-black/40 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-xs font-semibold text-red-600 dark:text-red-400">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Central Técnica de Campo • HVAC-R Troubleshooting</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
            Códigos de Erro e Diagnóstico Clínico
          </h1>
          <p className="text-slate-600 dark:text-gray-300 max-w-3xl text-sm leading-relaxed">
            Consulte a causa física, os testes com instrumentos de medição (multímetro, vacuômetro e manifold) e a solução definitiva para os principais fabricantes de climatização.
          </p>
        </div>

        {/* Estatísticas Rápidas */}
        <div className="flex sm:flex-col gap-3 shrink-0 self-stretch sm:self-auto justify-between sm:justify-start">
          <div className="bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-4 py-2.5 rounded-xl text-center sm:text-right">
            <span className="text-[11px] text-slate-500 dark:text-gray-400 block font-medium">Falhas Catalogadas</span>
            <span className="text-lg font-bold text-red-600 dark:text-red-400 font-mono">
              {hvacErrorCodesData.length} Diagnósticos
            </span>
          </div>
          <div className="bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-4 py-2.5 rounded-xl text-center sm:text-right">
            <span className="text-[11px] text-slate-500 dark:text-gray-400 block font-medium">Marcas Suportadas</span>
            <span className="text-xs font-semibold text-slate-700 dark:text-gray-300">
              Daikin • LG • Samsung • Gree • Midea
            </span>
          </div>
        </div>
      </div>

      {/* Painel de Busca e Filtros */}
      <div className="space-y-4">
        
        {/* Campo de Pesquisa em Tempo Real */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 dark:text-gray-400">
            <Search className="w-5 h-5" />
          </span>
          <input
            type="text"
            placeholder="Pesquisar por código (Ex: U4, CH 05, E101, E5, F0), sintoma ou componente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/80 dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600/50 focus:border-red-500 transition-all shadow-lg"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
            >
              Limpar
            </button>
          )}
        </div>

        {/* Filtros de Fabricante e Severidade */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          
          {/* Seletor de Fabricantes */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
            <span className="text-xs font-semibold text-slate-500 dark:text-gray-400 mr-1 flex items-center gap-1 shrink-0">
              <Layers className="w-3.5 h-3.5" /> Fabricante:
            </span>
            {brands.map((brand) => (
              <button
                key={brand}
                onClick={() => setSelectedBrand(brand)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer border ${
                  selectedBrand === brand
                    ? "bg-red-600 text-white border-red-600 shadow-md shadow-red-900/20"
                    : "bg-white/80 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/10"
                }`}
              >
                {brand}
              </button>
            ))}
          </div>

          {/* Seletor de Severidade */}
          <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
            <span className="text-xs font-semibold text-slate-500 dark:text-gray-400 mr-1 flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Gravidade:
            </span>
            {severities.map((sev) => (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer border ${
                  selectedSeverity === sev
                    ? "bg-slate-900 dark:bg-white text-white dark:text-black border-transparent font-bold"
                    : "bg-white/60 dark:bg-black/30 border-slate-200 dark:border-white/10 text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/10"
                }`}
              >
                {sev}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Resultados e Contagem */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-gray-400 border-b border-slate-200 dark:border-white/10 pb-3">
        <span>
          Exibindo <strong>{filteredCodes.length}</strong> {filteredCodes.length === 1 ? "código de falha" : "códigos de falha"}
        </span>
        {searchTerm && (
          <span className="italic">Filtro ativo: "{searchTerm}"</span>
        )}
      </div>

      {/* Grid de Cartões de Diagnóstico */}
      {filteredCodes.length === 0 ? (
        <div className="bg-white/80 dark:bg-black/40 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl p-12 text-center space-y-3">
          <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Nenhum código encontrado</h3>
          <p className="text-sm text-slate-600 dark:text-gray-400 max-w-md mx-auto">
            Não encontramos nenhum diagnóstico para os filtros aplicados. Tente buscar pelo sintoma (ex: "comunicação", "ventilador", "sensor", "gás") ou selecione "Todas as Marcas".
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedBrand("Todas");
              setSelectedSeverity("Todas");
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 cursor-pointer mt-2"
          >
            Redefinir Filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCodes.map((item) => {
            const isCritical = item.severity.startsWith("Crítico");
            const isModerate = item.severity.startsWith("Moderado");

            return (
              <div
                key={item.id}
                className="bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md border border-slate-200 dark:border-white/10 hover:border-red-500/40 rounded-2xl p-6 shadow-xl transition-all duration-300 flex flex-col justify-between group hover:shadow-red-950/20"
              >
                <div>
                  
                  {/* Cabeçalho do Card: Marca, Código e Gravidade */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-gray-200 border border-slate-200 dark:border-white/10 uppercase tracking-wider">
                        {item.brand}
                      </span>
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${
                          isCritical
                            ? "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
                            : isModerate
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                            : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                        }`}
                      >
                        {item.severity}
                      </span>
                    </div>

                    <button
                      onClick={() => setModalItem(item)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer transition-colors shrink-0"
                      title="Projetar em Tela Cheia"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Código de Erro e Título da Falha */}
                  <div className="mb-5">
                    <div className="inline-block px-3 py-1 rounded-lg bg-black text-red-500 font-mono text-xl md:text-2xl font-black tracking-wider border border-red-500/30 shadow-inner mb-2">
                      {item.errorCode}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                      {item.faultTitle}
                    </h3>
                  </div>

                  {/* 3 Seções Técnicas Estruturadas */}
                  <div className="space-y-3.5 text-xs">
                    
                    {/* 1. O Que Analisar */}
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200/70 dark:border-white/5 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-gray-200">
                        <Search className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                        <span>1. O Que Analisar Inicialmente:</span>
                      </div>
                      <p className="text-slate-600 dark:text-gray-300 leading-relaxed pl-5">
                        {item.whatToAnalyze}
                      </p>
                    </div>

                    {/* 2. Diagnóstico Técnico com Instrumentos */}
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200/70 dark:border-white/5 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-gray-200">
                        <Activity className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>2. Diagnóstico Prático com Instrumentos:</span>
                      </div>
                      <p className="text-slate-600 dark:text-gray-300 leading-relaxed pl-5 font-mono text-[11px]">
                        {item.diagnosticStep}
                      </p>
                    </div>

                    {/* 3. Ação Corretiva Definitiva */}
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-500/20 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-900 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>3. Ação Corretiva Recomendada:</span>
                      </div>
                      <p className="text-emerald-800 dark:text-emerald-300 leading-relaxed pl-5">
                        {item.correctiveAction}
                      </p>
                    </div>

                  </div>

                </div>

                {/* Rodapé do Card */}
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[11px] text-slate-500 dark:text-gray-400">
                  <span className="font-mono">ID: {item.id}</span>
                  <button
                    onClick={() => setModalItem(item)}
                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-semibold cursor-pointer inline-flex items-center gap-1"
                  >
                    Ver Laudo Completo
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL DE PROJEÇÃO TÉCNICA EM SALA DE AULA / BANCADA          */}
      {/* ============================================================ */}
      {modalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-3xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
            
            {/* Barra Superior do Modal */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-900">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold px-2.5 py-1 rounded bg-red-600 text-white uppercase tracking-wider">
                  {modalItem.brand}
                </span>
                <span className="text-xs font-mono text-slate-500 dark:text-gray-400">
                  {modalItem.severity}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={closeModal => setModalItem(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Conteúdo Ampliado para Projeção */}
            <div className="p-6 md:p-8 space-y-6 overflow-y-auto">
              
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="inline-block px-4 py-2 rounded-xl bg-black text-red-500 font-mono text-3xl sm:text-4xl font-black tracking-widest border border-red-500/40 shadow-xl mb-3">
                    {modalItem.errorCode}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
                    {modalItem.faultTitle}
                  </h2>
                </div>
              </div>

              <div className="space-y-4 text-sm">
                
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                    <Search className="w-4 h-4 text-sky-500" />
                    <span>1. Passo Inicial: O Que Analisar</span>
                  </div>
                  <p className="text-slate-700 dark:text-gray-300 leading-relaxed pl-6">
                    {modalItem.whatToAnalyze}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                    <Activity className="w-4 h-4 text-amber-500" />
                    <span>2. Diagnóstico Técnico de Oficina e Medições</span>
                  </div>
                  <p className="text-slate-700 dark:text-gray-300 leading-relaxed pl-6 font-mono text-xs sm:text-sm">
                    {modalItem.diagnosticStep}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/20 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-emerald-900 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>3. Ação Corretiva e Substituição de Peça</span>
                  </div>
                  <p className="text-emerald-800 dark:text-emerald-300 leading-relaxed pl-6">
                    {modalItem.correctiveAction}
                  </p>
                </div>

              </div>

            </div>

            {/* Barra Inferior com Navegação */}
            <div className="px-6 py-4 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-900 flex items-center justify-between">
              <button
                onClick={handlePrevModal}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-white/10 cursor-pointer transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </button>

              <span className="text-xs text-slate-500 dark:text-gray-400 font-mono">
                {filteredCodes.findIndex((i) => i.id === modalItem.id) + 1} de {filteredCodes.length}
              </span>

              <button
                onClick={handleNextModal}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-white/10 cursor-pointer transition-colors"
              >
                Próximo
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
