/**
 * CATÁLOGO TÉCNICO DE SISTEMAS DE CLIMATIZAÇÃO (HVAC-R)
 * Base com os 8 principais tipos de sistemas, capacidades, aplicações e complexidade técnica.
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
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Air_conditioner_indoor_unit.jpg/800px-Air_conditioner_indoor_unit.jpg",
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
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Multi_split_air_conditioner_outdoor_unit.jpg/800px-Multi_split_air_conditioner_outdoor_unit.jpg",
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
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Ceiling_cassette_air_conditioner.jpg/800px-Ceiling_cassette_air_conditioner.jpg",
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
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Floor_standing_air_conditioner.jpg/800px-Floor_standing_air_conditioner.jpg",
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
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/VRF_outdoor_units_on_roof.jpg/800px-VRF_outdoor_units_on_roof.jpg",
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
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Water_Chiller_Unit.jpg/800px-Water_Chiller_Unit.jpg",
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
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/HVAC_ductwork_installation.jpg/800px-HVAC_ductwork_installation.jpg",
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
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Window_air_conditioner.jpg/800px-Window_air_conditioner.jpg",
    details: [
      "Não requer tubulação de cobre nem flangeamento.",
      "Nível de ruído interno superior ao do Split.",
      "Fácil remoção para lavagem em oficina."
    ]
  }
];
