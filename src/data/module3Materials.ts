import { LessonMaterial } from "./module1Materials";
import { ModuleChallengeData } from "./module1Challenge";

export const module3MaterialsData: LessonMaterial[] = [
  {
    lessonOrder: 1,
    titleKey: "ferramentas",
    fullTitle: "Aula 01: Ferramentas, EPIs e Planejamento da Infraestrutura",
    workload: "4 Horas",
    shortSummary:
      "Apresentação das ferramentas exclusivas de refrigeração (Manifold, Vacuômetro, Flangeador, Bomba de Vácuo), EPIs obrigatórios (NR-35 e NR-10) e a correta locação da unidade interna e externa respeitando os distanciamentos do fabricante.",
    keyPoints: [
      "EPIs fundamentais: Luvas nitrílicas (gás), óculos de proteção, cinto tipo paraquedista (NR-35) e calçado de segurança.",
      "Planejamento: Evitar instalação de condensadoras em locais confinados sem ventilação cruzada.",
      "Desnível e Comprimento: Respeitar a tabela do manual do fabricante para distância máxima e necessidade de sifão.",
      "Organização de bancada e inspeção prévia de rede elétrica e drenagem antes da furação."
    ],
    diagramType: "pressao" as any,
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
    workload: "4 Horas",
    shortSummary:
      "Especificação das bitolas de tubos de cobre fosforoso (1/4, 3/8, 1/2, 5/8), espessura de parede para alta pressão (R-410A e R-32), isolamento térmico elastomérico individual e técnicas de brasagem oxi-acetilênica/Mapp com fluxo passante de Nitrogênio.",
    keyPoints: [
      "Isolamento individual obrigatório: As linhas de sucção e de líquido/expansão jamais devem ser isoladas juntas na mesma esponja.",
      "Espessura mínima de parede: Sistemas R-410A e R-32 exigem tubos de cobre sem costura com parede mínima de 0,79 mm (1/32').",
      "Passadiço de Nitrogênio (N₂): Injetar fluxo contínuo de N₂ (1 a 3 PSI) dentro do tubo durante a brasagem impede a formação de carepa (óxido de cobre).",
      "Curvamento técnico: Utilizar molas curvadoras ou curvadores de alavanca para evitar estrangulamento na seção transversal."
    ],
    diagramType: "temperatura" as any,
    diagramCaption: "Figura 2.1 — Isolamento elastomérico individual na tubulação de cobre prevenindo condensação e ganho térmico.",
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
      }
    ]
  },
  {
    lessonOrder: 3,
    titleKey: "flange",
    fullTitle: "Aula 03: Corte, Escareamento e Flangeamento Perfeito",
    workload: "4 Horas",
    shortSummary:
      "Execução mecânica de conexões flangeadas de alta pressão: corte em esquadro a 90°, escareamento interno com o tubo voltado para baixo, calibração da projeção na régua e conformação com flangeador excêntrico com catraca de torque.",
    keyPoints: [
      "Corte em esquadro: Utilizar cortador de tubos de roletes girando suavemente; proibido o uso de arco de serra.",
      "Escareamento limpo: Remover a rebarba interna com o tubo inclinado para baixo para que nenhuma limalha caia dentro da linha.",
      "Flange excêntrico: Produz face interna espelhada e uniforme sem afinar a parede do cobre.",
      "Aperto com Torquímetro: Apertar as porcas flangeadas respeitando o torque em N·m de cada bitola, sem uso de fita veda-rosca."
    ],
    diagramType: "pressao" as any,
    diagramCaption: "Figura 3.1 — Controle de pressão e vedação metal-metal nas conexões flangeadas de alta pressão.",
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
        }
      }
    ]
  },
  {
    lessonOrder: 4,
    titleKey: "suportes",
    fullTitle: "Aula 04: Fixação de Suportes, Nivelamento e Drenagem",
    workload: "4 Horas",
    shortSummary:
      "Instalação mecânica de suportes da unidade interna e mãos-francesas da condensadora: nivelamento de precisão, dimensionamento de buchas e chumbadores por tipo de alvenaria, amortecimento acústico com coxins e caimento hidráulico do dreno.",
    keyPoints: [
      "Nivelamento da evaporadora: A chapa de fixação deve ficar 100% em nível; a bandeja interna já possui o caimento de fábrica.",
      "Linha de drenagem: Declive contínuo mínimo de 1% a 2% (1 a 2 cm por metro), evitando sifões ou elevações que retenham água.",
      "Fixação da condensadora: Uso de buchas de expansão de qualidade (8 mm ou 10 mm) ou barra roscada passante em paredes ocas.",
      "Coxins de borracha: Obrigatórios entre os pés da condensadora e o suporte para isolar vibrações estruturais."
    ],
    diagramType: "ciclo" as any,
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
    workload: "4 Horas",
    shortSummary:
      "Execução da interligação elétrica entre evaporadora e condensadora com cabo PP multipolar: proibição de emendas no fio de comunicação serial (S), crimpagem de terminais tubulares (ilhós/forquilha), prensa-cabo e aterramento equipotencial (PE).",
    keyPoints: [
      "Cabo PP contínuo: Jamais faça emendas no cabo de interligação, especialmente na via de comunicação serial (Borne S).",
      "Terminais crimpados: Obrigatório o uso de terminais ilhós ou forquilha prensados com alicate específico em todas as pontas.",
      "Correspondência fiel na borneira: Respeitar rigorosamente a sequência L (Fase), N (Neutro/Fase 2), S (Sinal) e PE (Terra).",
      "Prensa-cabo mecânico: Travar a capa externa do cabo PP no prensa-cabo da máquina para evitar tração direta nos bornes."
    ],
    diagramType: "eletricidade_diagrama" as any,
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
    workload: "4 Horas",
    shortSummary:
      "Procedimento normativo de ensaio de estanqueidade com Nitrogênio seco (N₂) regulado em alta pressão para validação de soldas, flanges e serpentina antes do processo de vácuo, com proibição absoluta de oxigênio ou gases refrigerantes para caça-vazamentos.",
    keyPoints: [
      "Uso exclusivo de Nitrogênio (N₂) com regulador de pressão de dois estágios devidamente calibrado.",
      "Pressurização em degraus: Subir gradualmente (100 PSIG → 250 PSIG → 400 a 450 PSIG para linhas R-410A/R-32).",
      "Inspeção física: Aplicar solução tensoativa (espuma de sabão neutro) nas porcas flangeadas e pontos de brasagem.",
      "Estabilidade manométrica: Monitorar a pressão estabilizada por no mínimo 20 a 30 minutos (descontando variações de temperatura ambiente)."
    ],
    diagramType: "seguranca" as any,
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
    workload: "4 Horas",
    shortSummary:
      "Termodinâmica da desidratação a vácuo: remoção de ar, gases não-condensáveis e umidade interna até a meta estrita abaixo de 500 Microns de mercúrio (μmHg), utilizando bomba de vácuo de duplo estágio, extrator de núcleo Schrader e vacuômetro digital.",
    keyPoints: [
      "Por que fazer vácuo? Baixar a pressão absoluta faz a água líquida interna ferver e evaporar a temperatura ambiente.",
      "Meta técnica obrigatória: Atingir e estabilizar abaixo de 500 Microns (μmHg) lidos exclusivamente em Vacuômetro Digital.",
      "Aceleração de fluxo: Utilizar extrator de núcleo de válvula Schrader e mangueira específica de vácuo reduz o tempo pela metade.",
      "Teste de quebra de vácuo (Decay Test): Isolar a bomba por 15 minutos e confirmar que a leitura não sobe acima de 500 a 700 Microns."
    ],
    diagramType: "pressao" as any,
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
    workload: "4 Horas",
    shortSummary:
      "Procedimento de liberação do fluido original da condensadora, cálculo de carga complementar por metro excedente de tubulação, purga das mangueiras de serviço e carga precisa por massa (gramas) em balança eletrônica para fluidos R-410A e R-32.",
    keyPoints: [
      "Quebra do vácuo com fluido: Liberar parcialmente o fluido ou injetar pela balança ANTES de desconectar a mangueira sob pressão positiva.",
      "Fluidos Série 400 (R-410A): Mistura quase-azeotrópica — carga OBRIGATORIAMENTE na fase líquida (garrafa invertida).",
      "Cálculo complementar: Adicionar exatos 15 g/m a 20 g/m (conforme manual) para cada metro que ultrapassar a linha padrão de fábrica (ex: 5 m).",
      "Carga total pós-manutenção: Sempre recolher, fazer vácuo e carregar 100% por peso de placa usando balança digital."
    ],
    diagramType: "seguranca" as any,
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
    workload: "4 Horas",
    shortSummary:
      "Diagnóstico termodinâmico de start-up e comissionamento: aferição de Superaquecimento (SH), Subresfriamento (SC), Salto Térmico de ar na evaporadora (Delta T) e conferência da corrente nominal com alicate amperímetro True RMS.",
    keyPoints: [
      "Superaquecimento (SH = T_sucção - T_evaporação): Garante que apenas vapor seco chegue ao compressor (faixa típica em Split: 4 K a 8 K).",
      "Subresfriamento (SC = T_condensação - T_líquido): Garante 100% de líquido sem bolhas antes do dispositivo de expansão.",
      "Salto Térmico (ΔT = T_retorno - T_insuflamento): Diferença de temperatura do ar na evaporadora deve situar-se entre 10 °C e 15 °C.",
      "Validação elétrica final: Aferir tensão sob carga e corrente elétrica (A) comparando com a etiqueta nominal do equipamento."
    ],
    diagramType: "calor" as any,
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
    workload: "4 Horas",
    shortSummary:
      "Procedimentos seguros de recolhimento de fluido refrigerante para a unidade condensadora (Pump Down) em desinstalações ou manutenções, e uso de máquina recolhedora externa com cilindro próprio para evitar emissões atmosféricas.",
    keyPoints: [
      "Passo 1 do Pump Down: Ligar o aparelho no modo Frio (Cool) na menor temperatura e aguardar o compressor partir em carga.",
      "Passo 2: Fechar totalmente a válvula de serviço delgada (Linha de Líquido / Expansão) usando chave Allen.",
      "Passo 3: Monitorar o manômetro de baixa até a pressão cair próximo a 5 PSIG ~ 0 PSIG (nunca deixar entrar em vácuo profundo).",
      "Passo 4: Fechar rapidamente a válvula de Sucção (tubo grosso) e desligar o disjuntor imediatamente."
    ],
    diagramType: "ciclo" as any,
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
    workload: "4 Horas",
    shortSummary:
      "Protocolos de manutenção preventiva e corretiva: higienização técnica de serpentinas, turbina e bandeja com bolsa coletora e bactericidas neutros/alcalinos biodegradáveis, revisão elétrica e gestão do PMOC conforme a Lei Federal 13.589/2018 e Resolução ANVISA RE-09.",
    keyPoints: [
      "Proibição de ácidos agressivos: Produtos ácidos ('limpa-alumínio roxo') corroem a camada hidrofílica das aletas e furam os tubos de cobre.",
      "Lavagem por hidrojateamento controlado: Uso de bolsa coletora impermeável, blindagem da placa eletrônica e jato em leque a 90° das aletas.",
      "PMOC Obrigatório (Lei 13.589/2018): Exigido para todos os edifícios de uso público e coletivo climatizados artificialmente.",
      "Checklist de manutenção: Inclui limpeza química, desobstrução de dreno, reaperto de bornes, leitura de corrente (A) e registro no plano."
    ],
    diagramType: "fluidos" as any,
    diagramCaption: "Figura 11.1 — Gestão ambiental, segurança sanitária e conformidade legal na manutenção de sistemas de climatização.",
    sections: [
      {
        subtitle: "1. Higienização Técnica e Conformidade Legal com o PMOC",
        paragraphs: [
          "O acúmulo de biofilme (fungos, bactérias e poeira) no rotor tangencial (turbina) e nas aletas do evaporador reduz a vazão de ar em até 45%, provocando congelamento da serpentina, gotejamento de água pela parede, aumento do consumo elétrico e doenças respiratórias nos ocupantes.",
          "Pela Lei Federal nº 13.589/2018 e Portaria MS 3.523/98, todo sistema de climatização de uso coletivo deve possuir um Plano de Manutenção, Operação e Controle (PMOC) atualizado, com rotinas mensais, trimestrais e semestrais documentadas."
        ]
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
