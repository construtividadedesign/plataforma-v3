export type CourseLessonItem = {
  id: string; // e.g. "mod-1-aula-1"
  moduleId: string; // "mod-1", "mod-2", "mod-3"
  lessonOrder: number;
  title: string;
  duration?: string;
};

export type CourseModuleItem = {
  id: string; // "mod-1", "mod-2", "mod-3"
  order: number;
  title: string;
  description: string;
  duration: string;
  lessonCount: number;
  lessons: CourseLessonItem[];
};

export type CourseToolItem = {
  id: "seguranca_sst" | "climatizacao" | "componentes" | "diagnostico" | "dimensionamento";
  title: string;
  description: string;
  href: string;
  badge: string;
};

export const COURSE_TOOLS: CourseToolItem[] = [
  {
    id: "seguranca_sst",
    title: "Segurança e Vida (SST)",
    description: "Tolerância zero em NR-35, NR-10, fluidos A2L, simulador financeiro de acidentes e APR.",
    href: "/dashboard/safety",
    badge: "Sobrevivência & SST",
  },
  {
    id: "climatizacao",
    title: "Tipos de Climatização",
    description: "Catálogo completo de sistemas Split, VRF, Chiller, Piso-Teto e K7.",
    href: "/dashboard/systems",
    badge: "Sistemas & Tecnologias",
  },
  {
    id: "componentes",
    title: "Guia de Componentes",
    description: "152+ componentes reais de ar-condicionado com testes práticos e fotos.",
    href: "/dashboard/components",
    badge: "Laboratório & Peças",
  },
  {
    id: "diagnostico",
    title: "Diagnóstico e Falhas",
    description: "Tabela de códigos de erro e procedimentos de reparo de placas e sensores.",
    href: "/dashboard/troubleshooting",
    badge: "Bancada & Testes",
  },
  {
    id: "dimensionamento",
    title: "Dimensionamento (BTUs)",
    description: "Calculadora de carga térmica NBR 5858, simulação de ambientes e relatórios.",
    href: "/dashboard/sizing",
    badge: "Engenharia & Cálculo",
  },
];

export const COURSE_MODULES: CourseModuleItem[] = [
  {
    id: "mod-1",
    order: 1,
    title: "Módulo 1: Fundamentos de Climatização",
    description: "Conceitos de calor, temperatura, pressão, ciclo frigorífico e manuseio seguro de fluidos.",
    duration: "16 Horas",
    lessonCount: 6,
    lessons: [
      { id: "mod-1-aula-1", moduleId: "mod-1", lessonOrder: 1, title: "Aula 01: Fundamentos Físicos do Calor e Transferência Térmica", duration: "2h" },
      { id: "mod-1-aula-2", moduleId: "mod-1", lessonOrder: 2, title: "Aula 02: Temperatura, Escalas Termométricas e Medição Prática", duration: "2h" },
      { id: "mod-1-aula-3", moduleId: "mod-1", lessonOrder: 3, title: "Aula 03: Pressão, Escalas Manométricas e Relação P × T", duration: "3h" },
      { id: "mod-1-aula-4", moduleId: "mod-1", lessonOrder: 4, title: "Aula 04: Ciclo Frigorífico Básico por Compressão a Vapor", duration: "3h" },
      { id: "mod-1-aula-5", moduleId: "mod-1", lessonOrder: 5, title: "Aula 05: Fluidos Refrigerantes e Protocolos Ambientais", duration: "3h" },
      { id: "mod-1-aula-6", moduleId: "mod-1", lessonOrder: 6, title: "Aula 06: Segurança Operacional, EPIs e NR-35/NR-10", duration: "3h" },
    ],
  },
  {
    id: "mod-2",
    order: 2,
    title: "Módulo 2: Eletricidade Aplicada a Climatização",
    description: "Fundamentos elétricos, uso de instrumentos de medição, testes e diagramas elétricos.",
    duration: "16 Horas",
    lessonCount: 4,
    lessons: [
      { id: "mod-2-aula-1", moduleId: "mod-2", lessonOrder: 1, title: "Aula 01: Fundamentos de Eletricidade, Lei de Ohm e NBR 5410", duration: "4h" },
      { id: "mod-2-aula-2", moduleId: "mod-2", lessonOrder: 2, title: "Aula 02: Instrumentos de Medição Elétrica na Bancada", duration: "4h" },
      { id: "mod-2-aula-3", moduleId: "mod-2", lessonOrder: 3, title: "Aula 03: Testes de Componentes Elétricos e Eletromecânicos", duration: "4h" },
      { id: "mod-2-aula-4", moduleId: "mod-2", lessonOrder: 4, title: "Aula 04: Esquemas Elétricos e Interligação Força/Comando", duration: "4h" },
    ],
  },
  {
    id: "mod-3",
    order: 3,
    title: "Módulo 3: Instalação e Manutenção em Climatização",
    description: "Procedimentos de carga de fluido, vácuo, interligação elétrica e mecânica, e manutenção preventiva.",
    duration: "48 Horas",
    lessonCount: 12,
    lessons: [
      { id: "mod-3-aula-1", moduleId: "mod-3", lessonOrder: 1, title: "Aula 01: Ferramentas, EPIs e Planejamento da Infraestrutura", duration: "4h" },
      { id: "mod-3-aula-2", moduleId: "mod-3", lessonOrder: 2, title: "Aula 02: Tubos de Cobre, Isolamento Térmico e Brasagem", duration: "4h" },
      { id: "mod-3-aula-3", moduleId: "mod-3", lessonOrder: 3, title: "Aula 03: Flangeamento Técnico e Conexões Mecânicas", duration: "4h" },
      { id: "mod-3-aula-4", moduleId: "mod-3", lessonOrder: 4, title: "Aula 04: Fixação das Unidades Evaporadora e Condensadora", duration: "4h" },
      { id: "mod-3-aula-5", moduleId: "mod-3", lessonOrder: 5, title: "Aula 05: Teste de Estanqueidade com Nitrogênio", duration: "4h" },
      { id: "mod-3-aula-6", moduleId: "mod-3", lessonOrder: 6, title: "Aula 06: Desidratação e Vácuo Profundo", duration: "4h" },
      { id: "mod-3-aula-7", moduleId: "mod-3", lessonOrder: 7, title: "Aula 07: Quebra de Vácuo e Liberação do Fluido da Condensadora", duration: "4h" },
      { id: "mod-3-aula-8", moduleId: "mod-3", lessonOrder: 8, title: "Aula 08: Carga de Fluido Refrigerante por Balança Digital", duration: "4h" },
      { id: "mod-3-aula-9", moduleId: "mod-3", lessonOrder: 9, title: "Aula 09: Interligação Elétrica de Comunicação e Alimentação", duration: "4h" },
      { id: "mod-3-aula-10", moduleId: "mod-3", lessonOrder: 10, title: "Aula 10: Comissionamento, Superaquecimento e Sub-resfriamento", duration: "4h" },
      { id: "mod-3-aula-11", moduleId: "mod-3", lessonOrder: 11, title: "Aula 11: Drenagem e Teste Hidráulico", duration: "4h" },
      { id: "mod-3-aula-12", moduleId: "mod-3", lessonOrder: 12, title: "Aula 12: Manutenção Preventiva, Limpeza Química e Boas Práticas", duration: "4h" },
    ],
  },
];
