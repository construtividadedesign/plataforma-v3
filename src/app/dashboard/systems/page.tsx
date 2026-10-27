"use client";

import React, { useState, useMemo } from "react";
import {
  Wind,
  Search,
  SlidersHorizontal,
  Wrench,
  CheckCircle2,
  Maximize2,
  X,
  Zap,
  Building2,
  Layers,
  Sparkles,
  Info,
  ShieldCheck,
  Printer,
  ChevronRight,
  Flame,
  ArrowUpDown,
  FileText,
} from "lucide-react";
import { hvacSystemsData, HVACSystemType } from "@/data/hvacSystemsData";
import { useTurma } from "@/contexts/TurmaContext";
import ConteudoBloqueadoCard from "@/components/ConteudoBloqueadoCard";

// Imagens de alta fidelidade técnica locais (garantem 100% de disponibilidade e zero falhas de carregamento)
const SYSTEM_FALLBACK_IMAGES: Record<string, string> = {
  "sys-hiwall": "/systems/hiwall.jpg",
  "sys-multisplit": "/systems/multisplit.png",
  "sys-cassete": "/systems/cassete.jpg",
  "sys-pisoteto": "/systems/pisoteto.jpg",
  "sys-vrf": "/systems/vrf.png",
  "sys-chiller": "/systems/chiller.jpg",
  "sys-duto": "/systems/duto.jpg",
  "sys-acj": "/image_34.png",
};

const resolveSystemImage = (url: string) => {
  if (url === "image_33.png" || url === "/image_33.png") return "/image_33.png";
  if (url === "image_34.png" || url === "/image_34.png") return "/image_34.png";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/")) {
    return url;
  }
  return `/${url}`;
};

