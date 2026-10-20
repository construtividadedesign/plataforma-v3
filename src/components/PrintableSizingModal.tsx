"use client";

import React from "react";
import { X, Printer, Calculator, ShieldCheck, ThermometerSnowflake, Zap, Users, Sun, Wrench } from "lucide-react";
import { SizingCaseStudy } from "@/data/hvacSizingData";

export interface SizingReportData {
  projectName: string;
  clientOrLocation: string;
  roomType: string;
  areaM2: number;
  ceilingHeightM: number;
  volumeM3: number;
  occupants: number;
  solarExposure: string;
  glassAreaM2: number;
  glassProtection: string;
  computersCount: number;
  lightingWatts: number;
  highFlowDoor: boolean;
  breakdown: {
    baseAreaBtu: number;
    occupantsBtu: number;
    glassBtu: number;
    equipmentBtu: number;
    lightingBtu: number;
    infiltrationBtu: number;
    subtotalBtu: number;
    marginPercent: number;
    marginBtu: number;
    finalBtu: number;
    finalTr: number;
    finalKw: number;
  };
  recommendedMachine: {
    capacityBtu: string;
    modelType: string;
    breaker: string;
    copperPiping: string;
  };
  technicalNotes: string[];
}

interface PrintableSizingModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportData?: SizingReportData | null;
  caseStudy?: SizingCaseStudy | null;
}

