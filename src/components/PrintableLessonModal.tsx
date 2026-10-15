"use client";

import React from "react";
import { X, Printer, ShieldAlert, Info, Wrench, BookOpen, Lock } from "lucide-react";
import { LessonMaterial } from "@/data/module1Materials";

type Props = {
  material: LessonMaterial | null;
  moduleTitle: string;
  onClose: () => void;
};

export function TechnicalDiagram({ type }: { type: LessonMaterial["diagramType"] }) {
  switch (type) {
    case "calor":
      return (
        <svg viewBox="0 0 700 220" className="w-full h-auto max-h-60 mx-auto">
          <rect x="10" y="10" width="680" height="200" rx="10" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
          {/* Parte 1: Fluxo de Calor */}
          <text x="175" y="35" textAnchor="middle" fill="#0f172a" fontSize="13" fontWeight="bold">
            1. Fluxo Espontâneo de Calor (2ª Lei)
          </text>
          <rect x="35" y="60" width="95" height="90" rx="8" fill="#fee2e2" stroke="#dc2626" strokeWidth="2" />
          <text x="82" y="95" textAnchor="middle" fill="#991b1b" fontSize="13" fontWeight="bold">CORPO A</text>
          <text x="82" y="115" textAnchor="middle" fill="#dc2626" fontSize="12" fontWeight="bold">Maior Temp.</text>
          <text x="82" y="135" textAnchor="middle" fill="#7f1d1d" fontSize="11">(T₁ = 32 °C)</text>

          <path d="M 140 105 L 210 105" stroke="#ea580c" strokeWidth="4" />
          <polygon points="210,98 225,105 210,112" fill="#ea580c" />
          <text x="180" y="90" textAnchor="middle" fill="#ea580c" fontSize="11" fontWeight="bold">CALOR (Q)</text>

          <rect x="235" y="60" width="95" height="90" rx="8" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2" />
          <text x="282" y="95" textAnchor="middle" fill="#075985" fontSize="13" fontWeight="bold">CORPO B</text>
          <text x="282" y="115" textAnchor="middle" fill="#0284c7" fontSize="12" fontWeight="bold">Menor Temp.</text>
          <text x="282" y="135" textAnchor="middle" fill="#0c4a6e" fontSize="11">(T₂ = 7 °C)</text>

          <text x="182" y="178" textAnchor="middle" fill="#475569" fontSize="11">
            Sentido natural: T₁ → T₂ até atingir o Equilíbrio Térmico
          </text>

          <line x1="355" y1="25" x2="355" y2="195" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4" />

          {/* Parte 2: Curva Sensível vs Latente */}
          <text x="520" y="35" textAnchor="middle" fill="#0f172a" fontSize="13" fontWeight="bold">
            2. Calor Sensível vs. Calor Latente
          </text>
          <line x1="395" y1="165" x2="655" y2="165" stroke="#334155" strokeWidth="2" />
          <line x1="395" y1="165" x2="395" y2="55" stroke="#334155" strokeWidth="2" />
          <text x="382" y="110" textAnchor="middle" fill="#334155" fontSize="10" transform="rotate(-90 382 110)">Temp. (°C)</text>
          <text x="525" y="185" textAnchor="middle" fill="#334155" fontSize="10">Quantidade de Calor Adicionado (Q)</text>

          <polyline points="395,155 465,110 565,110 635,60" fill="none" stroke="#dc2626" strokeWidth="3" />
          <circle cx="465" cy="110" r="4" fill="#0f172a" />
          <circle cx="565" cy="110" r="4" fill="#0f172a" />

          <text x="425" y="122" fill="#b91c1c" fontSize="10" fontWeight="bold">Sensível</text>
          <text x="515" y="100" textAnchor="middle" fill="#0284c7" fontSize="10" fontWeight="bold">Calor Latente</text>
          <text x="515" y="125" textAnchor="middle" fill="#475569" fontSize="9">(Mudança de Fase / Temp. Constante)</text>
          <text x="615" y="92" fill="#b91c1c" fontSize="10" fontWeight="bold">Sensível</text>
        </svg>
      );

    case "temperatura":
      return (
        <svg viewBox="0 0 700 220" className="w-full h-auto max-h-60 mx-auto">
          <rect x="10" y="10" width="680" height="200" rx="10" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
          <text x="195" y="35" textAnchor="middle" fill="#0f172a" fontSize="13" fontWeight="bold">
            Comparativo de Escalas Termométricas
          </text>

          {/* Escala Celsius */}
          <rect x="65" y="55" width="16" height="125" rx="8" fill="#e2e8f0" stroke="#475569" strokeWidth="1.5" />
          <rect x="68" y="95" width="10" height="82" rx="5" fill="#dc2626" />
          <text x="73" y="50" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="bold">°C</text>
          <text x="90" y="70" fill="#dc2626" fontSize="11" fontWeight="bold">100 °C (Ebulição)</text>
          <text x="90" y="125" fill="#0284c7" fontSize="11" fontWeight="bold">0 °C (Fusão)</text>
          <text x="90" y="175" fill="#475569" fontSize="10">-273,15 °C (Zero Abs.)</text>

          {/* Escala Fahrenheit */}
          <rect x="215" y="55" width="16" height="125" rx="8" fill="#e2e8f0" stroke="#475569" strokeWidth="1.5" />
          <rect x="218" y="95" width="10" height="82" rx="5" fill="#ea580c" />
          <text x="223" y="50" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="bold">°F</text>
          <text x="240" y="70" fill="#ea580c" fontSize="11" fontWeight="bold">212 °F</text>
          <text x="240" y="125" fill="#0284c7" fontSize="11" fontWeight="bold">32 °F</text>
          <text x="240" y="175" fill="#475569" fontSize="10">-459,67 °F</text>

          {/* Escala Kelvin */}
          <rect x="330" y="55" width="16" height="125" rx="8" fill="#e2e8f0" stroke="#475569" strokeWidth="1.5" />
          <rect x="333" y="95" width="10" height="82" rx="5" fill="#0284c7" />
          <text x="338" y="50" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="bold">K</text>
          <text x="355" y="70" fill="#0f172a" fontSize="11" fontWeight="bold">373,15 K</text>
          <text x="355" y="125" fill="#0284c7" fontSize="11" fontWeight="bold">273,15 K</text>
          <text x="355" y="175" fill="#475569" fontSize="10">0 K</text>

          <line x1="425" y1="25" x2="425" y2="195" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4" />

          {/* Medição de Contato */}
          <text x="555" y="35" textAnchor="middle" fill="#0f172a" fontSize="13" fontWeight="bold">
            Aferição Correta na Tubulação
          </text>
          <rect x="455" y="95" width="200" height="28" fill="#d97706" stroke="#78350f" strokeWidth="2" />
          <text x="555" y="113" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">TUBO DE COBRE (SUCÇÃO)</text>
          <rect x="520" y="83" width="45" height="12" rx="3" fill="#1e293b" />
          <text x="542" y="76" textAnchor="middle" fill="#0f172a" fontSize="10" fontWeight="bold">Bulbo Sensor NTC</text>
          <rect x="495" y="78" width="95" height="52" rx="5" fill="none" stroke="#0284c7" strokeWidth="2.5" strokeDasharray="4" />
          <text x="555" y="152" textAnchor="middle" fill="#0369a1" fontSize="11" fontWeight="bold">
            Isolamento Elastomérico Protetor
          </text>
          <text x="555" y="170" textAnchor="middle" fill="#475569" fontSize="10">
            (Evita erro de leitura pelo ar externo)
          </text>
        </svg>
      );

    case "pressao":
      return (
        <svg viewBox="0 0 700 220" className="w-full h-auto max-h-60 mx-auto">
          <rect x="10" y="10" width="680" height="200" rx="10" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
          <text x="350" y="35" textAnchor="middle" fill="#0f172a" fontSize="13" fontWeight="bold">
            Escala Referencial de Pressões: Absoluta, Manométrica e Vácuo (Microns)
          </text>

          {/* Barra Horizontal de Pressão */}
          <rect x="50" y="85" width="220" height="36" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2" />
          <rect x="270" y="85" width="380" height="36" fill="#fee2e2" stroke="#dc2626" strokeWidth="2" />

          {/* Marco Zero Absoluto */}
          <line x1="50" y1="60" x2="50" y2="145" stroke="#0f172a" strokeWidth="3" />
          <text x="50" y="55" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="bold">VÁCUO ABSOLUTO</text>
          <text x="50" y="162" textAnchor="middle" fill="#334155" fontSize="10">0 PSIA / 0 Microns</text>

          {/* Meta 500 Microns */}
          <line x1="115" y1="75" x2="115" y2="135" stroke="#059669" strokeWidth="2.5" strokeDasharray="3" />
          <text x="115" y="70" textAnchor="middle" fill="#059669" fontSize="10" fontWeight="bold">Meta: &lt; 500 μmHg</text>

          {/* Marco Pressão Atmosférica */}
          <line x1="270" y1="55" x2="270" y2="150" stroke="#1e293b" strokeWidth="3" />
          <text x="270" y="50" textAnchor="middle" fill="#1e293b" fontSize="11" fontWeight="bold">PRESSÃO ATMOSFÉRICA (1 atm)</text>
          <text x="270" y="165" textAnchor="middle" fill="#0284c7" fontSize="11" fontWeight="bold">0 PSIG (Manômetro) = 14,7 PSIA</text>
          <text x="270" y="182" textAnchor="middle" fill="#475569" fontSize="10">(760.000 Microns / 1,013 Bar)</text>

          {/* Textos Internos */}
          <text x="165" y="108" textAnchor="middle" fill="#0369a1" fontSize="11" fontWeight="bold">ZONA DE VÁCUO (Vacuômetro)</text>
          <text x="460" y="108" textAnchor="middle" fill="#991b1b" fontSize="12" fontWeight="bold">
            PRESSÃO POSITIVA DE TRABALHO (PSIG / Bar / MPa)
          </text>
          <text x="545" y="155" textAnchor="middle" fill="#7f1d1d" fontSize="11">
            Ex: Sucção R-32 (~115 a 135 PSIG) | Descarga (~380 PSIG)
          </text>
        </svg>
      );

    case "ciclo":
      return (
        <svg viewBox="0 0 700 240" className="w-full h-auto max-h-64 mx-auto">
          <rect x="10" y="10" width="680" height="220" rx="10" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
          {/* Divisão Alta / Baixa */}
          <line x1="350" y1="20" x2="350" y2="220" stroke="#94a3b8" strokeWidth="2" strokeDasharray="6" />
          <text x="180" y="32" textAnchor="middle" fill="#dc2626" fontSize="12" fontWeight="bold">LADO DE ALTA PRESSÃO</text>
          <text x="520" y="32" textAnchor="middle" fill="#0284c7" fontSize="12" fontWeight="bold">LADO DE BAIXA PRESSÃO</text>

          {/* 1. Compressor (Topo) */}
          <circle cx="350" cy="65" r="28" fill="#1e293b" stroke="#0f172a" strokeWidth="2.5" />
          <text x="350" y="63" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">1. COMPRESSOR</text>
          <text x="350" y="75" textAnchor="middle" fill="#94a3b8" fontSize="8">Inverter</text>

          {/* 2. Condensador (Esquerda) */}
          <rect x="55" y="95" width="130" height="65" rx="8" fill="#fee2e2" stroke="#dc2626" strokeWidth="2" />
          <text x="120" y="122" textAnchor="middle" fill="#991b1b" fontSize="12" fontWeight="bold">2. CONDENSADOR</text>
          <text x="120" y="138" textAnchor="middle" fill="#7f1d1d" fontSize="10">(Unidade Externa)</text>
          <text x="120" y="152" textAnchor="middle" fill="#dc2626" fontSize="9">Rejeita Calor p/ Ambiente</text>

          {/* 4. Evaporador (Direita) */}
          <rect x="515" y="95" width="130" height="65" rx="8" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2" />
          <text x="580" y="122" textAnchor="middle" fill="#075985" fontSize="12" fontWeight="bold">4. EVAPORADOR</text>
          <text x="580" y="138" textAnchor="middle" fill="#0c4a6e" fontSize="10">(Unidade Interna)</text>
          <text x="580" y="152" textAnchor="middle" fill="#0284c7" fontSize="9">Absorve Calor da Sala</text>

          {/* 3. Expansão EEV (Base) */}
          <rect x="295" y="170" width="110" height="40" rx="6" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
          <text x="350" y="188" textAnchor="middle" fill="#92400e" fontSize="11" fontWeight="bold">3. EXPANSÃO (EEV)</text>
          <text x="350" y="202" textAnchor="middle" fill="#b45309" fontSize="9">Queda de Pressão</text>

          {/* Linhas de Interligação */}
          {/* Descarga */}
          <path d="M 322 65 L 120 65 L 120 95" fill="none" stroke="#dc2626" strokeWidth="3.5" />
          <text x="220" y="57" textAnchor="middle" fill="#dc2626" fontSize="10" fontWeight="bold">Descarga (Vapor Alta P.)</text>

          {/* Linha de Líquido */}
          <path d="M 120 160 L 120 190 L 295 190" fill="none" stroke="#ea580c" strokeWidth="3.5" />
          <text x="205" y="206" textAnchor="middle" fill="#c2410c" fontSize="10" fontWeight="bold">Líquido Subresfriado</text>

          {/* Expansão -> Evaporador */}
          <path d="M 405 190 L 580 190 L 580 160" fill="none" stroke="#38bdf8" strokeWidth="3.5" />
          <text x="495" y="206" textAnchor="middle" fill="#0284c7" fontSize="10" fontWeight="bold">Líquido + Vapor (Baixa P.)</text>

          {/* Sucção */}
          <path d="M 580 95 L 580 65 L 378 65" fill="none" stroke="#0284c7" strokeWidth="3.5" />
          <text x="480" y="57" textAnchor="middle" fill="#0369a1" fontSize="10" fontWeight="bold">Sucção (Vapor Superaquecido)</text>
        </svg>
      );

    case "seguranca":
      return (
        <svg viewBox="0 0 700 220" className="w-full h-auto max-h-60 mx-auto">
          <rect x="10" y="10" width="680" height="200" rx="10" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
          {/* Alerta Proibido O2 */}
          <rect x="30" y="30" width="290" height="160" rx="10" fill="#fef2f2" stroke="#dc2626" strokeWidth="2.5" />
          <circle cx="175" cy="75" r="24" fill="#dc2626" />
          <text x="175" y="82" textAnchor="middle" fill="#ffffff" fontSize="18" fontWeight="bold">O₂</text>
          <line x1="157" y1="57" x2="193" y2="93" stroke="#ffffff" strokeWidth="3.5" />
          <text x="175" y="120" textAnchor="middle" fill="#991b1b" fontSize="13" fontWeight="bold">
            PROIBIDO OXIGÊNIO (O₂)
          </text>
          <text x="175" y="140" textAnchor="middle" fill="#7f1d1d" fontSize="11">
            Risco de Explosão Letal com Óleo POE!
          </text>
          <text x="175" y="165" textAnchor="middle" fill="#059669" fontSize="11" fontWeight="bold">
            ✔ Use Exclusivamente NITROGÊNIO (N₂)
          </text>

          {/* Esquema Carga com Balança */}
          <rect x="345" y="30" width="325" height="160" rx="10" fill="#f0f9ff" stroke="#0284c7" strokeWidth="2" />
          <text x="507" y="55" textAnchor="middle" fill="#0f172a" fontSize="13" fontWeight="bold">
            Arranjo Seguro de Carga por Massa
          </text>
          <rect x="370" y="145" width="90" height="25" rx="4" fill="#1e293b" />
          <text x="415" y="161" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="bold">BALANÇA (g)</text>
          <rect x="390" y="80" width="50" height="65" rx="8" fill="#0284c7" />
          <text x="415" y="115" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">CILINDRO</text>

          <path d="M 440 95 L 510 95 L 510 115" fill="none" stroke="#eab308" strokeWidth="3" />
          <rect x="485" y="115" width="55" height="35" rx="5" fill="#334155" />
          <text x="512" y="136" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">MANIFOLD</text>

          <path d="M 540 132 L 605 132" fill="none" stroke="#0284c7" strokeWidth="3" />
          <rect x="595" y="120" width="55" height="25" rx="4" fill="#059669" />
          <text x="622" y="136" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">VÁLV. SEG.</text>
          <text x="565" y="175" textAnchor="middle" fill="#0369a1" fontSize="10" fontWeight="bold">
            EPIs: Óculos + Luvas Nitrílicas
          </text>
        </svg>
      );

    case "fluidos":
      return (
        <svg viewBox="0 0 700 220" className="w-full h-auto max-h-60 mx-auto">
          <rect x="10" y="10" width="680" height="200" rx="10" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
          <text x="350" y="35" textAnchor="middle" fill="#0f172a" fontSize="13" fontWeight="bold">
            Matriz de Classificação de Segurança ASHRAE Standard 34 (Inflamabilidade × Toxicidade)
          </text>

          {/* Cabeçalhos da Matriz */}
          <rect x="130" y="55" width="130" height="45" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.5" />
          <text x="195" y="75" textAnchor="middle" fill="#166534" fontSize="12" fontWeight="bold">CLASSE A1</text>
          <text x="195" y="92" textAnchor="middle" fill="#15803d" fontSize="10">Não Inflamável (R-410A)</text>

          <rect x="260" y="55" width="145" height="45" fill="#fef9c3" stroke="#ca8a04" strokeWidth="1.5" />
          <text x="332" y="75" textAnchor="middle" fill="#854d0e" fontSize="12" fontWeight="bold">CLASSE A2L</text>
          <text x="332" y="92" textAnchor="middle" fill="#a16207" fontSize="10">Levemente Inflam. (R-32)</text>

          <rect x="405" y="55" width="125" height="45" fill="#ffedd5" stroke="#ea580c" strokeWidth="1.5" />
          <text x="467" y="75" textAnchor="middle" fill="#9a3412" fontSize="12" fontWeight="bold">CLASSE A2</text>
          <text x="467" y="92" textAnchor="middle" fill="#c2410c" fontSize="10">Baixa Inflam. (R-152a)</text>

          <rect x="530" y="55" width="135" height="45" fill="#fee2e2" stroke="#dc2626" strokeWidth="1.5" />
          <text x="597" y="75" textAnchor="middle" fill="#991b1b" fontSize="12" fontWeight="bold">CLASSE A3</text>
          <text x="597" y="92" textAnchor="middle" fill="#b91c1c" fontSize="10">Alta Inflam. (R-290)</text>

          <text x="75" y="82" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="bold">Baixa Toxic. (A)</text>

          {/* Barra Comparativa GWP */}
          <text x="350" y="130" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="bold">
            Redução do Impacto no Aquecimento Global (Índice GWP — 100 anos)
          </text>
          <rect x="130" y="145" width="420" height="18" rx="4" fill="#dc2626" />
          <text x="560" y="158" fill="#991b1b" fontSize="11" fontWeight="bold">R-410A (GWP = 2088)</text>

          <rect x="130" y="170" width="140" height="18" rx="4" fill="#ca8a04" />
          <text x="280" y="183" fill="#854d0e" fontSize="11" fontWeight="bold">R-32 (GWP = 675 — Redução de 68%)</text>

          <rect x="130" y="192" width="12" height="14" rx="2" fill="#16a34a" />
          <text x="150" y="203" fill="#166534" fontSize="11" fontWeight="bold">R-290 Propano (GWP = 3)</text>
        </svg>
      );
  }
}

