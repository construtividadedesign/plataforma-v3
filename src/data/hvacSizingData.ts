/**
 * BANCO DE DADOS TÉCNICO DE DIMENSIONAMENTO E CARGA TÉRMICA (HVAC-R)
 * Tabelas normativas de insolação, fatores térmicos e 4 estudos de caso aprofundados.
 */

export interface SizingReferenceFactor {
  category: "Insolação / Envoltória" | "Ocupantes" | "Iluminação" | "Equipamentos" | "Vidros e Janelas" | "Infiltração e Ar Externo";
  factorName: string;
  baseValue: number;
  unit: string;
  description: string;
  impactLevel: "Baixo" | "Médio" | "Alto" | "Crítico";
}

export interface CommercialSplitModel {
  btu: number;
  tr: number;
  recommendedAreaMin: number;
  recommendedAreaMax: number;
  idealApplication: string;
  recommendedBreaker: string;
  copperPiping: string;
}

export interface SizingCaseStudy {
  id: string;
  caseNumber: number;
  title: string;
  buildingType: "Residencial" | "Comercial" | "Hospitalar / Clínico" | "Auditório / Eventos";
  badgeColor: string;
  subtitle: string;
  architecturalContext: string;
  dimensionsAndVariables: {
    areaM2: number;
    ceilingHeightM: number;
    volumeM3: number;
    occupancy: string;
    solarOrientation: string;
    lighting: string;
    equipment: string;
    windowsAndGlass: string;
    ventilationAndInfiltration: string;
  };
  calculationSteps: {
    stepNumber: number;
    stepTitle: string;
    formula: string;
    detail: string;
    partialBtu: number;
  }[];
  subtotalBtu: number;
  safetyMarginPercent: number;
  safetyMarginBtu: number;
  finalBtu: number;
  finalTr: number;
  equipmentRecommendation: {
    systemType: string;
    units: string;
    pipingAndElectrical: string;
    airflowAndFiltration: string;
  };
  engineeringNotes: string[];
}