export default function PrintableSizingModal({
  isOpen,
  onClose,
  reportData,
  caseStudy,
}: PrintableSizingModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm print:p-0 print:bg-white print:static print:inset-auto">
      {/* Container Principal do Modal / Folha A4 */}
      <div className="relative w-full max-w-4xl max-h-[95vh] bg-white text-slate-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 print:border-none print:shadow-none print:max-h-none print:w-full print:rounded-none">
        
        {/* BARRA SUPERIOR DE AÇÕES (Oculta na impressão) */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800 print:hidden shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white">
                Memorial Técnico de Cálculo e Carga Térmica
              </h2>
              <p className="text-xs text-slate-400">
                Laudo para exportação em PDF ou impressão em folha A4
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-md transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Salvar PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CORPO DO DOCUMENTO A4 SCROLLÁVEL */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 print:p-8 print:overflow-visible font-sans leading-normal">
          
          {/* CABEÇALHO OFICIAL DO LAUDO */}
          <div className="border-b-2 border-red-600 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-xs font-bold uppercase tracking-wider mb-1.5">
                <ThermometerSnowflake className="w-3.5 h-3.5 text-red-600" />
                <span>Laudo Técnico de Climatização HVAC-R</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                MEMORIAL DE CÁLCULO E DIMENSIONAMENTO TÉRMICO
              </h1>
              <p className="text-xs text-slate-600 mt-0.5">
                Plataforma de Engenharia e Capacitação em Climatização • Módulo de Carga Térmica
              </p>
            </div>
            <div className="text-left sm:text-right shrink-0">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Data de Emissão
              </span>
              <span className="text-sm font-bold text-slate-800">{currentDate}</span>
              <span className="text-xs text-slate-500 block mt-0.5 font-mono">
                REG: HVAC-{Date.now().toString().slice(-6)}
              </span>
            </div>
          </div>

          {/* ========================================================== */}
          {/* CASO: LAUDO DA CALCULADORA INTERATIVA                      */}
          {/* ========================================================== */}
          {reportData && (
            <div className="space-y-6">
              {/* BLOCO 1: IDENTIFICAÇÃO DO PROJETO E DO LOCAL */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-red-600" />
                  1. Dados do Projeto e Especificações do Ambiente
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block">Identificação:</span>
                    <strong className="text-slate-900">{reportData.projectName || "Projeto de Climatização"}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Local / Cliente:</span>
                    <strong className="text-slate-900">{reportData.clientOrLocation || "Geral"}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Tipo de Uso:</span>
                    <strong className="text-slate-900">{reportData.roomType}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Exposição Solar:</span>
                    <strong className="text-slate-900">{reportData.solarExposure}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Área Útil:</span>
                    <strong className="text-slate-900">{reportData.areaM2} m²</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Pé-Direito / Volume:</span>
                    <strong className="text-slate-900">{reportData.ceilingHeightM}m ({reportData.volumeM3} m³)</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Ocupação Prevista:</span>
                    <strong className="text-slate-900">{reportData.occupants} pessoa(s)</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Iluminação Instalada:</span>
                    <strong className="text-slate-900">{reportData.lightingWatts} W</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Janelas / Vidros:</span>
                    <strong className="text-slate-900">{reportData.glassAreaM2} m² ({reportData.glassProtection})</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Computadores / PCs:</span>
                    <strong className="text-slate-900">{reportData.computersCount} unidade(s)</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Fluxo de Portas:</span>
                    <strong className="text-slate-900">{reportData.highFlowDoor ? "Alto Fluxo Aberto (+15%)" : "Fechada / Normal"}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Margem de Projeto:</span>
                    <strong className="text-slate-900">+{reportData.breakdown.marginPercent}% Segurança</strong>
                  </div>
                </div>
              </div>

              {/* BLOCO 2: TABELA DE DECOMPOSIÇÃO DA CARGA TÉRMICA */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-red-600" />
                  2. Decomposição das Parcelas de Carga Térmica (BTU/h)
                </h3>
                <table className="w-full text-left border-collapse border border-slate-300 text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-900">
                      <th className="border border-slate-300 px-3 py-2 font-bold">Fonte de Calor</th>
                      <th className="border border-slate-300 px-3 py-2 font-bold">Variável / Parâmetro</th>
                      <th className="border border-slate-300 px-3 py-2 font-bold text-right">Potência Térmica (BTU/h)</th>
                      <th className="border border-slate-300 px-3 py-2 font-bold text-right">% do Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-slate-300 px-3 py-1.5 font-medium text-slate-900">1. Condução por Área e Envoltória</td>
                      <td className="border border-slate-300 px-3 py-1.5 text-slate-600">{reportData.areaM2} m² ({reportData.solarExposure})</td>
                      <td className="border border-slate-300 px-3 py-1.5 text-right font-mono font-bold text-slate-900">
                        {reportData.breakdown.baseAreaBtu.toLocaleString("pt-BR")} BTU/h
                      </td>
                      <td className="border border-slate-300 px-3 py-1.5 text-right text-slate-500">
                        {Math.round((reportData.breakdown.baseAreaBtu / reportData.breakdown.finalBtu) * 100)}%
                      </td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="border border-slate-300 px-3 py-1.5 font-medium text-slate-900">2. Carga Metabólica Humana</td>
                      <td className="border border-slate-300 px-3 py-1.5 text-slate-600">{reportData.occupants} ocupantes (sensível + latente)</td>
                      <td className="border border-slate-300 px-3 py-1.5 text-right font-mono font-bold text-slate-900">
                        {reportData.breakdown.occupantsBtu.toLocaleString("pt-BR")} BTU/h
                      </td>
                      <td className="border border-slate-300 px-3 py-1.5 text-right text-slate-500">
                        {Math.round((reportData.breakdown.occupantsBtu / reportData.breakdown.finalBtu) * 100)}%
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 px-3 py-1.5 font-medium text-slate-900">3. Radiação Solar por Vidros</td>
                      <td className="border border-slate-300 px-3 py-1.5 text-slate-600">{reportData.glassAreaM2} m² de vidro ({reportData.glassProtection})</td>
                      <td className="border border-slate-300 px-3 py-1.5 text-right font-mono font-bold text-slate-900">
                        {reportData.breakdown.glassBtu.toLocaleString("pt-BR")} BTU/h
                      </td>
                      <td className="border border-slate-300 px-3 py-1.5 text-right text-slate-500">
                        {Math.round((reportData.breakdown.glassBtu / reportData.breakdown.finalBtu) * 100)}%
                      </td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="border border-slate-300 px-3 py-1.5 font-medium text-slate-900">4. Equipamentos Eletrônicos / TI</td>
                      <td className="border border-slate-300 px-3 py-1.5 text-slate-600">{reportData.computersCount} computadores / periféricos</td>
                      <td className="border border-slate-300 px-3 py-1.5 text-right font-mono font-bold text-slate-900">
                        {reportData.breakdown.equipmentBtu.toLocaleString("pt-BR")} BTU/h
                      </td>
                      <td className="border border-slate-300 px-3 py-1.5 text-right text-slate-500">
                        {Math.round((reportData.breakdown.equipmentBtu / reportData.breakdown.finalBtu) * 100)}%
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 px-3 py-1.5 font-medium text-slate-900">5. Iluminação Artificial</td>
                      <td className="border border-slate-300 px-3 py-1.5 text-slate-600">{reportData.lightingWatts} W instalados (fator 3,41 BTU/h/W)</td>
                      <td className="border border-slate-300 px-3 py-1.5 text-right font-mono font-bold text-slate-900">
                        {reportData.breakdown.lightingBtu.toLocaleString("pt-BR")} BTU/h
                      </td>
                      <td className="border border-slate-300 px-3 py-1.5 text-right text-slate-500">
                        {Math.round((reportData.breakdown.lightingBtu / reportData.breakdown.finalBtu) * 100)}%
                      </td>
                    </tr>
                    {reportData.breakdown.infiltrationBtu > 0 && (
                      <tr className="bg-slate-50">
                        <td className="border border-slate-300 px-3 py-1.5 font-medium text-slate-900">6. Infiltração por Vão de Porta Aberta</td>
                        <td className="border border-slate-300 px-3 py-1.5 text-slate-600">Fluxo comercial de pedestres (+15%)</td>
                        <td className="border border-slate-300 px-3 py-1.5 text-right font-mono font-bold text-slate-900">
                          {reportData.breakdown.infiltrationBtu.toLocaleString("pt-BR")} BTU/h
                        </td>
                        <td className="border border-slate-300 px-3 py-1.5 text-right text-slate-500">
                          {Math.round((reportData.breakdown.infiltrationBtu / reportData.breakdown.finalBtu) * 100)}%
                        </td>
                      </tr>
                    )}
                    <tr className="border-t-2 border-slate-400 bg-slate-100">
                      <td colSpan={2} className="border border-slate-300 px-3 py-1.5 font-bold text-slate-800 text-right">
                        Subtotal de Carga Líquida:
                      </td>
                      <td className="border border-slate-300 px-3 py-1.5 text-right font-mono font-bold text-slate-900">
                        {reportData.breakdown.subtotalBtu.toLocaleString("pt-BR")} BTU/h
                      </td>
                      <td className="border border-slate-300 px-3 py-1.5 text-right text-slate-600">100%</td>
                    </tr>
                    <tr className="bg-slate-100">
                      <td colSpan={2} className="border border-slate-300 px-3 py-1.5 font-semibold text-slate-700 text-right">
                        Margem de Segurança Técnica (+{reportData.breakdown.marginPercent}%):
                      </td>
                      <td className="border border-slate-300 px-3 py-1.5 text-right font-mono font-bold text-amber-700">
                        +{reportData.breakdown.marginBtu.toLocaleString("pt-BR")} BTU/h
                      </td>
                      <td className="border border-slate-300 px-3 py-1.5 text-right text-amber-700">
                        +{reportData.breakdown.marginPercent}%
                      </td>
                    </tr>
                    <tr className="bg-red-50 border-t-2 border-red-600">
                      <td colSpan={2} className="border border-slate-300 px-3 py-2 font-black text-slate-900 text-right text-sm">
                        CARGA TÉRMICA TOTAL DE PROJETO:
                      </td>
                      <td className="border border-slate-300 px-3 py-2 text-right font-mono font-black text-red-600 text-sm">
                        {reportData.breakdown.finalBtu.toLocaleString("pt-BR")} BTU/h
                      </td>
                      <td className="border border-slate-300 px-3 py-2 text-right font-mono font-bold text-slate-900 text-xs">
                        {reportData.breakdown.finalTr.toFixed(2)} TR
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* BLOCO 3: SELEÇÃO COMERCIAL RECOMENDADA */}
              <div className="border border-red-200 bg-red-50/50 rounded-xl p-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-red-900 mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-red-600" />
                  3. Especificação do Equipamento e Infraestrutura Sugerida
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="bg-white p-3 rounded-lg border border-red-200/60 shadow-xs">
                    <span className="text-slate-500 font-medium block">Capacidade Comercial Recomendada:</span>
                    <strong className="text-base text-slate-900 font-black">
                      {reportData.recommendedMachine.capacityBtu} ({reportData.breakdown.finalTr.toFixed(2)} TR)
                    </strong>
                    <p className="text-slate-600 text-[11px] mt-1">
                      Equivalência térmica: ~{reportData.breakdown.finalKw.toFixed(1)} kW térmicos ({Math.round(reportData.breakdown.finalBtu * 0.252).toLocaleString("pt-BR")} kcal/h).
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-red-200/60 shadow-xs">
                    <span className="text-slate-500 font-medium block">Tipo de Evaporadora Indicada:</span>
                    <strong className="text-sm text-slate-900 font-bold">
                      {reportData.recommendedMachine.modelType}
                    </strong>
                    <p className="text-slate-600 text-[11px] mt-1">
                      Tecnologia Inverter com controle eletrônico de expansão (EEV).
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-red-200/60 shadow-xs">
                    <span className="text-slate-500 font-medium block">Proteção Elétrica Dedicada:</span>
                    <strong className="text-slate-900 font-bold">{reportData.recommendedMachine.breaker}</strong>
                    <p className="text-slate-600 text-[11px] mt-1">
                      Circuito elétrico exclusivo com condutor de aterramento conforme NBR 5410.
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-red-200/60 shadow-xs">
                    <span className="text-slate-500 font-medium block">Bitolas da Tubulação Frigorífica:</span>
                    <strong className="text-slate-900 font-bold">{reportData.recommendedMachine.copperPiping}</strong>
                    <p className="text-slate-600 text-[11px] mt-1">
                      Tubos de cobre sem costura classe recozido com isolamento elastomérico independente.
                    </p>
                  </div>
                </div>
              </div>

              {/* BLOCO 4: RECOMENDAÇÕES DE ENGENHARIA */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-slate-700" />
                  4. Diretrizes Técnicas de Instalação e Boas Práticas
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {reportData.technicalNotes.map((note, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* CASO: ESTUDO DE CASO COMPLETO                             */}
          {/* ========================================================== */}
          {caseStudy && (
            <div className="space-y-6">
              {/* Contexto Arquitetônico */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase bg-red-600 text-white">
                    Estudo de Caso #{caseStudy.caseNumber}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">{caseStudy.buildingType}</span>
                </div>
                <h2 className="text-base font-bold text-slate-900 mb-1">{caseStudy.title}</h2>
                <p className="text-xs text-slate-600 italic mb-3">{caseStudy.subtitle}</p>
                <p className="text-xs text-slate-700 leading-relaxed text-justify">
                  {caseStudy.architecturalContext}
                </p>
              </div>

              {/* Parâmetros e Variáveis de Carga */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Variáveis de Projeto e Parâmetros Térmicos
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-slate-500 block">Área e Volume:</span>
                    <strong className="text-slate-900">{caseStudy.dimensionsAndVariables.areaM2} m² ({caseStudy.dimensionsAndVariables.volumeM3} m³)</strong>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-slate-500 block">Pé-Direito:</span>
                    <strong className="text-slate-900">{caseStudy.dimensionsAndVariables.ceilingHeightM} metros</strong>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-slate-500 block">Insolação:</span>
                    <strong className="text-slate-900">{caseStudy.dimensionsAndVariables.solarOrientation}</strong>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg col-span-2 sm:col-span-1">
                    <span className="text-slate-500 block">Lotação Humana:</span>
                    <strong className="text-slate-900">{caseStudy.dimensionsAndVariables.occupancy}</strong>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg col-span-2">
                    <span className="text-slate-500 block">Renovação e Infiltração:</span>
                    <strong className="text-slate-900">{caseStudy.dimensionsAndVariables.ventilationAndInfiltration}</strong>
                  </div>
                </div>
              </div>

              {/* Tabela do Memorial de Cálculo Passo a Passo */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Memorial de Cálculo Passo a Passo
                </h3>
                <table className="w-full text-left border-collapse border border-slate-300 text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-900">
                      <th className="border border-slate-300 px-3 py-2 font-bold">Etapa</th>
                      <th className="border border-slate-300 px-3 py-2 font-bold">Descrição e Metodologia</th>
                      <th className="border border-slate-300 px-3 py-2 font-bold">Fórmula Aplicada</th>
                      <th className="border border-slate-300 px-3 py-2 font-bold text-right">Potência (BTU/h)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {caseStudy.calculationSteps.map((step) => (
                      <tr key={step.stepNumber} className={step.stepNumber % 2 === 0 ? "bg-slate-50" : ""}>
                        <td className="border border-slate-300 px-3 py-1.5 font-bold text-slate-900">
                          #{step.stepNumber}
                        </td>
                        <td className="border border-slate-300 px-3 py-1.5">
                          <strong className="text-slate-900 block">{step.stepTitle}</strong>
                          <span className="text-slate-600 text-[11px]">{step.detail}</span>
                        </td>
                        <td className="border border-slate-300 px-3 py-1.5 font-mono text-[11px] text-slate-800">
                          {step.formula}
                        </td>
                        <td className="border border-slate-300 px-3 py-1.5 text-right font-mono font-bold text-slate-900">
                          {step.partialBtu.toLocaleString("pt-BR")}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-slate-100 border-t-2 border-slate-400">
                      <td colSpan={3} className="border border-slate-300 px-3 py-1.5 text-right font-bold text-slate-800">
                        Subtotal de Carga Líquida:
                      </td>
                      <td className="border border-slate-300 px-3 py-1.5 text-right font-mono font-bold text-slate-900">
                        {caseStudy.subtotalBtu.toLocaleString("pt-BR")} BTU/h
                      </td>
                    </tr>
                    <tr className="bg-slate-100">
                      <td colSpan={3} className="border border-slate-300 px-3 py-1.5 text-right font-semibold text-slate-700">
                        Margem de Segurança e Perdas (+{caseStudy.safetyMarginPercent}%):
                      </td>
                      <td className="border border-slate-300 px-3 py-1.5 text-right font-mono font-bold text-amber-700">
                        +{caseStudy.safetyMarginBtu.toLocaleString("pt-BR")} BTU/h
                      </td>
                    </tr>
                    <tr className="bg-red-50 border-t-2 border-red-600">
                      <td colSpan={3} className="border border-slate-300 px-3 py-2 text-right font-black text-slate-900 text-sm">
                        RESULTADO FINAL CONSOLIDADO:
                      </td>
                      <td className="border border-slate-300 px-3 py-2 text-right font-mono font-black text-red-600 text-sm">
                        {caseStudy.finalBtu.toLocaleString("pt-BR")} BTU/h
                        <span className="block text-xs font-bold text-slate-800">
                          ({caseStudy.finalTr.toFixed(2)} TR)
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Especificação dos Equipamentos */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
                  Especificação Recomendada do Sistema
                </h3>
                <div className="space-y-2 text-xs">
                  <div>
                    <strong className="text-slate-900">Sistema: </strong>
                    <span className="text-slate-700">{caseStudy.equipmentRecommendation.systemType}</span>
                  </div>
                  <div>
                    <strong className="text-slate-900">Unidades: </strong>
                    <span className="text-slate-700">{caseStudy.equipmentRecommendation.units}</span>
                  </div>
                  <div>
                    <strong className="text-slate-900">Elétrica & Tubulações: </strong>
                    <span className="text-slate-700">{caseStudy.equipmentRecommendation.pipingAndElectrical}</span>
                  </div>
                  <div>
                    <strong className="text-slate-900">Filtragem & Difusão: </strong>
                    <span className="text-slate-700">{caseStudy.equipmentRecommendation.airflowAndFiltration}</span>
                  </div>
                </div>
              </div>

              {/* Notas de Engenharia */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
                  Notas de Engenharia e Normas Técnicas
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {caseStudy.engineeringNotes.map((note, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* CAMPO DE ASSINATURA TÉCNICA (Folha A4) */}
          <div className="border-t-2 border-slate-300 pt-6 mt-8 grid grid-cols-2 gap-8 text-center text-xs">
            <div>
              <div className="border-b border-slate-400 h-10 mb-1"></div>
              <strong className="text-slate-900 block">Responsável Técnico / Projetista</strong>
              <span className="text-slate-500 text-[11px]">Assinatura / Registro Profissional</span>
            </div>
            <div>
              <div className="border-b border-slate-400 h-10 mb-1"></div>
              <strong className="text-slate-900 block">Validação Técnica do Instrutor</strong>
              <span className="text-slate-500 text-[11px]">Prof. Cleverson Leonardo • HVAC-R</span>
            </div>
          </div>

          {/* RODAPÉ OFICIAL DE DIREITOS INTELECTUAIS */}
          <div className="border-t border-slate-200 pt-4 mt-6 text-center space-y-0.5">
            <p className="text-xs font-bold text-slate-800">
              © {new Date().getFullYear()} Direitos Intelectuais Reservados • Criado por Prof. Cleverson Leonardo.
            </p>
            <p className="text-[10px] text-red-700 font-semibold tracking-wide">
              PROIBIDA A VENDA, REPRODUÇÃO OU DISTRIBUIÇÃO SEM DEVIDA AUTORIZAÇÃO PRÉVIA DO AUTOR.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