export default function PrintableLessonModal({ material, moduleTitle, onClose }: Props) {
  if (!material) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto print:static print:bg-white print:p-0 print:block">
      {/* Estilos globais dedicados exclusivamente para formatação de página A4 limpa no momento da impressão/PDF */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-technical-sheet,
          #printable-technical-sheet * {
            visibility: visible;
          }
          #printable-technical-sheet {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: #ffffff !important;
            color: #0f172a !important;
            box-shadow: none !important;
            margin: 0 !important;
            padding: 12mm !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Container Principal do Modal */}
      <div className="bg-zinc-950 border border-white/15 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden print:max-w-none print:max-h-none print:border-none print:rounded-none print:bg-white">
        
        {/* Barra de Ferramentas Superior (Oculta na Impressão) */}
        <div className="no-print flex items-center justify-between px-6 py-4 bg-black/80 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-red-500" />
            <span className="text-sm font-semibold text-white">Apostila Técnica Oficial • Formato A4 Imprimível</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer shadow-lg shadow-red-900/30"
            >
              <Printer className="w-4 h-4" />
              Imprimir / Salvar em PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Fechar apostila"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* FOLHA TÉCNICA A4 (Fundo claro de alta legibilidade técnica tanto na tela quanto no PDF) */}
        <div className="overflow-y-auto p-4 sm:p-8 bg-zinc-900/60 print:p-0 print:bg-white">
          <div
            id="printable-technical-sheet"
            className="bg-white text-slate-900 rounded-xl p-6 sm:p-10 shadow-xl max-w-3xl mx-auto space-y-6 border border-slate-200"
          >
            {/* CABEÇALHO TÉCNICO E AVISO DE DIREITOS AUTORAIS */}
            <div className="border-b-2 border-red-600 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-red-600">
                  Plataforma de Climatização • Material Didático de Apoio
                </p>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
                  {material.fullTitle}
                </h1>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  Módulo: {moduleTitle} • Carga Horária: {material.workload} • Autor: Prof. Cleverson Leonardo
                </p>
              </div>
              <div className="bg-slate-100 border border-slate-300 rounded-lg px-3 py-2 text-right shrink-0">
                <span className="text-[10px] font-bold uppercase text-slate-700 block">Documento Técnico</span>
                <span className="text-xs font-extrabold text-red-700">USO EXCLUSIVO EM AULA</span>
              </div>
            </div>

            {/* Aviso Legal no Topo */}
            <div className="bg-red-50 border border-red-200 rounded-lg px-3.5 py-2 flex items-center gap-2 text-[11px] text-red-900 font-medium">
              <Lock className="w-3.5 h-3.5 text-red-600 shrink-0" />
              <span>
                <strong>AVISO LEGAL:</strong> Material protegido por direitos intelectuais (Prof. Cleverson Leonardo). É estritamente proibida a venda, reprodução ou distribuição sem autorização prévia.
              </span>
            </div>

            {/* SÍNTESE CONCEITUAL */}
            <div className="bg-slate-50 border-l-4 border-red-600 p-4 rounded-r-lg">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Definição Técnica Fundamental
              </h2>
              <p className="text-sm font-medium text-slate-800 leading-relaxed">
                {material.shortSummary}
              </p>
            </div>

            {/* ILUSTRAÇÃO TÉCNICA DE EXEMPLIFICAÇÃO */}
            <div className="border border-slate-200 rounded-xl p-4 bg-white">
              <TechnicalDiagram type={material.diagramType} />
              <p className="text-xs text-center text-slate-600 font-medium mt-2 italic">
                {material.diagramCaption}
              </p>
            </div>

            {/* SEÇÕES DE CONTEÚDO TÉCNICO */}
            <div className="space-y-6">
              {material.sections.map((sec, idx) => (
                <div key={idx} className="space-y-3">
                  <h3 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-1.5">
                    {sec.subtitle}
                  </h3>

                  {sec.paragraphs?.map((p, pIdx) => (
                    <p key={pIdx} className="text-sm text-slate-700 leading-relaxed text-justify">
                      {p}
                    </p>
                  ))}

                  {sec.bullets && (
                    <ul className="space-y-2 pl-1">
                      {sec.bullets.map((b, bIdx) => (
                        <li key={bIdx} className="text-sm text-slate-700 leading-relaxed flex items-start gap-2">
                          <span className="text-red-600 font-bold mt-0.5">•</span>
                          <div>
                            <strong className="text-slate-900">{b.label}:</strong> {b.text}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}

                  {sec.table && (
                    <div className="overflow-x-auto my-3">
                      <table className="w-full text-left border-collapse border border-slate-300 text-xs sm:text-sm">
                        <thead>
                          <tr className="bg-slate-100 text-slate-900">
                            {sec.table.headers.map((h, hIdx) => (
                              <th key={hIdx} className="border border-slate-300 px-3 py-2 font-bold">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {sec.table.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="even:bg-slate-50">
                              {row.map((cell, cIdx) => (
                                <td key={cIdx} className="border border-slate-300 px-3 py-2 text-slate-700">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {sec.highlightBox && (
                    <div
                      className={`p-4 rounded-lg border text-sm ${
                        sec.highlightBox.type === "danger"
                          ? "bg-red-50 border-red-300 text-red-950"
                          : sec.highlightBox.type === "practical"
                          ? "bg-amber-50 border-amber-300 text-amber-950"
                          : "bg-sky-50 border-sky-300 text-sky-950"
                      }`}
                    >
                      <div className="flex items-center gap-2 font-bold mb-1">
                        {sec.highlightBox.type === "danger" && <ShieldAlert className="w-4 h-4 text-red-600" />}
                        {sec.highlightBox.type === "practical" && <Wrench className="w-4 h-4 text-amber-600" />}
                        {sec.highlightBox.type === "info" && <Info className="w-4 h-4 text-sky-600" />}
                        <span>{sec.highlightBox.title}</span>
                      </div>
                      <p className="text-xs sm:text-sm leading-relaxed">{sec.highlightBox.content}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* RODAPÉ OFICIAL DE DIREITOS AUTORAIS */}
            <div className="border-t-2 border-slate-300 pt-4 mt-8 text-center space-y-1">
              <p className="text-xs font-bold text-slate-800">
                © {new Date().getFullYear()} Direitos Intelectuais Reservados • Criado por Prof. Cleverson Leonardo.
              </p>
              <p className="text-[11px] text-red-700 font-semibold">
                PROIBIDA A VENDA, REPRODUÇÃO OU DISTRIBUIÇÃO SEM DEVIDA AUTORIZAÇÃO PRÉVIA DO AUTOR.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}