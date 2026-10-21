import { Lesson, LessonMaterial } from "./module1Materials";
import { ModuleChallengeData } from "./module1Challenge";

export const module3MaterialsData: LessonMaterial[] = [
  {
    lessonOrder: 1,
    titleKey: "ferramentas",
    fullTitle: "Aula 01: Ferramentas, EPIs e Planejamento da Infraestrutura",
    videoUrl: "",
    videoTitle: "Planejamento e Kit Essencial de Ferramentas para Instalação Profissional de Split",
    videoDescription: "Apresentar a mala de ferramentas profissional de refrigeração e demonstrar a escolha correta do local de fixação das unidades respeitando distâncias mínimas de circulação e NR-35.",
    workload: "4 Horas",
    shortSummary:
      "Apresentação das ferramentas exclusivas de refrigeração (Manifold, Vacuômetro, Flangeador, Bomba de Vácuo), EPIs obrigatórios (NR-35 e NR-10) e a correta locação da unidade interna e externa respeitando os distanciamentos do fabricante.",
    keyPoints: [
      "EPIs fundamentais: Luvas nitrílicas (gás), óculos de proteção, cinto tipo paraquedista (NR-35) e calçado de segurança.",
      "Planejamento: Evitar instalação de condensadoras em locais confinados sem ventilação cruzada.",
      "Desnível e Comprimento: Respeitar a tabela do manual do fabricante para distância máxima e necessidade de sifão.",
      "Organização de bancada e inspeção prévia de rede elétrica e drenagem antes da furação."
    ],
    diagramType: "pressao",
    diagramCaption: "Figura 1.1 — Planejamento de infraestrutura, leitura de pressões de trabalho e zonas de operação.",
    sections: [
      {
        subtitle: "1. Inspeção do Local, Distanciamentos e Normas de Segurança (NR-10 e NR-35)",
        paragraphs: [
          "A instalação técnica começa na avaliação arquitetônica e estrutural. A unidade evaporadora não deve ser instalada sobre fontes de calor ou equipamentos eletrônicos sensíveis, garantindo no mínimo 15 cm de folga livre do teto para o pleno retorno de ar.",
          "A unidade condensadora exige circulação franca de ar. Instalações em fossos fechados ou varandas envidraçadas sem exaustão provocam recirculação de ar quente, elevando drasticamente a pressão de descarga e causando desarme térmico ou queima do compressor."
        ],
        bullets: [
          {
            label: "Distância Mínima e Máxima de Tubulação",
            text: "Respeitar o comprimento mínimo exigido pelo fabricante (geralmente 2 a 3 metros) para evitar ruído de expansão e vibração mecânica, bem como o comprimento máximo e desnível para retorno de óleo lubrificante."
          },
          {
            label: "EPIs Obrigatórios na Instalação",
            text: "Óculos de proteção contra projeção de partículas e fluido refrigerante, luvas nitrílicas (prevenção de queimadura criogênica), protetor auricular no uso de martelete/serra copo e cinto paraquedista ancorado em linha de vida para trabalhos acima de 2,0 metros (NR-35)."
          }
        ]
      }
    ]
  },
  {
    lessonOrder: 2,
    titleKey: "tubulacao",
    fullTitle: "Aula 02: Tubos de Cobre, Isolamento Térmico e Brasagem",
    videoUrl: "https://www.youtube.com/watch?v=d0Vqak3Lr_A",
    videoTitle: "Brasagem Técnica em Tubulação de Cobre com Nitrogênio Passante (Passadiço de N₂)",
    videoDescription: "Executar duas soldas lado a lado — uma com fluxo de N₂ e outra sem —, cortar os tubos ao meio e mostrar na câmera a formação de carepa preta prejudicial nos tubos soldados sem proteção gasosa.",
    workload: "4 Horas",
    shortSummary:
      "Especificação das bitolas de tubos de cobre fosforoso (1/4, 3/8, 1/2, 5/8), espessura de parede para alta pressão (R-410A e R-32), isolamento térmico elastomérico individual e técnicas de brasagem oxi-acetilênica/Mapp com fluxo passante de Nitrogênio.",
    keyPoints: [
      "Isolamento individual obrigatório: As linhas de sucção e de líquido/expansão jamais devem ser isoladas juntas na mesma esponja.",
      "Espessura mínima de parede: Sistemas R-410A e R-32 exigem tubos de cobre sem costura com parede mínima de 0,79 mm (1/32').",
      "Passadiço de Nitrogênio (N₂): Injetar fluxo contínuo de N₂ (1 a 3 PSI) dentro do tubo durante a brasagem impede a formação de carepa (óxido de cobre).",
      "Curvamento técnico: Utilizar molas curvadoras ou curvadores de alavanca para evitar estrangulamento na seção transversal."
    ],
    diagramType: "brasagem",
    diagramCaption: "Figura 2.1 — Protocolo de brasagem: regulagem da chama neutra (3.100 °C), fluxo passante de N₂ (1 a 3 PSI) e proteção térmica das válvulas com pano úmido.",
    sections: [
      {
        subtitle: "1. Especificação de Tubos de Cobre e Isolamento Elastomérico",
        paragraphs: [
          "Tubos de cobre amassados ou estrangulados durante o desenrolamento funcionam como um ponto de restrição (pré-expansão indesejada), reduzindo a capacidade frigorífica e alterando o superaquecimento.",
          "Durante qualquer emenda por brasagem (solda foscoper ou prata), o aquecimento do cobre em contato com o oxigênio atmosférico interno gera carepa preta (óxido cúprico). Quando o fluido R-410A/R-32 e o óleo POE circulam, essa carepa se solta e entope a válvula de expansão eletrônica (EEV) e a tela do compressor."
        ],
        highlightBox: {
          type: "danger",
          title: "REGRA DE OURO NA BRASAGEM: FLUXO PASSANTE DE NITROGÊNIO (N₂)",
          content: "Nunca execute solda em tubulações de climatização sem fazer circular um filete contínuo de Nitrogênio seco pela parte interna do tubo (2 a 3 PSI). O Nitrogênio expulsa o oxigênio interno e garante que a parede interna do cobre permaneça 100% limpa e espelhada após a brasagem."
        }
      },
      {
        subtitle: "2. Tipos de Chama do Maçarico e Proteção Térmica de Válvulas",
        paragraphs: [
          "A regulagem correta da chama no maçarico (oxi-acetileno ou gás MAPP) é determinante para a fusão perfeita da liga de enchimento (solda foscoper para cobre-cobre ou solda prata com fluxo para cobre-latão):"
        ],
        bullets: [
          {
            label: "Chama Redutora / Carburante (Excesso de Combustível/Gás)",
            text: "Apresenta cone interno luminoso e penugem intermediária amarelada. Possui temperatura inferior e deposita fuligem de carbono sobre o tubo de cobre. Indicada apenas para aquecimento brando."
          },
          {
            label: "Chama Oxidante (Excesso de Oxigênio — PREJUDICIAL)",
            text: "Apresenta dardo cônico pontiagudo e chiado estridente. O excesso de oxigênio queima o tubo de cobre, gerando fragilidade na parede metálica e porosidades na solda. É proibida na brasagem de refrigeração."
          },
          {
            label: "Chama Neutra ou Normal (Proporção Exata — OBRIGATÓRIA)",
            text: "Apresenta dardo cônico bem delineado, arredondado e com coloração azul-claro brilhante suave (~3.100 °C). É a única chama correta para brasagem em refrigeração, garantindo aquecimento uniforme e fluidez por capilaridade."
          }
        ],
        highlightBox: {
          type: "practical",
          title: "PROTEÇÃO TÉRMICA DAS VÁLVULAS DE SERVIÇO CONTRA DESTRUIÇÃO TÉRMICA",
          content: "As válvulas de serviço da unidade condensadora contêm retentores internos de teflon e anéis de vedação (O-rings) de borracha sintética. Se submetidas a calor direto ou conduzido pelo tubo de cobre durante a brasagem, essas vedações derretem, inutilizando a máquina. É OBRIGATÓRIO envolver o corpo da válvula com um pano abundantemente encharcado de água fria ou aplicar pasta dissipadora anti-chama profissional antes de aproximar a chama do maçarico."
        }
      }
    ]
  },
  {
    lessonOrder: 3,
    titleKey: "flange",
    fullTitle: "Aula 03: Corte, Escareamento e Flangeamento Perfeito",
    videoUrl: "https://www.youtube.com/watch?v=hvROmk1A80Y",
    videoTitle: "O Passo a Passo do Flange Perfeito para R-410A e R-32 com Flangeador Excêntrico e Torquímetro",
    videoDescription: "Demonstrar o corte com cortador de roletes, escareamento com o tubo voltado para baixo, projeção na régua, conformação cônica espelhada e aperto na porca utilizando chave torquimétrica aferida em N·m.",
    workload: "4 Horas",
    shortSummary:
      "Execução mecânica de conexões flangeadas de alta pressão: corte em esquadro a 90°, escareamento interno com o tubo voltado para baixo, calibração da projeção na régua e conformação com flangeador excêntrico com catraca de torque.",
    keyPoints: [
      "Corte em esquadro: Utilizar cortador de tubos de roletes girando suavemente; proibido o uso de arco de serra.",
      "Escareamento limpo: Remover a rebarba interna com o tubo inclinado para baixo para que nenhuma limalha caia dentro da linha.",
      "Flange excêntrico: Produz face interna espelhada e uniforme sem afinar a parede do cobre.",
      "Aperto com Torquímetro: Apertar as porcas flangeadas respeitando o torque em N·m de cada bitola, sem uso de fita veda-rosca."
    ],
    diagramType: "flange",
    diagramCaption: "Figura 3.1 — Geometria do flange perfeito a 45°: projeção de 1,0 a 1,5 mm acima da mesa, lubrificação com gota de óleo POE e aperto calibrado em N·m.",
    sections: [
      {
        subtitle: "1. Vedação Metal-Metal e Tabela de Torque para Porcas Flangeadas",
        paragraphs: [
          "Em sistemas Split, a vedação não ocorre na rosca da porca, mas sim no assentamento cônico a 45° entre o flange de cobre e a sede de latão da válvula de serviço. Jamais aplique fita teflon (veda-rosca) nas conexões."
        ],
        table: {
          headers: ["Bitola do Tubo (Pol.)", "Diâmetro Externo (mm)", "Torque Recomendado (N·m)", "Consequência do Excesso de Aperto"],
          rows: [
            ["1/4\"", "6,35 mm", "14 a 18 N·m", "Esmagamento e corte do colarinho do flange."],
            ["3/8\"", "9,52 mm", "33 a 42 N·m", "Trinca na parede cônica e vazamento lento."],
            ["1/2\"", "12,70 mm", "50 a 62 N·m", "Deformação da sede de latão ou rachadura da porca."],
            ["5/8\"", "15,88 mm", "63 a 77 N·m", "Ruptura estrutural da porca em alta pressão."]
          ]
        },
        highlightBox: {
          type: "practical",
          title: "PROJEÇÃO DE 1,0 A 1,5 MM E GOTA DE ÓLEO POE NO CONE DO FLANGEADOR",
          content: "Para atingir o padrão ouro na conformação do flange excêntrico em tubos para R-410A e R-32: 1) O tubo de cobre deve ficar projetado estritamente entre 1,0 mm e 1,5 mm acima da face da mesa/morsa do flangeador antes da fixação da prensa; 2) Aplique UMA GOTA DE ÓLEO REFRIGERANTE SINTÉTICO (POE) na face do cone excêntrico giratório antes de iniciar a prensagem. O óleo reduz o atrito mecânico, previne microrrachaduras no colarinho e assegura um acabamento 100% espelhado e vedante."
        }
      }
    ]
  },
  {
    lessonOrder: 4,
    titleKey: "suportes",
    fullTitle: "Aula 04: Fixação de Suportes, Nivelamento e Drenagem",
    videoUrl: "",
    videoTitle: "Instalação de Suporte com Nível Bolha, Coxins Antivibração e Teste Hidráulico de Drenagem",
    videoDescription: "Demonstrar a correta fixação mecânica da evaporadora e condensadora, aplicação de buchas adequadas e teste de vazão contínua com 500 ml de água na calha do dreno.",
    workload: "4 Horas",
    shortSummary:
      "Instalação mecânica de suportes da unidade interna e mãos-francesas da condensadora: nivelamento de precisão, dimensionamento de buchas e chumbadores por tipo de alvenaria, amortecimento acústico com coxins e caimento hidráulico do dreno.",
    keyPoints: [
      "Nivelamento da evaporadora: A chapa de fixação deve ficar 100% em nível; a bandeja interna já possui o caimento de fábrica.",
      "Linha de drenagem: Declive contínuo mínimo de 1% a 2% (1 a 2 cm por metro), evitando sifões ou elevações que retenham água.",
      "Fixação da condensadora: Uso de buchas de expansão de qualidade (8 mm ou 10 mm) ou barra roscada passante em paredes ocas.",
      "Coxins de borracha: Obrigatórios entre os pés da condensadora e o suporte para isolar vibrações estruturais."
    ],
    diagramType: "ciclo",
    diagramCaption: "Figura 4.1 — Posicionamento físico entre Unidade Interna (Evaporadora) e Unidade Externa (Condensadora).",
    sections: [
      {
        subtitle: "1. Nivelamento, Fixação Estrutural e Teste Hidráulico de Drenagem",
        paragraphs: [
          "Antes de encaixar definitivamente a carenagem ou fechar o acabamento em gesso, o instalador deve despejar 500 ml de água limpa diretamente na serpentina da evaporadora e observar o escoamento livre na ponta final do dreno."
        ]
      }
    ]
  },
  {
    lessonOrder: 5,
    titleKey: "eletrica",
    fullTitle: "Aula 05: Interligação Elétrica de Potência e Comando Serial",
    videoUrl: "",
    videoTitle: "Crimpagem de Terminais Ilhós e Interligação da Borneira L-N-S-PE sem Emendas",
    videoDescription: "Exibir a decapagem técnica, uso do alicate de crimpagem com terminais tipo forquilha/ilhós e montagem firme no prensa-cabos da condensadora.",
    workload: "4 Horas",
    shortSummary:
      "Execução da interligação elétrica entre evaporadora e condensadora com cabo PP multipolar: proibição de emendas no fio de comunicação serial (S), crimpagem de terminais tubulares (ilhós/forquilha), prensa-cabo e aterramento equipotencial (PE).",
    keyPoints: [
      "Cabo PP contínuo: Jamais faça emendas no cabo de interligação, especialmente na via de comunicação serial (Borne S).",
      "Terminais crimpados: Obrigatório o uso de terminais ilhós ou forquilha prensados com alicate específico em todas as pontas.",
      "Correspondência fiel na borneira: Respeitar rigorosamente a sequência L (Fase), N (Neutro/Fase 2), S (Sinal) e PE (Terra).",
      "Prensa-cabo mecânico: Travar a capa externa do cabo PP no prensa-cabo da máquina para evitar tração direta nos bornes."
    ],
    diagramType: "eletricidade_diagrama",
    diagramCaption: "Figura 5.1 — Diagrama de interligação elétrica e malha de comunicação serial (L, N, S, PE) no Split Inverter.",
    sections: [
      {
        subtitle: "1. Padrão Industrial de Crimpagem e Integridade do Sinal Inverter",
        paragraphs: [
          "Pontas de fio decapadas e presas diretamente sob o parafuso da borneira sofrem oxidação e afrouxamento térmico, gerando pontos quentes (Efeito Joule) e derretimento da borneira. A crimpagem de terminais garante área de contato 100% firme e segura."
        ]
      }
    ]
  },
  {
    lessonOrder: 6,
    titleKey: "estanqueidade",
    fullTitle: "Aula 06: Teste de Estanqueidade por Pressurização com Nitrogênio",
    videoUrl: "",
    videoTitle: "Teste de Estanqueidade com Nitrogênio Seco (N₂) em Degraus até 450 PSIG",
    videoDescription: "Conectar o cilindro de N₂ com regulador de alta pressão de dois estágios, elevar a pressão em etapas e aplicar líquido detector de bolhas em todos os flanges e soldas da instalação.",
    workload: "4 Horas",
    shortSummary:
      "Procedimento normativo de ensaio de estanqueidade com Nitrogênio seco (N₂) regulado em alta pressão para validação de soldas, flanges e serpentina antes do processo de vácuo, com proibição absoluta de oxigênio ou gases refrigerantes para caça-vazamentos.",
    keyPoints: [
      "Uso exclusivo de Nitrogênio (N₂) com regulador de pressão de dois estágios devidamente calibrado.",
      "Pressurização em degraus: Subir gradualmente (100 PSIG → 250 PSIG → 400 a 450 PSIG para linhas R-410A/R-32).",
      "Inspeção física: Aplicar solução tensoativa (espuma de sabão neutro) nas porcas flangeadas e pontos de brasagem.",
      "Estabilidade manométrica: Monitorar a pressão estabilizada por no mínimo 20 a 30 minutos (descontando variações de temperatura ambiente)."
    ],
    diagramType: "seguranca",
    diagramCaption: "Figura 6.1 — Segurança na pressurização: uso obrigatório de Nitrogênio seco (N₂) e proibição letal de Oxigênio (O₂).",
    sections: [
      {
        subtitle: "1. Protocolo de Pressurização em Degraus e Inspeção de Vazamentos",
        highlightBox: {
          type: "danger",
          title: "ALERTA DE SEGURANÇA MÁXIMA (NR-12): JAMAIS USE OXIGÊNIO (O₂) OU AR COMPRIMIDO",
          content: "O Oxigênio puro sob pressão reage instantaneamente com o óleo poliolester (POE) ou mineral do sistema, provocando uma explosão mecânica violenta e letal da tubulação ou condensadora. Da mesma forma, o ar comprimido injeta água líquida diretamente na linha. Utilize exclusivamente NITROGÊNIO SECO (N₂) com válvula reguladora."
        }
      }
    ]
  },
  {
    lessonOrder: 7,
    titleKey: "vacuo",
    fullTitle: "Aula 07: Procedimento de Desidratação por Vácuo Profundo",
    videoUrl: "https://www.youtube.com/watch?v=7nJPw41pof4",
    videoTitle: "Como Atingir Vácuo Abaixo de 500 Microns usando Vacuômetro Digital e Extrator de Schrader",
    videoDescription: "Explicar a limitação do manômetro analógico, operar o vacuômetro digital acoplado diretamente à válvula de serviço e realizar o teste de estanqueidade em vácuo (Decay Test por 15 minutos).",
    workload: "4 Horas",
    shortSummary:
      "Termodinâmica da desidratação a vácuo: remoção de ar, gases não-condensáveis e umidade interna até a meta estrita abaixo de 500 Microns de mercúrio (μmHg), utilizando bomba de vácuo de duplo estágio, extrator de núcleo Schrader e vacuômetro digital.",
    keyPoints: [
      "Por que fazer vácuo? Baixar a pressão absoluta faz a água líquida interna ferver e evaporar a temperatura ambiente.",
      "Meta técnica obrigatória: Atingir e estabilizar abaixo de 500 Microns (μmHg) lidos exclusivamente em Vacuômetro Digital.",
      "Aceleração de fluxo: Utilizar extrator de núcleo de válvula Schrader e mangueira específica de vácuo reduz o tempo pela metade.",
      "Teste de quebra de vácuo (Decay Test): Isolar a bomba por 15 minutos e confirmar que a leitura não sobe acima de 500 a 700 Microns."
    ],
    diagramType: "vacuo",
    diagramCaption: "Figura 7.1 — Escala absoluta de vácuo e meta técnica de desidratação abaixo de 500 Microns (μmHg).",
    sections: [
      {
        subtitle: "1. Física do Vácuo Profundo e Prevenção de Acidez no Óleo POE",
        paragraphs: [
          "O óleo sintético POE utilizado nos compressores Inverter R-410A e R-32 é altamente higroscópico (absorve umidade do ar rapidamente). Se restar umidade dentro do circuito, ela reagirá com o fluido e o óleo sob alta temperatura, formando ácido fluorídrico/clorídrico que corrói o verniz das bobinas do compressor (queima ácida).",
          "Manômetros analógicos comuns não medem vácuo profundo (o ponteiro encosta em -30 inHg quando ainda existem mais de 25.000 Microns de pressão residual). Apenas o Vacuômetro Digital garante a desidratação real abaixo de 500 μmHg."
        ]
      }
    ]
  },
  {
    lessonOrder: 8,
    titleKey: "carga",
    fullTitle: "Aula 08: Carga de Fluido Refrigerante por Massa com Balança Digital",
    videoUrl: "",
    videoTitle: "Carga de Gás por Peso na Balança Digital e Cálculo do Adicional por Metro de Tubo",
    videoDescription: "Posicionar a garrafa de R-410A/R-32 sobre a balança de precisão, tarar, purgar a mangueira de serviço e dosar com exatidão a quantidade de gramas indicada na etiqueta de engenharia.",
    workload: "4 Horas",
    shortSummary:
      "Procedimento de liberação do fluido original da condensadora, cálculo de carga complementar por metro excedente de tubulação, purga das mangueiras de serviço e carga precisa por massa (gramas) em balança eletrônica para fluidos R-410A e R-32.",
    keyPoints: [
      "Quebra do vácuo com fluido: Liberar parcialmente o fluido ou injetar pela balança ANTES de desconectar a mangueira sob pressão positiva.",
      "Fluidos Série 400 (R-410A): Mistura quase-azeotrópica — carga OBRIGATORIAMENTE na fase líquida (garrafa invertida).",
      "Cálculo complementar: Adicionar exatos 15 g/m a 20 g/m (conforme manual) para cada metro que ultrapassar a linha padrão de fábrica (ex: 5 m).",
      "Carga total pós-manutenção: Sempre recolher, fazer vácuo e carregar 100% por peso de placa usando balança digital."
    ],
    diagramType: "balanca",
    diagramCaption: "Figura 8.1 — Arranjo técnico de carga de fluido refrigerante por massa utilizando Balança Digital, Manifold e Válvula de Segurança.",
    sections: [
      {
        subtitle: "1. Protocolo de Carga por Massa e Adicional de Linha Frigorífica",
        paragraphs: [
          "Em equipamentos Inverter, a válvula de expansão eletrônica (EEV) e a rotação variável do compressor mascaram as pressões de trabalho no manifold. Por isso, é tecnicamente proibido 'completar gás no olhômetro pela pressão'. Toda carga deve ser pesada em gramas na balança digital."
        ]
      }
    ]
  },
  {
    lessonOrder: 9,
    titleKey: "rendimento",
    fullTitle: "Aula 09: Análise de Rendimento: Superaquecimento, Subresfriamento e Delta T",
    videoUrl: "https://www.youtube.com/watch?v=Z-5henAEHgA",
    videoTitle: "Comissionamento e Start-up Técnico: Como Calcular o Superaquecimento (SH) e o Delta T do Ar",
    videoDescription: "Medir temperatura do tubo de sucção, converter pressão lida em temperatura de evaporação pela régua P-T, calcular o valor de SH e atestar a eficiência da máquina com termômetro no insuflamento e retorno.",
    workload: "4 Horas",
    shortSummary:
      "Diagnóstico termodinâmico de start-up e comissionamento: aferição de Superaquecimento (SH), Subresfriamento (SC), Salto Térmico de ar na evaporadora (Delta T) e conferência da corrente nominal com alicate amperímetro True RMS.",
    keyPoints: [
      "Superaquecimento (SH = T_sucção - T_evaporação): Garante que apenas vapor seco chegue ao compressor (faixa típica em Split: 4 K a 8 K).",
      "Subresfriamento (SC = T_condensação - T_líquido): Garante 100% de líquido sem bolhas antes do dispositivo de expansão.",
      "Salto Térmico (ΔT = T_retorno - T_insuflamento): Diferença de temperatura do ar na evaporadora deve situar-se entre 10 °C e 15 °C.",
      "Validação elétrica final: Aferir tensão sob carga e corrente elétrica (A) comparando com a etiqueta nominal do equipamento."
    ],
    diagramType: "calor",
    diagramCaption: "Figura 9.1 — Comportamento termodinâmico do Calor Sensível e Latente na avaliação de Superaquecimento e Subresfriamento.",
    sections: [
      {
        subtitle: "1. Parâmetros de Aprovação no Comissionamento (Start-up Técnico)",
        table: {
          headers: ["Parâmetro Termodinâmico", "Fórmula Prática", "Faixa Ideal de Referência", "Significado de Leitura Fora do Padrão"],
          rows: [
            [
              "Superaquecimento (SH)",
              "T_tubo_sucção - T_sat_baixa",
              "4 °C a 8 °C (ou K)",
              "SH Alto (>12°C): Falta de fluido ou restrição. SH Baixo (<2°C): Retorno de líquido ao compressor."
            ],
            [
              "Subresfriamento (SC)",
              "T_sat_alta - T_tubo_líquido",
              "5 °C a 10 °C (ou K)",
              "SC Alto (>14°C): Excesso de carga ou condensador sujo. SC Baixo (<3°C): Falta de fluido."
            ],
            [
              "Salto Térmico do Ar (ΔT)",
              "T_ar_retorno - T_ar_saída",
              "10 °C a 15 °C",
              "ΔT < 8°C: Baixo rendimento frigorífico. ΔT > 17°C: Baixa vazão de ar (filtro/turbina sujos)."
            ]
          ]
        }
      }
    ]
  },
  {
    lessonOrder: 10,
    titleKey: "recolhimento",
    fullTitle: "Aula 10: Procedimento de Recolhimento de Fluido (Pump Down e Recolhedora)",
    videoUrl: "",
    videoTitle: "Procedimento Seguro de Pump Down: Recolhendo o Gás para a Condensadora Passo a Passo",
    videoDescription: "Demonstrar a manobra de fechamento da válvula de linha de líquido com chave Allen, monitoramento da queda da pressão de baixa até ~2 PSIG e corte instantâneo da válvula de sucção e da alimentação elétrica.",
    workload: "4 Horas",
    shortSummary:
      "Procedimentos seguros de recolhimento de fluido refrigerante para a unidade condensadora (Pump Down) em desinstalações ou manutenções, e uso de máquina recolhedora externa com cilindro próprio para evitar emissões atmosféricas.",
    keyPoints: [
      "Passo 1 do Pump Down: Ligar o aparelho no modo Frio (Cool) na menor temperatura e aguardar o compressor partir em carga.",
      "Passo 2: Fechar totalmente a válvula de serviço delgada (Linha de Líquido / Expansão) usando chave Allen.",
      "Passo 3: Monitorar o manômetro de baixa até a pressão cair próximo a 5 PSIG ~ 0 PSIG (nunca deixar entrar em vácuo profundo).",
      "Passo 4: Fechar rapidamente a válvula de Sucção (tubo grosso) e desligar o disjuntor imediatamente."
    ],
    diagramType: "ciclo",
    diagramCaption: "Figura 10.1 — Confinamento do fluido refrigerante no lado de alta pressão (Condensador) durante a manobra de Pump Down.",
    sections: [
      {
        subtitle: "1. Sequência Operacional Segura de Pump Down",
        highlightBox: {
          type: "practical",
          title: "CUIDADO CRÍTICO: NUNCA OPERE O COMPRESSOR EM VÁCUO OU COM VÁLVULAS FECHADAS",
          content: "Durante o Pump Down, assim que o manômetro de baixa encostar próximo a 0 PSIG, feche a válvula de sucção e desligue a alimentação elétrica no mesmo segundo. Se o compressor continuar rodando em vácuo sem fluxo de gás para resfriá-lo, ocorre faiscamento interno nos bornes herméticos (efeito Corona) ou ruptura mecânica por alta pressão caso ambas as válvulas estejam fechadas."
        }
      }
    ]
  },
  {
    lessonOrder: 11,
    titleKey: "manutencao",
    fullTitle: "Aula 11: Manutenção Preventiva, Higienização Química e PMOC (Lei 13.589/2018)",
    videoUrl: "",
    videoTitle: "Higienização Profissional com Bolsa Coletora, Lavadora de Pressão Regulada e Gestão do PMOC",
    videoDescription: "Demonstrar a aplicação de detergente desincrustante neutro/bactericida na serpentina e turbina com proteção da placa eletrônica, desobstrução de dreno e preenchimento de checklist normativo do PMOC.",
    workload: "4 Horas",
    shortSummary:
      "Protocolos de manutenção preventiva e corretiva: higienização técnica de serpentinas, turbina e bandeja com bolsa coletora e bactericidas neutros/alcalinos biodegradáveis, revisão elétrica e gestão do PMOC conforme a Lei Federal 13.589/2018 e Resolução ANVISA RE-09.",
    keyPoints: [
      "Proibição de ácidos agressivos: Produtos ácidos ('limpa-alumínio roxo') corroem a camada hidrofílica das aletas e furam os tubos de cobre.",
      "Lavagem por hidrojateamento controlado: Uso de bolsa coletora impermeável, blindagem da placa eletrônica e jato em leque a 90° das aletas.",
      "PMOC Obrigatório (Lei 13.589/2018): Exigido para todos os edifícios de uso público e coletivo climatizados artificialmente.",
      "Checklist de manutenção: Inclui limpeza química, desobstrução de dreno, reaperto de bornes, leitura de corrente (A) e registro no plano."
    ],
    diagramType: "fluidos",
    diagramCaption: "Figura 11.1 — Gestão ambiental, segurança sanitária e conformidade legal na manutenção de sistemas de climatização.",
    sections: [
      {
        subtitle: "1. Higienização Técnica e Conformidade Legal com o PMOC",
        paragraphs: [
          "O acúmulo de biofilme (fungos, bactérias e poeira) no rotor tangencial (turbina) e nas aletas do evaporador reduz a vazão de ar em até 45%, provocando congelamento da serpentina, gotejamento de água pela parede, aumento do consumo elétrico e doenças respiratórias nos ocupantes.",
          "Pela Lei Federal nº 13.589/2018 e Portaria MS 3.523/98, todo sistema de climatização de uso coletivo deve possuir um Plano de Manutenção, Operação e Controle (PMOC) atualizado, com rotinas mensais, trimestrais e semestrais documentadas."
        ]
      }
    ]  },
  {
    lessonOrder: 12,
    titleKey: "oficina",
    fullTitle: "Aula 12: Oficina Prática Integrada e Comissionamento Final",
    videoUrl: "",
    videoTitle: "Oficina Prática de Start-up: Simulação Real de Bancada do Desafio Integrado",
    videoDescription: "Execução prática do Desafio das 4 Equipes em bancada: comissionamento autônomo, conformação de flanges, pressurização com N₂, vácuo profundo < 500 Microns, carga por balança e laudo térmico de aprovação.",
    workload: "4 Horas",
    shortSummary:
      "Atividade prática conclusiva do Módulo 3 dedicada à execução autônoma do Desafio das 4 Equipes nas bancadas didáticas: integração dos processos de brasagem com Nitrogênio passante, flangeamento calibrado, teste de estanqueidade a 450 PSIG com N₂, desidratação a vácuo profundo, carga de fluido por massa em balança digital e emissão do laudo técnico com cálculo de Superaquecimento (SH) e Salto Térmico (Delta T).",
    keyPoints: [
      "Autonomia de bancada: Execução prática integral dos 4 dossiês técnicos do Desafio das Equipes.",
      "Conformidade mecânica: Validação de flanges excêntricos calibrados e aperto com torquímetro em N·m.",
      "Ciclo de desidratação e estanqueidade: Pressurização em degraus com N₂ e meta estrita de vácuo < 500 μmHg.",
      "Comissionamento termodinâmico: Carga em balança de precisão, cálculo de SH (4 a 8 K) e laudo final de start-up."
    ],
    diagramType: "comissionamento",
    diagramCaption: "Figura 12.1 — Roteiro de comissionamento integrado na bancada: brasagem, estanqueidade N₂, vácuo profundo, carga por balança e laudo termodinâmico.",
    sections: [
      {
        subtitle: "1. Metodologia da Oficina Prática Integrada de Bancada",
        paragraphs: [
          "A Aula 12 é o momento em que todas as competências desenvolvidas no curso convergem para uma intervenção real de bancada. Organizados em equipes técnicas, os alunos realizam o ciclo completo de instalação mecânica, testes e partida em um kit didático de condicionador de ar Split Inverter, operando com total autonomia sob supervisão do instrutor.",
          "O objetivo é simular fielmente a rotina do instalador credenciado de alto padrão, aplicando as boas práticas normativas (NR-10, NR-12, NR-35 e ABNT) e atestando os parâmetros de eficiência do ciclo frigorífico."
        ],
        bullets: [
          {
            label: "Etapa 1: Preparação Mecânica e Brasagem",
            text: "Corte em esquadro, escareamento com o tubo voltado para baixo, conformação do flange excêntrico com projeção de 1,0 a 1,5 mm e brasagem foscoper com fluxo contínuo de Nitrogênio (1 a 3 PSI) e proteção térmica das válvulas de serviço."
          },
          {
            label: "Etapa 2: Teste de Pressurização e Vácuo Profundo",
            text: "Pressurização em degraus com Nitrogênio seco até 400-450 PSIG para caça-vazamentos com espuma neutra, seguida de desidratação por vácuo profundo estabilizado abaixo de 500 Microns (Decay Test por 15 minutos)."
          },
          {
            label: "Etapa 3: Carga por Balança e Start-up Técnico",
            text: "Quebra do vácuo com fluido original ou carga líquida complementar controlada por massa (gramas) em balança digital, acionamento do equipamento e monitoramento de corrente (A) True RMS."
          },
          {
            label: "Etapa 4: Laudo Termodinâmico e Entrega",
            text: "Aferição de Superaquecimento Útil (SH entre 4 K e 8 K), Subresfriamento (SC entre 5 K e 10 K), Salto Térmico do ar na evaporadora (ΔT entre 10 °C e 15 °C) e preenchimento da folha de registro do PMOC."
          }
        ],
        highlightBox: {
          type: "practical",
          title: "CRITÉRIO DE APROVAÇÃO TÉCNICA NA BANCADA DIDÁTICA",
          content: "A aprovação do comissionamento exige: 1) Flange sem trincas e sem fita veda-rosca; 2) Ausência de vazamento a 400 PSIG com N₂; 3) Vácuo estável < 500 μmHg por 15 minutos; 4) SH entre 4 °C e 8 °C; 5) Relatório de comissionamento preenchido e assinado pela equipe."
        }
      }
    ]
  }
];

