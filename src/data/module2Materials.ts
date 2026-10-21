import { Lesson, LessonMaterial } from "./module1Materials";
import { ModuleChallengeData } from "./module1Challenge";

export const module2MaterialsData: LessonMaterial[] = [
  {
    lessonOrder: 1,
    titleKey: "fundamentos",
    fullTitle: "Aula 01: Fundamentos de Eletricidade, Lei de Ohm e NBR 5410",
    videoUrl: "",
    videoTitle: "Dimensionamento de Circuito Elétrico Exclusivo para Ar-Condicionado conforme NBR 5410",
    videoDescription: "Demonstrar a montagem correta de disjuntor bipolar curva C no quadro de distribuição, cálculo de queda de tensão em cabos e o papel do condutor de aterramento (PE) contra queima de placas Inverter.",
    workload: "4 Horas",
    shortSummary:
      "Estudo das grandezas elétricas fundamentais (Tensão, Corrente, Resistência e Potência), aplicação prática da Lei de Ohm, distinção entre Corrente Alternada (CA) e Corrente Contínua (Barramento DC Inverter) e critérios normativos da ABNT NBR 5410 para circuitos exclusivos de climatização.",
    keyPoints: [
      "Grandezas base: Tensão (Volt - V), Corrente (Ampère - A), Resistência (Ohm - Ω) e Potência (Watt - W).",
      "Fórmulas de bolso na bancada: V = R × I (Lei de Ohm) e P = V × I (Lei de Joule/Potência).",
      "Corrente Alternada (CA 220V 60Hz) alimenta a rede; Corrente Contínua (CC ~310V DC) opera o barramento Inverter.",
      "Norma ABNT NBR 5410: exige circuito exclusivo, disjuntor termomagnético dedicado e condutor Terra (PE) obrigatório."
    ],
    diagramType: "eletricidade_fundamentos" as any,
    diagramCaption:
      "Figura 1.1 — Triângulo da Lei de Ohm, retificação CA para Barramento DC Inverter (310 VDC) e circuito dedicado NBR 5410.",
    sections: [
      {
        subtitle: "1. As 4 Grandezas Elétricas Essenciais na Climatização",
        bullets: [
          {
            label: "Tensão Elétrica (U ou V — Unidade: Volt [V])",
            text: "É a diferença de potencial elétrico (ddp) ou 'pressão elétrica' que impulsiona os elétrons através do condutor. Nos sistemas residenciais brasileiros, os aparelhos Split operam tipicamente em 220 V (monofásico Fase-Neutro ou bifásico Fase-Fase)."
          },
          {
            label: "Corrente Elétrica (I — Unidade: Ampère [A])",
            text: "É o fluxo ordenado de elétrons que circula pelo cabo quando o equipamento está em funcionamento. É a grandeza mais monitorada pelo mecânico de refrigeração para dimensionar cabos (mm²), disjuntores e avaliar se o compressor está trabalhando com sobrecarga mecânica."
          },
          {
            label: "Resistência Elétrica (R — Unidade: Ohm [Ω])",
            text: "É a oposição física oferecida pelo material à passagem da corrente elétrica. Na bancada, medimos a resistência ôhmica para diagnosticar o estado dos enrolamentos (bobinas) de compressores, motores ventiladores e sensores termistores NTC."
          },
          {
            label: "Potência Elétrica Ativa (P — Unidade: Watt [W] ou kW)",
            text: "Representa a taxa de consumo de energia elétrica convertida em trabalho mecânico e térmico pelo aparelho. Calcula-se multiplicando a Tensão pela Corrente (P = V × I)."
          }
        ]
      },
      {
        subtitle: "2. Lei de Ohm, Corrente Alternada (CA) vs. Corrente Contínua (CC)",
        paragraphs: [
          "Pela 1ª Lei de Ohm (V = R × I), para uma tensão constante, a corrente elétrica é inversamente proporcional à resistência (I = V / R). Se o isolamento de uma bobina do compressor derrete e a resistência cai drasticamente (curto-circuito), a corrente elétrica tende ao infinito, provocando o desarme imediato do disjuntor ou queima do fusível.",
          "Nos equipamentos modernos, convivemos com dois regimes de corrente elétrica no mesmo aparelho:"
        ],
        table: {
          headers: ["Tipo de Corrente", "Símbolo no Multímetro", "Comportamento Físico", "Onde atua no Ar-Condicionado Split"],
          rows: [
            [
              "Corrente Alternada (CA / AC)",
              "V~ ou VAC / A~",
              "Os elétrons invertem o sentido 60 vezes por segundo (60 Hz) em onda senoidal.",
              "Alimentação da rede elétrica (220 V), compressores On/Off convencionais, transformadores e contatores."
            ],
            [
              "Corrente Contínua (CC / DC)",
              "V⎓ ou VDC",
              "Fluxo unidirecional constante de elétrons (possui polaridade Positiva + e Negativa -).",
              "Barramento DC da placa Inverter (~310 VDC), fontes chaveadas (5V, 12V, 15V DC), motores BLDC e comunicação serial."
            ]
          ]
        }
      },
      {
        subtitle: "3. Requisitos Normativos ABNT NBR 5410 para Ar-Condicionado",
        highlightBox: {
          type: "danger",
          title: "OBRIGATORIEDADE DO ATERRAMENTO (CONDUTOR PE) E CIRCUITO EXCLUSIVO",
          content: "Segundo a norma ABNT NBR 5410, todo equipamento de climatização deve possuir um circuito elétrico exclusivo vindo do quadro de distribuição, protegido por disjuntor termomagnético compatível (Bipolar para sistemas 220V Fase+Fase) e condutor de proteção Terra (verde ou verde-amarelo). Nos aparelhos Split Inverter, a ausência de aterramento gera ruído eletromagnético severo, queima prematura da placa eletrônica por surtos, erros de comunicação (E1) e risco de choque elétrico na carcaça metálica."
        },
        table: {
          headers: ["Capacidade Típica (220V)", "Corrente Nominal Aprox.", "Seção Mínima do Condutor (Cobre)", "Disjuntor Recomendado (Curva C)"],
          rows: [
            ["9.000 a 12.000 BTU/h", "3,8 A a 5,5 A", "2,5 mm²", "10 A ou 16 A (Dedicado)"],
            ["18.000 a 24.000 BTU/h", "7,5 A a 11,0 A", "2,5 mm² a 4,0 mm²", "16 A ou 20 A (Dedicado)"],
            ["30.000 a 36.000 BTU/h", "13,5 A a 17,0 A", "4,0 mm² a 6,0 mm²", "25 A ou 32 A (Dedicado)"]
          ]
        }
      }
    ]
  },
  {
    lessonOrder: 2,
    titleKey: "instrumentos",
    fullTitle: "Aula 02: Instrumentos de Medição Elétrica e Segurança CAT",
    videoUrl: "",
    videoTitle: "Uso Correto do Alicate Amperímetro e Multímetro True RMS: Por que o Cabo PP Marca 0,0 A?",
    videoDescription: "Demonstrar na prática que a garra amperimétrica deve abraçar apenas uma fase, explicar o que é a tecnologia True RMS para leitura de ondas PWM e reforçar a segurança CAT III.",
    workload: "4 Horas",
    shortSummary:
      "Operação técnica e segura dos instrumentos de diagnóstico elétrico na climatização (Multímetro Digital True RMS, Alicate Amperímetro, Capacímetro e Megômetro), categorias de segurança contra arco elétrico (CAT II, CAT III e CAT IV) e procedimentos corretos de conexão em série, paralelo e indução.",
    keyPoints: [
      "Instrumentos True RMS são obrigatórios para leituras precisas em sinais chaveados de placas Inverter.",
      "Medição de Tensão (V): pontas de prova em PARALELO com o circuito energizado.",
      "Medição de Corrente (A): garra do alicate amperímetro abraçando APENAS UM CONDUTOR (Fase) por vez.",
      "Medição de Resistência (Ω), Continuidade e Capacitância (μF): circuito 100% DESENERGIZADO e capacitor descarregado."
    ],
    diagramType: "eletricidade_instrumentos" as any,
    diagramCaption:
      "Figura 2.1 — Uso correto da garra do alicate amperímetro (1 condutor isolado vs. erro no cabo PP) e conexão em paralelo na borneira.",
    sections: [
      {
        subtitle: "1. Categorias de Sobretensão e Segurança do Instrumento (IEC 61010)",
        paragraphs: [
          "Antes de encostar as pontas de prova em um painel elétrico ou condensadora, o técnico deve verificar a categoria de segurança gravada na carcaça do multímetro e dos cabos de teste, prevenindo explosões por arco elétrico:"
        ],
        bullets: [
          {
            label: "CAT II",
            text: "Equipamentos portáteis e cargas conectadas a tomadas residenciais comuns."
          },
          {
            label: "CAT III (Padrão Obrigatório para Climatização)",
            text: "Instalações fixas prediais, quadros de distribuição (QDC), disjuntores, barramentos e borneiras de unidades condensadoras."
          },
          {
            label: "CAT IV",
            text: "Origem da instalação elétrica de baixa tensão (padrão de entrada, medidores da concessionária e cabos subterrâneos)."
          }
        ]
      },
      {
        subtitle: "2. Tecnologia True RMS vs. Multímetros Comuns",
        paragraphs: [
          "Multímetros simples calculam a tensão e a corrente assumindo uma onda senoidal perfeita de 60 Hz. Entretanto, nos aparelhos Split Inverter, a placa eletrônica utiliza chaveamento PWM de alta frequência (IGBTs / Módulo IPM), gerando ondas distorcidas. Apenas instrumentos com tecnologia True RMS (Valor Eficaz Verdadeiro) conseguem ler com exatidão a corrente e a tensão nesses circuitos."
        ]
      },
      {
        subtitle: "3. Protocolo de Conexão por Grandeza Elétrica",
        table: {
          headers: ["Grandeza / Função", "Escala no Seletor", "Estado do Equipamento", "Procedimento Técnico de Ligação"],
          rows: [
            [
              "Tensão Alternada (Rede)",
              "V~ (VAC - 600V/750V)",
              "ENERGIZADO",
              "Conectar as pontas de prova em PARALELO nos bornes L e N (ou L1 e L2)."
            ],
            [
              "Tensão Contínua (Placa)",
              "V⎓ (VDC)",
              "ENERGIZADO",
              "Conectar em PARALELO respeitando polaridade: ponta Vermelha no (+) e Preta no (-)."
            ],
            [
              "Corrente Elétrica",
              "A~ (Garra Amperimétrica)",
              "ENERGIZADO (Em Carga)",
              "Envolver APENAS UM FIO (Fase) no centro da garra. Nunca abraçar o cabo PP inteiro."
            ],
            [
              "Resistência e Continuidade",
              "Ω / Símbolo Sonoro (Bipe)",
              "DESENERGIZADO",
              "Desligar disjuntor e desconectar os terminais do componente para não ler retorno da placa."
            ],
            [
              "Capacitância",
              "μF (Microfarad) / CAP",
              "DESENERGIZADO",
              "Retirar o capacitor, CURTO-CIRCUITAR seus terminais com chave isolada para descarregar antes de medir."
            ]
          ]
        },
        highlightBox: {
          type: "practical",
          title: "Erro Clássico de Oficina: Por que o Alicate Amperímetro marca 0,0 A no Cabo PP?",
          content: "O alicate amperímetro mede a corrente através do campo eletromagnético gerado ao redor do fio. Se você colocar a garra abraçando o cabo PP inteiro (Fase + Neutro juntos), a corrente que vai pela Fase gera um campo magnético positivo e a corrente que retorna pelo Neutro gera um campo magnético igual e oposto. Os dois campos se anulam (Soma Vetorial = 0) e o visor mostrará 0,0 A! Sempre separe e abrace exclusivamente UM único condutor."
        }
      }
    ]
  },
  {
    lessonOrder: 3,
    titleKey: "testes",
    fullTitle: "Aula 03: Testes Práticos dos Componentes Elétricos e Eletrônicos",
    videoUrl: "",
    videoTitle: "Como Testar Compressor Inverter (U-V-W), Compressor Convencional (C-S-R), Sensores NTC e Fuga à Massa",
    videoDescription: "Realizar na bancada de oficina a medição ôhmica das 3 bobinas simétricas de um compressor Inverter, o teste de isolamento para a carcaça e a curva de resistência do sensor NTC mergulhado em água fria e quente.",
    workload: "4 Horas",
    shortSummary:
      "Protocolos práticos de diagnóstico e laudo técnico em bancada: aferição das bobinas de compressores convencionais (C-S-R) e Inverter BLDC (U-V-W), teste de isolação à massa (fuga para carcaça), medição de capacitores permanentes, sensores termistores NTC e bobinas de válvulas EEV e reversora.",
    keyPoints: [
      "Compressor On/Off (C-S-R): a soma das resistências C-R + C-S deve ser igual à resistência S-R.",
      "Compressor Inverter (U-V-W): as 3 bobinas são simétricas e devem apresentar resistências idênticas entre si (ex: 1,5 Ω).",
      "Teste de Massa (Carcaça): resistência entre qualquer borne do compressor e o tubo de cobre deve ser Infinita (OL).",
      "Sensor NTC: quando a temperatura aumenta, a resistência ôhmica diminui (ex: 10 kΩ a 25 °C)."
    ],
    diagramType: "eletricidade_testes" as any,
    diagramCaption:
      "Figura 3.1 — Arranjo dos bornes C-S-R (On/Off) vs. U-V-W (Inverter Trifásico) e curva Temperatura × Resistência do Sensor NTC.",
    sections: [
      {
        subtitle: "1. Diagnóstico de Compressores: Convencional (C-S-R) vs. Inverter (U-V-W)",
        paragraphs: [
          "Com o equipamento totalmente desenergizado e os cabos desconectados dos bornes herméticos do compressor, selecionamos a escala de Resistência (Ω) no multímetro:"
        ],
        bullets: [
          {
            label: "Compressor Rotativo Monofásico On/Off (Bornes C = Comum, R = Marcha/Run, S = Partida/Start)",
            text: "Possui duas bobinas internas assimétricas. A bobina de Marcha (C-R) tem fio mais grosso e menor resistência (ex: 1,8 Ω). A bobina de Partida/Auxiliar (C-S) tem fio mais fino e maior resistência (ex: 4,2 Ω). A medição entre os pinos S e R mede as duas bobinas em série e deve resultar exatamente na soma: R(S-R) = R(C-R) + R(C-S) (ex: 6,0 Ω)."
          },
          {
            label: "Compressor Rotativo Inverter BLDC / Trifásico (Bornes U, V, W)",
            text: "Construído como um motor síncrono trifásico de ímãs permanentes no rotor. Suas três bobinas internas são 100% idênticas. Portanto, as leituras entre U-V, V-W e U-W devem apresentar exatamente o mesmo valor ôhmico (tipicamente entre 0,8 Ω e 3,5 Ω). Se uma das leituras divergir ou der aberto (OL), o compressor está condenado."
          },
          {
            label: "Teste de Fuga à Massa (Curto para a Carcaça)",
            text: "Encoste uma ponta de prova no pino C (ou U, V, W) e a outra ponta no tubo de cobre da sucção/descarga (limpo, sem tinta ou oxidação) na maior escala de resistência (MΩ) ou no megômetro. O visor deve indicar OL (Circuito Aberto / Isolamento Perfeito). Qualquer leitura de continuidade ou resistência indica compressor em curto com a massa."
          }
        ]
      },
      {
        subtitle: "2. Teste de Capacitores, Sensores NTC e Válvulas",
        table: {
          headers: ["Componente", "Escala do Multímetro", "Valores de Referência / Critério de Aprovação"],
          rows: [
            [
              "Capacitor de Fase (Compressor/Ventilador)",
              "Capacímetro (μF)",
              "Deve estar dentro da tolerância gravada na peça (geralmente ±5%). Ex: Capacitor de 35 μF ±5% é aprovado entre 33,25 μF e 36,75 μF."
            ],
            [
              "Sensor de Temperatura (Termistor NTC)",
              "Resistência (kΩ)",
              "Medido a exatos 25 °C (em água termostatizada), deve cravar seu valor nominal (ex: 5 kΩ, 10 kΩ, 15 kΩ ou 50 kΩ). Ao aquecer o bulbo com os dedos, a resistência deve cair suavemente."
            ],
            [
              "Bobina da Válvula Solenoide Reversora (4 Vias)",
              "Resistência (Ω)",
              "Tipicamente apresenta resistência entre 1.000 Ω (1 kΩ) e 2.200 Ω (2,2 kΩ) para bobinas 220 VAC. Se der OL, a bobina está rompida."
            ],
            [
              "Bobina da Válvula de Expansão Eletrônica (EEV)",
              "Resistência (Ω)",
              "Possui conector de 5 ou 6 pinos (motor de passo). Medindo do pino Comum para cada uma das 4 fases, encontra-se tipicamente ~46 Ω a 50 Ω em cada bobina."
            ]
          ]
        },
        highlightBox: {
          type: "info",
          title: "Regra Prática sobre Sensores NTC Descalibrados",
          content: "Um sensor NTC raramente 'abre' ou entra em curto total; na maioria dos defeitos reais, ele altera sua curva (descalibra). Exemplo: um sensor de 10 kΩ que a 25 °C mede 4,2 kΩ fará a placa eletrônica 'acreditar' que o ambiente está a 45 °C, mantendo o compressor acelerado no máximo sem modular ou gerando código de erro de proteção."
        }
      }
    ]
  },
  {
    lessonOrder: 4,
    titleKey: "diagrama",
    fullTitle: "Aula 04: Diagrama Elétrico de Condicionador de Ar Tipo Split",
    videoUrl: "",
    videoTitle: "Como Diagnosticar o Erro de Comunicação Serial (E1) Medindo a Tensão Contínua (VDC) entre Bornes N e S",
    videoDescription: "Ensinar o técnico a posicionar o multímetro em escala de corrente contínua nos bornes da borneira para observar o pulso de comunicação oscilante e diagnosticar se o defeito está no cabo de sinal, na evaporadora ou na condensadora.",
    workload: "4 Horas",
    shortSummary:
      "Leitura e interpretação de esquemas elétricos de condicionadores de ar Split On/Off e Inverter: simbologia padronizada, arquitetura da borneira de interligação (L, N, S / Comunicação Serial), malha de potência da placa eletrônica (Fusível, Varistor, Ponte Retificadora, PFC e IPM) e diagnóstico do sinal serial.",
    keyPoints: [
      "Split On/Off usa múltiplos cabos de comando (Compressor, Ventilador, Válvula 4 Vias, Neutro e Terra).",
      "Split Inverter usa apenas 3 vias ativas + Terra (Fase L, Neutro N, Sinal de Comunicação S e Terra PE).",
      "O borne 'S' (Sinal) trafega pulsos em Corrente Contínua (VDC oscilante) entre a evaporadora e a condensadora.",
      "Na placa eletrônica: Fusível protege contra sobrecorrente; Varistor (MOV) protege contra surtos de tensão."
    ],
    diagramType: "eletricidade_diagrama" as any,
    diagramCaption:
      "Figura 4.1 — Diagrama elétrico de interligação da Borneira Split Inverter (L, N, S, PE) e ponto de teste da comunicação serial.",
    sections: [
      {
        subtitle: "1. Arquitetura de Interligação: Split On/Off vs. Split Inverter",
        paragraphs: [
          "A leitura do diagrama elétrico colado na tampa da unidade condensadora é o mapa oficial do técnico. A diferença estrutural entre tecnologias reside na forma como a unidade interna aciona a unidade externa:"
        ],
        bullets: [
          {
            label: "Arquitetura Split Convencional (On/Off)",
            text: "A placa eletrônica fica apenas na evaporadora. Quando o usuário pede refrigeração, relés na placa interna fecham contato e enviam 220 VAC diretamente por fios separados na borneira (ex: Borne 1 = Compressor, Borne 2 = Neutro, Borne 3 = Ventilador Externo, Borne 4 = Válvula Reversora + Terra)."
          },
          {
            label: "Arquitetura Split Inverter (Comunicação Serial)",
            text: "Existem duas placas computadorizadas: uma na evaporadora e outra na condensadora. A interligação elétrica entre as unidades requer apenas alimentação elétrica (Fase L + Neutro N + Terra PE) e UM único fio de dados chamado Sinal de Comunicação (Borne S, W ou SI)."
          }
        ]
      },
      {
        subtitle: "2. Como Diagnosticar o Erro de Comunicação Serial (Borne N e S)",
        paragraphs: [
          "O 'Erro de Comunicação' (código E1, C1, CH05, etc.) é a falha mais frequente em campo nos sistemas Inverter. O circuito de comunicação opera com um loop de corrente contínua (tipicamente 24 VDC a 56 VDC) chaveado por fotoacopladores ópticos nas duas placas."
        ],
        highlightBox: {
          type: "practical",
          title: "Passo a Passo do Teste de Comunicação com Multímetro",
          content: "Com o aparelho ligado e os cabos conectados, coloque o multímetro na escala de Tensão Contínua (VDC). Posicione a ponta Preta no borne N (ou L2) e a ponta Vermelha no borne S (Sinal): 1) NORMAL: A tensão varia e oscila continuamente no visor (ex: alternando de +5 VDC a +24 VDC ou de -15V a +25V), provando que uma placa fala e a outra responde; 2) DEFEITO: Se a tensão ficar travada fixa em 0 V ou travada fixa no valor máximo (ex: 24 V ou 56 V cravados sem oscilar), há rompimento no fio S ou falha em uma das placas."
        }
      },
      {
        subtitle: "3. Simbologia e Estágios da Placa Eletrônica Condensadora (PCB Inverter)",
        table: {
          headers: ["Sigla no Diagrama", "Componente Eletrônico", "Função no Circuito da Placa"],
          rows: [
            ["FUSE / F1", "Fusível de Vidro ou Cerâmico", "Abre o circuito em caso de curto-circuito grave, evitando incêndio nas trilhas."],
            ["MOV / ZNR / VAR", "Varistor de Óxido Metálico", "Protege contra surtos de sobretensão (raios/rede). Entra em curto para queimar o fusível e salvar a placa."],
            ["DB / BR1", "Ponte Retificadora de Diodos", "Converte a tensão alternada da rede (220 VAC) em tensão contínua pulsante."],
            ["REACTOR / L / PFC", "Reator (Indutor de Potência)", "Corrige o fator de potência e estabiliza a corrente no barramento DC."],
            ["CAP (DC Link)", "Capacitores Eletrolíticos", "Filtram e armazenam a tensão contínua retificada em ~310 VDC."],
            ["IPM", "Módulo Inteligente de Potência", "Conjunto de 6 transistores IGBTs que converte os 310 VDC em saída trifásica modulada (U, V, W) para o compressor."]
          ]
        }
      }
    ]
  }
];

