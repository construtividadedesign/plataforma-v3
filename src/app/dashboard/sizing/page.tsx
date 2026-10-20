"use client";

import React, { useState, useMemo } from "react";
import {
  Calculator,
  ThermometerSnowflake,
  Sun,
  Users,
  Tv,
  Lightbulb,
  DoorOpen,
  Printer,
  ShieldCheck,
  Zap,
  ArrowRight,
  Sparkles,
  Info,
  CheckCircle2,
  Maximize2,
  Building2,
  HeartPulse,
  Landmark,
  Compass,
  Layers,
  Wrench,
  HelpCircle,
  RotateCcw,
} from "lucide-react";
import {
  hvacSizingFactors,
  commercialSplitModels,
  hvacSizingCaseStudies,
  SizingCaseStudy,
} from "@/data/hvacSizingData";
import PrintableSizingModal, { SizingReportData } from "@/components/PrintableSizingModal";

export default function SizingPage() {
  // Estado das Abas Principais
  const [activeTab, setActiveTab] = useState<"calc" | "theory" | "cases" | "tables">("calc");

  // Estado dos Casos de Estudo
  const [selectedCaseId, setSelectedCaseId] = useState<string>("caso-1-residencia");

  // ==========================================================================
  // ESTADOS DA CALCULADORA INTERATIVA DE BANCADA
  // ==========================================================================
  const [projectName, setProjectName] = useState<string>("Sala Comercial 101");
  const [clientOrLocation, setClientOrLocation] = useState<string>("Edifício Metropolitan");
  const [roomType, setRoomType] = useState<string>("Comercial / Escritório");
  const [areaM2, setAreaM2] = useState<number>(25);
  const [ceilingHeightM, setCeilingHeightM] = useState<number>(2.8);
  const [solarExposure, setSolarExposure] = useState<"sombra" | "sol_tarde" | "laje_exposta">("sol_tarde");
  const [occupants, setOccupants] = useState<number>(3);
  const [activityType, setActivityType] = useState<"repouso" | "comercial">("repouso");
  const [glassAreaM2, setGlassAreaM2] = useState<number>(3);
  const [glassProtection, setGlassProtection] = useState<"com_cortina" | "sem_protecao">("com_cortina");
  const [computersCount, setComputersCount] = useState<number>(2);
  const [lightingWatts, setLightingWatts] = useState<number>(100);
  const [highFlowDoor, setHighFlowDoor] = useState<boolean>(false);
  const [safetyMarginPercent, setSafetyMarginPercent] = useState<number>(10);

  // Estado do Modal de Impressão A4
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [printModalMode, setPrintModalMode] = useState<"calc" | "case">("calc");

  // ==========================================================================
  // PRESETS RÁPIDOS DA CALCULADORA
  // ==========================================================================
  const applyPreset = (preset: "quarto" | "sala" | "escritorio" | "loja") => {
    switch (preset) {
      case "quarto":
        setProjectName("Suíte Residencial");
        setRoomType("Quarto de Casal");
        setAreaM2(14);
        setCeilingHeightM(2.7);
        setSolarExposure("sombra");
        setOccupants(2);
        setActivityType("repouso");
        setGlassAreaM2(2);
        setGlassProtection("com_cortina");
        setComputersCount(1);
        setLightingWatts(40);
        setHighFlowDoor(false);
        setSafetyMarginPercent(10);
        break;
      case "sala":
        setProjectName("Sala de Estar e Jantar");
        setRoomType("Sala Integrada");
        setAreaM2(32);
        setCeilingHeightM(2.8);
        setSolarExposure("sol_tarde");
        setOccupants(4);
        setActivityType("repouso");
        setGlassAreaM2(5);
        setGlassProtection("com_cortina");
        setComputersCount(1);
        setLightingWatts(120);
        setHighFlowDoor(false);
        setSafetyMarginPercent(10);
        break;
      case "escritorio":
        setProjectName("Escritório de Engenharia");
        setRoomType("Escritório / Sala de Reunião");
        setAreaM2(40);
        setCeilingHeightM(2.8);
        setSolarExposure("sol_tarde");
        setOccupants(6);
        setActivityType("repouso");
        setGlassAreaM2(6);
        setGlassProtection("com_cortina");
        setComputersCount(6);
        setLightingWatts(180);
        setHighFlowDoor(false);
        setSafetyMarginPercent(10);
        break;
      case "loja":
        setProjectName("Loja de Varejo / Vitrine");
        setRoomType("Comércio de Rua");
        setAreaM2(55);
        setCeilingHeightM(3.2);
        setSolarExposure("sol_tarde");
        setOccupants(10);
        setActivityType("comercial");
        setGlassAreaM2(15);
        setGlassProtection("sem_protecao");
        setComputersCount(2);
        setLightingWatts(600);
        setHighFlowDoor(true);
        setSafetyMarginPercent(15);
        break;
    }
  };

  // ==========================================================================
  // CÁLCULO DINÂMICO EM TEMPO REAL
  // ==========================================================================
  const calculation = useMemo(() => {
    // 1. Fator de área base
    let baseFactor = 600;
    if (solarExposure === "sol_tarde") baseFactor = 800;
    if (solarExposure === "laje_exposta") baseFactor = 900;
    const baseAreaBtu = Math.round(areaM2 * baseFactor);

    // 2. Ocupantes adicionais (acima da 1ª pessoa que já está na área base)
    const extraOccupants = Math.max(0, occupants - 1);
    const occupantFactor = activityType === "comercial" ? 900 : 600;
    const occupantsBtu = extraOccupants * occupantFactor;

    // 3. Vidros e Janelas
    const glassFactor = glassProtection === "sem_protecao" ? 600 : 250;
    const glassBtu = Math.round(glassAreaM2 * glassFactor);

    // 4. Equipamentos eletrônicos
    const equipmentBtu = computersCount * 700;

    // 5. Iluminação (3.41 BTU/h por Watt)
    const lightingBtu = Math.round(lightingWatts * 3.412);

    // Subtotal de condução e fontes internas
    const subtotalDirect = baseAreaBtu + occupantsBtu + glassBtu + equipmentBtu + lightingBtu;

    // 6. Infiltração por porta aberta
    const infiltrationBtu = highFlowDoor ? Math.round(subtotalDirect * 0.15) : 0;

    const subtotalBtu = subtotalDirect + infiltrationBtu;

    // 7. Margem de segurança de engenharia
    const marginBtu = Math.round(subtotalBtu * (safetyMarginPercent / 100));
    const finalBtu = subtotalBtu + marginBtu;

    // Conversões
    const finalTr = finalBtu / 12000;
    const finalKw = finalBtu / 3412.14;
    const finalKcal = finalBtu * 0.252;
    const volumeM3 = Math.round(areaM2 * ceilingHeightM * 10) / 10;

    // Seleção comercial recomendada
    let recommendedModel = commercialSplitModels[0];
    for (const model of commercialSplitModels) {
      if (model.btu >= finalBtu) {
        recommendedModel = model;
        break;
      }
      recommendedModel = model;
    }

    let recommendedDescription = `${recommendedModel.btu.toLocaleString("pt-BR")} BTU/h (${recommendedModel.tr} TR)`;
    let recommendedType = "Split Hi-Wall Inverter";

    if (finalBtu > 60000) {
      const unitsCount = Math.ceil(finalBtu / 36000);
      const unitCapacity = Math.round(finalBtu / unitsCount / 6000) * 6000;
      recommendedDescription = `${unitsCount}x Splits de ${unitCapacity.toLocaleString("pt-BR")} BTU/h`;
      recommendedType = "Sistema Piso-Teto, Cassete 4 Vias ou Split Duto";
    } else if (finalBtu > 30000) {
      recommendedType = "Split Piso-Teto ou Cassete 4 Vias Inverter";
    }

    return {
      volumeM3,
      baseAreaBtu,
      occupantsBtu,
      glassBtu,
      equipmentBtu,
      lightingBtu,
      infiltrationBtu,
      subtotalBtu,
      marginBtu,
      finalBtu,
      finalTr,
      finalKw,
      finalKcal,
      recommendedModel,
      recommendedDescription,
      recommendedType,
    };
  }, [
    areaM2,
    ceilingHeightM,
    solarExposure,
    occupants,
    activityType,
    glassAreaM2,
    glassProtection,
    computersCount,
    lightingWatts,
    highFlowDoor,
    safetyMarginPercent,
  ]);

  // Dados para o Relatório A4 da Calculadora
  const reportData: SizingReportData = {
    projectName,
    clientOrLocation,
    roomType,
    areaM2,
    ceilingHeightM,
    volumeM3: calculation.volumeM3,
    occupants,
    solarExposure:
      solarExposure === "sombra"
        ? "Sombra / Sol da Manhã (600 BTU/m²)"
        : solarExposure === "sol_tarde"
        ? "Sol da Tarde Poente (800 BTU/m²)"
        : "Laje Plena Exposta (900 BTU/m²)",
    glassAreaM2,
    glassProtection: glassProtection === "com_cortina" ? "Com Cortina / Persiana" : "Vidro Transparente Sem Proteção",
    computersCount,
    lightingWatts,
    highFlowDoor,
    breakdown: {
      baseAreaBtu: calculation.baseAreaBtu,
      occupantsBtu: calculation.occupantsBtu,
      glassBtu: calculation.glassBtu,
      equipmentBtu: calculation.equipmentBtu,
      lightingBtu: calculation.lightingBtu,
      infiltrationBtu: calculation.infiltrationBtu,
      subtotalBtu: calculation.subtotalBtu,
      marginPercent: safetyMarginPercent,
      marginBtu: calculation.marginBtu,
      finalBtu: calculation.finalBtu,
      finalTr: calculation.finalTr,
      finalKw: calculation.finalKw,
    },
    recommendedMachine: {
      capacityBtu: calculation.recommendedDescription,
      modelType: calculation.recommendedType,
      breaker: calculation.recommendedModel.recommendedBreaker,
      copperPiping: calculation.recommendedModel.copperPiping,
    },
    technicalNotes: [
      "Dimensionamento baseado na metodologia de ganhos de calor por condução, radiação solar e cargas internas.",
      "Para ambientes com isolamento inadequado ou telhados de fibrocimento, recomenda-se a aplicação prévia de manta térmica reflexiva.",
      "A tecnologia Inverter é recomendada para manter a estabilidade térmica sem picos de corrente e com economia de até 60% de energia.",
      "Garantir vácuo em nível inferior a 500 Microns antes da liberação do fluido refrigerante (R-32 ou R-410A).",
    ],
  };

  // Caso selecionado atual
  const activeCaseStudy = useMemo(() => {
    return (
      hvacSizingCaseStudies.find((c) => c.id === selectedCaseId) ||
      hvacSizingCaseStudies[0]
    );
  }, [selectedCaseId]);

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-500">
      
      {/* ============================================================ */}
      {/* CABEÇALHO DA PÁGINA COM AÇÕES                                */}
      {/* ============================================================ */}
      <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-500/20 text-xs font-semibold text-red-500">
            <ThermometerSnowflake className="w-3.5 h-3.5" />
            <span>Engenharia Térmica & Dimensionamento HVAC-R</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <span>Cálculo de Carga Térmica & BTUs</span>
          </h1>
          <p className="text-sm text-gray-300 max-w-3xl leading-relaxed">
            Ferramenta profissional para levantamento de cargas térmicas (condução, radiação, pessoas e equipamentos),
            seleção de aparelhos Split e 4 estudos de caso aprofundados para avaliação técnica.
          </p>
        </div>

        {/* Botão de Impressão A4 no Topo */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto shrink-0">
          <button
            onClick={() => {
              setPrintModalMode("calc");
              setIsPrintModalOpen(true);
            }}
            className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold shadow-lg shadow-red-900/30 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Memorial de Cálculo (A4)</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SELETOR DE ABAS PRINCIPAIS                                   */}
      {/* ============================================================ */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("calc")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer shrink-0 ${
            activeTab === "calc"
              ? "bg-red-600 text-white shadow-md shadow-red-900/20"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>Calculadora Interativa de Bancada</span>
        </button>

        <button
          onClick={() => setActiveTab("theory")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer shrink-0 ${
            activeTab === "theory"
              ? "bg-red-600 text-white shadow-md shadow-red-900/20"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Fundamentos & Teoria de Campo</span>
        </button>

        <button
          onClick={() => setActiveTab("cases")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer shrink-0 ${
            activeTab === "cases"
              ? "bg-red-600 text-white shadow-md shadow-red-900/20"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Estudos de Caso de Avaliação (4 Projetos)</span>
        </button>

        <button
          onClick={() => setActiveTab("tables")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer shrink-0 ${
            activeTab === "tables"
              ? "bg-red-600 text-white shadow-md shadow-red-900/20"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Tabelas Normativas de Referência</span>
        </button>
      </div>

      {/* ============================================================ */}
      {/* ABA 1: CALCULADORA INTERATIVA DE BANCADA                     */}
      {/* ============================================================ */}
      {activeTab === "calc" && (
        <div className="space-y-6">
          
          {/* BARRA DE PRESETS RÁPIDOS */}
          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-300">
              <Sparkles className="w-4 h-4 text-red-500" />
              <span>Configurações Rápidas de Campo (Presets):</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => applyPreset("quarto")}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-gray-300 hover:text-white transition-colors cursor-pointer"
              >
                Quarto Residencial (14m²)
              </button>
              <button
                onClick={() => applyPreset("sala")}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-gray-300 hover:text-white transition-colors cursor-pointer"
              >
                Sala Integrada (32m²)
              </button>
              <button
                onClick={() => applyPreset("escritorio")}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-gray-300 hover:text-white transition-colors cursor-pointer"
              >
                Escritório Corporativo (40m²)
              </button>
              <button
                onClick={() => applyPreset("loja")}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-gray-300 hover:text-white transition-colors cursor-pointer"
              >
                Loja de Varejo (55m²)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
            
            {/* COLUNA ESQUERDA: PARÂMETROS E INPUTS DA CALCULADORA (7 Colunas) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* CARTÃO 1: DADOS DO AMBIENTE E GEOMETRIA */}
              <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl space-y-5">
                <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
                  <Maximize2 className="w-4 h-4 text-red-500" />
                  1. Dimensões Físicas e Geometria do Recinto
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-300 block mb-1">
                      Identificação do Projeto / Ambiente:
                    </label>
                    <input
                      type="text"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      placeholder="Ex: Sala de Reunião"
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-300 block mb-1">
                      Tipo de Ocupação:
                    </label>
                    <input
                      type="text"
                      value={roomType}
                      onChange={(e) => setRoomType(e.target.value)}
                      placeholder="Ex: Consultório, Residência"
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-medium text-gray-300">
                        Área Útil do Piso:
                      </label>
                      <span className="text-xs font-bold text-red-400 font-mono">
                        {areaM2} m²
                      </span>
                    </div>
                    <input
                      type="range"
                      min={6}
                      max={150}
                      step={1}
                      value={areaM2}
                      onChange={(e) => setAreaM2(Number(e.target.value))}
                      className="w-full accent-red-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-gray-500 mt-0.5">
                      <span>6 m²</span>
                      <span>50 m²</span>
                      <span>100 m²</span>
                      <span>150 m²</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-medium text-gray-300">
                        Pé-Direito (Altura):
                      </label>
                      <span className="text-xs font-bold text-red-400 font-mono">
                        {ceilingHeightM} m ({calculation.volumeM3} m³)
                      </span>
                    </div>
                    <input
                      type="range"
                      min={2.4}
                      max={6.0}
                      step={0.1}
                      value={ceilingHeightM}
                      onChange={(e) => setCeilingHeightM(Number(e.target.value))}
                      className="w-full accent-red-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-gray-500 mt-0.5">
                      <span>2,4m</span>
                      <span>3,5m</span>
                      <span>6,0m</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARTÃO 2: ORIENTAÇÃO SOLAR E ENVOLTÓRIA */}
              <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl space-y-5">
                <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
                  <Sun className="w-4 h-4 text-amber-500" />
                  2. Exposição Solar e Características Construtivas
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setSolarExposure("sombra")}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      solarExposure === "sombra"
                        ? "bg-red-600/20 border-red-500 text-white shadow-md shadow-red-950/40"
                        : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                    }`}
                  >
                    <span className="text-xs font-bold block mb-1">Sombra / Sol da Manhã</span>
                    <span className="text-[11px] text-gray-400 block leading-tight">
                      Fachada Leste/Sul ou sob outra laje habitada (600 BTU/m²).
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSolarExposure("sol_tarde")}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      solarExposure === "sol_tarde"
                        ? "bg-red-600/20 border-red-500 text-white shadow-md shadow-red-950/40"
                        : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                    }`}
                  >
                    <span className="text-xs font-bold block mb-1">Sol da Tarde (Poente)</span>
                    <span className="text-[11px] text-gray-400 block leading-tight">
                      Fachada Oeste com sol vespertino direto (800 BTU/m²).
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSolarExposure("laje_exposta")}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      solarExposure === "laje_exposta"
                        ? "bg-red-600/20 border-red-500 text-white shadow-md shadow-red-950/40"
                        : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                    }`}
                  >
                    <span className="text-xs font-bold block mb-1">Laje / Cobertura Exposta</span>
                    <span className="text-[11px] text-gray-400 block leading-tight">
                      Sol pleno no telhado ou laje sem isolamento (900 BTU/m²).
                    </span>
                  </button>
                </div>

                {/* Vidros e Janelas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="text-xs font-medium text-gray-300 block mb-1">
                      Área Total de Vidros / Janelas expostas ao sol:
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={0}
                        max={50}
                        value={glassAreaM2}
                        onChange={(e) => setGlassAreaM2(Math.max(0, Number(e.target.value)))}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-red-500 font-mono"
                      />
                      <span className="text-xs text-gray-400 shrink-0">m² de vidro</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-300 block mb-1">
                      Proteção Solar do Vidro:
                    </label>
                    <select
                      value={glassProtection}
                      onChange={(e) => setGlassProtection(e.target.value as any)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 cursor-pointer"
                    >
                      <option value="com_cortina">Com Cortina / Persiana / Película (250 BTU/m²)</option>
                      <option value="sem_protecao">Vidro Transparente Sem Proteção (600 BTU/m²)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* CARTÃO 3: CARGAS INTERNAS (PESSOAS, EQUIPAMENTOS, ILUMINAÇÃO) */}
              <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl space-y-5">
                <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
                  <Users className="w-4 h-4 text-sky-400" />
                  3. Ocupação, Eletrônicos e Cargas Internas
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-300 block mb-1">
                      Número Total de Ocupantes no Recinto:
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        max={200}
                        value={occupants}
                        onChange={(e) => setOccupants(Math.max(1, Number(e.target.value)))}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-red-500 font-mono"
                      />
                      <span className="text-xs text-gray-400 shrink-0">pessoas</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-300 block mb-1">
                      Nível de Atividade Humana:
                    </label>
                    <select
                      value={activityType}
                      onChange={(e) => setActivityType(e.target.value as any)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 cursor-pointer"
                    >
                      <option value="repouso">Repouso / Escritório / Sentados (600 BTU/p)</option>
                      <option value="comercial">Comércio / Movimento / Atividade Moderada (900 BTU/p)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="text-xs font-medium text-gray-300 block mb-1">
                      Computadores Desktop / Servidores:
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={0}
                        max={50}
                        value={computersCount}
                        onChange={(e) => setComputersCount(Math.max(0, Number(e.target.value)))}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-red-500 font-mono"
                      />
                      <span className="text-xs text-gray-400 shrink-0">máquinas (~700 BTU/cada)</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-300 block mb-1">
                      Potência Total de Iluminação (Watts):
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={0}
                        max={5000}
                        step={20}
                        value={lightingWatts}
                        onChange={(e) => setLightingWatts(Math.max(0, Number(e.target.value)))}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-red-500 font-mono"
                      />
                      <span className="text-xs text-gray-400 shrink-0">Watts (× 3,41 BTU/h/W)</span>
                    </div>
                  </div>
                </div>

                {/* Infiltração e Portas */}
                <div className="pt-2 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="doorToggle"
                      checked={highFlowDoor}
                      onChange={(e) => setHighFlowDoor(e.target.checked)}
                      className="w-4 h-4 accent-red-600 rounded cursor-pointer"
                    />
                    <label htmlFor="doorToggle" className="text-xs font-medium text-gray-200 cursor-pointer">
                      Porta de rua ou comércio aberta com alto fluxo de pedestres (+15% de infiltração térmica)
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">Margem Técnica:</span>
                    <select
                      value={safetyMarginPercent}
                      onChange={(e) => setSafetyMarginPercent(Number(e.target.value))}
                      className="bg-black/50 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-red-500 cursor-pointer"
                    >
                      <option value={10}>+10% (Padrão de Conforto)</option>
                      <option value={15}>+15% (Hospitalar / Crítico)</option>
                      <option value={20}>+20% (Alta Dissipação)</option>
                    </select>
                  </div>
                </div>
              </div>

            </div>

            {/* COLUNA DIREITA: RESULTADOS DINÂMICOS E DIAGNÓSTICO (5 Colunas) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* CARD DE RESULTADO CONSOLIDADO */}
              <div className="bg-gradient-to-br from-red-950/40 via-black/50 to-black/60 border-2 border-red-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                  <ThermometerSnowflake className="w-36 h-36 text-red-500" />
                </div>

                <div className="relative z-10 space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/20 text-red-400 text-xs font-bold uppercase tracking-wider">
                    <Zap className="w-3.5 h-3.5 text-red-500" />
                    <span>Carga Térmica Total de Projeto</span>
                  </div>

                  <div>
                    <span className="text-xs text-gray-400 block mb-0.5">Potência Frigorífica Necessária:</span>
                    <div className="text-4xl sm:text-5xl font-black text-white tracking-tight flex items-baseline gap-2">
                      <span className="text-red-500">{calculation.finalBtu.toLocaleString("pt-BR")}</span>
                      <span className="text-lg font-bold text-gray-300">BTU/h</span>
                    </div>
                  </div>

                  {/* Equivalências Técnicas */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center">
                    <div className="bg-white/5 p-2 rounded-xl">
                      <span className="text-[10px] text-gray-400 block">Capacidade (TR)</span>
                      <strong className="text-sm font-bold text-white font-mono">
                        {calculation.finalTr.toFixed(2)} TR
                      </strong>
                    </div>
                    <div className="bg-white/5 p-2 rounded-xl">
                      <span className="text-[10px] text-gray-400 block">Potência (kW térmico)</span>
                      <strong className="text-sm font-bold text-white font-mono">
                        {calculation.finalKw.toFixed(2)} kW
                      </strong>
                    </div>
                    <div className="bg-white/5 p-2 rounded-xl">
                      <span className="text-[10px] text-gray-400 block">Frigorias (kcal/h)</span>
                      <strong className="text-sm font-bold text-white font-mono">
                        {Math.round(calculation.finalKcal).toLocaleString("pt-BR")}
                      </strong>
                    </div>
                  </div>

                  {/* Recomendação Comercial */}
                  <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-2 mt-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-white">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Modelo Comercial Recomendado:</span>
                    </div>
                    <p className="text-base font-black text-emerald-400">
                      {calculation.recommendedDescription}
                    </p>
                    <p className="text-xs text-gray-300">
                      {calculation.recommendedType}
                    </p>
                  </div>

                  {/* Botão de Laudo / Modal A4 */}
                  <button
                    onClick={() => {
                      setPrintModalMode("calc");
                      setIsPrintModalOpen(true);
                    }}
                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-red-900/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Gerar Laudo / Memorial A4 deste Cálculo</span>
                  </button>
                </div>
              </div>

              {/* CARD DE DECOMPOSIÇÃO DAS PARCELAS DE CARGA */}
              <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
                  <Layers className="w-4 h-4 text-red-500" />
                  Decomposição das Parcelas Térmicas
                </h3>

                <div className="space-y-3 text-xs">
                  {/* Condução de Área */}
                  <div>
                    <div className="flex justify-between text-gray-300 mb-1">
                      <span>Área & Envoltória ({areaM2} m²):</span>
                      <span className="font-mono font-bold text-white">
                        {calculation.baseAreaBtu.toLocaleString("pt-BR")} BTU/h ({Math.round((calculation.baseAreaBtu / calculation.finalBtu) * 100)}%)
                      </span>
                    </div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-red-500 h-full rounded-full"
                        style={{ width: `${Math.min(100, (calculation.baseAreaBtu / calculation.finalBtu) * 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Pessoas */}
                  <div>
                    <div className="flex justify-between text-gray-300 mb-1">
                      <span>Carga Metabólica ({occupants} pessoas):</span>
                      <span className="font-mono font-bold text-white">
                        {calculation.occupantsBtu.toLocaleString("pt-BR")} BTU/h ({Math.round((calculation.occupantsBtu / calculation.finalBtu) * 100)}%)
                      </span>
                    </div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-sky-400 h-full rounded-full"
                        style={{ width: `${Math.min(100, (calculation.occupantsBtu / calculation.finalBtu) * 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Vidros */}
                  <div>
                    <div className="flex justify-between text-gray-300 mb-1">
                      <span>Radiação por Vidros ({glassAreaM2} m²):</span>
                      <span className="font-mono font-bold text-white">
                        {calculation.glassBtu.toLocaleString("pt-BR")} BTU/h ({Math.round((calculation.glassBtu / calculation.finalBtu) * 100)}%)
                      </span>
                    </div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-400 h-full rounded-full"
                        style={{ width: `${Math.min(100, (calculation.glassBtu / calculation.finalBtu) * 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Equipamentos & Iluminação */}
                  <div>
                    <div className="flex justify-between text-gray-300 mb-1">
                      <span>Computadores & Iluminação:</span>
                      <span className="font-mono font-bold text-white">
                        {(calculation.equipmentBtu + calculation.lightingBtu).toLocaleString("pt-BR")} BTU/h ({Math.round(((calculation.equipmentBtu + calculation.lightingBtu) / calculation.finalBtu) * 100)}%)
                      </span>
                    </div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-purple-400 h-full rounded-full"
                        style={{ width: `${Math.min(100, ((calculation.equipmentBtu + calculation.lightingBtu) / calculation.finalBtu) * 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Infiltração */}
                  {calculation.infiltrationBtu > 0 && (
                    <div>
                      <div className="flex justify-between text-gray-300 mb-1">
                        <span>Infiltração de Porta Aberta:</span>
                        <span className="font-mono font-bold text-white">
                          {calculation.infiltrationBtu.toLocaleString("pt-BR")} BTU/h ({Math.round((calculation.infiltrationBtu / calculation.finalBtu) * 100)}%)
                        </span>
                      </div>
                      <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-rose-500 h-full rounded-full"
                          style={{ width: `${Math.min(100, (calculation.infiltrationBtu / calculation.finalBtu) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Margem de Segurança */}
                  <div>
                    <div className="flex justify-between text-gray-300 mb-1">
                      <span>Margem Técnica (+{safetyMarginPercent}%):</span>
                      <span className="font-mono font-bold text-emerald-400">
                        +{calculation.marginBtu.toLocaleString("pt-BR")} BTU/h
                      </span>
                    </div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full"
                        style={{ width: `${safetyMarginPercent}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD DE ESPECIFICAÇÃO DE INSTALAÇÃO */}
              <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl space-y-3 text-xs">
                <h3 className="font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
                  <Wrench className="w-4 h-4 text-red-500" />
                  Diretrizes de Instalação e Infraestrutura
                </h3>
                <div className="space-y-2 text-gray-300">
                  <p>
                    <strong className="text-white">Disjuntor Recomendado: </strong>
                    {calculation.recommendedModel.recommendedBreaker}
                  </p>
                  <p>
                    <strong className="text-white">Bitola de Tubos de Cobre: </strong>
                    {calculation.recommendedModel.copperPiping}
                  </p>
                  <p>
                    <strong className="text-white">Procedimento de Vácuo: </strong>
                    Evacuar com bomba de duplo estágio e vacuômetro digital até atingir menos de 500 Microns estáveis por 15 min.
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* ABA 2: FUNDAMENTOS & TEORIA DE CAMPO                         */}
      {/* ============================================================ */}
      {activeTab === "theory" && (
        <div className="space-y-6">
          
          {/* O QUE É BTU E EQUIVALÊNCIAS */}
          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl space-y-6">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  O Conceito Termodinâmico de BTU (*British Thermal Unit*)
                </h2>
                <p className="text-xs text-gray-400">
                  A definição física que rege toda a engenharia de refrigeração e climatização mundial
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-300 leading-relaxed">
              <div className="space-y-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ThermometerSnowflake className="w-4 h-4 text-red-500" />
                  Definição Física Rigorosa
                </h3>
                <p className="text-justify">
                  O <strong>BTU (British Thermal Unit)</strong> é uma unidade de energia térmica definida originalmente no sistema britânico. 
                  Representa a <strong>quantidade exata de calor necessária para elevar a temperatura de 1 libra (0,453 kg) de água líquida em 1 grau Fahrenheit (1 °F)</strong>, 
                  à pressão atmosférica constante ao nível do mar (1 atm), especificamente no intervalo de 39 °F para 40 °F (onde a água atinge sua densidade máxima).
                </p>
                <p className="text-justify">
                  No contexto de ar-condicionado, a unidade comercial utilizada é o <strong>BTU/h (BTU por hora)</strong>, que é uma taxa de potência térmica (fluxo de calor que o equipamento é capaz de extrair do recinto por unidade de tempo).
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  Quadro de Equivalências Termodinâmicas Fundamentais
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                    <span className="text-gray-400 block mb-0.5">1 BTU/h em Watts:</span>
                    <strong className="text-sm text-white font-mono">≈ 0,293071 W</strong>
                  </div>
                  <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                    <span className="text-gray-400 block mb-0.5">1 Watt em BTU/h:</span>
                    <strong className="text-sm text-white font-mono">≈ 3,41214 BTU/h</strong>
                  </div>
                  <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                    <span className="text-gray-400 block mb-0.5">1 TR (Ton. Refrigeração):</span>
                    <strong className="text-sm text-red-400 font-mono">12.000 BTU/h</strong>
                  </div>
                  <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                    <span className="text-gray-400 block mb-0.5">1 TR em Potência Térmica:</span>
                    <strong className="text-sm text-emerald-400 font-mono">≈ 3.516,85 W (3,52 kW)</strong>
                  </div>
                </div>
                <p className="text-xs text-gray-400 italic">
                  *Nota Histórica: 1 TR (Tonelada de Refrigeração) é a taxa térmica necessária para fundir 1 tonelada americana (2.000 lb) de gelo puro a 0 °C em 24 horas contínuas.
                </p>
              </div>
            </div>
          </div>

          {/* DIAGRAMA VISUAL DE COMO O CALOR ENTRA NO AMBIENTE */}
          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sun className="w-5 h-5 text-amber-500" />
              Mecanismos Físicos de Penetração de Calor no Ambiente
            </h3>

            {/* SVG Didático Ilustrativo de Engenharia */}
            <div className="border border-white/10 rounded-2xl p-4 bg-slate-950 overflow-hidden">
              <svg viewBox="0 0 800 360" className="w-full h-auto max-h-96 mx-auto">
                <defs>
                  <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0f172a" />
                    <stop offset="100%" stopColor="#1e293b" />
                  </linearGradient>
                  <linearGradient id="sunGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#f97316" />
                  </linearGradient>
                  <linearGradient id="coolGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0284c7" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#0369a1" stopOpacity="0.4" />
                  </linearGradient>
                </defs>

                {/* Céu de Fundo */}
                <rect x="0" y="0" width="800" height="360" fill="url(#skyGrad)" rx="12" />

                {/* Sol no Canto Superior Direito */}
                <circle cx="710" cy="70" r="45" fill="url(#sunGrad)" />
                <circle cx="710" cy="70" r="55" fill="none" stroke="#fbbf24" strokeWidth="2" strokeDasharray="6,4" opacity="0.6" />
                <text x="710" y="75" textAnchor="middle" fill="#78350f" fontSize="13" fontWeight="bold">SOL (34°C)</text>

                {/* Raios Solares Radiação */}
                <line x1="660" y1="90" x2="520" y2="170" stroke="#f97316" strokeWidth="3" strokeDasharray="5,3" />
                <polygon points="520,170 528,162 534,174" fill="#f97316" />
                <text x="590" y="125" fill="#f97316" fontSize="11" fontWeight="bold" transform="rotate(-30 590 125)">
                  1. Radiação Solar Direta (Vidro)
                </text>

                {/* Estrutura da Edificação (Corte Esquemático) */}
                {/* Telhado / Laje */}
                <polygon points="200,80 500,80 530,120 170,120" fill="#334155" stroke="#64748b" strokeWidth="2" />
                <text x="350" y="105" textAnchor="middle" fill="#e2e8f0" fontSize="12" fontWeight="bold">
                  2. Condução Térmica pela Laje / Telhado (Q = U · A · ΔT)
                </text>

                {/* Paredes e Piso */}
                <rect x="200" y="120" width="300" height="190" fill="url(#coolGrad)" stroke="#64748b" strokeWidth="2" />
                <rect x="180" y="310" width="340" height="20" fill="#1e293b" stroke="#475569" strokeWidth="2" />

                {/* Janela Envidraçada */}
                <rect x="475" y="150" width="25" height="80" fill="#38bdf8" fillOpacity="0.4" stroke="#0ea5e9" strokeWidth="2" />
                <text x="487" y="195" textAnchor="middle" fill="#bae6fd" fontSize="10" transform="rotate(90 487 195)">VIDRO</text>

                {/* Porta Aberta Infiltração */}
                <rect x="200" y="220" width="10" height="90" fill="#ef4444" fillOpacity="0.6" stroke="#dc2626" strokeWidth="2" />
                <path d="M 140 265 L 195 265" stroke="#ef4444" strokeWidth="3" />
                <polygon points="195,265 185,260 185,270" fill="#ef4444" />
                <text x="110" y="255" fill="#f87171" fontSize="10" fontWeight="bold">3. Infiltração de Ar</text>
                <text x="110" y="275" fill="#cbd5e1" fontSize="9">Porta aberta (Calor externo)</text>

                {/* Fontes Internas no Ambiente Climatizado */}
                {/* Pessoa */}
                <circle cx="280" cy="245" r="12" fill="#f87171" />
                <rect x="272" y="258" width="16" height="30" rx="3" fill="#f87171" />
                <text x="280" y="302" textAnchor="middle" fill="#fca5a5" fontSize="9" fontWeight="bold">Ocupante</text>
                <text x="280" y="225" textAnchor="middle" fill="#f87171" fontSize="9">~600 BTU/h</text>

                {/* Computador / Eletrônico */}
                <rect x="330" y="260" width="30" height="22" rx="3" fill="#a855f7" />
                <rect x="342" y="282" width="6" height="10" fill="#a855f7" />
                <text x="345" y="302" textAnchor="middle" fill="#d8b4fe" fontSize="9" fontWeight="bold">Eletrônicos</text>
                <text x="345" y="250" textAnchor="middle" fill="#c084fc" fontSize="9">~700 BTU/h</text>

                {/* Lâmpada */}
                <circle cx="410" cy="140" r="8" fill="#facc15" />
                <text x="410" y="160" textAnchor="middle" fill="#fde047" fontSize="9">Iluminação</text>

                {/* Evaporador do Ar-Condicionado */}
                <rect x="220" y="130" width="70" height="22" rx="4" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
                <text x="255" y="145" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">SPLIT (22°C)</text>
                
                {/* Jato de Ar Frio */}
                <path d="M 235 152 Q 255 175 290 185" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4,2" />
                <path d="M 255 152 Q 275 185 320 200" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4,2" />
                <text x="300" y="175" fill="#38bdf8" fontSize="10" fontWeight="bold">Extração Contínua de Calor</text>

                {/* Rodapé Interno */}
                <text x="350" y="340" textAnchor="middle" fill="#94a3b8" fontSize="11">
                  Balanço Térmico: Capacidade do Split (BTU/h) ≥ Soma de Todas as Cargas Entrantes + Fator de Segurança (+10%)
                </text>
              </svg>
            </div>

            {/* Explicação dos 4 Fatores Termodinâmicos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-1.5">
                <span className="font-bold text-red-400 block">1. Condução (Envoltória)</span>
                <p className="text-gray-300 leading-relaxed">
                  Calor transmitido por contato molecular através de paredes, telhados, janelas e pisos. Depende da área ($A$), do coeficiente global de transmissão ($U$) e da diferença de temperatura ($\Delta T$).
                </p>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-1.5">
                <span className="font-bold text-amber-400 block">2. Radiação Solar (Vidros)</span>
                <p className="text-gray-300 leading-relaxed">
                  Ondas eletromagnéticas do sol atravessam o vidro transparente e são absorvidas pelos móveis e piso, convertendo-se em calor sensível retido (efeito estufa).
                </p>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-1.5">
                <span className="font-bold text-sky-400 block">3. Calor Humano (Metabolismo)</span>
                <p className="text-gray-300 leading-relaxed">
                  O corpo humano emite calor sensível (por convecção e radiação da pele) e calor latente (vaporização do suor e respiração). Quanto mais ativo o ocupante, maior o calor emitido.
                </p>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-1.5">
                <span className="font-bold text-emerald-400 block">4. Efeito Joule (Equipamentos)</span>
                <p className="text-gray-300 leading-relaxed">
                  Toda a potência elétrica consumida por computadores, iluminação e eletrodomésticos é integralmente convertida em calor sensível liberado dentro do ambiente fechado.
                </p>
              </div>
            </div>
          </div>

          {/* CALOR SENSÍVEL VS CALOR LATENTE */}
          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ThermometerSnowflake className="w-4 h-4 text-sky-400" />
              Diferença Crítica: Calor Sensível vs. Calor Latente no Brasil
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-300 leading-relaxed">
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-2">
                <strong className="text-white text-sm block">Calor Sensível ($Q_s$):</strong>
                <p>
                  É o calor que provoca a <strong>variação da temperatura de bulbo seco (TBS)</strong> sem alteração no estado físico da matéria. 
                  É medido diretamente pelo termômetro comum. Provém das paredes quentes, do sol, do ar exterior aquecido e de motores elétricos.
                </p>
              </div>
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-2">
                <strong className="text-white text-sm block">Calor Latente ($Q_l$):</strong>
                <p>
                  É o calor absorvido ou liberado durante a <strong>mudança de fase da água (umidade do ar)</strong>, sem alteração na temperatura. 
                  No clima tropical brasileiro, a desumidificação (condensação do vapor de água na serpentina fria) representa até 35% do esforço do ar-condicionado.
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ============================================================ */}
      {/* ABA 3: ESTUDOS DE CASO DE AVALIAÇÃO PRÁTICA (4 CASOS)        */}
      {/* ============================================================ */}
      {activeTab === "cases" && (
        <div className="space-y-6">
          
          {/* SELETOR DOS 4 CASOS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {hvacSizingCaseStudies.map((cs) => {
              const isSelected = cs.id === selectedCaseId;
              return (
                <button
                  key={cs.id}
                  onClick={() => setSelectedCaseId(cs.id)}
                  className={`p-5 rounded-2xl border text-left transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "bg-red-600/15 border-red-500 shadow-xl shadow-red-950/40 ring-1 ring-red-500"
                      : "bg-black/40 border-white/10 hover:bg-white/5 hover:border-white/20"
                  }`}
                >
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 text-gray-300">
                        Caso #{cs.caseNumber}
                      </span>
                      <span className="text-xs font-semibold text-red-400">{cs.buildingType}</span>
                    </div>
                    <h3 className="text-sm font-bold text-white line-clamp-2 leading-tight">
                      {cs.title}
                    </h3>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-gray-400 block">Carga Final:</span>
                      <strong className="text-xs font-black text-white font-mono">
                        {cs.finalBtu.toLocaleString("pt-BR")} BTU
                      </strong>
                    </div>
                    <span className="text-xs font-bold text-red-500 font-mono">
                      {cs.finalTr.toFixed(2)} TR
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* DETALHAMENTO DO CASO SELECIONADO */}
          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl space-y-6">
            
            {/* CABEÇALHO DO CASO */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 text-red-400 text-xs font-bold uppercase mb-2">
                  <span>Avaliação Técnica de Campo • Caso #{activeCaseStudy.caseNumber}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {activeCaseStudy.title}
                </h2>
                <p className="text-sm text-gray-400 mt-1 italic">
                  {activeCaseStudy.subtitle}
                </p>
              </div>

              {/* Botão para Imprimir Laudo deste Caso */}
              <button
                onClick={() => {
                  setPrintModalMode("case");
                  setIsPrintModalOpen(true);
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-red-500" />
                <span>Imprimir Laudo deste Caso (A4)</span>
              </button>
            </div>

            {/* CONTEXTO ARQUITETÔNICO */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-red-500" />
                Contexto Arquitetônico e Descrição da Obra
              </h4>
              <p className="text-sm text-gray-200 leading-relaxed text-justify">
                {activeCaseStudy.architecturalContext}
              </p>
            </div>

            {/* VARIÁVEIS E DIMENSÕES DE CARGA */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-red-500" />
                Variáveis e Parâmetros Térmicos de Entrada
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                  <span className="text-gray-400 block mb-0.5">Área Útil & Volume:</span>
                  <strong className="text-white text-sm">{activeCaseStudy.dimensionsAndVariables.areaM2} m² ({activeCaseStudy.dimensionsAndVariables.volumeM3} m³)</strong>
                </div>
                <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                  <span className="text-gray-400 block mb-0.5">Pé-Direito:</span>
                  <strong className="text-white text-sm">{activeCaseStudy.dimensionsAndVariables.ceilingHeightM} metros</strong>
                </div>
                <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                  <span className="text-gray-400 block mb-0.5">Orientação Solar:</span>
                  <strong className="text-white text-sm">{activeCaseStudy.dimensionsAndVariables.solarOrientation}</strong>
                </div>
                <div className="p-3 bg-white/5 border border-white/10 rounded-xl sm:col-span-2 lg:col-span-1">
                  <span className="text-gray-400 block mb-0.5">Ocupação Humana:</span>
                  <strong className="text-white text-sm">{activeCaseStudy.dimensionsAndVariables.occupancy}</strong>
                </div>
                <div className="p-3 bg-white/5 border border-white/10 rounded-xl sm:col-span-2">
                  <span className="text-gray-400 block mb-0.5">Renovação de Ar e Infiltração:</span>
                  <strong className="text-white text-sm">{activeCaseStudy.dimensionsAndVariables.ventilationAndInfiltration}</strong>
                </div>
              </div>
            </div>

            {/* MEMORIAL DE CÁLCULO PASSO A PASSO */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5 text-red-500" />
                Memorial de Cálculo Passo a Passo (Metodologia de Engenharia)
              </h4>
              
              <div className="overflow-x-auto border border-white/10 rounded-xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-white/10 text-white">
                      <th className="px-3.5 py-3 font-bold border-b border-white/10">Etapa</th>
                      <th className="px-3.5 py-3 font-bold border-b border-white/10">Descrição do Ganho de Calor</th>
                      <th className="px-3.5 py-3 font-bold border-b border-white/10">Fórmula de Cálculo</th>
                      <th className="px-3.5 py-3 font-bold border-b border-white/10 text-right">Potência (BTU/h)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {activeCaseStudy.calculationSteps.map((step) => (
                      <tr key={step.stepNumber} className="hover:bg-white/5 transition-colors">
                        <td className="px-3.5 py-3 font-bold text-red-400">
                          #{step.stepNumber}
                        </td>
                        <td className="px-3.5 py-3">
                          <strong className="text-white block">{step.stepTitle}</strong>
                          <span className="text-gray-400 text-[11px]">{step.detail}</span>
                        </td>
                        <td className="px-3.5 py-3 font-mono text-[11px] text-gray-300">
                          {step.formula}
                        </td>
                        <td className="px-3.5 py-3 text-right font-mono font-bold text-white text-sm">
                          {step.partialBtu.toLocaleString("pt-BR")}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-white/5">
                      <td colSpan={3} className="px-3.5 py-2.5 text-right font-bold text-gray-300">
                        Subtotal de Carga Térmica Líquida:
                      </td>
                      <td className="px-3.5 py-2.5 text-right font-mono font-bold text-white text-sm">
                        {activeCaseStudy.subtotalBtu.toLocaleString("pt-BR")} BTU/h
                      </td>
                    </tr>
                    <tr className="bg-white/5">
                      <td colSpan={3} className="px-3.5 py-2.5 text-right font-semibold text-gray-400">
                        Margem de Segurança Operacional (+{activeCaseStudy.safetyMarginPercent}%):
                      </td>
                      <td className="px-3.5 py-2.5 text-right font-mono font-bold text-amber-400 text-sm">
                        +{activeCaseStudy.safetyMarginBtu.toLocaleString("pt-BR")} BTU/h
                      </td>
                    </tr>
                    <tr className="bg-red-600/20 border-t-2 border-red-500">
                      <td colSpan={3} className="px-3.5 py-3 text-right font-black text-white text-sm">
                        RESULTADO FINAL CONSOLIDADO DE PROJETO:
                      </td>
                      <td className="px-3.5 py-3 text-right font-mono font-black text-red-400 text-base">
                        {activeCaseStudy.finalBtu.toLocaleString("pt-BR")} BTU/h
                        <span className="block text-xs font-bold text-white">
                          ({activeCaseStudy.finalTr.toFixed(2)} TR)
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* ESPECIFICAÇÃO DE EQUIPAMENTOS E INFRAESTRUTURA */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Especificação Recomendada do Sistema Frigorífico
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-gray-400 block mb-0.5">Tipo de Sistema:</span>
                  <strong className="text-white text-sm">{activeCaseStudy.equipmentRecommendation.systemType}</strong>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">Unidades Selecionadas:</span>
                  <strong className="text-white text-sm">{activeCaseStudy.equipmentRecommendation.units}</strong>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">Elétrica e Tubulações:</span>
                  <p className="text-gray-300">{activeCaseStudy.equipmentRecommendation.pipingAndElectrical}</p>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">Distribuição de Ar e Filtragem:</span>
                  <p className="text-gray-300">{activeCaseStudy.equipmentRecommendation.airflowAndFiltration}</p>
                </div>
              </div>
            </div>

            {/* NOTAS DE ENGENHARIA E NORMAS TÉCNICAS */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-amber-400" />
                Recomendações e Boas Práticas Normativas (NBR / ANVISA)
              </h4>
              <ul className="space-y-2 text-xs text-gray-300">
                {activeCaseStudy.engineeringNotes.map((note, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">•</span>
                    <span className="leading-relaxed">{note}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* ABA 4: TABELAS NORMATIVAS DE REFERÊNCIA                      */}
      {/* ============================================================ */}
      {activeTab === "tables" && (
        <div className="space-y-6">
          
          {/* TABELA DE FATORES TÉRMICOS */}
          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-red-500" />
              Tabela de Fatores de Acréscimo Térmico por Fonte de Calor
            </h3>
            <p className="text-xs text-gray-400">
              Valores médios recomendados para dimensionamento empírico de instalações de climatização no Brasil.
            </p>

            <div className="overflow-x-auto border border-white/10 rounded-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-white/10 text-white">
                    <th className="px-4 py-3 font-bold border-b border-white/10">Categoria</th>
                    <th className="px-4 py-3 font-bold border-b border-white/10">Fonte / Fator</th>
                    <th className="px-4 py-3 font-bold border-b border-white/10">Valor Base</th>
                    <th className="px-4 py-3 font-bold border-b border-white/10">Impacto</th>
                    <th className="px-4 py-3 font-bold border-b border-white/10">Descrição Técnica</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {hvacSizingFactors.map((factor, idx) => (
                    <tr key={idx} className="hover:bg-white/5 transition-colors">
                      <td className="px-4 py-2.5 font-medium text-gray-400">{factor.category}</td>
                      <td className="px-4 py-2.5 font-bold text-white">{factor.factorName}</td>
                      <td className="px-4 py-2.5 font-mono font-bold text-red-400">
                        {factor.baseValue} {factor.unit}
                      </td>
                      <td className="px-4 py-2.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            factor.impactLevel === "Crítico"
                              ? "bg-red-500/20 text-red-400 border border-red-500/30"
                              : factor.impactLevel === "Alto"
                              ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                              : "bg-sky-500/20 text-sky-400 border border-sky-500/30"
                          }`}
                        >
                          {factor.impactLevel}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-gray-300 text-[11px]">{factor.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* TABELA DE MODELOS COMERCIAIS */}
          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-400" />
              Modelos Comerciais de Split, Tubulações e Disjuntores
            </h3>
            <p className="text-xs text-gray-400">
              Guia rápido para compatibilização mecânica e elétrica na compra de máquinas de refrigeração.
            </p>

            <div className="overflow-x-auto border border-white/10 rounded-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-white/10 text-white">
                    <th className="px-4 py-3 font-bold border-b border-white/10">Capacidade Comercial</th>
                    <th className="px-4 py-3 font-bold border-b border-white/10">TR</th>
                    <th className="px-4 py-3 font-bold border-b border-white/10">Área Sugerida</th>
                    <th className="px-4 py-3 font-bold border-b border-white/10">Tubulação Cobre (Líq. / Sucção)</th>
                    <th className="px-4 py-3 font-bold border-b border-white/10">Disjuntor Recomendado</th>
                    <th className="px-4 py-3 font-bold border-b border-white/10">Aplicação Ideal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {commercialSplitModels.map((m) => (
                    <tr key={m.btu} className="hover:bg-white/5 transition-colors">
                      <td className="px-4 py-2.5 font-bold text-white font-mono text-sm">
                        {m.btu.toLocaleString("pt-BR")} BTU/h
                      </td>
                      <td className="px-4 py-2.5 font-mono text-red-400 font-bold">{m.tr} TR</td>
                      <td className="px-4 py-2.5 text-gray-300">
                        {m.recommendedAreaMin} a {m.recommendedAreaMax} m²
                      </td>
                      <td className="px-4 py-2.5 font-mono text-gray-300">{m.copperPiping}</td>
                      <td className="px-4 py-2.5 text-amber-300 font-medium">{m.recommendedBreaker}</td>
                      <td className="px-4 py-2.5 text-gray-400 text-[11px]">{m.idealApplication}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL DE IMPRESSÃO A4 (MEMORIAL DE CÁLCULO / CASO PRÁTICO)   */}
      {/* ============================================================ */}
      <PrintableSizingModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        reportData={printModalMode === "calc" ? reportData : null}
        caseStudy={printModalMode === "case" ? activeCaseStudy : null}
      />

    </div>
  );
}