// ============================================================================
// 1. TABELA DE REFERÊNCIA DE FATORES DE CARGA TÉRMICA
// ============================================================================
export const hvacSizingFactors: SizingReferenceFactor[] = [
  {
    category: "Insolação / Envoltória",
    factorName: "Ambiente na Sombra ou Sol da Manhã",
    baseValue: 600,
    unit: "BTU/h por m²",
    description: "Ambientes com paredes protegidas, orientação Leste/Sul ou sob outra laje habitada.",
    impactLevel: "Médio",
  },
  {
    category: "Insolação / Envoltória",
    factorName: "Sol da Tarde (Poente) ou Cobertura",
    baseValue: 800,
    unit: "BTU/h por m²",
    description: "Fachadas Oeste, incidência solar vespertina direta ou sob telhado de fibrocimento/telha sem forro isolante.",
    impactLevel: "Alto",
  },
  {
    category: "Insolação / Envoltória",
    factorName: "Laje Exposta ao Sol Pleno o Dia Todo",
    baseValue: 900,
    unit: "BTU/h por m²",
    description: "Laje plana de concreto sem isolamento térmico (EPS/poliuretano) exposta ao calor diurno contínuo.",
    impactLevel: "Crítico",
  },
  {
    category: "Ocupantes",
    factorName: "Pessoa Adicional (Repouso / Escritório)",
    baseValue: 600,
    unit: "BTU/h por pessoa",
    description: "Dissipação metabólica média: ~250 BTU/h calor sensível + ~350 BTU/h calor latente (transpiração).",
    impactLevel: "Médio",
  },
  {
    category: "Ocupantes",
    factorName: "Pessoa Adicional (Atividade Física / Movimento)",
    baseValue: 900,
    unit: "BTU/h por pessoa",
    description: "Ambientes comerciais movimentados, academias ou pessoas transitando frequentemente.",
    impactLevel: "Alto",
  },
  {
    category: "Iluminação",
    factorName: "Iluminação LED Moderna",
    baseValue: 3.41,
    unit: "BTU/h por Watt",
    description: "Alta eficiência luminosa: emite menor radiação térmica direta se comparada a halógenas.",
    impactLevel: "Baixo",
  },
  {
    category: "Iluminação",
    factorName: "Lâmpadas Incandescentes / Halógenas de Destaque",
    baseValue: 3.41,
    unit: "BTU/h por Watt (alta densidade)",
    description: "Até 90% da energia consumida é convertida diretamente em radiação infravermelha no recinto.",
    impactLevel: "Alto",
  },
  {
    category: "Equipamentos",
    factorName: "Computador Desktop + Monitor",
    baseValue: 700,
    unit: "BTU/h por máquina",
    description: "Dissipação por fonte de alimentação, placa-mãe, CPU e tela em operação normal (~200W).",
    impactLevel: "Médio",
  },
  {
    category: "Equipamentos",
    factorName: "Notebook / Laptop Corporativo",
    baseValue: 250,
    unit: "BTU/h por aparelho",
    description: "Aparelho portátil com gerenciamento térmico eficiente (~70W de consumo médio).",
    impactLevel: "Baixo",
  },
  {
    category: "Equipamentos",
    factorName: "Televisor Grande Porte (55 a 75 polegadas)",
    baseValue: 500,
    unit: "BTU/h por tela",
    description: "Dissipação térmica de backlight LED, circuitos eletrônicos e fontes de alta potência.",
    impactLevel: "Baixo",
  },
  {
    category: "Equipamentos",
    factorName: "Projetor Multimídia de Alta Potência",
    baseValue: 1200,
    unit: "BTU/h por projetor",
    description: "Lâmpadas de arco de mercúrio ou fontes laser de alto fluxo que dissipam entre 300W e 450W.",
    impactLevel: "Alto",
  },
  {
    category: "Vidros e Janelas",
    factorName: "Vidro Exposto ao Sol Sem Cortina",
    baseValue: 600,
    unit: "BTU/h por m² de vidro",
    description: "Efeito estufa: radiação de ondas curtas atravessa o vidro e fica retida na forma de calor sensível.",
    impactLevel: "Crítico",
  },
  {
    category: "Vidros e Janelas",
    factorName: "Vidro com Cortina / Película Solar / Brise",
    baseValue: 250,
    unit: "BTU/h por m² de vidro",
    description: "A reflexão e a barreira mecânica reduzem a penetração da radiação direta no ambiente.",
    impactLevel: "Médio",
  },
  {
    category: "Infiltração e Ar Externo",
    factorName: "Porta de Alto Fluxo Aberta (Comércio de Rua)",
    baseValue: 15,
    unit: "% de acréscimo",
    description: "Entrada maciça de ar exterior quente e úmido que sobrecarrega a serpentina evaporadora.",
    impactLevel: "Crítico",
  },
];

