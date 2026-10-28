export interface CompetenciasData {
  moduloId: string;
  moduloTitulo: string;
  badge: string;
  competenciaGeral: string;
  capacidadesTecnicas: string[];
  capacidadesSocioemocionais: string[];
  normasReferencia: string[];
  metodologiaUIPainel: string;
}

export const COMPETENCIAS_MODULOS: Record<string, CompetenciasData> = {
  "mod-1": {
    moduloId: "mod-1",
    moduloTitulo: "Módulo 1: Fundamentos de Climatização",
    badge: "Termodinâmica & Fluidos",
    metodologiaUIPainel: "Padrão MSEP • Metodologia SENAI de Ensino por Competências",
    competenciaGeral:
      "Aplicar os princípios termodinâmicos, psicrométricos e de mecânica dos fluidos na identificação e análise do ciclo frigorífico por compressão a vapor, operando instrumentos de medição de pressão e temperatura com responsabilidade ecológica, precisão técnica e rigor normativo.",
    capacidadesTecnicas: [
      "Diferenciar calor sensível de calor latente em processos de resfriamento, aquecimento e desumidificação do ar.",
      "Interpretar e correlacionar leituras de temperatura de bulbo seco, bulbo úmido e ponto de orvalho em instrumentos de precisão.",
      "Converter e correlacionar escalas de pressão manométrica (relativa, bar e PSI) e absoluta com a tabela de saturação P × T dos fluidos frigoríficos.",
      "Identificar o papel, localização e transformações termodinâmicas nos 4 componentes básicos do ciclo (compressor, condensador, dispositivo de expansão e evaporador).",
      "Classificar os fluidos refrigerantes segundo a norma ASHRAE 34 quanto à toxidade, inflamabilidade (Classes A1, A2L, A3) e impactos ambientais (ODP e GWP).",
      "Executar manuseio e recolhimento de refrigerantes segundo as boas práticas do Protocolo de Montreal e normas ambientais brasileiras.",
    ],
    capacidadesSocioemocionais: [
      "Consciência e rigor ecológico na contenção de fluidos halogenados e prevenção de emissões fugitivas para a atmosfera.",
      "Postura investigativa e raciocínio analítico para correlacionar grandezas termodinâmicas no diagnóstico de anomalias térmicas.",
      "Zelo profissional e disciplina na guarda, transporte e conservação de instrumentos de medição de bancada.",
      "Colaboração ativa e escuta qualificada durante as dinâmicas de resolução de estudos de caso em equipe.",
    ],
    normasReferencia: [
      "ABNT NBR 16655 (Instalação de Sistemas Split)",
      "ASHRAE Standard 34 & 15 (Designação e Segurança de Refrigerantes)",
      "NR-06 (Equipamentos de Proteção Individual)",
      "Protocolo de Montreal / Resoluções CONAMA",
    ],
  },
  "mod-2": {
    moduloId: "mod-2",
    moduloTitulo: "Módulo 2: Eletricidade Aplicada a Climatização",
    badge: "Eletroeletrônica & Inverter",
    metodologiaUIPainel: "Padrão MSEP • Metodologia SENAI de Ensino por Competências",
    competenciaGeral:
      "Executar diagnósticos elétricos, interligações de circuitos de potência e comando e ensaios de grandezas elétricas em equipamentos de climatização residenciais e comerciais, aplicando as prescrições da ABNT NBR 5410 e os rígidos protocolos de desenergização e segurança da NR-10.",
    capacidadesTecnicas: [
      "Aplicar a Lei de Ohm e Leis de Kirchhoff no cálculo de queda de tensão, corrente nominal e dimensionamento de condutores e disjuntores termomagnéticos.",
      "Operar instrumentos de medição elétrica True RMS (multímetro, alicate amperímetro e megômetro) nas escalas de tensão AC/DC, corrente, resistência e continuidade.",
      "Diagnosticar e laudar enrolamentos de motores compressores monofásicos, trifásicos e BLDC Inverter (medição de resistência ôhmica e teste de fuga à carcaça).",
      "Interpretar diagramas unifilares, esquemas elétricos funcionais e bornes de interligação entre unidades evaporadora e condensadora.",
      "Testar componentes eletromecânicos e sensores eletrônicos (termistores NTC de serpentina e descarga, relés, contatores e protetores térmicos).",
      "Verificar a integridade do barramento de corrente contínua (310V–380V DC) e circuitos conversores chaveados em placas Inverter.",
    ],
    capacidadesSocioemocionais: [
      "Autodisciplina e tolerância zero a desvios nos procedimentos de desenergização, bloqueio de disjuntores e teste prévio com multímetro.",
      "Atenção concentrada e postura metódica no isolamento de condutores e conexões elétricas de alta corrente.",
      "Comunicação técnica clara e assertiva na elaboração de laudos elétricos e explicação de causas-raiz ao cliente.",
      "Resiliência e persistência no rastreamento lógico de falhas intermitentes e curtos-circuitos em bancada.",
    ],
    normasReferencia: [
      "ABNT NBR 5410 (Instalações Elétricas de Baixa Tensão)",
      "NR-10 (Segurança em Instalações e Serviços em Eletricidade)",
      "IEC 60335-2-40 (Requisitos de Segurança para Bombas de Calor e Condicionadores)",
    ],
  },
  "mod-3": {
    moduloId: "mod-3",
    moduloTitulo: "Módulo 3: Instalação e Manutenção em Climatização",
    badge: "Prática de Campo & PMOC",
    metodologiaUIPainel: "Padrão MSEP • Metodologia SENAI de Ensino por Competências",
    competenciaGeral:
      "Planejar e executar a instalação completa, o comissionamento de start-up e os planos de manutenção preventiva e corretiva de condicionadores de ar tipo Split e sistemas afins, assegurando estanqueidade, desidratação profunda, equilíbrio termodinâmico e conformidade com o PMOC (NBR 16655).",
    capacidadesTecnicas: [
      "Confeccionar conexões mecânicas flangeadas, expansões e bolsas em tubulações de cobre utilizando ferramentas de precisão (flangeadores excêntricos e cortadores orbitais).",
      "Executar brasagem oxi-acetileno ou com maçarico portátil com purga contínua de Nitrogênio Seco (N₂ a 2–3 PSI) para suprimir a formação de carepa de óxido interna.",
      "Realizar ensaio hidrostático/pneumático de estanqueidade pressurizando com Nitrogênio Seco e regulador calibrado, aplicando água e sabão neutro nas conexões.",
      "Operar bomba de vácuo de duplo estágio e vacuômetro digital no processo de desidratação molecular (atingindo meta estável inferior a 500 microns com teste de queda).",
      "Efetuar carga de fluido refrigerante por pesagem em balança digital na fase líquida e avaliar os parâmetros térmicos de Superaquecimento Útil (SH) e Sub-resfriamento (SC).",
      "Elaborar e implementar rotinas de manutenção preventiva, higienização química de bandejas e serpentinas e preenchimento de planilhas do PMOC.",
    ],
    capacidadesSocioemocionais: [
      "Compromisso com o padrão de acabamento e senso de ordem (Metodologia 5S) no canteiro de obras e residência do cliente.",
      "Ética e transparência inegociável na apresentação de orçamentos, laudos de componentes condenados e garantia de serviços.",
      "Coordenação de equipe e sinergia operacional na movimentação e içamento seguro de condensadoras pesadas.",
      "Iniciativa proativa para consulta constante de manuais técnicos de fabricantes e documentações normativas.",
    ],
    normasReferencia: [
      "ABNT NBR 16655 (Diretrizes de Instalação e Manutenção de Splits)",
      "Lei Federal 13.589/2018 (Obrigatoriedade do PMOC)",
      "Portaria MS nº 3.523/1998 e Resolução ANVISA RE nº 09 (Qualidade do Ar Interior)",
      "NR-35 (Trabalho em Altura)",
    ],
  },
  "seguranca_sst": {
    moduloId: "seguranca_sst",
    moduloTitulo: "Módulo Especial: Segurança e Vida (SST) na Climatização",
    badge: "Sobrevivência & Tolerância Zero",
    metodologiaUIPainel: "Padrão MSEP • Metodologia SENAI de Ensino por Competências",
    competenciaGeral:
      "Atuar com mentalidade de tolerância zero a desvios e improvisos na execução de serviços de refrigeração e climatização, eliminando na fonte os riscos críticos de quedas em altura (NR-35), eletrocussão (NR-10), explosões mecânicas e queimaduras criogênicas ou químicas (NR-13 e fluidos A2L).",
    capacidadesTecnicas: [
      "Inspecionar, vestir e ajustar corretamente EPIs e EPCs de retenção de quedas (cinto tipo paraquedista com talabarte duplo em Y e absorvedor de impacto).",
      "Mapear, inspecionar e validar pontos de ancoragem estruturais independentes que atendam à resistência mínima de 15 kN por usuário.",
      "Elaborar e validar a Análise Preliminar de Risco (APR) de campo e executar o checklist pré-operatório de 8 passos antes de qualquer intervenção.",
      "Aplicar protocolos formais de Bloqueio, Travamento e Etiquetagem (LOTO) e aferir ausência de tensão com multímetro CAT III 600V em bornes AC e nos capacitores DC de placas Inverter.",
      "Manusear cilindros pressurizados exclusivamente com reguladores de pressão certificados de dois estágios, banindo de forma irrevogável o uso de Oxigênio (O₂) ou ar comprimido em ensaios de pressão.",
      "Implementar procedimentos de segurança para fluidos refrigerantes Classe A2L (R-32), assegurando ventilação forçada contínua, detecção eletrônica e posicionamento de extintor de Pó ABC.",
    ],
    capacidadesSocioemocionais: [
      "Responsabilidade indelegável pela preservação da própria integridade física, da vida do parceiro de trabalho e de terceiros.",
      "Coragem e firmeza moral no exercício irrestrito do Direito de Recusa quando as condições de trabalho não oferecerem garantias plenas de segurança.",
      "Postura intransigente e vigilante contra a cultura do improviso ('jeitinho brasileiro') e o excesso de autoconfiança ('é rapidinho').",
      "Liderança participativa e consciência civil quanto às responsabilidades jurídicas (CLT e Código Civil) derivadas de acidentes de trabalho.",
    ],
    normasReferencia: [
      "NR-01 (Disposições Gerais e Gerenciamento de Riscos Ocupacionais - GRO/PGR)",
      "NR-10 (Segurança em Instalações e Serviços em Eletricidade)",
      "NR-35 (Trabalho em Altura)",
      "NR-13 (Caldeiras, Vasos de Pressão e Tubulações)",
      "Código Civil Brasileiro (Artigos 186 e 932 - Responsabilidade Civil)",
    ],
  },
};
