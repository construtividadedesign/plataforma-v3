"use client";

import React from "react";
import { X, Printer, ShieldAlert, Info, Wrench, BookOpen } from "lucide-react";
import { LessonMaterial } from "@/data/module1Materials";
import { printElementById } from "@/lib/printUtils";

type Props = {
  material: LessonMaterial | null;
  moduleTitle: string;
  onClose: () => void;
};

export function TechnicalDiagram({ type }: { type: string }) {
  switch (type) {
    case "calor":
      return (
        <svg viewBox="0 0 700 220" className="w-full h-auto max-h-60 mx-auto">
          <rect x="10" y="10" width="680" height="200" rx="10" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
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

          <rect x="65" y="55" width="16" height="125" rx="8" fill="#e2e8f0" stroke="#475569" strokeWidth="1.5" />
          <rect x="68" y="95" width="10" height="82" rx="5" fill="#dc2626" />
          <text x="73" y="50" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="bold">°C</text>
          <text x="90" y="70" fill="#dc2626" fontSize="11" fontWeight="bold">100 °C (Ebulição)</text>
          <text x="90" y="125" fill="#0284c7" fontSize="11" fontWeight="bold">0 °C (Fusão)</text>
          <text x="90" y="175" fill="#475569" fontSize="10">-273,15 °C (Zero Abs.)</text>

          <rect x="215" y="55" width="16" height="125" rx="8" fill="#e2e8f0" stroke="#475569" strokeWidth="1.5" />
          <rect x="218" y="95" width="10" height="82" rx="5" fill="#ea580c" />
          <text x="223" y="50" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="bold">°F</text>
          <text x="240" y="70" fill="#ea580c" fontSize="11" fontWeight="bold">212 °F</text>
          <text x="240" y="125" fill="#0284c7" fontSize="11" fontWeight="bold">32 °F</text>
          <text x="240" y="175" fill="#475569" fontSize="10">-459,67 °F</text>

          <rect x="330" y="55" width="16" height="125" rx="8" fill="#e2e8f0" stroke="#475569" strokeWidth="1.5" />
          <rect x="333" y="95" width="10" height="82" rx="5" fill="#0284c7" />
          <text x="338" y="50" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="bold">K</text>
          <text x="355" y="70" fill="#0f172a" fontSize="11" fontWeight="bold">373,15 K</text>
          <text x="355" y="125" fill="#0284c7" fontSize="11" fontWeight="bold">273,15 K</text>
          <text x="355" y="175" fill="#475569" fontSize="10">0 K</text>

          <line x1="425" y1="25" x2="425" y2="195" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4" />

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

          <rect x="50" y="85" width="220" height="36" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2" />
          <rect x="270" y="85" width="380" height="36" fill="#fee2e2" stroke="#dc2626" strokeWidth="2" />

          <line x1="50" y1="60" x2="50" y2="145" stroke="#0f172a" strokeWidth="3" />
          <text x="50" y="55" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="bold">VÁCUO ABSOLUTO</text>
          <text x="50" y="162" textAnchor="middle" fill="#334155" fontSize="10">0 PSIA / 0 Microns</text>

          <line x1="115" y1="75" x2="115" y2="135" stroke="#059669" strokeWidth="2.5" strokeDasharray="3" />
          <text x="115" y="70" textAnchor="middle" fill="#059669" fontSize="10" fontWeight="bold">Meta: &lt; 500 μmHg</text>

          <line x1="270" y1="55" x2="270" y2="150" stroke="#1e293b" strokeWidth="3" />
          <text x="270" y="50" textAnchor="middle" fill="#1e293b" fontSize="11" fontWeight="bold">PRESSÃO ATMOSFÉRICA (1 atm)</text>
          <text x="270" y="165" textAnchor="middle" fill="#0284c7" fontSize="11" fontWeight="bold">0 PSIG (Manômetro) = 14,7 PSIA</text>
          <text x="270" y="182" textAnchor="middle" fill="#475569" fontSize="10">(760.000 Microns / 1,013 Bar)</text>

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
          <line x1="350" y1="20" x2="350" y2="220" stroke="#94a3b8" strokeWidth="2" strokeDasharray="6" />
          <text x="180" y="32" textAnchor="middle" fill="#dc2626" fontSize="12" fontWeight="bold">LADO DE ALTA PRESSÃO</text>
          <text x="520" y="32" textAnchor="middle" fill="#0284c7" fontSize="12" fontWeight="bold">LADO DE BAIXA PRESSÃO</text>

          <circle cx="350" cy="65" r="28" fill="#1e293b" stroke="#0f172a" strokeWidth="2.5" />
          <text x="350" y="63" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">1. COMPRESSOR</text>
          <text x="350" y="75" textAnchor="middle" fill="#94a3b8" fontSize="8">Inverter</text>

          <rect x="55" y="95" width="130" height="65" rx="8" fill="#fee2e2" stroke="#dc2626" strokeWidth="2" />
          <text x="120" y="122" textAnchor="middle" fill="#991b1b" fontSize="12" fontWeight="bold">2. CONDENSADOR</text>
          <text x="120" y="138" textAnchor="middle" fill="#7f1d1d" fontSize="10">(Unidade Externa)</text>
          <text x="120" y="152" textAnchor="middle" fill="#dc2626" fontSize="9">Rejeita Calor p/ Ambiente</text>

          <rect x="515" y="95" width="130" height="65" rx="8" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2" />
          <text x="580" y="122" textAnchor="middle" fill="#075985" fontSize="12" fontWeight="bold">4. EVAPORADOR</text>
          <text x="580" y="138" textAnchor="middle" fill="#0c4a6e" fontSize="10">(Unidade Interna)</text>
          <text x="580" y="152" textAnchor="middle" fill="#0284c7" fontSize="9">Absorve Calor da Sala</text>

          <rect x="295" y="170" width="110" height="40" rx="6" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
          <text x="350" y="188" textAnchor="middle" fill="#92400e" fontSize="11" fontWeight="bold">3. EXPANSÃO (EEV)</text>
          <text x="350" y="202" textAnchor="middle" fill="#b45309" fontSize="9">Queda de Pressão</text>

          <path d="M 322 65 L 120 65 L 120 95" fill="none" stroke="#dc2626" strokeWidth="3.5" />
          <text x="220" y="57" textAnchor="middle" fill="#dc2626" fontSize="10" fontWeight="bold">Descarga (Vapor Alta P.)</text>

          <path d="M 120 160 L 120 190 L 295 190" fill="none" stroke="#ea580c" strokeWidth="3.5" />
          <text x="205" y="206" textAnchor="middle" fill="#c2410c" fontSize="10" fontWeight="bold">Líquido Subresfriado</text>

          <path d="M 405 190 L 580 190 L 580 160" fill="none" stroke="#38bdf8" strokeWidth="3.5" />
          <text x="495" y="206" textAnchor="middle" fill="#0284c7" fontSize="10" fontWeight="bold">Líquido + Vapor (Baixa P.)</text>

          <path d="M 580 95 L 580 65 L 378 65" fill="none" stroke="#0284c7" strokeWidth="3.5" />
          <text x="480" y="57" textAnchor="middle" fill="#0369a1" fontSize="10" fontWeight="bold">Sucção (Vapor Superaquecido)</text>
        </svg>
      );

    case "seguranca":
      return (
        <svg viewBox="0 0 700 220" className="w-full h-auto max-h-60 mx-auto">
          <rect x="10" y="10" width="680" height="200" rx="10" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
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

    case "eletricidade_fundamentos":
      return (
        <svg viewBox="0 0 700 220" className="w-full h-auto max-h-60 mx-auto">
          <rect x="10" y="10" width="680" height="200" rx="10" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
          <text x="135" y="35" textAnchor="middle" fill="#0f172a" fontSize="13" fontWeight="bold">
            1. Triângulo da Lei de Ohm
          </text>
          <polygon points="135,52 65,165 205,165" fill="#fef2f2" stroke="#dc2626" strokeWidth="2.5" />
          <line x1="100" y1="108" x2="170" y2="108" stroke="#dc2626" strokeWidth="2" />
          <line x1="135" y1="108" x2="135" y2="165" stroke="#dc2626" strokeWidth="2" />
          <text x="135" y="96" textAnchor="middle" fill="#991b1b" fontSize="18" fontWeight="bold">V</text>
          <text x="112" y="148" textAnchor="middle" fill="#0284c7" fontSize="16" fontWeight="bold">R</text>
          <text x="158" y="148" textAnchor="middle" fill="#ea580c" fontSize="16" fontWeight="bold">I</text>
          <text x="135" y="188" textAnchor="middle" fill="#334155" fontSize="11" fontWeight="bold">
            V = R × I  |  I = V / R  |  P = V × I
          </text>

          <line x1="255" y1="25" x2="255" y2="195" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4" />

          <text x="470" y="35" textAnchor="middle" fill="#0f172a" fontSize="13" fontWeight="bold">
            2. Circuito Dedicado NBR 5410 e Barramento DC Inverter
          </text>
          <rect x="280" y="65" width="95" height="65" rx="6" fill="#1e293b" />
          <text x="327" y="92" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">DISJUNTOR</text>
          <text x="327" y="108" textAnchor="middle" fill="#38bdf8" fontSize="10">Bipolar 220V</text>

          <line x1="375" y1="82" x2="445" y2="82" stroke="#dc2626" strokeWidth="3" />
          <line x1="375" y1="108" x2="445" y2="108" stroke="#0284c7" strokeWidth="3" />
          <line x1="375" y1="145" x2="555" y2="145" stroke="#16a34a" strokeWidth="3" strokeDasharray="5" />
          <text x="465" y="162" textAnchor="middle" fill="#15803d" fontSize="10" fontWeight="bold">
            Condutor de Proteção Terra (PE) Obrigatório
          </text>

          <rect x="445" y="65" width="105" height="65" rx="6" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
          <text x="497" y="90" textAnchor="middle" fill="#92400e" fontSize="10" fontWeight="bold">PONTE DIODOS</text>
          <text x="497" y="106" textAnchor="middle" fill="#b45309" fontSize="9">CA 220V → CC</text>

          <path d="M 550 95 L 585 95" stroke="#dc2626" strokeWidth="3.5" />
          <rect x="585" y="65" width="85" height="65" rx="6" fill="#fee2e2" stroke="#dc2626" strokeWidth="2" />
          <text x="627" y="92" textAnchor="middle" fill="#991b1b" fontSize="11" fontWeight="bold">LINK DC</text>
          <text x="627" y="110" textAnchor="middle" fill="#dc2626" fontSize="11" fontWeight="bold">~310 VDC</text>
        </svg>
      );

    case "eletricidade_instrumentos":
      return (
        <svg viewBox="0 0 700 220" className="w-full h-auto max-h-60 mx-auto">
          <rect x="10" y="10" width="680" height="200" rx="10" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
          <rect x="30" y="30" width="300" height="160" rx="10" fill="#fef2f2" stroke="#dc2626" strokeWidth="2" />
          <text x="180" y="52" textAnchor="middle" fill="#991b1b" fontSize="12" fontWeight="bold">
            ✖ ERRADO: Garra no Cabo PP Inteiro
          </text>
          <rect x="60" y="95" width="240" height="26" rx="12" fill="#334155" />
          <line x1="65" y1="103" x2="295" y2="103" stroke="#dc2626" strokeWidth="3" />
          <line x1="65" y1="113" x2="295" y2="113" stroke="#38bdf8" strokeWidth="3" />
          <circle cx="180" cy="108" r="32" fill="none" stroke="#dc2626" strokeWidth="5" />
          <text x="180" y="160" textAnchor="middle" fill="#dc2626" fontSize="12" fontWeight="bold">
            Leitura no Visor = 0,0 A
          </text>
          <text x="180" y="177" textAnchor="middle" fill="#7f1d1d" fontSize="10">
            (Campos magnéticos de Ida e Volta se anulam)
          </text>

          <rect x="365" y="30" width="305" height="160" rx="10" fill="#f0fdf4" stroke="#16a34a" strokeWidth="2" />
          <text x="517" y="52" textAnchor="middle" fill="#166534" fontSize="12" fontWeight="bold">
            ✔ CORRETO: Garra em Apenas 1 Condutor (Fase)
          </text>
          <line x1="395" y1="90" x2="640" y2="90" stroke="#dc2626" strokeWidth="4" />
          <line x1="395" y1="130" x2="640" y2="130" stroke="#0284c7" strokeWidth="4" />
          <circle cx="517" cy="90" r="22" fill="none" stroke="#16a34a" strokeWidth="5" />
          <text x="517" y="160" textAnchor="middle" fill="#15803d" fontSize="12" fontWeight="bold">
            Leitura Real True RMS = 5,4 A
          </text>
          <text x="517" y="177" textAnchor="middle" fill="#166534" fontSize="10">
            (Instrumento Categoria CAT III • Isolar 1 via)
          </text>
        </svg>
      );

    case "eletricidade_testes":
      return (
        <svg viewBox="0 0 700 220" className="w-full h-auto max-h-60 mx-auto">
          <rect x="10" y="10" width="680" height="200" rx="10" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
          <text x="170" y="35" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="bold">
            1. Bornes On/Off (C - S - R)
          </text>
          <circle cx="170" cy="115" r="58" fill="#f1f5f9" stroke="#334155" strokeWidth="2" />
          <circle cx="170" cy="78" r="10" fill="#1e293b" />
          <text x="170" y="82" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">C</text>
          <circle cx="138" cy="138" r="10" fill="#0284c7" />
          <text x="138" y="142" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">S</text>
          <circle cx="202" cy="138" r="10" fill="#dc2626" />
          <text x="202" y="142" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">R</text>
          <text x="170" y="192" textAnchor="middle" fill="#334155" fontSize="10" fontWeight="bold">
            Soma: R(C-S) + R(C-R) = R(S-R)
          </text>

          <line x1="340" y1="25" x2="340" y2="195" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4" />

          <text x="515" y="35" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="bold">
            2. Bornes Inverter BLDC (U - V - W)
          </text>
          <circle cx="515" cy="115" r="58" fill="#fef2f2" stroke="#dc2626" strokeWidth="2" />
          <circle cx="515" cy="78" r="10" fill="#dc2626" />
          <text x="515" y="82" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">U</text>
          <circle cx="483" cy="138" r="10" fill="#dc2626" />
          <text x="483" y="142" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">V</text>
          <circle cx="547" cy="138" r="10" fill="#dc2626" />
          <text x="547" y="142" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">W</text>
          <text x="515" y="192" textAnchor="middle" fill="#991b1b" fontSize="10" fontWeight="bold">
            Bobinas Simétricas: R(U-V) = R(V-W) = R(U-W)
          </text>
        </svg>
      );

    case "brasagem":
      return (
        <svg viewBox="0 0 700 220" className="w-full h-auto max-h-60 mx-auto">
          <rect x="10" y="10" width="680" height="200" rx="10" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
          <text x="350" y="32" textAnchor="middle" fill="#0f172a" fontSize="13" fontWeight="bold">
            Protocolo Técnico de Brasagem: Tipos de Chama, Nitrogênio Passante e Proteção Térmica
          </text>

          {/* Quadrante 1: Tipos de Chama */}
          <rect x="25" y="48" width="280" height="150" rx="8" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5" />
          <text x="165" y="66" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="bold">
            1. Regulagem da Chama do Maçarico
          </text>

          {/* Chama Redutora */}
          <text x="35" y="90" fill="#b45309" fontSize="10" fontWeight="bold">A. Redutora / Carburante:</text>
          <text x="165" y="90" fill="#64748b" fontSize="9">Excesso de gás • Fuligem • ~2.800 °C</text>
          <ellipse cx="65" cy="105" rx="35" ry="8" fill="#fed7aa" />
          <ellipse cx="55" cy="105" rx="20" ry="5" fill="#f97316" />

          {/* Chama Oxidante */}
          <text x="35" y="130" fill="#b91c1c" fontSize="10" fontWeight="bold">B. Oxidante (PREJUDICIAL):</text>
          <text x="165" y="130" fill="#dc2626" fontSize="9">Excesso O₂ • Queima cobre e fura</text>
          <polygon points="30,145 90,145 105,145 75,140" fill="#38bdf8" />
          <polygon points="30,145 60,145 68,142" fill="#ffffff" />

          {/* Chama Neutra */}
          <rect x="30" y="152" width="270" height="38" rx="4" fill="#ecfdf5" stroke="#10b981" strokeWidth="1.5" />
          <text x="40" y="167" fill="#047857" fontSize="10" fontWeight="bold">C. CHAMA NEUTRA (A ÚNICA CORRETA):</text>
          <text x="40" y="182" fill="#0f766e" fontSize="9">Dardo cônico azul-claro suave • Fusão homogênea a ~3.100 °C</text>

          {/* Divisor */}
          <line x1="320" y1="48" x2="320" y2="198" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3" />

          {/* Quadrante 2: Bancada com N2 e Proteção de Válvula */}
          <rect x="335" y="48" width="340" height="150" rx="8" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5" />
          <text x="505" y="66" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="bold">
            2. Proteção de Válvula e Passadiço de N₂ (1 a 3 PSI)
          </text>

          {/* Tubo de Cobre */}
          <rect x="350" y="110" width="180" height="20" rx="2" fill="#d97706" stroke="#92400e" strokeWidth="1.5" />
          <text x="440" y="124" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">TUBO DE COBRE LIMPO</text>

          {/* Seta N2 interno */}
          <path d="M 355 120 L 405 120" stroke="#0284c7" strokeWidth="3" />
          <polygon points="405,116 415,120 405,124" fill="#0284c7" />
          <text x="440" y="146" textAnchor="middle" fill="#0284c7" fontSize="9" fontWeight="bold">Fluxo Passante de N₂ (Sem Carepa)</text>

          {/* Ponto de Solda */}
          <circle cx="490" cy="120" r="14" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="3" />
          <text x="490" y="98" textAnchor="middle" fill="#dc2626" fontSize="9" fontWeight="bold">Zona de Fusão (3.100°C)</text>

          {/* Válvula de Serviço Envolvida com Pano Úmido */}
          <rect x="545" y="90" width="115" height="60" rx="6" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2" />
          <text x="602" y="110" textAnchor="middle" fill="#0369a1" fontSize="10" fontWeight="bold">VÁLVULA SERVIÇO</text>
          <rect x="550" y="116" width="105" height="26" rx="4" fill="#38bdf8" fillOpacity="0.25" stroke="#0284c7" strokeDasharray="3" />
          <text x="602" y="130" textAnchor="middle" fill="#0c4a6e" fontSize="9" fontWeight="bold">Pano Úmido / Gel</text>
          <text x="602" y="140" textAnchor="middle" fill="#0284c7" fontSize="8">(Protege Teflon e O-Ring)</text>
          
          <text x="505" y="185" textAnchor="middle" fill="#15803d" fontSize="9" fontWeight="bold">
            ✓ Solda Espelhada e Vedações Preservadas
          </text>
        </svg>
      );

    case "flange":
      return (
        <svg viewBox="0 0 700 220" className="w-full h-auto max-h-60 mx-auto">
          <rect x="10" y="10" width="680" height="200" rx="10" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
          <text x="350" y="32" textAnchor="middle" fill="#0f172a" fontSize="13" fontWeight="bold">
            Geometria do Flange Perfeito a 45°: Projeção de 1,0 a 1,5 mm e Lubrificação POE
          </text>

          {/* Quadrante 1: Medida da Projeção na Mesa */}
          <rect x="30" y="48" width="310" height="150" rx="8" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5" />
          <text x="185" y="66" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="bold">
            1. Calibração da Projeção do Tubo na Mesa
          </text>

          {/* Mesa do Flangeador */}
          <rect x="50" y="125" width="270" height="40" rx="4" fill="#334155" stroke="#0f172a" strokeWidth="1.5" />
          <text x="185" y="148" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">MESA / MORSA DO FLANGEADOR</text>

          {/* Tubo de Cobre passando pela morsa */}
          <rect x="160" y="88" width="50" height="77" fill="#d97706" stroke="#92400e" strokeWidth="1.5" />
          <text x="185" y="112" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">TUBO</text>

          {/* Cota da Projeção */}
          <line x1="225" y1="88" x2="225" y2="125" stroke="#dc2626" strokeWidth="2" />
          <line x1="220" y1="88" x2="230" y2="88" stroke="#dc2626" strokeWidth="2" />
          <line x1="220" y1="125" x2="230" y2="125" stroke="#dc2626" strokeWidth="2" />
          <text x="240" y="110" fill="#dc2626" fontSize="11" fontWeight="bold">1,0 a 1,5 mm</text>
          <text x="240" y="122" fill="#64748b" fontSize="8">(Projeção exata)</text>

          <text x="185" y="183" textAnchor="middle" fill="#475569" fontSize="9">
            Tubo cortado em esquadro (90°) e rebarbado com bocal voltado para baixo.
          </text>

          {/* Quadrante 2: Cone Excêntrico + Gota de Óleo POE */}
          <rect x="360" y="48" width="310" height="150" rx="8" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5" />
          <text x="515" y="66" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="bold">
            2. Prensagem Excêntrica e Lubrificação POE
          </text>

          {/* Cone Excêntrico */}
          <polygon points="485,82 545,82 515,120" fill="#94a3b8" stroke="#475569" strokeWidth="2" />
          <text x="515" y="98" textAnchor="middle" fill="#0f172a" fontSize="9" fontWeight="bold">CONE 45°</text>

          {/* Gota de Óleo */}
          <ellipse cx="515" cy="126" rx="5" ry="7" fill="#38bdf8" />
          <text x="555" y="128" fill="#0284c7" fontSize="10" fontWeight="bold">+ 1 GOTA DE ÓLEO POE</text>
          <text x="555" y="140" fill="#64748b" fontSize="8">(Elimina atrito e trincas)</text>

          {/* Flange Concluído */}
          <polygon points="460,145 570,145 550,165 480,165" fill="#f59e0b" stroke="#b45309" strokeWidth="1.5" />
          <text x="515" y="158" textAnchor="middle" fill="#78350f" fontSize="9" fontWeight="bold">Flange Espelhado 45°</text>

          <rect x="375" y="172" width="280" height="20" rx="3" fill="#fee2e2" />
          <text x="515" y="185" textAnchor="middle" fill="#991b1b" fontSize="9" fontWeight="bold">
            VEDAÇÃO METAL-METAL CÔNICA • PROIBIDO FITA VEDA-ROSCA
          </text>
        </svg>
      );

    case "vacuo":
      return (
        <svg viewBox="0 0 700 220" className="w-full h-auto max-h-60 mx-auto">
          <rect x="10" y="10" width="680" height="200" rx="10" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
          <text x="350" y="32" textAnchor="middle" fill="#0f172a" fontSize="13" fontWeight="bold">
            Procedimento de Desidratação por Vácuo Profundo e Teste de Estabilidade (Decay Test)
          </text>

          {/* Display Vacuômetro Digital */}
          <rect x="35" y="52" width="230" height="140" rx="10" fill="#09090b" stroke="#27272a" strokeWidth="2" />
          <text x="150" y="74" textAnchor="middle" fill="#a1a1aa" fontSize="10" fontWeight="bold">VACUÔMETRO DIGITAL</text>
          
          <rect x="50" y="85" width="200" height="55" rx="6" fill="#18181b" />
          <text x="150" y="122" textAnchor="middle" fill="#22c55e" fontSize="28" fontWeight="bold" fontFamily="monospace">
            280
          </text>
          <text x="215" y="118" fill="#22c55e" fontSize="11" fontWeight="bold">μmHg</text>
          <text x="150" y="134" textAnchor="middle" fill="#4ade80" fontSize="9">ESTÁVEL (META &lt; 500)</text>

          <text x="150" y="165" textAnchor="middle" fill="#e4e4e7" fontSize="10" fontWeight="bold">
            ✓ Sistema Seco e Desidratado
          </text>
          <text x="150" y="179" textAnchor="middle" fill="#71717a" fontSize="8">
            Óleo POE protegido contra acidez
          </text>

          {/* Linha e Extrator Schrader */}
          <rect x="290" y="52" width="375" height="140" rx="8" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5" />
          <text x="477" y="72" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="bold">
            Conexão com Extrator Schrader e Decay Test (15 min)
          </text>

          {/* Extrator de Válvula */}
          <rect x="310" y="90" width="105" height="40" rx="5" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.5" />
          <text x="362" y="108" textAnchor="middle" fill="#0369a1" fontSize="9" fontWeight="bold">Extrator Schrader</text>
          <text x="362" y="122" textAnchor="middle" fill="#0c4a6e" fontSize="8">Sem Núcleo = 4x Mais Rápido</text>

          {/* Mangueira de Vácuo */}
          <path d="M 415 110 L 485 110" stroke="#0284c7" strokeWidth="6" />
          <text x="450" y="102" textAnchor="middle" fill="#0369a1" fontSize="8" fontWeight="bold">Mangueira 3/8"</text>

          {/* Bomba de Vácuo */}
          <rect x="490" y="85" width="155" height="50" rx="6" fill="#fee2e2" stroke="#dc2626" strokeWidth="1.5" />
          <text x="567" y="106" textAnchor="middle" fill="#991b1b" fontSize="10" fontWeight="bold">Bomba Duplo Estágio</text>
          <text x="567" y="122" textAnchor="middle" fill="#dc2626" fontSize="8">Com Válvula Gas Ballast</text>

          {/* Decay Test Banner */}
          <rect x="310" y="148" width="335" height="32" rx="4" fill="#f0fdf4" stroke="#16a34a" strokeWidth="1" />
          <text x="477" y="163" textAnchor="middle" fill="#15803d" fontSize="9" fontWeight="bold">
            TESTE DE SUBIDA (DECAY TEST): Isolar a bomba por 15 minutos
          </text>
          <text x="477" y="174" textAnchor="middle" fill="#166534" fontSize="8">
            Se subir e estabilizar abaixo de 700 μmHg = APROVADO | Se subir até atm = VAZAMENTO
          </text>
        </svg>
      );

    case "balanca":
      return (
        <svg viewBox="0 0 700 220" className="w-full h-auto max-h-60 mx-auto">
          <rect x="10" y="10" width="680" height="200" rx="10" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
          <text x="350" y="32" textAnchor="middle" fill="#0f172a" fontSize="13" fontWeight="bold">
            Carga de Fluido Refrigerante por Massa: Balança Digital e Dosagem Exata em Gramas
          </text>

          {/* Cilindro Invertido */}
          <rect x="50" y="52" width="180" height="140" rx="8" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5" />
          <text x="140" y="70" textAnchor="middle" fill="#0f172a" fontSize="10" fontWeight="bold">Garrafa Invertida (Líquido)</text>
          
          <rect x="80" y="78" width="120" height="70" rx="10" fill="#fed7aa" stroke="#ea580c" strokeWidth="2" />
          <text x="140" y="105" textAnchor="middle" fill="#9a3412" fontSize="11" fontWeight="bold">R-410A / R-32</text>
          <text x="140" y="122" textAnchor="middle" fill="#c2410c" fontSize="9" fontWeight="bold">100% Fase Líquida</text>
          
          {/* Válvula inferior da garrafa */}
          <rect x="130" y="148" width="20" height="15" fill="#334155" />
          <circle cx="140" cy="168" r="6" fill="#0284c7" />

          {/* Mangueira para balança */}
          <path d="M 140 168 L 260 168 L 260 120 L 300 120" stroke="#0284c7" strokeWidth="4" fill="none" />

          {/* Balança Digital */}
          <rect x="305" y="52" width="350" height="140" rx="8" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5" />
          <text x="480" y="70" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="bold">
            Controle de Peso e Carga Adicional de Linha
          </text>

          {/* Visor da Balança */}
          <rect x="330" y="85" width="170" height="50" rx="6" fill="#0f172a" />
          <text x="415" y="118" textAnchor="middle" fill="#38bdf8" fontSize="24" fontWeight="bold" fontFamily="monospace">
            -0.850
          </text>
          <text x="480" y="114" fill="#38bdf8" fontSize="11" fontWeight="bold">kg</text>

          {/* Fórmula Adicional */}
          <rect x="520" y="85" width="120" height="50" rx="6" fill="#f8fafc" stroke="#cbd5e1" />
          <text x="580" y="104" textAnchor="middle" fill="#0f172a" fontSize="9" fontWeight="bold">ADICIONAL LINHA</text>
          <text x="580" y="122" textAnchor="middle" fill="#dc2626" fontSize="11" fontWeight="bold">+20 g/metro</text>

          {/* Aviso Proibitivo */}
          <rect x="325" y="148" width="315" height="32" rx="4" fill="#fef2f2" stroke="#ef4444" strokeWidth="1" />
          <text x="482" y="162" textAnchor="middle" fill="#991b1b" fontSize="9" fontWeight="bold">
            PROIBIDO CARREGAR "NO OLHÔMETRO" PELA PRESSÃO DO MANIFOLD
          </text>
          <text x="482" y="174" textAnchor="middle" fill="#b91c1c" fontSize="8">
            Em compressores Inverter, a Válvula EEV modula e mascara a pressão. Pese sempre na balança.
          </text>
        </svg>
      );

    case "comissionamento":
      return (
        <svg viewBox="0 0 700 220" className="w-full h-auto max-h-60 mx-auto">
          <rect x="10" y="10" width="680" height="200" rx="10" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
          <text x="350" y="32" textAnchor="middle" fill="#0f172a" fontSize="13" fontWeight="bold">
            Roteiro Oficial de Comissionamento e Start-up Técnico em Bancada (Oficina Integrada)
          </text>

          {/* Card 1: Mecânica & Brasagem */}
          <rect x="25" y="50" width="150" height="138" rx="8" fill="#ffffff" stroke="#f59e0b" strokeWidth="1.5" />
          <rect x="25" y="50" width="150" height="24" rx="8" fill="#fef3c7" />
          <text x="100" y="66" textAnchor="middle" fill="#92400e" fontSize="10" fontWeight="bold">1. MECÂNICA / SOLDA</text>
          <text x="35" y="92" fill="#334155" fontSize="9">• Flange 1,0-1,5 mm</text>
          <text x="35" y="112" fill="#334155" fontSize="9">• Óleo POE no cone</text>
          <text x="35" y="132" fill="#334155" fontSize="9">• N₂ passante (1-3 PSI)</text>
          <text x="35" y="152" fill="#334155" fontSize="9">• Pano úmido na válvula</text>
          <text x="35" y="172" fill="#b45309" fontSize="8" fontWeight="bold">✓ Torque N·m aferido</text>

          {/* Card 2: Estanqueidade & Vácuo */}
          <rect x="185" y="50" width="150" height="138" rx="8" fill="#ffffff" stroke="#0284c7" strokeWidth="1.5" />
          <rect x="185" y="50" width="150" height="24" rx="8" fill="#e0f2fe" />
          <text x="260" y="66" textAnchor="middle" fill="#075985" fontSize="10" fontWeight="bold">2. TESTES & VÁCUO</text>
          <text x="195" y="92" fill="#334155" fontSize="9">• N₂ seco a 450 PSIG</text>
          <text x="195" y="112" fill="#334155" fontSize="9">• Teste com espuma neutra</text>
          <text x="195" y="132" fill="#334155" fontSize="9">• Extrator de Schrader</text>
          <text x="195" y="152" fill="#334155" fontSize="9">• Vácuo &lt; 500 μmHg</text>
          <text x="195" y="172" fill="#0369a1" fontSize="8" fontWeight="bold">✓ Decay Test por 15 min</text>

          {/* Card 3: Carga de Gás */}
          <rect x="345" y="50" width="150" height="138" rx="8" fill="#ffffff" stroke="#10b981" strokeWidth="1.5" />
          <rect x="345" y="50" width="150" height="24" rx="8" fill="#d1fae5" />
          <text x="420" y="66" textAnchor="middle" fill="#065f46" fontSize="10" fontWeight="bold">3. CARGA EM BALANÇA</text>
          <text x="355" y="92" fill="#334155" fontSize="9">• Quebra de vácuo c/ fluido</text>
          <text x="355" y="112" fill="#334155" fontSize="9">• Balança digital calibrada</text>
          <text x="355" y="132" fill="#334155" fontSize="9">• R-410A em fase líquida</text>
          <text x="355" y="152" fill="#334155" fontSize="9">• +20g/m adicional tubos</text>
          <text x="355" y="172" fill="#047857" fontSize="8" fontWeight="bold">✓ Massa de placa exata</text>

          {/* Card 4: Termometria & Laudo */}
          <rect x="505" y="50" width="170" height="138" rx="8" fill="#ffffff" stroke="#dc2626" strokeWidth="1.5" />
          <rect x="505" y="50" width="170" height="24" rx="8" fill="#fee2e2" />
          <text x="590" y="66" textAnchor="middle" fill="#991b1b" fontSize="10" fontWeight="bold">4. LAUDO TÉRMICO</text>
          <text x="515" y="92" fill="#334155" fontSize="9">• Superaquecimento: 4 a 8 K</text>
          <text x="515" y="112" fill="#334155" fontSize="9">• Subresfriamento: 5 a 10 K</text>
          <text x="515" y="132" fill="#334155" fontSize="9">• Salto Térmico ΔT: 10-15 °C</text>
          <text x="515" y="152" fill="#334155" fontSize="9">• Corrente (A) True RMS</text>
          <text x="515" y="172" fill="#b91c1c" fontSize="8" fontWeight="bold">✓ Start-up Aprovado e PMOC</text>
        </svg>
      );

    case "eletricidade_diagrama":
    default:
      return (
        <svg viewBox="0 0 700 220" className="w-full h-auto max-h-60 mx-auto">
          <rect x="10" y="10" width="680" height="200" rx="10" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
          <text x="350" y="35" textAnchor="middle" fill="#0f172a" fontSize="13" fontWeight="bold">
            Diagrama de Interligação Elétrica e Sinal Serial — Split Inverter (L, N, S, PE)
          </text>

          <rect x="40" y="55" width="150" height="135" rx="8" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2" />
          <text x="115" y="75" textAnchor="middle" fill="#075985" fontSize="11" fontWeight="bold">EVAPORADORA</text>
          <text x="155" y="100" textAnchor="end" fill="#dc2626" fontSize="11" fontWeight="bold">Borne L (1)</text>
          <text x="155" y="125" textAnchor="end" fill="#0284c7" fontSize="11" fontWeight="bold">Borne N (2)</text>
          <text x="155" y="150" textAnchor="end" fill="#d97706" fontSize="11" fontWeight="bold">Borne S (3)</text>
          <text x="155" y="175" textAnchor="end" fill="#16a34a" fontSize="11" fontWeight="bold">Terra (PE)</text>

          <rect x="510" y="55" width="150" height="135" rx="8" fill="#fee2e2" stroke="#dc2626" strokeWidth="2" />
          <text x="585" y="75" textAnchor="middle" fill="#991b1b" fontSize="11" fontWeight="bold">CONDENSADORA</text>
          <text x="545" y="100" textAnchor="start" fill="#dc2626" fontSize="11" fontWeight="bold">Borne L (1)</text>
          <text x="545" y="125" textAnchor="start" fill="#0284c7" fontSize="11" fontWeight="bold">Borne N (2)</text>
          <text x="545" y="150" textAnchor="start" fill="#d97706" fontSize="11" fontWeight="bold">Borne S (3)</text>
          <text x="545" y="175" textAnchor="start" fill="#16a34a" fontSize="11" fontWeight="bold">Terra (PE)</text>

          <line x1="165" y1="96" x2="535" y2="96" stroke="#dc2626" strokeWidth="3" />
          <line x1="165" y1="121" x2="535" y2="121" stroke="#0284c7" strokeWidth="3" />
          <line x1="165" y1="146" x2="535" y2="146" stroke="#d97706" strokeWidth="3" />
          <line x1="165" y1="171" x2="535" y2="171" stroke="#16a34a" strokeWidth="3" strokeDasharray="5" />

          <rect x="285" y="110" width="130" height="50" rx="6" fill="#1e293b" />
          <text x="350" y="130" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="bold">TESTE SERIAL (VDC)</text>
          <text x="350" y="146" textAnchor="middle" fill="#fde047" fontSize="10" fontWeight="bold">N ↔ S: 0V a 24V (Oscila)</text>
        </svg>
      );
  }
}

export default function PrintableLessonModal({ material, moduleTitle, onClose }: Props) {
  if (!material) return null;

  const handlePrint = () => {
    printElementById("printable-technical-sheet", {
      title: `${material.fullTitle} • Apostila Técnica A4`,
      pageMargin: "10mm 10mm",
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto print:static print:bg-white print:p-0 print:block">
      <div className="bg-zinc-950 border border-white/15 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden print:max-w-none print:max-h-none print:border-none print:rounded-none print:bg-white">
        
        <div className="no-print print:hidden flex items-center justify-between px-6 py-4 bg-black/80 border-b border-white/10 shrink-0">
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

        <div className="overflow-y-auto p-4 sm:p-8 bg-zinc-900/60 print:p-0 print:bg-white">
          <div
            id="printable-technical-sheet"
            className="bg-white text-slate-900 rounded-xl p-6 sm:p-10 shadow-xl max-w-3xl mx-auto space-y-6 border border-slate-200"
          >
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

            <div className="bg-slate-50 border-l-4 border-red-600 p-4 rounded-r-lg">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Definição Técnica Fundamental
              </h2>
              <p className="text-sm font-medium text-slate-800 leading-relaxed">
                {material.shortSummary}
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl p-4 bg-white">
              <TechnicalDiagram type={material.diagramType} />
              <p className="text-xs text-center text-slate-600 font-medium mt-2 italic">
                {material.diagramCaption}
              </p>
            </div>

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