export const module2ChallengeData: ModuleChallengeData = {
  title: "Desafio Prático Integrado: Diagnóstico Elétrico e Eletrônico na Bancada",
  subtitle: "Atividade Oficial de Encerramento do Módulo 2 • Metodologia SENAI de Oficina",
  objective:
    "Capacitar os alunos a diagnosticar falhas elétricas reais em condicionadores de ar Split On/Off e Inverter, utilizando raciocínio lógico baseado na Lei de Ohm, normas ABNT NBR 5410, uso correto de instrumentos True RMS, laudo de componentes e interpretação de diagramas elétricos.",
  dynamics: [
    "Fase 1 (15 min): As 4 equipes analisam os seus respectivos dossiês de falha elétrica utilizando as apostilas técnicas do Módulo 2.",
    "Fase 2 (15 min): Cada equipe apresenta à turma o laudo técnico, explicando a causa física do problema e o procedimento seguro de medição.",
    "Fase 3 (15 min): O Instrutor valida os diagnósticos na bancada didática, reforçando os protocolos de segurança elétrica (NR-10 e NBR 5410)."
  ],
  groups: [
    {
      groupNumber: 1,
      groupTitle: "Equipe de Instalações Elétricas e Normas (NBR 5410)",
      focusTopics: "Foco: Aula 01 (Fundamentos de Eletricidade e Dimensionamento)",
      scenario:
        "Um cliente instalou um Split Inverter de 24.000 BTU/h (Potência elétrica nominal de 2.200 W em 220 V) puxando uma extensão improvisada de 25 metros feita com fio paralelo fino de 1,5 mm², ligada em uma tomada comum junto com um micro-ondas, e cortou o pino de aterramento (PE). O cabo derreteu parcialmente e o aparelho desliga sozinho quando o compressor acelera.",
      missions: [
        "Calcular a corrente elétrica nominal do aparelho aplicando a fórmula de potência (I = P / V).",
        "Explicar fisicamente, pela Lei de Ohm, por que o cabo fino de 1,5 mm² aqueceu e provocou queda de tensão na condensadora.",
        "Especificar o circuito dedicado correto exigido pela ABNT NBR 5410 (bitola mínima em mm², disjuntor e papel vital do aterramento na placa Inverter)."
      ]
    },
    {
      groupNumber: 2,
      groupTitle: "Equipe de Instrumentação e Segurança de Medição",
      focusTopics: "Foco: Aula 02 (Instrumentos de Medição e Categorias CAT)",
      scenario:
        "Durante uma manutenção, um ajudante colocou a garra do alicate amperímetro abraçando o cabo PP inteiro (contendo Fase, Neutro e Terra juntos) e afirmou que o compressor estava consumindo 0,0 A mesmo funcionando. Em seguida, sem desligar o disjuntor, colocou o multímetro na escala de Resistência (Ω) para medir a borneira energizada em 220 V, queimando o instrumento.",
      missions: [
        "Explicar eletromagneticamente por que o alicate amperímetro marcou 0,0 A ao abraçar o cabo PP inteiro e demonstrar o procedimento correto.",
        "Apontar o erro grave cometido ao usar a escala de Resistência (Ω) com o circuito energizado e detalhar como medir Tensão, Corrente e Capacitância com segurança.",
        "Justificar por que sistemas Inverter exigem instrumentos True RMS e classificação mínima de segurança CAT III."
      ]
    },
    {
      groupNumber: 3,
      groupTitle: "Equipe de Laudo de Componentes em Bancada",
      focusTopics: "Foco: Aula 03 (Testes de Compressores, Sensores e Capacitores)",
      scenario:
        "Três peças suspeitas chegaram à bancada para laudo técnico: 1) Um compressor Inverter apresentando resistências U-V = 1,6 Ω, V-W = 1,6 Ω e U-W = 0,1 Ω; 2) Um sensor de degelo NTC de 10 kΩ que, mergulhado em água a 25 °C, está medindo 1,8 kΩ fixos; 3) Um capacitor de 35 μF ±5% que mediu 21 μF no capacímetro.",
      missions: [
        "Emitir o laudo técnico (Aprovado ou Reprovado) para o compressor Inverter, comparando a simetria das bobinas U-V-W com o sistema C-S-R convencional e explicando o teste de massa.",
        "Diagnosticar o estado do sensor NTC de 10 kΩ e explicar como essa leitura de 1,8 kΩ engana o microprocessador da placa eletrônica.",
        "Calcular a faixa mínima aceitável do capacitor de 35 μF (±5%) e explicar o sintoma que um capacitor de 21 μF causa na partida do motor."
      ]
    },
    {
      groupNumber: 4,
      groupTitle: "Equipe de Diagramas Elétricos e Comunicação Serial",
      focusTopics: "Foco: Aula 04 (Diagrama Elétrico Split e Falha de Comunicação)",
      scenario:
        "Um Split Inverter recém-instalado liga a unidade interna normalmente, mas a unidade externa não parte e, após 2 minutos, o painel exibe 'Erro E1 (Falha de Comunicação Serial)'. Ao abrir a tampa da borneira (L, N, S, PE), a equipe precisa descobrir se o problema é falta de alimentação, cabo S rompido por emenda mal feita ou placa queimada por surto.",
      missions: [
        "Diferenciar a função dos bornes L, N, S e PE no diagrama elétrico de um Split Inverter em comparação ao Split On/Off.",
        "Descrever passo a passo como testar a oscilação do sinal de comunicação entre os bornes N e S usando o multímetro em Tensão Contínua (VDC).",
        "Identificar no diagrama da placa eletrônica a função da dupla de proteção de entrada (Fusível + Varistor MOV) e do módulo IPM."
      ]
    }
  ]
};