// ============================================================================
// 2. MODELOS COMERCIAIS DE SPLIT E ESPECIFICAÇÕES
// ============================================================================
export const commercialSplitModels: CommercialSplitModel[] = [
  {
    btu: 9000,
    tr: 0.75,
    recommendedAreaMin: 9,
    recommendedAreaMax: 15,
    idealApplication: "Quartos pequenos, consultórios individuais, home office até 12m².",
    recommendedBreaker: "Disjuntor Bipolar Curva C 10A ou 16A",
    copperPiping: "1/4' (Linha de Líquido) e 3/8' (Linha de Sucção)",
  },
  {
    btu: 12000,
    tr: 1.0,
    recommendedAreaMin: 14,
    recommendedAreaMax: 20,
    idealApplication: "Quartos de casal, salas residenciais médias, escritórios até 18m².",
    recommendedBreaker: "Disjuntor Bipolar Curva C 16A",
    copperPiping: "1/4' (Linha de Líquido) e 3/8' ou 1/2' (Linha de Sucção)",
  },
  {
    btu: 18000,
    tr: 1.5,
    recommendedAreaMin: 20,
    recommendedAreaMax: 30,
    idealApplication: "Salas de estar grandes, consultórios com fluxo de pessoas, salas de aula pequenas.",
    recommendedBreaker: "Disjuntor Bipolar Curva C 20A",
    copperPiping: "1/4' (Linha de Líquido) e 1/2' (Linha de Sucção)",
  },
  {
    btu: 24000,
    tr: 2.0,
    recommendedAreaMin: 28,
    recommendedAreaMax: 40,
    idealApplication: "Espaços integrados, lojas comerciais médias, academias compactas.",
    recommendedBreaker: "Disjuntor Bipolar Curva C 20A ou 25A",
    copperPiping: "3/8' (Linha de Líquido) e 5/8' (Linha de Sucção)",
  },
  {
    btu: 30000,
    tr: 2.5,
    recommendedAreaMin: 38,
    recommendedAreaMax: 50,
    idealApplication: "Comércios com fluxo moderado, restaurantes, clínicas médicas.",
    recommendedBreaker: "Disjuntor Bipolar Curva C 25A",
    copperPiping: "3/8' (Linha de Líquido) e 5/8' (Linha de Sucção)",
  },
  {
    btu: 36000,
    tr: 3.0,
    recommendedAreaMin: 45,
    recommendedAreaMax: 60,
    idealApplication: "Piso-Teto ou Cassete em lojas, salas de reunião executivas e igrejas médias.",
    recommendedBreaker: "Disjuntor Trifásico / Bipolar Curva C 25A ou 32A",
    copperPiping: "3/8' (Linha de Líquido) e 3/4' (Linha de Sucção)",
  },
  {
    btu: 48000,
    tr: 4.0,
    recommendedAreaMin: 60,
    recommendedAreaMax: 80,
    idealApplication: "Lojas de departamentos, buffets, restaurantes e auditórios médios.",
    recommendedBreaker: "Disjuntor Trifásico Curva C 32A",
    copperPiping: "3/8' (Linha de Líquido) e 3/4' ou 7/8' (Linha de Sucção)",
  },
  {
    btu: 60000,
    tr: 5.0,
    recommendedAreaMin: 75,
    recommendedAreaMax: 100,
    idealApplication: "Grandes áreas comerciais, galpões de conferência e clínicas cirúrgicas.",
    recommendedBreaker: "Disjuntor Trifásico Curva C 40A",
    copperPiping: "3/8' ou 1/2' (Líquido) e 7/8' ou 1.1/8' (Sucção)",
  },
];