export const module3ChallengeData: ModuleChallengeData = {
  title: "Desafio Prático Integrado: Instalação Padrão Ouro, Start-up e PMOC",
  subtitle: "Atividade Oficial de Encerramento do Módulo 3 • Metodologia SENAI de Oficina",
  objective:
    "Avaliar a capacidade técnica integrada das 4 equipes na execução de uma instalação completa de condicionador de ar Split Inverter, cobrindo preparação mecânica de tubulações, ensaio de estanqueidade com Nitrogênio, desidratação por vácuo profundo, carga por balança, laudo de Superaquecimento/Delta T e plano de manutenção PMOC.",
  dynamics: [
    "Fase 1 (15 min): Cada equipe recebe seu Dossiê Técnico de Campo e elabora o plano de execução e diagnóstico apoiado nas 11 apostilas do Módulo 3.",
    "Fase 2 (15 min): Apresentação cruzada e defesa técnica dos parâmetros mecânicos, termodinâmicos e normativos perante a turma.",
    "Fase 3 (15 min): Validação prática pelo Instrutor nos kits didáticos da oficina (conferência de flanges, pressão de N₂, leitura em Microns e corrente True RMS)."
  ],
  groups: [
    {
      groupNumber: 1,
      groupTitle: "Equipe de Infraestrutura Mecânica, Brasagem e Flangeamento",
      focusTopics: "Foco: Aulas 01, 02, 03 e 04 (Tubulação, Solda, Flanges e Nivelamento)",
      scenario:
        "Em uma obra comercial, um instalador terceirizado passou os tubos de cobre de 1/4' e 3/8' dentro da mesma esponja isolante, fez uma emenda soldada sem passar Nitrogênio interno, cortou o tubo com serra manual e aplicou fita veda-rosca nas porcas do flange antes de apertar até estalar.",
      missions: [
        "Apontar os 4 erros técnicos graves cometidos pelo instalador e explicar fisicamente como a carepa da solda sem N₂ e o isolamento conjunto afetam um Split Inverter.",
        "Descrever o passo a passo correto para corte, escareamento (posição do tubo), projeção na régua, flangeamento excêntrico e aperto com torquímetro (N·m).",
        "Explicar como validar o nivelamento da evaporadora e realizar o teste hidráulico preventivo da linha de drenagem antes de entregar a obra."
      ]
    },
    {
      groupNumber: 2,
      groupTitle: "Equipe de Estanqueidade com Nitrogênio e Vácuo Profundo",
      focusTopics: "Foco: Aulas 06 e 07 (Pressurização N₂ e Desidratação em Microns)",
      scenario:
        "Após conectar as linhas de cobre, um técnico afirmou que 'não precisava testar vazamento com Nitrogênio porque o flange ficou bonito' e ligou a bomba de vácuo por apenas 10 minutos olhando um manômetro analógico comum, dizendo que o ponteiro já estava no verde (-30 inHg) e pronto para liberar o gás R-32.",
      missions: [
        "Explicar o risco grave dessa conduta e detalhar o protocolo completo de pressurização em degraus com Nitrogênio seco (N₂) até a pressão de teste (400+ PSIG).",
        "Justificar fisicamente por que o manômetro analógico não serve para validar vácuo e qual é a meta obrigatória no Vacuômetro Digital (< 500 μmHg).",
        "Explicar a reação química que ocorre entre a umidade residual e o óleo sintético POE dentro do compressor Inverter (formação de acidez) e como executar o Teste de Estanqueidade de Vácuo (Decay Test)."
      ]
    },
    {
      groupNumber: 3,
      groupTitle: "Equipe de Carga por Massa e Comissionamento Termodinâmico",
      focusTopics: "Foco: Aulas 05, 08 e 09 (Interligação, Balança, Superaquecimento e Delta T)",
      scenario:
        "Um Split Inverter R-410A de 18.000 BTU/h foi instalado com 12 metros de linha frigorífica (a carga de fábrica na etiqueta cobre até 5 metros, exigindo adicional de 20 g/m). No start-up, o ar entra na evaporadora a 27 °C e sai na insuflação a 14 °C; a pressão de sucção equivale a 8 °C saturados e o termopar no tubo de sucção lê 14 °C.",
      missions: [
        "Calcular a massa exata (em gramas) de fluido R-410A complementar que deve ser adicionada na balança digital e explicar em qual fase física (líquido ou vapor) o R-410A deve entrar.",
        "Calcular o Superaquecimento (SH) e o Salto Térmico do Ar (Delta T) com os dados do cenário e emitir o laudo técnico (Aprovado ou Reprovado).",
        "Detalhar os cuidados obrigatórios na interligação elétrica da borneira (crimpagem de terminais e integridade do fio S de comunicação)."
      ]
    },
    {
      groupNumber: 4,
      groupTitle: "Equipe de Manutenção, Pump Down e Gestão de PMOC",
      focusTopics: "Foco: Aulas 10 e 11 (Recolhimento de Fluido, Limpeza Química e Lei 13.589/2018)",
      scenario:
        "Uma clínica médica com 15 aparelhos Split apresenta gotejamento de água pelas evaporadoras, baixo fluxo de vento e mau cheiro. Além disso, uma das unidades precisará ser removida da parede para pintura da sala sem perder a carga de gás R-32.",
      missions: [
        "Descrever na ordem cronológica exata os 4 passos da manobra de recolhimento de fluido (Pump Down) para guardar o gás na condensadora com total segurança.",
        "Especificar o procedimento profissional de higienização com bolsa coletora e explicar por que é proibido usar produtos ácidos corrosivos nas serpentinas.",
        "Apresentar as exigências legais da Lei Federal nº 13.589/2018 (PMOC) aplicáveis à clínica médica e os itens essenciais do checklist periódico."
      ]
    }
  ]
};
