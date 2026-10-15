export type LessonMaterialSection = {
  subtitle: string;
  paragraphs?: string[];
  bullets?: { label: string; text: string }[];
  highlightBox?: {
    type: "info" | "danger" | "practical";
    title: string;
    content: string;
  };
  table?: {
    headers: string[];
    rows: string[][];
  };
};

export type LessonMaterial = {
  lessonOrder: number;
  titleKey: string; // Palavra-chave para correspondência segura com o título do banco
  fullTitle: string;
  workload: string;
  shortSummary: string; // Explicação técnica exibida diretamente no card da aula
  keyPoints: string[]; // Pontos-chave exibidos no quadro principal quando não há vídeo
  diagramType: "calor" | "temperatura" | "pressao" | "ciclo" | "seguranca" | "fluidos";
  diagramCaption: string;
  sections: LessonMaterialSection[];
};

export const module1MaterialsData: LessonMaterial[] = [
  {
    lessonOrder: 1,
    titleKey: "calor",
    fullTitle: "Aula 01: Fundamentos Físicos do Calor e Transferência Térmica",
    workload: "2 Horas",
    shortSummary:
      "O calor é a energia térmica em trânsito que se move espontaneamente de um corpo ou sistema com maior temperatura para outro com menor temperatura, até que ambos atinjam o equilíbrio térmico (a mesma temperatura).",
    keyPoints: [
      "Na climatização não se 'cria frio': o sistema retira calor do ambiente interno e o rejeita no externo.",
      "Mecanismos de transmissão: Condução (sólidos), Convecção (fluidos em movimento) e Radiação (ondas).",
      "Calor Sensível altera a temperatura; Calor Latente altera o estado físico sem variar a temperatura.",
      "Relação prática de capacidade: 1 TR (Tonelada de Refrigeração) equivale a 12.000 BTU/h."
    ],
    diagramType: "calor",
    diagramCaption: "Figura 1.1 — Fluxo espontâneo de energia térmica (T1 > T2) e curva de Calor Sensível vs. Calor Latente na mudança de fase.",
    sections: [
      {
        subtitle: "1. Definição Termodinâmica de Calor na Climatização",
        paragraphs: [
          "O calor é definido fisicamente como energia térmica em trânsito. Ele jamais permanece estático: desloca-se espontaneamente sempre do corpo de maior temperatura para o corpo de menor temperatura (2ª Lei da Termodinâmica), cessando o fluxo apenas quando ambos atingem o equilíbrio térmico.",
          "Na engenharia de climatização, não existe o conceito físico de 'produzir frio'. O condicionador de ar Split atua como uma bomba térmica: o fluido refrigerante circula pela unidade interna (evaporadora) a uma temperatura inferior à do ar da sala, absorvendo o calor do ambiente e transportando-o até a unidade externa (condensadora), onde é dissipado para o ar exterior."
        ]
      },
      {
        subtitle: "2. Mecanismos de Transferência de Calor",
        bullets: [
          {
            label: "Condução Térmica",
            text: "Transferência de energia molécula a molécula através de um meio material sólido, sem transporte de matéria. Exemplo prático: o calor do ar atravessa a parede metálica dos tubos de cobre e das aletas de alumínio da serpentina até chegar ao fluido refrigerante."
          },
          {
            label: "Convecção Térmica",
            text: "Transferência de calor que ocorre em fluidos (líquidos ou gases) devido ao deslocamento de massas. Nos sistemas Split, utilizamos a Convecção Forçada, promovida pela turbina tangencial na evaporadora e pela hélice axial na condensadora."
          },
          {
            label: "Radiação Térmica",
            text: "Propagação de energia por meio de ondas eletromagnéticas (infravermelho), não necessitando de meio material para ocorrer. Exemplo prático: a radiação solar direta incidindo sobre telhados, janelas e paredes externas, compondo a carga térmica do imóvel."
          }
        ]
      },
      {
        subtitle: "3. Calor Sensível vs. Calor Latente",
        paragraphs: [
          "Compreender a diferença entre calor sensível e latente é obrigatório para o diagnóstico de rendimento e desumidificação do equipamento:"
        ],
        table: {
          headers: ["Tipo de Calor", "Efeito Físico Principal", "Exemplo Prático no Ar-Condicionado Split"],
          rows: [
            [
              "Calor Sensível",
              "Altera a temperatura da substância, sem mudar seu estado físico.",
              "Queda da temperatura do ar ambiente de 28 °C para 22 °C medida no termômetro."
            ],
            [
              "Calor Latente",
              "Altera o estado físico (mudança de fase) mantendo a temperatura constante.",
              "Ebulição do fluido refrigerante dentro da evaporadora e condensação da umidade do ar na bandeja de dreno."
            ]
          ]
        },
        highlightBox: {
          type: "practical",
          title: "Unidades de Capacidade Térmica na Prática",
          content: "1 BTU (British Thermal Unit) é a quantidade de calor necessária para elevar em 1 °F a temperatura de 1 libra de água. Na prática de dimensionamento: 1 TR (Tonelada de Refrigeração) = 12.000 BTU/h ≈ 3.024 kcal/h ≈ 3,517 kW térmicos."
        }
      }
    ]
  },
  {
    lessonOrder: 2,
    titleKey: "temperatura",
    fullTitle: "Aula 02: Termometria, Escalas e Medição de Temperatura",
    workload: "2 Horas",
    shortSummary:
      "A temperatura é a grandeza física escalar que mede o grau de agitação térmica das moléculas de um corpo ou fluido, determinando o sentido do fluxo de calor e permitindo o diagnóstico preciso do ciclo frigorífico.",
    keyPoints: [
      "Temperatura mede o estado de agitação molecular; Calor é a energia transferida devido à diferença de temperatura.",
      "Escalas principais: Celsius (°C) no Brasil, Fahrenheit (°F) em tabelas importadas e Kelvin (K) absoluta.",
      "Diferença entre Temperatura de Bulbo Seco (TBS) e Temperatura de Bulbo Úmido (TBU).",
      "Medição correta em tubulações exige termômetro de contato isolado termicamente do ar externo."
    ],
    diagramType: "temperatura",
    diagramCaption: "Figura 2.1 — Correspondência entre escalas termométricas (°C, °F, K) e fixação técnica do sensor de contato na linha de sucção.",
    sections: [
      {
        subtitle: "1. Conceito Físico de Temperatura",
        paragraphs: [
          "As moléculas que compõem qualquer matéria (sólida, líquida ou gasosa) estão em constante movimento vibratório ou translacional. A grandeza física que quantifica o nível médio dessa energia cinética (agitação molecular) é denominada Temperatura.",
          "Quanto maior a velocidade de vibração das moléculas do fluido refrigerante na descarga do compressor, maior será a sua temperatura registrada pelo sensor NTC ou pelo termômetro."
        ]
      },
      {
        subtitle: "2. Escalas Termométricas e Fórmulas de Conversão",
        table: {
          headers: ["Escala", "Ponto de Fusão da Água", "Ponto de Ebulição da Água", "Zero Absoluto", "Fórmula de Conversão"],
          rows: [
            ["Celsius (°C)", "0 °C", "100 °C", "-273,15 °C", "°C = (°F - 32) / 1,8"],
            ["Fahrenheit (°F)", "32 °F", "212 °F", "-459,67 °F", "°F = (°C × 1,8) + 32"],
            ["Kelvin (K)", "273,15 K", "373,15 K", "0 K", "K = °C + 273,15"]
          ]
        },
        highlightBox: {
          type: "info",
          title: "Atenção à Variação de Temperatura (Delta T - ΔT)",
          content: "Em cálculos de Superaquecimento e Subresfriamento na escala Celsius (K), uma variação de 1 °C equivale exatamente a uma variação de 1 K. Já na escala Fahrenheit, 1 °C de variação equivale a 1,8 °F de variação."
        }
      },
      {
        subtitle: "3. Temperatura de Bulbo Seco (TBS), Bulbo Úmido (TBU) e Ponto de Orvalho",
        bullets: [
          {
            label: "Temperatura de Bulbo Seco (TBS)",
            text: "Temperatura real do ar medida por um termômetro comum ou sensor NTC de retorno, sem influência direta da evaporação de umidade."
          },
          {
            label: "Temperatura de Bulbo Úmido (TBU)",
            text: "Temperatura medida com o bulbo envolto em gaze umedecida sob fluxo de ar, refletindo o potencial de resfriamento evaporativo e a umidade relativa presente."
          },
          {
            label: "Temperatura de Ponto de Orvalho (TPO)",
            text: "Temperatura na qual o vapor de água presente no ar inicia a condensação ao tocar em uma superfície fria (como a serpentina da evaporadora ou tubulação sem isolamento)."
          }
        ]
      },
      {
        subtitle: "4. Procedimento de Bancada: Termômetro de Contato vs. Infravermelho",
        paragraphs: [
          "Para aferir a temperatura real do fluido refrigerante através da parede do tubo de cobre (linhas de sucção e líquido), deve-se utilizar obrigatoriamente um termômetro digital de contato (tipo termopar K ou NTC) devidamente acoplado ao tubo limpo e protegido com espuma elastomérica para evitar interferência do ar ambiente ou do vento da condensadora. Termômetros a laser (infravermelho) sofrem erro severo de emissividade em superfícies metálicas polidas."
        ]
      }
    ]
  },
  {
    lessonOrder: 3,
    titleKey: "press",
    fullTitle: "Aula 03: Grandezas de Pressão, Manometria e Vácuo",
    workload: "2 Horas",
    shortSummary:
      "Pressão é a relação física entre uma força aplicada perpendicularmente sobre uma determinada área (P = F / A). Na climatização, o controle da pressão permite manipular a temperatura de saturação (ebulição e condensação) do fluido refrigerante.",
    keyPoints: [
      "Relação direta Pressão × Temperatura: aumentar a pressão eleva o ponto de ebulição; reduzir a pressão diminui o ponto de ebulição.",
      "Pressão Manométrica (lida no Manifold) adota a pressão atmosférica local como zero de referência (0 psig).",
      "Vácuo técnico profundo é medido em Microns de Mercúrio (μmHg) com vacuômetro digital exclusivo.",
      "Conversões de campo: 1 Bar ≈ 14,5 PSI | 1 MPa ≈ 145 PSI | 1 atm ≈ 14,7 PSI."
    ],
    diagramType: "pressao",
    diagramCaption: "Figura 3.1 — Escala comparativa entre Pressão Absoluta, Pressão Atmosférica, Pressão Manométrica e faixa de Vácuo em Microns.",
    sections: [
      {
        subtitle: "1. A Importância da Pressão no Sistema Frigorífico",
        paragraphs: [
          "Ao nível do mar (1 atm = 14,7 psi), a água entra em ebulição a 100 °C. Se reduzirmos a pressão sobre a água dentro de uma câmara fechada com uma bomba de vácuo, ela ferverá à temperatura ambiente (ex: 20 °C). Esse mesmo princípio governa a climatização: controlamos a pressão nas serpentinas para forçar o fluido refrigerante a ferver a baixas temperaturas no evaporador (ex: 5 °C) e condensar a altas temperaturas no condensador (ex: 45 °C)."
        ]
      },
      {
        subtitle: "2. Classificação das Pressões na Prática Técnica",
        bullets: [
          {
            label: "Pressão Atmosférica (Patm)",
            text: "Pressão exercida pelo peso da coluna de ar atmosférico sobre a superfície terrestre. Ao nível do mar equivale a 1 atm = 14,696 psi = 1,013 Bar = 760 mmHg."
          },
          {
            label: "Pressão Manométrica ou Relativa (Pman / PSIG)",
            text: "É a pressão indicada pelos manômetros de trabalho (Manifold). Quando o manômetro está desconectado e aberto para o ar ambiente, ele marca zero (0 psig), ignorando a pressão atmosférica."
          },
          {
            label: "Pressão Absoluta (Pabs / PSIA)",
            text: "Medida a partir do vácuo absoluto (ausência total de matéria). É obtida pela soma: Pressão Absoluta = Pressão Manométrica + Pressão Atmosférica."
          },
          {
            label: "Pressão Negativa (Vácuo)",
            text: "Qualquer estado de pressão inferior à pressão atmosférica. Na desidratação de sistemas Split, o nível de vácuo é aferido na escala de Microns de Mercúrio (μmHg), sendo a meta normativa atingir e estabilizar abaixo de 500 Microns."
          }
        ]
      },
      {
        subtitle: "3. Tabela de Conversão Rápida de Unidades de Pressão",
        table: {
          headers: ["Unidade Técnica", "Equivalência em PSI (lbf/pol²)", "Aplicação Principal na Climatização"],
          rows: [
            ["1 Bar", "14,50 PSI", "Manômetros europeus e reguladores de Nitrogênio"],
            ["1 MPa (Megapascal)", "145,03 PSI", "Placas de identificação de condensadoras Inverter"],
            ["1 kgf/cm²", "14,22 PSI", "Manômetros industriais e vasos de pressão"],
            ["1 atm (Atmosfera)", "14,70 PSI (760.000 Microns)", "Referência ao nível do mar"],
            ["500 Microns (μmHg)", "0,0096 PSI (Absoluta)", "Meta de vácuo profundo para partida do sistema"]
          ]
        },
        highlightBox: {
          type: "practical",
          title: "Leitura do Manifold em Campo",
          content: "O manômetro de Baixa Pressão (Azul - Compound) lê pressões de trabalho na linha de sucção (modo refrigeração). O manômetro de Alta Pressão (Vermelho) lê pressões de descarga/linha de líquido ou testes de pressurização com Nitrogênio."
        }
      }
    ]
  },
  {
    lessonOrder: 4,
    titleKey: "ciclo",
    fullTitle: "Aula 04: O Ciclo Frigorífico por Compressão Mecânica de Vapor",
    workload: "4 Horas",
    shortSummary:
      "O ciclo frigorífico por compressão de vapor é um circuito termodinâmico fechado onde o fluido refrigerante altera continuamente sua pressão e seu estado físico (líquido e vapor) através de 4 componentes fundamentais para promover o transporte de calor.",
    keyPoints: [
      "Os 4 componentes principais: Compressor, Condensador, Dispositivo de Expansão (EEV/Capilar) e Evaporador.",
      "Divisão de pressões: Lado de Alta Pressão (Descarga/Condensação) e Lado de Baixa Pressão (Expansão/Sucção).",
      "Superaquecimento (SA) protege o compressor contra retorno de líquido.",
      "Subresfriamento (SR) garante 100% de fluido líquido na entrada do dispositivo de expansão."
    ],
    diagramType: "ciclo",
    diagramCaption: "Figura 4.1 — Diagrama esquemático do Ciclo Frigorífico detalhando zonas de Alta/Baixa pressão e estados físicos do fluido.",
    sections: [
      {
        subtitle: "1. Arquitetura e Funcionamento dos 4 Componentes Principais",
        bullets: [
          {
            label: "1. Compressor (Unidade Condensadora)",
            text: "Atua como bomba propulsora do ciclo. Succiona o refrigerante na forma de vapor a baixa pressão e baixa temperatura vindo do evaporador, realiza trabalho mecânico de compressão e o descarrega como Vapor Superaquecido a Alta Pressão e Alta Temperatura."
          },
          {
            label: "2. Condensador (Unidade Condensadora)",
            text: "Trocador de calor externo. O ar externo mais frio passa pelas aletas do condensador, absorvendo o calor do refrigerante. O fluido cede calor sensível (dessuperaquece), cede calor latente mudando de fase (vapor para líquido a pressão constante) e sai como Líquido Subresfriado a Alta Pressão."
          },
          {
            label: "3. Dispositivo de Expansão (Válvula EEV ou Tubo Capilar)",
            text: "Localizado entre o condensador e o evaporador, promove uma restrição severa de área. Ao passar por ele, o líquido sofre uma queda abrupta de pressão e temperatura, vaporizando parcialmente (Flash Gas) e saindo como Mistura de Líquido + Vapor (~80% líquido / 20% vapor) a Baixa Pressão e Baixa Temperatura."
          },
          {
            label: "4. Evaporador (Unidade Evaporadora Interna)",
            text: "Trocador de calor interno. O ar quente do ambiente passa pela serpentina fria; o fluido refrigerante absorve esse calor latente, entra em ebulição (evapora totalmente) e, no trecho final da serpentina, aquece ligeiramente, saindo pela linha de sucção como Vapor Superaquecido a Baixa Pressão de volta ao compressor."
          }
        ]
      },
      {
        subtitle: "2. Resumo Termodinâmico das Linhas do Circuito",
        table: {
          headers: ["Trecho / Linha do Circuito", "Regime de Pressão", "Estado Físico do Fluido Refrigerante"],
          rows: [
            ["Linha de Descarga (Saída do Compressor)", "Alta Pressão", "100% Vapor Superaquecido (Alta Temperatura)"],
            ["Linha de Líquido (Saída do Condensador)", "Alta Pressão", "100% Líquido Subresfriado (Temperatura Média)"],
            ["Saída da Expansão (Entrada do Evaporador)", "Baixa Pressão", "Mistura Bifásica (Líquido + Flash Gas a Baixa Temp.)"],
            ["Linha de Sucção (Entrada do Compressor)", "Baixa Pressão", "100% Vapor Superaquecido (Baixa Temperatura)"]
          ]
        },
        highlightBox: {
          type: "info",
          title: "Conceitos Críticos de Diagnóstico: SA e SR",
          content: "Superaquecimento (SA = Temp. Tubo de Sucção - Temp. Saturação de Evaporação) garante que nenhum líquido entre na câmara de compressão, evitando o golpe de líquido (calço hidráulico). Subresfriamento (SR = Temp. Saturação de Condensação - Temp. Tubo de Líquido) assegura que não haja bolhas de vapor antes do dispositivo de expansão."
        }
      }
    ]
  },
  {
    lessonOrder: 5,
    titleKey: "seguran",
    fullTitle: "Aula 05: Procedimentos de Segurança para Recolhimento e Carga",
    workload: "4 Horas",
    shortSummary:
      "Protocolos técnicos e normativos de segurança (NR-10, NR-12 e normas ambientais) aplicáveis ao manuseio de vasos sob pressão, pressurização com nitrogênio, recolhimento de fluidos (Pump Down / Recolhedora) e carga por massa em balança de precisão.",
    keyPoints: [
      "Uso estrito de EPIs: Óculos de ampla visão e luvas nitrílicas/térmicas contra queimaduras criogênicas (-40 °C).",
      "PROIBIÇÃO LETAL: Jamais pressurizar o sistema com Oxigênio (O2) ou ar comprimido sob risco de explosão química.",
      "Testes de estanqueidade devem ser executados exclusivamente com Nitrogênio Seco (N2) e regulador de pressão.",
      "Fluidos blends (ex: R-410A) exigem carga obrigatoriamente na fase líquida controlada por balança eletrônica."
    ],
    diagramType: "seguranca",
    diagramCaption: "Figura 5.1 — Arranjo técnico de segurança para carga por massa com balança digital, válvula de segurança e cilindro de serviço.",
    sections: [
      {
        subtitle: "1. Equipamentos de Proteção Individual (EPIs) na Intervenção Frigorífica",
        paragraphs: [
          "O fluido refrigerante em fase líquida, quando exposto subitamente à pressão atmosférica durante a desconexão de mangueiras nas válvulas de serviço Schrader, entra em ebulição instantânea a temperaturas entre -26 °C e -51 °C (dependendo do fluido). O contato direto com a pele ou olhos provoca congelamento imediato dos tecidos (geladura grave e perda de visão)."
        ],
        bullets: [
          {
            label: "Óculos de Proteção Ampla Visão (Incolor)",
            text: "Uso contínuo obrigatório em qualquer conexão de manifold, brasagem, pressurização ou carga de gás."
          },
          {
            label: "Luvas de Segurança Térmica / Nitrílica",
            text: "Protegem os dedos durante o manuseio de válvulas acionadoras rápidas (válvulas sem perda) e registros."
          },
          {
            label: "Válvula Acionadora de Segurança (Low-Loss)",
            text: "Dispositivo obrigatório na extremidade das mangueiras que só abre o pino da válvula Schrader após a rosca estar 100% vedada, eliminando jatos de líquido nas mãos do mecânico."
          }
        ]
      },
      {
        subtitle: "2. Regra de Ouro de Sobrevivência: Proibição Absoluta de Oxigênio",
        highlightBox: {
          type: "danger",
          title: "PERIGO DE EXPLOSÃO LETAL — PROIBIDO USAR OXIGÊNIO (O₂) OU AR COMPRIMIDO",
          content: "JAMAIS utilize cilindros de Oxigênio (O₂) medicinal/solda ou compressores de ar para pressurizar ou limpar linhas frigoríficas. O oxigênio sob pressão em contato com o óleo lubrificante (POE ou Mineral) do compressor provoca uma reação química exotérmica espontânea (dieselização), resultando na explosão violenta da unidade condensadora. Utilize EXCLUSIVAMENTE Nitrogênio Seco (N₂) com regulador de pressão em bom estado."
        }
      },
      {
        subtitle: "3. Procedimento de Recolhimento (Pump Down e Recolhedora Externa)",
        bullets: [
          {
            label: "Recolhimento para a Condensadora (Pump Down)",
            text: "Aplicável para manutenção na evaporadora ou tubulação quando o equipamento opera normalmente: 1) Ligar o aparelho no modo Refrigeração (Frio); 2) Fechar totalmente a válvula de serviço da linha de líquido (tubo fino) com chave Allen; 3) Acompanhar no manômetro de baixa pressão até atingir ~2 a 5 psig (nunca deixar entrar em vácuo negativo caso haja vazamento na linha para não aspirar ar/umidade, especialmente com R-32); 4) Fechar imediatamente a válvula de sucção (tubo grosso) e desligar a alimentação elétrica no disjuntor."
          },
          {
            label: "Unidade Recolhedora Externa e Cilindro Recolhedor",
            text: "Em casos de queima de compressor ou substituição de fluido contaminado, a legislação ambiental proíbe a liberação proposital de refrigerantes na atmosfera. Utiliza-se máquina recolhedora conectada a um cilindro cinza/amarelo de recolhimento respeitando o limite máximo de enchimento de 80% do volume útil."
          }
        ]
      },
      {
        subtitle: "4. Carga de Fluido Refrigerante por Massa",
        paragraphs: [
          "Nos sistemas Split Inverter (equipados com Válvula de Expansão Eletrônica — EEV), a carga de gás deve ser efetuada estritamente por peso (gramas/quilogramas) utilizando balança eletrônica de precisão conforme a etiqueta técnica da condensadora, somando o adicional por metro de tubulação excedente ao padrão de fábrica (ex: +15g a +20g por metro além de 5m). Antes de abrir o registro, realizar sempre o expurgo (ou vácuo) da mangueira de serviço para não injetar ar não condensável no sistema."
        ]
      }
    ]
  },
  {
    lessonOrder: 6,
    titleKey: "fluido",
    fullTitle: "Aula 06: Fluidos Refrigerantes Alternativos e Classificação de Segurança",
    workload: "2 Horas",
    shortSummary:
      "Estudo técnico e ambiental dos fluidos refrigerantes modernos (HFCs, HFOs e Hidrocarbonetos Naturais), analisando o Potencial de Destruição de Ozônio (ODP), Potencial de Aquecimento Global (GWP), matriz de inflamabilidade ASHRAE 34 e exigências operacionais.",
    keyPoints: [
      "Indicadores ambientais: ODP mede destruição da camada de ozônio (meta zero); GWP mede impacto no efeito estufa.",
      "Classificação ASHRAE 34: Letra (A ou B) define toxicidade; Número (1, 2L, 2, 3) define inflamabilidade.",
      "R-32 (Classe A2L — levemente inflamável) possui GWP 68% menor que o R-410A e é substância pura.",
      "R-290 / Propano (Classe A3 — altamente inflamável) possui impacto ambiental quase nulo (GWP = 3)."
    ],
    diagramType: "fluidos",
    diagramCaption: "Figura 6.1 — Matriz normativa ASHRAE Standard 34 (Toxicidade vs. Inflamabilidade) e comparativo ambiental GWP.",
    sections: [
      {
        subtitle: "1. Evolução Ambiental: ODP e GWP",
        paragraphs: [
          "Os acordos ambientais internacionais (Protocolo de Montreal e Emenda de Kigali) determinaram a eliminação progressiva dos fluidos que agridem a atmosfera, baseando-se em dois índices técnicos:"
        ],
        bullets: [
          {
            label: "ODP (Ozone Depletion Potential — Potencial de Destruição da Camada de Ozônio)",
            text: "Causado pela presença de átomos de Cloro na molécula (como nos antigos CFCs R-12 e HCFCs R-22). Todos os fluidos modernos (R-410A, R-32, R-290) não possuem cloro e apresentam ODP = 0."
          },
          {
            label: "GWP (Global Warming Potential — Potencial de Aquecimento Global)",
            text: "Compara a capacidade de retenção de calor na atmosfera de 1 kg de refrigerante em relação a 1 kg de CO₂ (GWP = 1) ao longo de 100 anos. A indústria migra do R-410A (GWP 2088) para o R-32 (GWP 675) e fluidos naturais."
          }
        ]
      },
      {
        subtitle: "2. Classificação de Segurança ASHRAE Standard 34 / ISO 817",
        paragraphs: [
          "Todo fluido refrigerante recebe um código alfanumérico que define seu grau de toxicidade (A = Baixa toxicidade; B = Alta toxicidade) e sua velocidade de propagação de chama (1 = Não inflamável; 2L = Levemente inflamável; 2 = Inflamável; 3 = Altamente inflamável):"
        ],
        table: {
          headers: ["Fluido", "Família Química", "Classe ASHRAE", "ODP", "GWP (100 anos)", "Óleo / Modo de Carga"],
          rows: [
            ["R-22 (Legado)", "HCFC (Puro)", "A1 (Não inflamável)", "0,055", "1.810", "Mineral / Fase Vapor ou Líquido"],
            ["R-410A", "HFC (Mistura / Blend)", "A1 (Não inflamável)", "0", "2.088", "POE Sintético / 100% Fase Líquida"],
            ["R-32", "HFC (Substância Pura)", "A2L (Levemente inflamável)", "0", "675", "POE Sintético / Líquido ou Vapor"],
            ["R-290 (Propano)", "HC (Hidrocarboneto Natural)", "A3 (Alta inflamabilidade)", "0", "3", "POE ou Mineral / Carga rigorosa por balança"]
          ]
        }
      },
      {
        subtitle: "3. Particularidades Práticas do Fluido R-32 (Classe A2L) em Sistemas Split",
        highlightBox: {
          type: "practical",
          title: "Protocolo Técnico na Manutenção com R-32",
          content: "Diferente do R-410A (que é uma mistura de 50% R-32 + 50% R-125 e sofre fracionamento em caso de vazamento), o R-32 é um fluido puro (monocomponente), permitindo completar carga se necessário e apresentando maior eficiência energética. Contudo, por ser Classe A2L (levemente inflamável), exige: 1) Vácuo rigoroso sem ar residual; 2) Ambiente ventilado; 3) Jamais usar maçarico em tubulação pressurizada ou sem prévia purga com Nitrogênio."
        }
      }
    ]
  }
];