// ============================================================================
// 3. OS 4 ESTUDOS DE CASO DE AVALIAÇÃO PRÁTICA
// ============================================================================
export const hvacSizingCaseStudies: SizingCaseStudy[] = [
  // --------------------------------------------------------------------------
  // CASO 1: RESIDÊNCIA
  // --------------------------------------------------------------------------
  {
    id: "caso-1-residencia",
    caseNumber: 1,
    title: "Residência Unifamiliar — Suíte Master & Sala de Estar Integrada",
    buildingType: "Residencial",
    badgeColor: "emerald",
    subtitle: "Dimensionamento com insolação matinal e poente em casa térrea com forro de gesso",
    architecturalContext:
      "Edificação residencial térrea de alvenaria convencional (tijolo cerâmico 8 furos rebocado), forro de gesso acartonado sob telhado cerâmico colonial com laje de forro. O projeto contempla dois setores térmicos distintos: a Suíte Master voltada para o Leste (sol matinal) e a Sala de Estar integrada com cozinha gourmet voltada para o Oeste (sol intenso poente com ampla porta envidraçada).",
    dimensionsAndVariables: {
      areaM2: 50, // 18m² suíte + 32m² sala integrada
      ceilingHeightM: 2.7,
      volumeM3: 135,
      occupancy: "Suíte: 2 adultos permanentes. Sala de Estar: 4 pessoas frequentes (pico de até 6 em reuniões sociais).",
      solarOrientation: "Suíte com insolação Leste (sol suave da manhã até 10h30). Sala voltada a Oeste (sol forte das 13h30 às 18h).",
      lighting: "Iluminação 100% LED: Suíte com 40W (plafon + arandelas); Sala com 80W (spots de embutir e fita LED).",
      equipment: "Suíte: 1 TV LED 55' (120W) + 1 Notebook. Sala: 1 Smart TV 65' (180W), 1 Geladeira Frost-Free e coifa.",
      windowsAndGlass: "Suíte: Janela de alumínio 2,00m x 1,20m com cortina blackout espessa. Sala: Porta de correr 3,00m x 2,10m com persiana solar.",
      ventilationAndInfiltration: "Infiltração residencial normal (portas e janelas bem vedadas com borracha de vedação acústica).",
    },
    calculationSteps: [
      {
        stepNumber: 1,
        stepTitle: "Setor 1 (Suíte Master - 18 m²): Carga Base de Área e Sol da Manhã",
        formula: "18 m² × 600 BTU/h/m²",
        detail: "Ambiente com sol matinal ameno e laje isolada sob telhado: fator padrão de 600 BTU/h/m² incluindo a 1ª pessoa.",
        partialBtu: 10800,
      },
      {
        stepNumber: 2,
        stepTitle: "Setor 1 (Suíte Master): Ocupante Adicional + Eletrônicos",
        formula: "1 pessoa extra (600 BTU/h) + TV/Notebook (800 BTU/h) + Iluminação (400 BTU/h)",
        detail: "Soma das cargas internas sensíveis e latentes dos ocupantes e aparelhos eletrônicos.",
        partialBtu: 1800,
      },
      {
        stepNumber: 3,
        stepTitle: "Setor 1 (Suíte Master): Subtotal e Margem de Segurança (+10%)",
        formula: "(10.800 + 1.800) × 1,10",
        detail: "Garante resposta rápida de resfriamento (pulldown) e operação contínua do Inverter em frequência econômica.",
        partialBtu: 13860,
      },
      {
        stepNumber: 4,
        stepTitle: "Setor 2 (Sala de Estar Integrada - 32 m²): Carga Base com Sol Poente",
        formula: "32 m² × 800 BTU/h/m²",
        detail: "Fachada voltada a Oeste com alta penetração térmica de pico no período da tarde: fator de 800 BTU/h/m².",
        partialBtu: 25600,
      },
      {
        stepNumber: 5,
        stepTitle: "Setor 2 (Sala Integrada): Pessoas Extras + Eletrodomésticos + Radiação de Vidro",
        formula: "3 pessoas extras (1.800 BTU) + TV/Geladeira (1.400 BTU) + Vidro 6,3m² poente (1.200 BTU) + Luz (300 BTU)",
        detail: "Carga interna com ocupação plena e irradiação solar filtrada pela persiana na porta de correr.",
        partialBtu: 4700,
      },
      {
        stepNumber: 6,
        stepTitle: "Setor 2 (Sala Integrada): Subtotal e Margem de Segurança (+10%)",
        formula: "(25.600 + 4.700) × 1,10",
        detail: "Compensa a abertura eventual da porta para o jardim e calor sensível adicional da cozinha.",
        partialBtu: 33330,
      },
    ],
    subtotalBtu: 42900,
    safetyMarginPercent: 10,
    safetyMarginBtu: 4290,
    finalBtu: 47190,
    finalTr: 3.93,
    equipmentRecommendation: {
      systemType: "Sistemas Split Hi-Wall Inverter Independentes (Gás R-32 ou R-410A)",
      units: "Suíte: 1x Split Hi-Wall Inverter de 12.000 BTU/h (ou 18.000 BTU/h para refrigeração ultra-rápida). Sala: 1x Split Hi-Wall ou Piso-Teto de 36.000 BTU/h (ou 2x 18.000 BTU/h para distribuição uniforme em 'L').",
      pipingAndElectrical: "Suíte: Linhas 1/4' e 3/8', disjuntor 16A curva C. Sala: Linhas 3/8' e 5/8' (ou 3/4'), disjuntor 25A curva C individualizado.",
      airflowAndFiltration: "Filtros antibacterianos laváveis com carvão ativado para retenção de odores domésticos e poeira.",
    },
    engineeringNotes: [
      "Evitar instalar a evaporadora da suíte diretamente alinhada sobre a cabeceira da cama para não causar desconforto térmico por jato de ar frio direto nos ocupantes.",
      "A tecnologia Inverter é indispensável para a suíte: modula a rotação do compressor em cargas parciais noturnas, mantendo o nível de ruído em menos de 22 dB(A).",
      "Na sala integrada, priorizar a condensadora instalada em suporte antivibratório na parede externa leste/sul para evitar que o calor do sol da tarde prejudique a condensação do fluido frigorífico.",
    ],
  },

  // --------------------------------------------------------------------------
  // CASO 2: COMÉRCIO
  // --------------------------------------------------------------------------
  {
    id: "caso-2-comercio",
    caseNumber: 2,
    title: "Comércio Varejista — Loja de Vestuário com Fachada Envidraçada e Porta Aberta",
    buildingType: "Comercial",
    badgeColor: "amber",
    subtitle: "Carga de infiltração maciça por porta de rua aberta e irradiação solar em vitrine de 24 m²",
    architecturalContext:
      "Loja de calçados e vestuário em galeria comercial de rua, com área útil de 65 m² e pé-direito elevado de 3,50 m (Volume de 227,5 m³). A fachada principal é 100% envidraçada (vitrine de 8,00m de largura por 3,00m de altura em vidro temperado incolor de 10mm) com a porta de acesso de 2,00m mantida constantemente aberta durante o horário comercial para atração visual dos clientes.",
    dimensionsAndVariables: {
      areaM2: 65,
      ceilingHeightM: 3.5,
      volumeM3: 227.5,
      occupancy: "3 funcionários fixos em pé + média de 12 clientes circulando simultaneamente (total 15 pessoas).",
      solarOrientation: "Fachada Oeste: sol da tarde incide perpendicularmente na vitrine das 14h às 17h30.",
      lighting: "Alta densidade luminosa de vitrine: 40 spots LED direcionais de 30W cada (total 1.200W = 4.092 BTU/h).",
      equipment: "2 terminais de computadores PDV no balcão, 1 impressora térmica de cupom fiscal e sistema de som ambiente.",
      windowsAndGlass: "Vitrine frontal de 24 m² sem película de proteção solar (vidro transparente de alta transmissão térmica).",
      ventilationAndInfiltration: "CRÍTICA: Porta aberta de 2,00m de vão livre. Convecção natural faz o ar quente da calçada (34°C) invadir o recinto continuamente.",
    },
    calculationSteps: [
      {
        stepNumber: 1,
        stepTitle: "Carga Estrutural e Condução Base (65 m²)",
        formula: "65 m² × 800 BTU/h/m²",
        detail: "Base comercial para ambiente com pé-direito de 3,50m e intensa insolação poente na fachada.",
        partialBtu: 52000,
      },
      {
        stepNumber: 2,
        stepTitle: "Ocupação Comercial em Movimento (14 Pessoas Extras)",
        formula: "14 pessoas × 600 BTU/h",
        detail: "Carga metabólica mista de funcionários trabalhando em pé e clientes entrando e saindo da loja.",
        partialBtu: 8400,
      },
      {
        stepNumber: 3,
        stepTitle: "Iluminação de Destaque de Vitrine (1.200 Watts)",
        formula: "1.200 W × 3,412 BTU/h/W",
        detail: "Dissipação contínua de 40 luminárias tipo spot focadas nas roupas e manequins de exposição.",
        partialBtu: 4094,
      },
      {
        stepNumber: 4,
        stepTitle: "Equipamentos do Caixa / PDV e Áudio",
        formula: "2 Computadores (1.400 BTU) + Áudio e Periféricos (600 BTU)",
        detail: "Dissipação de calor sensível dos computadores de emissão de nota, nobreak e amplificador.",
        partialBtu: 2000,
      },
      {
        stepNumber: 5,
        stepTitle: "Radiação Solar Direta Através do Vidro da Vitrine (24 m²)",
        formula: "24 m² × 600 BTU/h/m² de vidro",
        detail: "Intensa carga térmica solar transmitida por radiação infravermelha sem barreira mecânica ou película.",
        partialBtu: 14400,
      },
      {
        stepNumber: 6,
        stepTitle: "Acréscimo por Infiltração de Ar Exterior (Porta Aberta)",
        formula: "+15% sobre a carga sensível acumulada (80.894 × 0,15)",
        detail: "Massa de ar externo quente e úmido que invade a loja pela porta de pedestres desprovida de barreira térmica.",
        partialBtu: 12134,
      },
    ],
    subtotalBtu: 93028,
    safetyMarginPercent: 10,
    safetyMarginBtu: 9303,
    finalBtu: 102331,
    finalTr: 8.53,
    equipmentRecommendation: {
      systemType: "Duas Unidades Split Cassete 4 Vias Inverter ou Piso-Teto + Cortina de Ar Frontal",
      units: "Climatização: 2x Splits Cassete Inverter de 48.000 BTU/h (4 TR cada) ou 2x Piso-Teto 48.000 a 60.000 BTU/h. Barreira: 1x Cortina de Ar de 2,00m (vazão de ar mínima 1.800 m³/h) sobre o vão de entrada.",
      pipingAndElectrical: "Alimentação Trifásica 220V ou 380V. Dois disjuntores tripolares de 32A curva C independentes.",
      airflowAndFiltration: "O fluxo de ar dos Cassetes de 4 vias distribui o ar a 360°, eliminando zonas de estagnação de ar quente entre as araras.",
    },
    engineeringNotes: [
      "A instalação da CORTINA DE AR sobre o vão da porta é MANDATÓRIA: reduz em até 70% a penetração de ar quente da rua, evitando que a máquina trabalhe em sobrecarga permanente com congelamento de serpentina.",
      "A aplicação de película reflexiva de controle solar (fator de redução solar de 60%) na vitrine economizaria aproximadamente 8.000 BTU/h na carga de pico diária.",
      "A drenagem dos evaporadores Cassete exige o uso das bombas de dreno integradas originais de fábrica com sifão na saída para não retornar mau cheiro da rede pluvial.",
    ],
  },

  // --------------------------------------------------------------------------
  // CASO 3: HOSPITAL
  // --------------------------------------------------------------------------
  {
    id: "caso-3-hospital",
    caseNumber: 3,
    title: "Estabelecimento Assistencial de Saúde — Ala de Internação e Sala de Exames",
    buildingType: "Hospitalar / Clínico",
    badgeColor: "sky",
    subtitle: "Conformidade sanitária NBR 7256 / RDC 50 ANVISA, taxa de renovação e filtragem G4 + F9",
    architecturalContext:
      "Ala de internação hospitalar e exames clínicos de diagnóstico rápido em clínica de saúde com área de 50 m² e pé-direito de 3,00 m (Volume de 150 m³). O ambiente exige rígido controle de biossegurança contra contaminação cruzada, umidade relativa controlada entre 45% e 55% para inibir a proliferação de esporos de fungos, e vazão obrigatória de renovação de ar externo para diluição de aerossóis biológicos conforme NBR 7256 e Portaria 3.523/MS.",
    dimensionsAndVariables: {
      areaM2: 50,
      ceilingHeightM: 3.0,
      volumeM3: 150,
      occupancy: "4 pacientes em leitos + 4 acompanhantes + 2 profissionais médicos/enfermeiros (total 10 pessoas).",
      solarOrientation: "Paredes internas com isolamento térmico, janelas de vidro duplo seladas (sem abertura basculante).",
      lighting: "Iluminação hospitalar estéril e difusa: 400W LED em luminárias de embutir seladas com grau de proteção IP65.",
      equipment: "4 monitores multiparamétricos, 1 ultrassom de bancada, 1 refrigerador para medicamentos termolábeis e 2 computadores.",
      windowsAndGlass: "Janelas duplas hermeticamente vedadas para impedir infiltração de ar poluído e garantir estanqueidade da pressão positiva.",
      ventilationAndInfiltration: "RENOVAÇÃO DE AR OBRIGATÓRIA: Mínimo de 6 a 8 trocas/hora de ar exterior tratado (900 a 1.200 m³/h de ar novo com pré-filtragem).",
    },
    calculationSteps: [
      {
        stepNumber: 1,
        stepTitle: "Carga de Condução e Transmissão de Envoltória (50 m²)",
        formula: "50 m² × 700 BTU/h/m²",
        detail: "Considera paredes internas e necessidade de manter o recinto em temperatura estável de 22°C constante.",
        partialBtu: 35000,
      },
      {
        stepNumber: 2,
        stepTitle: "Carga Metabólica dos Ocupantes (9 Pessoas Extras)",
        formula: "9 pessoas × 700 BTU/h",
        detail: "Fator elevado de calor latente decorrente da respiração de pacientes febris e pessoal clínico em atividade.",
        partialBtu: 6300,
      },
      {
        stepNumber: 3,
        stepTitle: "Equipamentos Médicos de Monitoramento e TI",
        formula: "4 Monitores (2.000 BTU) + Ultrassom (1.800 BTU) + Geladeira/TI (2.000 BTU)",
        detail: "Calor sensível dissipado pelos monitores de sinais vitais, bombas de infusão e computadores de prontuário.",
        partialBtu: 5800,
      },
      {
        stepNumber: 4,
        stepTitle: "Iluminação Hospitalar Difusa (400 Watts)",
        formula: "400 W × 3,412 BTU/h/W",
        detail: "Carga contínua das luminárias hospitalares em operação 24 horas por dia.",
        partialBtu: 1365,
      },
      {
        stepNumber: 5,
        stepTitle: "Carga Psicrométrica de Renovação de Ar Externo (900 m³/h)",
        formula: "Vazão 900 m³/h: Resfriamento e desumidificação do ar externo de 32°C / 70% UR para 22°C / 50% UR",
        detail: "Trabalho termodinâmico para retirar o calor e a umidade do ar admitido pela tomada de ar exterior.",
        partialBtu: 22500,
      },
    ],
    subtotalBtu: 70965,
    safetyMarginPercent: 15,
    safetyMarginBtu: 10645,
    finalBtu: 81610,
    finalTr: 6.8,
    equipmentRecommendation: {
      systemType: "Split Duto Inverter (Duct Split) com Caixa de Tomada de Ar Externo e Filtragem F9",
      units: "1x Sistema Split Duto de Alta Pressão Estática de 90.000 BTU/h (7,5 TR) ou 2x Split Duto de 48.000 BTU/h (4 TR cada) para redundância hospitalar.",
      pipingAndElectrical: "Quadro elétrico com nobreak hospitalar dedicado para manter a climatização e ventilação em caso de queda de energia da rede.",
      airflowAndFiltration: "Caixa plenum com pré-filtro classe G4 (grosso) + filtro fino classe F9 (eficiência superior a 95% para partículas de 0,4 micra) e difusores de ar hospitalares com registro de balanceamento.",
    },
    engineeringNotes: [
      "É ESTRITAMENTE PROIBIDO pelo Anexo I da NBR 7256 o uso de aparelhos do tipo Split Hi-Wall com recirculação direta de ar de 100% sem tomada de ar externo em áreas de internação.",
      "A sala deve operar em PRESSÃO POSITIVA (+15 Pa) em relação ao corredor de circulação para impedir que germes e vírus do corredor penetrem na ala de pacientes imunes.",
      "O controle de umidade relativa deve possuir sensores de segurança: se a umidade subir acima de 60%, a serpentina deve ser acionada em modo desumidificação com reaquecimento para não baixar excessivamente a temperatura ambiente.",
    ],
  },

  // --------------------------------------------------------------------------
  // CASO 4: AUDITÓRIO DE GRANDE PORTE
  // --------------------------------------------------------------------------
  {
    id: "caso-4-auditorio",
    caseNumber: 4,
    title: "Centro de Convenções — Auditório de Grande Porte para 250 Pessoas",
    buildingType: "Auditório / Eventos",
    badgeColor: "rose",
    subtitle: "Concentração máxima de calor humano sensível e latente, renovação maciça de 6.885 m³/h e acústica NC-30",
    architecturalContext:
      "Auditório corporativo e universitário de grande porte com 280 m² de área de plateia e palco, e pé-direito médio inclinado de 5,00 m (Volume total de 1.400 m³). O ambiente possui tratamento acústico completo com paredes duplas revestidas de lã de rocha e painéis perfurados em madeira (sem janelas externas). Os maiores desafios são a dissipação térmica humana em lotação esgotada e o ruído dos ventiladores, que não pode ultrapassar a curva de ruído NC-30.",
    dimensionsAndVariables: {
      areaM2: 280,
      ceilingHeightM: 5.0,
      volumeM3: 1400,
      occupancy: "250 espectadores sentados na plateia + 5 palestrantes/técnicos de som e iluminação no palco (total 255 pessoas).",
      solarOrientation: "Ambiente enclausurado no miolo da edificação (sem incidência solar direta em janelas; paredes e forro isolados).",
      lighting: "Iluminação geral dimerizável + refletores de palco DMX: total de 3.500 Watts de potência elétrica (11.942 BTU/h).",
      equipment: "1 Projetor Laser Profissional de 12.000 ANSI lúmens (3.800 BTU/h) + Racks de amplificadores de áudio, computadores de streaming e cabine técnica (6.200 BTU/h).",
      windowsAndGlass: "0 m² de janelas (totalmente cego para retenção acústica de áudio profissional).",
      ventilationAndInfiltration: "RENOVAÇÃO DE AR SEGUNDO NBR 16401 / RE 09 ANVISA: Mínimo de 27 m³/h por pessoa = 255 × 27 = 6.885 m³/h de ar novo filtrado.",
    },
    calculationSteps: [
      {
        stepNumber: 1,
        stepTitle: "Carga de Transmissão Estrutural e Forro (280 m²)",
        formula: "280 m² × 450 BTU/h/m²",
        detail: "Carga de envoltória reduzida devido ao isolamento acústico em lã mineral nas paredes e laje de cobertura.",
        partialBtu: 126000,
      },
      {
        stepNumber: 2,
        stepTitle: "Carga Metabólica Humana em Plena Capacidade (254 Pessoas Extras)",
        formula: "254 pessoas × 550 BTU/h",
        detail: "Calor sensível e enorme volume de vapor de água (calor latente) exalado pela plateia durante 2 a 3 horas de evento.",
        partialBtu: 139700,
      },
      {
        stepNumber: 3,
        stepTitle: "Iluminação Cênica de Palco e Geral (3.500 Watts)",
        formula: "3.500 W × 3,412 BTU/h/W",
        detail: "Dissipação térmica de refletores e iluminação de platéia com dimmer acionado.",
        partialBtu: 11942,
      },
      {
        stepNumber: 4,
        stepTitle: "Equipamentos Audiovisuais, Racks de Som e Projeção",
        formula: "Projetor Laser (3.800 BTU) + Racks de Potência e TI (6.200 BTU)",
        detail: "Calor gerado por equipamentos de transmissão ao vivo e amplificadores de potência Classe D.",
        partialBtu: 10000,
      },
      {
        stepNumber: 5,
        stepTitle: "Tratamento de Renovação de Ar Obrigatório (6.885 m³/h)",
        formula: "6.885 m³/h de ar exterior: resfriamento e desumidificação constante de ar novo para controle de CO₂",
        detail: "Exigência legal para manter o nível de dióxido de carbono (CO₂) abaixo de 1.000 ppm na respiração coletiva.",
        partialBtu: 148500,
      },
    ],
    subtotalBtu: 436142,
    safetyMarginPercent: 10,
    safetyMarginBtu: 43614,
    finalBtu: 479756,
    finalTr: 39.98,
    equipmentRecommendation: {
      systemType: "Sistema Central VRF (Fluxo de Refrigerante Variável) ou Chiller a Água com Rede de Dutos e Atenuadores de Ruído",
      units: "2 Módulos VRF de 20 TR cada (Total 40 TR) acoplados a 4 evaporadoras de duto de 10 TR com caixas plenum de insuflamento e retorno.",
      pipingAndElectrical: "Alimentação Trifásica 380V/440V. Quadro geral de força com inversores de frequência e proteção contra harmônicos.",
      airflowAndFiltration: "Rede de dutos de distribuição em chapa galvanizada com isolamento interno em manta termoacústica e curvas com silenciadores acústicos baffles para garantir NC < 30 no microfone.",
    },
    engineeringNotes: [
      "A velocidade do ar nos difusores de insuflamento não deve ultrapassar 2,0 m/s para não gerar ruído aerodinâmico ou sopro perceptível na cabeça dos ouvintes.",
      "A renovação de ar deve ser modulada automaticamente através de sensores de CO₂ instalados no duto de retorno: quando o auditório estiver com meia ocupação, a taxa de ar externo reduz automaticamente, poupando energia elétrica.",
      "A divisão em 2 módulos independentes de 20 TR garante redundância operacional: caso uma máquina passe por manutenção preventiva, o auditório mantém 50% de capacidade sem cancelamento do evento.",
    ],
  },
];