export default function SystemsPage() {
  const { isProfessor, isConteudoLiberado } = useTurma();
  const isLiberado = isConteudoLiberado("climatizacao", "ferramenta");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("Todas");
  const [selectedSystemModal, setSelectedSystemModal] = useState<HVACSystemType | null>(null);
  const [isCompareView, setIsCompareView] = useState<boolean>(false);

  // Filtros dinâmicos
  const filteredSystems = useMemo(() => {
    return hvacSystemsData.filter((sys) => {
      // Filtro de dificuldade de instalação
      if (selectedDifficulty !== "Todas" && sys.difficultyInstall !== selectedDifficulty) {
        return false;
      }

      // Filtro por termo de busca
      if (searchTerm.trim() !== "") {
        const query = searchTerm.toLowerCase();
        const matchesName = sys.name.toLowerCase().includes(query);
        const matchesApp = sys.application.toLowerCase().includes(query);
        const matchesDesc = sys.description.toLowerCase().includes(query);
        const matchesCap = sys.capacityRange.toLowerCase().includes(query);
        const matchesDetails = sys.details.some((d) => d.toLowerCase().includes(query));

        return matchesName || matchesApp || matchesDesc || matchesCap || matchesDetails;
      }

      return true;
    });
  }, [searchTerm, selectedDifficulty]);

  // Função auxiliar para cores de dificuldade
  const getDifficultyBadge = (level: "Baixa" | "Média" | "Alta" | "Especialista") => {
    switch (level) {
      case "Baixa":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "Média":
        return "bg-sky-500/10 text-sky-400 border-sky-500/30";
      case "Alta":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "Especialista":
        return "bg-red-500/20 text-red-400 border-red-500/40";
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isProfessor && !isLiberado) {
    return (
      <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-500">
        <ConteudoBloqueadoCard
          titulo="Tipos de Climatização"
          categoria="ferramenta"
          descricaoDetalhada="Catálogo técnico de sistemas Split Hi-Wall, Multi-Split, Cassete, Piso-Teto, VRF e Chiller."
        />
      </div>
    );
  }


  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-500">
      
      {/* ============================================================ */}
      {/* CABEÇALHO DA PÁGINA COM AÇÕES                                */}
      {/* ============================================================ */}
      <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 print:border-none print:shadow-none print:p-2">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-500/20 text-xs font-semibold text-red-500">
            <Wind className="w-3.5 h-3.5" />
            <span>Guia de Arquitetura Térmica & Equipamentos</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <span>Tipos de Climatização (HVAC-R)</span>
          </h1>
          <p className="text-sm text-gray-300 max-w-3xl leading-relaxed">
            Catálogo técnico com os 8 sistemas mais utilizados na refrigeração e climatização comercial,
            residencial e predial. Compare faixas de capacidade, aplicações típicas e níveis de complexidade.
          </p>
        </div>

        {/* Ações Rápidas */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto shrink-0 print:hidden">
          <button
            onClick={() => setIsCompareView(!isCompareView)}
            className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer border ${
              isCompareView
                ? "bg-red-600 text-white border-red-500 shadow-lg shadow-red-900/30"
                : "bg-white/5 hover:bg-white/10 text-gray-300 border-white/10"
            }`}
          >
            <ArrowUpDown className="w-4 h-4" />
            <span>{isCompareView ? "Ver em Cards" : "Tabela Comparativa"}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer border border-white/10 shadow"
            title="Imprimir Guia em A4"
          >
            <Printer className="w-4 h-4 text-red-500" />
            <span>Imprimir Catálogo (A4)</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* BARRA DE PESQUISA E FILTROS                                  */}
      {/* ============================================================ */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 print:hidden">
        {/* Input de Busca */}
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
            <Search className="w-5 h-5" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquise por nome, capacidade, aplicação (ex: VRF, Chiller, K7, 36.000)..."
            className="w-full bg-black/40 backdrop-blur-md border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors shadow-lg"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filtro por Complexidade */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-gray-400 hidden md:inline">Dificuldade:</span>
          <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-1.5 shadow-lg overflow-x-auto">
            {["Todas", "Baixa", "Média", "Alta", "Especialista"].map((level) => (
              <button
                key={level}
                onClick={() => setSelectedDifficulty(level)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                  selectedDifficulty === level
                    ? "bg-red-600 text-white shadow-md shadow-red-950/40"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* MODO 1: TABELA COMPARATIVA DIRETA                            */}
      {/* ============================================================ */}
      {isCompareView ? (
        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-red-500" />
              Quadro Comparativo de Sistemas Frigoríficos
            </h3>
            <span className="text-xs text-gray-400 font-mono">
              {filteredSystems.length} sistema(s) encontrado(s)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-white/10 text-white">
                  <th className="px-4 py-3 font-bold border-b border-white/10">Sistema / Equipamento</th>
                  <th className="px-4 py-3 font-bold border-b border-white/10">Faixa de Capacidade</th>
                  <th className="px-4 py-3 font-bold border-b border-white/10">Aplicação Principal</th>
                  <th className="px-4 py-3 font-bold border-b border-white/10">Instalação</th>
                  <th className="px-4 py-3 font-bold border-b border-white/10">Manutenção</th>
                  <th className="px-4 py-3 font-bold border-b border-white/10 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredSystems.map((sys) => (
                  <tr key={sys.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 font-bold text-white flex items-center gap-2">
                      <Wind className="w-4 h-4 text-red-500 shrink-0" />
                      <span>{sys.name}</span>
                    </td>
                    <td className="px-4 py-3 font-mono text-red-400 font-bold">
                      {sys.capacityRange}
                    </td>
                    <td className="px-4 py-3 text-gray-300">
                      {sys.application}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${getDifficultyBadge(sys.difficultyInstall)}`}>
                        {sys.difficultyInstall}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${getDifficultyBadge(sys.difficultyMaintenance)}`}>
                        {sys.difficultyMaintenance}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => setSelectedSystemModal(sys)}
                        className="px-3 py-1 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Ver Dossiê
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* ============================================================ */
        /* MODO 2: GRID DE CARDS COM FOTOS REAIS E DETALHES             */
        /* ============================================================ */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSystems.map((sys) => (
            <div
              key={sys.id}
              className="group bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-xl hover:border-red-500/40 transition-all duration-300 flex flex-col justify-between"
            >
              {/* IMAGEM COM BADGES */}
              <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
                <img
                  src={resolveSystemImage(sys.imageUrl)}
                  alt={sys.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = SYSTEM_FALLBACK_IMAGES[sys.id] || "/systems/hiwall.jpg";
                  }}
                />
                
                {/* Gradiente de leitura */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                {/* Badge de Capacidade */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-red-400 border border-red-500/30 shadow">
                    {sys.capacityRange}
                  </span>
                </div>

                {/* Badge de Dificuldade de Instalação */}
                <div className="absolute top-3 right-3 z-10">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg backdrop-blur-md uppercase tracking-wider border shadow ${getDifficultyBadge(sys.difficultyInstall)}`}>
                    {sys.difficultyInstall}
                  </span>
                </div>

                {/* Botão Hover de Zoom */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center p-4">
                  <button
                    onClick={() => setSelectedSystemModal(sys)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer shadow-xl transition-transform hover:scale-105"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Abrir Dossiê Técnico</span>
                  </button>
                </div>
              </div>

              {/* CONTEÚDO DO CARD */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-[11px] text-gray-400 font-semibold">
                    <Building2 className="w-3 h-3 text-red-500" />
                    <span>{sys.application}</span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-red-400 transition-colors leading-snug">
                    {sys.name}
                  </h3>

                  <p className="text-xs text-gray-300 leading-relaxed line-clamp-3">
                    {sys.description}
                  </p>
                </div>

                {/* Tópicos Técnicos Rápidos */}
                <div className="space-y-2 pt-3 border-t border-white/5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                    Pontos-Chave de Engenharia:
                  </span>
                  <ul className="space-y-1 text-xs text-gray-300">
                    {sys.details.slice(0, 2).map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 line-clamp-1">
                        <span className="text-red-500 font-bold shrink-0">•</span>
                        <span className="truncate">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Rodapé com Dificuldades e Botão */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <div className="text-[11px] text-gray-400">
                    <span>Manutenção: </span>
                    <strong className="text-white">{sys.difficultyMaintenance}</strong>
                  </div>

                  <button
                    onClick={() => setSelectedSystemModal(sys)}
                    className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>Dossiê</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ============================================================ */}
      {/* NENHUM RESULTADO ENCONTRADO                                  */}
      {/* ============================================================ */}
      {filteredSystems.length === 0 && (
        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-gray-500">
            <Search className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Nenhum sistema encontrado</h3>
            <p className="text-xs text-gray-400 mt-1">
              Tente buscar por outro termo ou remova os filtros de dificuldade selecionados.
            </p>
          </div>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedDifficulty("Todas");
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Limpar Filtros
          </button>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL DETALHADO DO SISTEMA (DOSSIÊ TÉCNICO)                  */}
      {/* ============================================================ */}
      {selectedSystemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-3xl bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
            
            {/* Barra Superior do Modal */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-zinc-900/90 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500">
                  <Wind className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                    {selectedSystemModal.name}
                  </h3>
                  <p className="text-xs text-gray-400">Dossiê de Engenharia & Boas Práticas</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedSystemModal(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Corpo do Modal Scrollável */}
            <div className="p-6 overflow-y-auto space-y-6">
              
              {/* Imagem em Destaque */}
              <div className="relative h-64 sm:h-72 w-full rounded-xl overflow-hidden border border-white/10 bg-black">
                <img
                  src={resolveSystemImage(selectedSystemModal.imageUrl)}
                  alt={selectedSystemModal.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      SYSTEM_FALLBACK_IMAGES[selectedSystemModal.id] || "/systems/hiwall.jpg";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <span className="text-sm font-mono font-bold px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-md text-red-400 border border-red-500/30 shadow">
                    Faixa: {selectedSystemModal.capacityRange}
                  </span>
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-lg backdrop-blur-md uppercase tracking-wider border shadow ${getDifficultyBadge(selectedSystemModal.difficultyInstall)}`}>
                    Instalação: {selectedSystemModal.difficultyInstall}
                  </span>
                </div>
              </div>

              {/* Informações Principais */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-1">
                  <span className="text-gray-400 block font-medium">Aplicação Típica:</span>
                  <strong className="text-sm text-white block">{selectedSystemModal.application}</strong>
                </div>

                <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-1">
                  <span className="text-gray-400 block font-medium">Nível de Manutenção:</span>
                  <strong className="text-sm text-amber-400 block">{selectedSystemModal.difficultyMaintenance}</strong>
                </div>
              </div>

              {/* Descrição Detalhada */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-red-500" />
                  Visão Geral do Funcionamento
                </h4>
                <p className="text-sm text-gray-200 leading-relaxed text-justify">
                  {selectedSystemModal.description}
                </p>
              </div>

              {/* Diretrizes de Instalação e Manutenção */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Requisitos de Campo & Procedimentos Obrigatórios
                </h4>
                <ul className="space-y-2 text-xs text-gray-300">
                  {selectedSystemModal.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 p-3 rounded-lg bg-white/5 border border-white/5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Rodapé Oficial de Autoria */}
              <div className="border-t border-white/10 pt-4 text-center">
                <p className="text-xs text-gray-400">
                  Plataforma de Climatização • Dossiê Técnico Autorizado por Prof. Cleverson Leonardo
                </p>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
