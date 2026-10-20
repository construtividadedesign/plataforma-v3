/**
 * CATÁLOGO TÉCNICO DE SISTEMAS DE CLIMATIZAÇÃO (HVAC-R)
 * Base com os 8 principais tipos de sistemas, capacidades, aplicações e fotografias técnicas fidedignas.
 */

export interface HVACSystemType {
  id: string;
  name: string;
  capacityRange: string;
  application: string;
  description: string;
  difficultyInstall: "Baixa" | "Média" | "Alta" | "Especialista";
  difficultyMaintenance: "Baixa" | "Média" | "Alta" | "Especialista";
  imageUrl: string;
  details: string[];
}

export const hvacSystemsData: HVACSystemType[] = [
  {
    id: "sys-hiwall",
    name: "Split Hi-Wall (Inverter / On-Off)",
    capacityRange: "9.000 a 36.000 BTU/h",
    application: "Residencial e Pequenos Escritórios",
    description: "O sistema mais popular do mercado. Composto por uma unidade evaporadora instalada no alto da parede e uma condensadora externa. Silencioso, econômico (na versão Inverter) e de rápida instalação.",
    difficultyInstall: "Média",
    difficultyMaintenance: "Média",
    imageUrl: "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQEh1NyAws1c3FPK1HyWmDgkF0ddoh1Om8So74FFBtTJOEKIb5ZYC4Cw4R-X-N8lvifCHgkvDNMfLHZaTyvZ6zXAsQWW8z6j5HsLpUpBqo3vtIQK_KXx6ipoV5APGXm8bF18GcNhNM7kUjxBb8-Ch9wFS_4ajJs3JdSVpHSYX48p21_JYXgLbcf8czHJ-H3RvYkLEUWq2dRz-zFwcOCKmT55z7_-_ggH0j8ZlZstNbHXW490CoeROYwgX3XH", // Foto real da evaporadora e condensadora (Split)
    details: [
      "Instalação requer furação, flangeamento e vácuo.",
      "Filtros de fácil acesso para o usuário.",
      "Manutenção preventiva exige bolsa coletora para limpeza da turbina."
    ]
  },
  {
    id: "sys-multisplit",
    name: "Multi Split",
    capacityRange: "18.000 a 60.000 BTU/h (Condensadora)",
    application: "Residencial Premium e Clínicas",
    description: "Permite conectar de 2 a 5 evaporadoras (Hi-Wall, Cassete ou Duto) em uma única condensadora externa. Ideal para fachadas com pouco espaço físico.",
    difficultyInstall: "Alta",
    difficultyMaintenance: "Média",
    imageUrl: "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQEdP7wULSouWMbjLo5n8oMVEZitvoOUUJ3JHDX8i88a3WwlT70OePg691nc3pT0bY0hGm7Eo43VaTXIpJlYu65DNsynFcm_Tecira_3KMzK0zhpLsfaLY9RB71OQ2Tf5_YR4j1JIGb9XNk1K2zPI4dxmhbsFmYVrGcxr64", // Multi Split com várias evaporadoras e uma condensadora
    details: [
      "Múltiplas linhas de tubulação de cobre partindo da mesma máquina.",
      "Requer cálculo rigoroso de adição de fluido refrigerante por metro excedente.",
      "Se a condensadora falhar, todos os ambientes perdem a climatização."
    ]
  },
  {
    id: "sys-cassete",
    name: "Split Cassete (K7)",
    capacityRange: "18.000 a 60.000 BTU/h",
    application: "Comercial, Lojas, Bancos e Salas de Reunião",
    description: "Embutido no teto (forro de gesso ou modular), possui fluxo de ar em 360° ou 4 vias, garantindo distribuição térmica homogênea sem ocupar espaço nas paredes.",
    difficultyInstall: "Alta",
    difficultyMaintenance: "Alta",
    imageUrl: "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQH0PpCfLQ5k0Ojwm39DT23tZP-mpuMSERraryqI_QNAmXxS3lq-ZRVvosyuvo2gacbwxTtCOUeJOHKw1BpskOqlP0VZ5WqvJYhb4oVE7ID0tquGu7ZyFPGhk5flrFfnq9e2PIYL0gpxXNqdbjhUHW75-NlRL1qXZV524rx9mSnX3_TUCu8oxm8wWVE7sQ6sW5eNlaXIcjgrWaeUm1aZWNmYjkCql1KExwk0Id0b", // Foto real de cassete k7 instalado em forro modular
    details: [
      "Exige altura mínima de entreforro (cerca de 30 a 40 cm).",
      "Possui bomba de dreno interna obrigatória para recalque da água condensada.",
      "Manutenção química exige desmontagem completa do painel e defletores."
    ]
  },
  {
    id: "sys-pisoteto",
    name: "Split Piso-Teto",
    capacityRange: "36.000 a 80.000 BTU/h",
    application: "Igrejas, Restaurantes e Ambientes Abertos",
    description: "Equipamento de alta vazão de vento. Pode ser instalado deitado no teto ou em pé no chão. Projetado para vencer grandes distâncias e altas cargas térmicas.",
    difficultyInstall: "Alta",
    difficultyMaintenance: "Média",
    imageUrl: "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQFYg10LphM3NQIbPxZmqIBq7UjzN7FC7Sl2f8TUcAwZN2qheIfXSs73hbMsTHG1dBfpWAjK1zYaXGQb69IjBeidhK4Kv8MZFkI0hrOkMTR9Ty_fWckvk6nze2_SBsqmlmr-DIHm2idcBqOC88Zx48MT8J_EaONtO0U6_lB4SAYZQuw", // Foto real da evaporadora Piso-Teto horizontal fixada no teto de grande ambiente
    details: [
      "Tubulação de cobre utiliza bitolas maiores (ex: 3/8 e 3/4 ou 7/8).",
      "Evaporadora pesada (exige suportes tirantes fixados na laje).",
      "Vento denso e direcional, excelente para refrigeração rápida."
    ]
  },
  {
    id: "sys-vrf",
    name: "Sistemas VRF / VRV",
    capacityRange: "3 HP a mais de 60 HP (Modular)",
    application: "Prédios Corporativos, Hotéis e Hospitais",
    description: "Fluxo de Refrigerante Variável. Uma ou mais condensadoras modulares conectadas a dezenas de evaporadoras através de uma tubulação única com derivações (Refnets). Automação de altíssimo nível.",
    difficultyInstall: "Especialista",
    difficultyMaintenance: "Especialista",
    imageUrl: "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQEdQkn0ZpVAKAUwgqRFOZLhdCdR1nClVAEoWNlJSYPAKNRg4kN98qTCoVD90CcS4TsTfU9mWYizCwBW9vB4p4sffGO8EYcUgg8cZxhS9YrSjZmqCAZKdh2Uk4eYyM_9TyCMp-zX763MVN4sie3jqcYh-UixWpJe1WQZc3YRMeqZVWYUnOXoQ5JpMIAeMw", // Unidade condensadora modular VRF e suas evaporadoras associadas
    details: [
      "Exige solda prata obrigatória com passadiço de Nitrogênio.",
      "Ligação de comunicação em rede (Daisy Chain).",
      "Comissionamento feito via software conectado à placa principal (Service Tool)."
    ]
  },
  {
    id: "sys-chiller",
    name: "Chiller (Água Gelada)",
    capacityRange: "10 TR a 2.000+ TR (Toneladas de Refrigeração)",
    application: "Shoppings, Indústrias e Aeroportos",
    description: "Em vez de gás refrigerante nas evaporadoras, o Chiller gela água. A água gelada (aprox. 7°C) é bombeada por canos hidráulicos até os Fancoils (evaporadores) espalhados pelo edifício.",
    difficultyInstall: "Especialista",
    difficultyMaintenance: "Especialista",
    imageUrl: "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQEsL0IKcMVIOavq5S-S922nmBfwgH3EPvJcl8RZhPj-9fON33rmv5usTW0glT2zipZe2-iM54_7MDoYjvSMQGBgZXXF7qp3CphKR0J-nKICoZ-o-LVkFhHDX8nOB1xuI_GITGeeb6MdYKpVhfk8T2xG3_mW6-YnHpXQQwDr0p2A6WIb1xD68z5qa_vL6cMP6xyeSTc", // Grande maquina de chiller industrial em cobertura técnica com tubulações hidráulicas pesadas
    details: [
      "Envolve infraestrutura pesada: bombas de água, tubulações isoladas em PU e torres de resfriamento.",
      "Trabalha com fluidos primários (R-134a/R-410A) e secundários (Água).",
      "Riscos de congelamento do trocador (Placas ou Shell and Tube) se não houver fluxo."
    ]
  },
  {
    id: "sys-duto",
    name: "Split Duto (Built-in)",
    capacityRange: "24.000 a 100.000+ BTU/h",
    application: "Casas de Alto Padrão, Estúdios e Shopping Centers",
    description: "Máquina evaporadora fica 100% oculta no entreforro. O ar gelado é distribuído pelo ambiente através de dutos (TDC, MPU ou Flexível) e grelhas lineares de insuflação e retorno.",
    difficultyInstall: "Especialista",
    difficultyMaintenance: "Alta",
    imageUrl: "image_33.png", // Imagem gerada: Split Duto instalado no entreforro, com isolamento térmico e fiação real de HVAC
    details: [
      "Exige cálculo de perda de carga do ar (Pressão Estática).",
      "Perfeito para estética arquitetônica (invisível).",
      "Manutenção e higienização difíceis (requer alçapões de acesso no gesso)."
    ]
  },
  {
    id: "sys-acj",
    name: "Ar-Condicionado de Janela (ACJ)",
    capacityRange: "7.000 a 30.000 BTU/h",
    application: "Residencial (Projetos antigos ou adaptações)",
    description: "Sistema compacto tipo 'caixote' onde o compressor, evaporador e condensador ficam no mesmo chassi. Insere-se em um buraco na parede.",
    difficultyInstall: "Baixa",
    difficultyMaintenance: "Baixa",
    imageUrl: "image_34.png", // Imagem gerada: Ar condicionado de janela mecânico clássico instalado em parede residencial real
    details: [
      "Não requer tubulação de cobre nem flangeamento.",
      "Nível de ruído interno superior ao do Split.",
      "Fácil remoção para lavagem em oficina."
    ]
  }
];
