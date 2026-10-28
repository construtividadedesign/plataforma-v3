"use client";

import React, { useState, useMemo } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  Zap,
  HardHat,
  Flame,
  CheckCircle2,
  XCircle,
  Printer,
  DollarSign,
  Activity,
  FileSpreadsheet,
  PlayCircle,
  ExternalLink,
  Lock,
  Unlock,
  CheckSquare,
  Square,
  Sparkles,
  Building2,
  UserX,
  FileText,
  Ban,
  TrendingDown,
  Info,
  Scale,
  Stethoscope,
  ChevronRight,
  Eye,
  Layers,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";
import { useTurma } from "@/contexts/TurmaContext";
import ConteudoBloqueadoCard from "@/components/ConteudoBloqueadoCard";
import { printHtml } from "@/lib/printUtils";
import DiretrizesCompetenciaCard from "@/components/DiretrizesCompetenciaCard";
import { COMPETENCIAS_MODULOS } from "@/data/competenciasData";

// ============================================================================
// DADOS OPERACIONAIS E ESTATÍSTICOS (1º SEMESTRE DE 2026)
// ============================================================================

interface RuleItem {
  id: number;
  number: string;
  category: "altura" | "eletrica" | "pressao" | "ergonomia" | "quimica";
  nrBadge: string;
  title: string;
  theRule: string;
  realRisk: string;
  procedure: string[];
}

const OPERATIONAL_RULES: RuleItem[] = [
  {
    id: 1,
    number: "Regra #01",
    category: "altura",
    nrBadge: "NR-35 (Trabalho em Altura)",
    title: "Não Se Arrisque: \"É Rapidinho\" é a frase que mais mata no HVAC",
    theRule:
      "Nunca suba em escada, parapeito ou andaime sem ancoragem independente, mesmo que seja 'só para soltar uma porca de 1/4' ou 'apenas medir a tubulação'.",
    realRisk:
      "90% das mortes em NR-35 no setor ocorrem em intervenções que levariam menos de 5 minutos. Quedas a partir de 2,0 metros causam fratura na base do crânio, politraumatismo ou paraplegia irreversível instantânea.",
    procedure: [
      "Inspecionar o ponto de ancoragem antes da subida (deve suportar no mínimo 15 kN por usuário).",
      "Vestir cinto tipo paraquedista antes de tirar os dois pés do chão.",
      "Travar o mosquetão do talabarte duplo em ponto estrutural rígido, JAMAIS na alça ou suporte da própria condensadora.",
      "Se não houver linha de vida ou ponto homologado, a atividade DEVE ser paralisada na hora.",
    ],
  },
  {
    id: 2,
    number: "Regra #02",
    category: "ergonomia",
    nrBadge: "NR-17 & NR-35 (Trabalho em Dupla)",
    title: "Trabalho em Dupla Obrigatório: Içamento e Quadros Energizados",
    theRule:
      "É estritamente proibido içar condensadoras (>30 kg) ou realizar intervenções em quadros de distribuição elétrica geral sem a presença de um segundo técnico qualificado.",
    realRisk:
      "Em caso de choque elétrico com fibrilação ventricular ou suspensão inerte pelo cinto (choque ortostático), você tem no máximo 4 minutos para receber socorro antes de lesões cerebrais irreversíveis ou óbito. Sem dupla, não há sobrevivência.",
    procedure: [
      "Planejar todo içamento com cordas estáticas certificadas e polias multiplicadoras de força.",
      "Um técnico opera a retenção e descida/subida enquanto o outro guia a peça longe da fachada.",
      "Manter canal direto de comunicação (rádio ou viva-voz) e telefone de emergência (SAMU 192 / Bombeiros 193) pré-discado.",
      "NUNCA tentar segurar uma condensadora no braço livre na janela; se escorregar, solte a carga.",
    ],
  },
  {
    id: 3,
    number: "Regra #03",
    category: "altura",
    nrBadge: "NR-35 (Acesso Seguro)",
    title: "Escadas e Andaimes Certificados: Carga Nominal e Proporção 4:1",
    theRule:
      "Escada é exclusivamente meio de acesso, jamais posto de trabalho prolongado. Utilize apenas escadas de fibra de vidro com certificação INMETRO (capacidade mínima de 150 kg).",
    realRisk:
      "Escadas de alumínio conduzem corrente elétrica fatal se tocarem em fiações rompidas. Escadas mal posicionadas escorregam na base ou sofrem tombamento lateral pelo torque de chaves de catraca.",
    procedure: [
      "Posicionar a escada no ângulo de 75° seguindo a regra 4:1 (para cada 4 metros de altura, a base deve se afastar 1 metro da parede).",
      "Conferir integridade das sapatas de borracha antiderrapantes e travas de degrau.",
      "Amarrar firmemente o topo da escada em suporte sólido antes de iniciar a operação.",
      "Manter sempre os 3 pontos de contato (duas mãos e um pé ou dois pés e uma mão) durante subida e descida.",
    ],
  },
  {
    id: 4,
    number: "Regra #04",
    category: "altura",
    nrBadge: "NR-35 & NR-01 (Tolerância Zero)",
    title: "Tolerância Zero ao Improviso: \"Jeitinho\" Mata Técnicos e Arruína Famílias",
    theRule:
      "Proibido terminantemente o uso de baldes de plástico, tambores, cadeiras giratórias, beirais de janela ou condensadoras vizinhas como suporte para os pés.",
    realRisk:
      "O polipropileno de baldes resseca sob calor e cede sem aviso. O colapso do apoio a apenas 2,5 metros arremessa o técnico contra o chão ou contra ferragens expostas, gerando empalamento e fraturas graves.",
    procedure: [
      "Se o pé-direito ou vão não permite apoio plano e nivelado, exija andaime tubular travado com sapatas reguláveis.",
      "O andaime deve ter rodapé de 20 cm, guarda-corpo duplo (0,70m e 1,20m) e piso metálico 100% preenchido.",
      "Em sacadas e vãos técnicos, utilize Plataforma Elevatória Móvel de Trabalho (PEMT/PTA) homologada.",
      "Recuse o serviço com base no Direito de Recusa (NR-01 item 1.4.3) caso o cliente pressione por improvisos.",
    ],
  },
  {
    id: 5,
    number: "Regra #05",
    category: "altura",
    nrBadge: "NBR 16655 & NR-11 (Ancoragem)",
    title: "Capacidade de Carga de Suportes e Buchas: Ancoragem Estrutural Real",
    theRule:
      "O conjunto suporte + fixação deve suportar no mínimo 4 vezes o peso estático da unidade condensadora, somado à carga dinâmica do vento.",
    realRisk:
      "A vibração rotativa do compressor pulveriza o interior de tijolos cerâmicos ocos. Buchas plásticas simples escorregam e a condensadora de 40 kg despenca do 12º andar, matando transeuntes na calçada — crime de homicídio culposo com prisão imediata.",
    procedure: [
      "Em tijolo furado ou bloco de concreto oco, usar EXCLUSIVAMENTE barra roscada passante com contra-chapa metálica interna ou chumbador químico com camisa/jaqueta.",
      "Em concreto maciço usinado, utilizar chumbador metálico de expansão (Parabolt) de aço zincado ou inox.",
      "Aplicar suportes de aço carbono galvanizado a fogo ou aço inoxidável 304 com espessura mínima de 2 mm.",
      "Instalar coxins de borracha vulcanizada de alta densidade para absorção contínua de vibração.",
    ],
  },
  {
    id: 6,
    number: "Regra #06",
    category: "pressao",
    nrBadge: "NR-13 & NR-20 (Fluidos & Pressão)",
    title: "Fluidos A2L (R-32) e Proibição Absoluta de Oxigênio (O₂)",
    theRule:
      "O refrigerante R-32 é classificado como levemente inflamável (Classe A2L). NUNCA efetue brasagem com gás na linha e NUNCA, SOB QUALQUER PRETEXTO, utilize oxigênio para teste de estanqueidade.",
    realRisk:
      "O Oxigênio puro sob alta pressão reage espontaneamente com os óleos sintéticos (POE/PVE) num processo de detonação adiabática (Efeito Diesel a partir de 15 bar). A condensadora explode instantaneamente com a força de uma granada de fragmentação, decepando membros e matando todos ao redor.",
    procedure: [
      "Utilizar EXCLUSIVAMENTE Nitrogênio Seco (N₂) com regulador de pressão de dois estágios e manômetro calibrado.",
      "Nunca ultrapassar a pressão máxima de teste estipulada pelo fabricante (Split residencial: max 40–45 bar / 580–650 PSI).",
      "Ao manipular fluido R-32, garanta ventilação forçada cruzada contínua e mantenha detector eletrônico para A2L ligado.",
      "Recolha todo o fluido com recolhedora certificada para A2L e passe fluxo contínuo de N₂ (2 a 3 PSI) durante a solda.",
    ],
  },
  {
    id: 7,
    number: "Regra #07",
    category: "eletrica",
    nrBadge: "NR-10 (Segurança em Eletricidade)",
    title: "Eletricidade NR-10: Desenergizar, Bloquear (LOTO) e Medir Ausência de Tensão",
    theRule:
      "Apenas baixar o disjuntor não é segurança. Todo circuito é considerado vivo e potencialmente letal até que se comprove ausência absoluta de tensão nos terminais de contato.",
    realRisk:
      "Terceiros podem religar o disjuntor acidentalmente durante a obra. Além disso, as placas Inverter possuem banco de capacitores eletrolíticos de alta voltagem que retêm entre 310V e 380V DC por até 10 minutos após o desligamento da rede.",
    procedure: [
      "1. Seccionar a alimentação no Disjuntor Geral / Caixa de Distribuição.",
      "2. Aplicar cadeado de segurança e garra de travamento com etiqueta de bloqueio (LOTO - Lockout & Tagout).",
      "3. Testar ausência de tensão na borneira com multímetro categoria CAT III 600V ou CAT IV 600V devidamente calibrado.",
      "4. Aguardar 10 minutos e medir com as pontas de prova a tensão contínua nos bornes do capacitor DC da condensadora (deve indicar impreterivelmente 0V DC antes do toque manual).",
    ],
  },
  {
    id: 8,
    number: "Regra #08",
    category: "quimica",
    nrBadge: "NR-06 & NR-26 (Produtos Químicos)",
    title: "Higienização Química Segura: Cuidados com Desincrustantes e Bactericidas",
    theRule:
      "A aplicação de produtos decapantes, ácidos de alumínio e desincrustantes alcalinos requer uso obrigatório de óculos de vedação estanque e proteção respiratória adequada.",
    realRisk:
      "O respingo de ácido fluorídrico/fosfórico ou soda cáustica na mucosa ocular destrói a córnea em menos de 10 segundos, causando cegueira permanente. A inalação de névoas químicas provoca queimaduras na traqueia e edema pulmonar agudo.",
    procedure: [
      "Utilizar óculos de segurança ampla visão com vedação de borracha (óculos tipo ampla visão com ventilação indireta).",
      "Usar máscara semi-facial com cartucho contra vapores orgânicos e névoas ácidas.",
      "Calçar luvas de borracha nitrílica ou neoprene de cano longo (mínimo 30 cm) cobrindo os punhos.",
      "Manter frasco de soro fisiológico ou ponto de água corrente a menos de 5 metros para lavagem imediata de emergência.",
    ],
  },
];

interface VideoCardItem {
  id: number;
  title: string;
  tag: string;
  duration: string;
  description: string;
  query: string;
  keyPoints: string[];
}

const VIDEOS_DATA: VideoCardItem[] = [
  {
    id: 1,
    title: "Acidentes Fatais na Refrigeração: Análise Real de Quedas e Eletrocussão",
    tag: "NR-35 & NR-10",
    duration: "14 min",
    description:
      "Reconstituição pericial de acidentes com instaladores em fachadas prediais e contato com barramento de alta tensão em condensadoras Inverter comerciais.",
    query: "acidentes seguranca climatizacao instalacao ar condicionado nr35 nr10",
    keyPoints: [
      "Como 1 segundo de desatenção na fachada custou a vida do instalador",
      "Arco elétrico DC em condensadora Inverter de 60.000 BTUs",
      "A importância do talabarte duplo na transição entre apoios",
    ],
  },
  {
    id: 2,
    title: "Explosão de Ar Condicionado: O Perigo Mortal do Oxigênio no Teste de Pressão",
    tag: "Efeito Diesel & NR-13",
    duration: "11 min",
    description:
      "Demonstração prática e chocante do que ocorre quando o técnico usa cilindro de oxigênio em vez de nitrogênio seco. A detonação estraçalha a máquina.",
    query: "explosao ar condicionado oxigenio nitrogenio perigo hvac",
    keyPoints: [
      "A física do Efeito Diesel com óleos sintéticos POE e PVE",
      "Diferença visual entre cilindros de N₂ (verde/preto) e O₂ (verde escuro)",
      "Por que o regulador de pressão é peça de sobrevivência obrigatória",
    ],
  },
  {
    id: 3,
    title: "Boas Práticas com Fluido R-32 (A2L): Ventilação e Riscos de Ignição",
    tag: "Fluidos Inflamáveis A2L",
    duration: "18 min",
    description:
      "Treinamento aprofundado para a transição dos fluidos R-410A para o R-32. Como evitar faíscas elétricas, cuidados no vácuo e teste de vazamento.",
    query: "seguranca fluido R32 inflamabilidade boas praticas instalacao",
    keyPoints: [
      "Classificação ASHRAE 34 e limite inferior de inflamabilidade (LFL)",
      "Ferramental à prova de centelha (recolhedora e bomba de vácuo sem escovas)",
      "Procedimento de queima zero durante solda com purga contínua",
    ],
  },
  {
    id: 4,
    title: "Como Preencher e Usar a APR (Análise Preliminar de Risco) na Prática",
    tag: "Gestão de Risco & SST",
    duration: "16 min",
    description:
      "Passo a passo de como documentar os riscos antes de iniciar o serviço, protegendo sua integridade física e blindando sua empresa juridicamente.",
    query: "analise preliminar de risco apr climatizacao refrigeracao",
    keyPoints: [
      "Mapeamento de riscos no ambiente do cliente (redes elétricas, altura e piso)",
      "Como assinar e colher o ciente do cliente ou condomínio",
      "Validade jurídica da APR perante a fiscalização do Ministério do Trabalho",
    ],
  },
];

const CHECKLIST_ITEMS = [
  {
    id: "chk-1",
    label: "EPIs Básicos Completos",
    desc: "Capacete com jugular, óculos de proteção UV com vedação lateral, luvas de vaqueta/nitrila e bota de couro com biqueira de composite.",
    nr: "NR-06",
  },
  {
    id: "chk-2",
    label: "NR-35: Cinto Paraquedista e Ponto de Ancoragem Estrutural",
    desc: "Cinto tipo paraquedista ajustado com talabarte duplo em Y com absorvedor de energia, conectado em ancoragem independente (>15 kN).",
    nr: "NR-35",
  },
  {
    id: "chk-3",
    label: "NR-10: Disjuntor Geral Desenergizado e Bloqueado (LOTO)",
    desc: "Circuito seccionado, cadeado e etiqueta de travamento aplicados no quadro, e ausência comprovada com multímetro CAT III 600V.",
    nr: "NR-10",
  },
  {
    id: "chk-4",
    label: "Placa Inverter: Tempo de Descarga e Teste de Bornes DC",
    desc: "Aguardou 10 minutos após desenergizar e mediu a tensão no barramento dos capacitores da condensadora marcando estritamente 0V DC.",
    nr: "NR-10",
  },
  {
    id: "chk-5",
    label: "Estanqueidade: Teste Exclusivo com Nitrogênio Seco (N₂)",
    desc: "Cilindro de N₂ equipado com regulador de pressão calibrado com válvula de alívio. Proibição absoluta e confirmada de Oxigênio (O₂).",
    nr: "NR-13",
  },
  {
    id: "chk-6",
    label: "Carga Estrutural: Suporte com Barra Passante ou Chumbador Químico",
    desc: "Fixação dimensionada para 4x o peso dinâmico. Tijolo furado travado com contra-chapa interna ou injeção química certificada.",
    nr: "NBR 16655",
  },
  {
    id: "chk-7",
    label: "Fluidos A2L: Ambiente Ventilado e Extintor Operacional",
    desc: "Área arejada com ventilação cruzada, detector eletrônico de refrigerante ativado e extintor de Pó ABC / CO₂ posicionado ao lado.",
    nr: "NR-20",
  },
  {
    id: "chk-8",
    label: "Isolamento de Área Inferior Contra Queda de Objetos",
    desc: "Perímetro sob a fachada isolado com fita zebrada e cones. Ferramentas manuais conectadas com cordões de retenção na munheca.",
    nr: "NR-18",
  },
];

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function SafetyPage() {
  const { isProfessor, isConteudoLiberado, turmaAtiva, atualizarPermissaoTurma } = useTurma();
  const isLiberado = isConteudoLiberado("seguranca_sst", "ferramenta");

  const [isTogglingPerm, setIsTogglingPerm] = useState(false);

  // Estados do Simulador Financeiro
  const [incomeType, setIncomeType] = useState<number>(6000);
  const [customIncome, setCustomIncome] = useState<string>("");
  const [selectedScenario, setSelectedScenario] = useState<"queda" | "choque" | "explosao">("queda");

  // Filtro de Regras
  const [selectedCategory, setSelectedCategory] = useState<"todas" | "altura" | "eletrica" | "pressao" | "ergonomia" | "quimica">("todas");
  const [expandedRule, setExpandedRule] = useState<number | null>(null);

  // Checklist Pré-Operatório
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    "chk-1": false,
    "chk-2": false,
    "chk-3": false,
    "chk-4": false,
    "chk-5": false,
    "chk-6": false,
    "chk-7": false,
    "chk-8": false,
  });

  // Alternância de permissão pelo Instrutor
  const handleToggleLiberacao = async () => {
    if (!isProfessor) {
      toast.error("Ação restrita ao Instrutor.");
      return;
    }
    if (!turmaAtiva) {
      toast.error("Nenhuma turma ativa selecionada.");
      return;
    }

    setIsTogglingPerm(true);
    const novoStatus = !isLiberado;
    const sucesso = await atualizarPermissaoTurma(turmaAtiva.id, "seguranca_sst", novoStatus, "ferramenta");
    setIsTogglingPerm(false);

    if (sucesso) {
      if (novoStatus) {
        toast.success("Módulo de Segurança e Vida liberado para os alunos da turma!");
      } else {
        toast.info("Módulo de Segurança e Vida bloqueado para os alunos da turma.");
      }
    } else {
      toast.error("Erro ao sincronizar permissão com a base de dados.");
    }
  };

  // Cálculo de Renda Efetiva
  const effectiveIncome = useMemo(() => {
    if (customIncome.trim() !== "") {
      const parsed = parseFloat(customIncome.replace(/[^\d]/g, ""));
      return isNaN(parsed) || parsed <= 0 ? 6000 : parsed;
    }
    return incomeType;
  }, [incomeType, customIncome]);

  // Cálculos do Simulador Financeiro
  const simulationResults = useMemo(() => {
    switch (selectedScenario) {
      case "queda": {
        const meses = 6;
        const lucroCessante = effectiveIncome * meses;
        const custosMedicos = 18500;
        const perdaCarteira = effectiveIncome * 0.25 * 12; // 25% da carteira anual
        const prejuizoTotal = lucroCessante + custosMedicos + perdaCarteira;
        return {
          scenarioTitle: "Queda de Altura em Fachada / Escada (NR-35)",
          mesesAfastado: meses,
          lucroCessante,
          custosMedicos,
          perdaCarteira,
          prejuizoTotal,
          danosClienteMin: 95000,
          danosClienteMax: 280000,
          multasEmpresaMin: 18500,
          multasEmpresaMax: 48000,
          diagnostico: "Fratura exposta de tíbia/fíbula, luxação pélvica e 40 sessões de fisioterapia.",
          detalheCliente: "Responsabilidade civil solidária do condomínio/morador por não exigir APR e linha de vida.",
          detalheEmpresa: "Autuação gravíssima do MTE por falta de ASO de altura, cinto sem CA e ausência de ancoragem.",
        };
      }
      case "choque": {
        const meses = 4;
        const lucroCessante = effectiveIncome * meses;
        const custosMedicos = 14800;
        const perdaCarteira = effectiveIncome * 0.2 * 12;
        const prejuizoTotal = lucroCessante + custosMedicos + perdaCarteira;
        return {
          scenarioTitle: "Choque Elétrico em Barramento DC Inverter 380V (NR-10)",
          mesesAfastado: meses,
          lucroCessante,
          custosMedicos,
          perdaCarteira,
          prejuizoTotal,
          danosClienteMin: 120000,
          danosClienteMax: 320000,
          multasEmpresaMin: 22000,
          multasEmpresaMax: 54000,
          diagnostico: "Queimadura térmica profunda em mãos e perda temporária de reflexos neuromusculares.",
          detalheCliente: "Processo cível do proprietário por ausência de isolamento do quadro de energia do imóvel.",
          detalheEmpresa: "Notificação pelo MTE por técnico sem capacitação NR-10 e ausência de multímetro CAT III.",
        };
      }
      case "explosao": {
        const meses = 8;
        const lucroCessante = effectiveIncome * meses;
        const custosMedicos = 32500;
        const perdaCarteira = effectiveIncome * 0.35 * 12;
        const prejuizoTotal = lucroCessante + custosMedicos + perdaCarteira;
        return {
          scenarioTitle: "Explosão por Efeito Diesel (O₂) / Ruptura Criogênica (NR-13)",
          mesesAfastado: meses,
          lucroCessante,
          custosMedicos,
          perdaCarteira,
          prejuizoTotal,
          danosClienteMin: 250000,
          danosClienteMax: 480000,
          multasEmpresaMin: 38000,
          multasEmpresaMax: 64000,
          diagnostico: "Trauma acústico com perda auditiva severa, enxerto por queimadura e trauma facial por estilhaços.",
          detalheCliente: "Processo criminal e indenização de terceiros por explosão com estilhaços na vizinhança.",
          detalheEmpresa: "Ação regressiva total do INSS, descredenciamento por fabricantes e cancelamento de registro técnico.",
        };
      }
    }
  }, [effectiveIncome, selectedScenario]);

  // Regras Filtradas
  const filteredRules = useMemo(() => {
    if (selectedCategory === "todas") return OPERATIONAL_RULES;
    return OPERATIONAL_RULES.filter((r) => r.category === selectedCategory);
  }, [selectedCategory]);

  // Checklist interativo
  const checkedCount = useMemo(() => {
    return Object.values(checklist).filter(Boolean).length;
  }, [checklist]);

  const toggleCheckItem = (id: string) => {
    setChecklist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelectAllChecklist = (val: boolean) => {
    const updated: Record<string, boolean> = {};
    CHECKLIST_ITEMS.forEach((item) => {
      updated[item.id] = val;
    });
    setChecklist(updated);
  };

  // ============================================================================
  // GERADOR E IMPRESSÃO DE APR DE CAMPO (A4 PDF)
  // ============================================================================
  const handlePrintAPR = () => {
    const dataAtual = new Date().toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const codigoApr = `APR-HVAC-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const aprHtml = `
      <div style="font-family: Arial, sans-serif; font-size: 11px; color: #1e293b; line-height: 1.35; padding: 10px;">
        <!-- CABEÇALHO DA EMPRESA / ÓRGÃO -->
        <div style="border: 2px solid #0f172a; padding: 10px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; background-color: #f8fafc;">
          <div>
            <div style="font-size: 16px; font-weight: bold; color: #b91c1c; text-transform: uppercase; letter-spacing: 0.5px;">
              ANÁLISE PRELIMINAR DE RISCO (APR) • OPERAÇÃO HVAC-R
            </div>
            <div style="font-size: 10px; color: #475569; margin-top: 2px;">
              Em conformidade com NR-01 (GRO/PGR), NR-10, NR-35, NR-13 e NBR 16655 • Tolerância Zero a Desvios
            </div>
          </div>
          <div style="text-align: right; border-left: 2px solid #cbd5e1; padding-left: 12px;">
            <div style="font-size: 10px; font-weight: bold; color: #0f172a;">Nº CONTROLE: <span style="font-family: monospace;">${codigoApr}</span></div>
            <div style="font-size: 10px; color: #64748b;">DATA DE EMISSÃO: <strong>${dataAtual}</strong></div>
            <div style="font-size: 9px; color: #16a34a; font-weight: bold;">VALIDADE: 1 TURNO (8 HORAS)</div>
          </div>
        </div>

        <!-- DADOS DA ORDEM DE SERVIÇO -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 12px; font-size: 10.5px;">
          <tr>
            <td style="border: 1px solid #94a3b8; padding: 5px; background: #f1f5f9; width: 20%; font-weight: bold;">EMPRESA / PRESTADOR:</td>
            <td style="border: 1px solid #94a3b8; padding: 5px; width: 45%;">ENGENHARIA TÉRMICA & CLIMATIZAÇÃO APLICADA</td>
            <td style="border: 1px solid #94a3b8; padding: 5px; background: #f1f5f9; width: 15%; font-weight: bold;">TURMA / POLO:</td>
            <td style="border: 1px solid #94a3b8; padding: 5px; width: 20%;">${turmaAtiva ? turmaAtiva.nome : "Turma de Climatização Profissional"}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #94a3b8; padding: 5px; background: #f1f5f9; font-weight: bold;">CLIENTE / EDIFÍCIO:</td>
            <td style="border: 1px solid #94a3b8; padding: 5px;">EDIFÍCIO RESIDENCIAL & COMERCIAL METROPOLITAN</td>
            <td style="border: 1px solid #94a3b8; padding: 5px; background: #f1f5f9; font-weight: bold;">LOCAL DA INTERVENÇÃO:</td>
            <td style="border: 1px solid #94a3b8; padding: 5px;">Fachada Técnica / Sacada Técnica Externa</td>
          </tr>
          <tr>
            <td style="border: 1px solid #94a3b8; padding: 5px; background: #f1f5f9; font-weight: bold;">ESCOPO DA ATIVIDADE:</td>
            <td colspan="3" style="border: 1px solid #94a3b8; padding: 5px;">
              Instalação / Substituição de Sistema Split Inverter, furação de alvenaria com serra-copo, brasagem oxi-acetileno/maçarico portátil com purga de N₂, teste de estanqueidade a 40 bar e start-up elétrico.
            </td>
          </tr>
        </table>

        <!-- MATRIZ DE RISCOS E MEDIDAS DE CONTROLE -->
        <div style="font-size: 11px; font-weight: bold; background: #0f172a; color: #ffffff; padding: 4px 8px; margin-bottom: 0px; text-transform: uppercase;">
          1. MATRIZ CRÍTICA DE PERIGOS, RISCOS E MEDIDAS DE BLOQUEIO OBRIGATÓRIAS
        </div>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 12px; font-size: 9.5px;">
          <thead>
            <tr style="background: #e2e8f0; text-align: left;">
              <th style="border: 1px solid #94a3b8; padding: 5px; width: 22%;">ETAPA / PERIGO</th>
              <th style="border: 1px solid #94a3b8; padding: 5px; width: 28%;">RISCOS POTENCIAIS</th>
              <th style="border: 1px solid #94a3b8; padding: 5px; width: 50%;">AÇÕES PREVENTIVAS & MEDIDAS DE CONTROLE (OBRIGATÓRIO)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border: 1px solid #94a3b8; padding: 4px; font-weight: bold;">1. Trabalho em Altura (> 2m)</td>
              <td style="border: 1px solid #94a3b8; padding: 4px; color: #b91c1c;">Queda de nível, traumatismo craniano, fratura múltipla, óbito.</td>
              <td style="border: 1px solid #94a3b8; padding: 4px;">Uso de cinto paraquedista com talabarte duplo em Y ancorado em ponto independente (>15 kN). Proibido improvisar apoios ou baldes. Escada travada em 75°.</td>
            </tr>
            <tr>
              <td style="border: 1px solid #94a3b8; padding: 4px; font-weight: bold;">2. Intervenção Elétrica</td>
              <td style="border: 1px solid #94a3b8; padding: 4px; color: #b91c1c;">Choque elétrico em 220V AC ou 380V DC (capacitores Inverter), arco e queimaduras.</td>
              <td style="border: 1px solid #94a3b8; padding: 4px;">Desenergização no QDC, aplicação de cadeado/etiqueta LOTO, teste com multímetro CAT III 600V e aguardo de 10 min para descarga total dos capacitores.</td>
            </tr>
            <tr>
              <td style="border: 1px solid #94a3b8; padding: 4px; font-weight: bold;">3. Teste de Pressurização</td>
              <td style="border: 1px solid #94a3b8; padding: 4px; color: #b91c1c;">Explosão por Efeito Diesel, fragmentação mecânica, trauma timpânico.</td>
              <td style="border: 1px solid #94a3b8; padding: 4px;"><strong>TERMINANTEMENTE PROIBIDO OXIGÊNIO (O₂).</strong> Utilizar estritamente Nitrogênio Seco (N₂) com regulador de 2 estágios testado. Não exceder 45 bar.</td>
            </tr>
            <tr>
              <td style="border: 1px solid #94a3b8; padding: 4px; font-weight: bold;">4. Fluidos A2L (R-32) & Brasagem</td>
              <td style="border: 1px solid #94a3b8; padding: 4px; color: #b91c1c;">Ignição de fluido inflamável, incêndio, inalação de gases tóxicos.</td>
              <td style="border: 1px solid #94a3b8; padding: 4px;">Ventilação mecânica forçada contínua, detector eletrônico de vazamento ligado, purga contínua de N₂ durante solda e extintor de Pó ABC a menos de 2 metros.</td>
            </tr>
            <tr>
              <td style="border: 1px solid #94a3b8; padding: 4px; font-weight: bold;">5. Movimentação de Cargas</td>
              <td style="border: 1px solid #94a3b8; padding: 4px; color: #b91c1c;">Queda de condensadora sobre transeuntes, lesão lombar severa.</td>
              <td style="border: 1px solid #94a3b8; padding: 4px;">Trabalho obrigatório em dupla para peças > 30 kg. Uso de carretilha/polia de içamento. Isolamento do perímetro inferior com fita zebrada e cones.</td>
            </tr>
          </tbody>
        </table>

        <!-- EPIs E EPCs OBRIGATÓRIOS -->
        <div style="font-size: 11px; font-weight: bold; background: #0f172a; color: #ffffff; padding: 4px 8px; margin-bottom: 0px; text-transform: uppercase;">
          2. RELAÇÃO DE EQUIPAMENTOS DE PROTEÇÃO INDIVIDUAL E COLETIVA (VERIFICADOS EM CAMPO)
        </div>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 12px; font-size: 9.5px;">
          <tr>
            <td style="border: 1px solid #94a3b8; padding: 4px; width: 25%;">[ X ] Capacete com Jugular (NR-06)</td>
            <td style="border: 1px solid #94a3b8; padding: 4px; width: 25%;">[ X ] Cinto Paraquedista c/ Talabarte Y</td>
            <td style="border: 1px solid #94a3b8; padding: 4px; width: 25%;">[ X ] Óculos Ampla Visão / UV</td>
            <td style="border: 1px solid #94a3b8; padding: 4px; width: 25%;">[ X ] Luvas de Vaqueta e Nitrílica</td>
          </tr>
          <tr>
            <td style="border: 1px solid #94a3b8; padding: 4px;">[ X ] Bota c/ Biqueira de Composite</td>
            <td style="border: 1px solid #94a3b8; padding: 4px;">[ X ] Protetor Auricular Plug/Concha</td>
            <td style="border: 1px solid #94a3b8; padding: 4px;">[ X ] Extintor de Incêndio Pó ABC</td>
            <td style="border: 1px solid #94a3b8; padding: 4px;">[ X ] Fita Zebrada e Cones Sinalizadores</td>
          </tr>
          <tr>
            <td style="border: 1px solid #94a3b8; padding: 4px;">[ X ] Multímetro CAT III 600V Calibrado</td>
            <td style="border: 1px solid #94a3b8; padding: 4px;">[ X ] Cadeado e Garra de Bloqueio LOTO</td>
            <td style="border: 1px solid #94a3b8; padding: 4px;">[ X ] Regulador de Pressão N₂ Testado</td>
            <td style="border: 1px solid #94a3b8; padding: 4px;">[ X ] Kit de Primeiros Socorros Básico</td>
          </tr>
        </table>

        <!-- DECLARAÇÃO DE RESPONSABILIDADE E ASSINATURAS -->
        <div style="font-size: 11px; font-weight: bold; background: #0f172a; color: #ffffff; padding: 4px 8px; margin-bottom: 0px; text-transform: uppercase;">
          3. TERMO DE CIÊNCIA, AUTORIZAÇÃO E COMPROMISSO DE TOLERÂNCIA ZERO A DESVIOS
        </div>
        <div style="border: 1px solid #94a3b8; padding: 8px; margin-bottom: 12px; font-size: 9px; text-align: justify; background: #fff;">
          Declaramos expressamente que inspecionamos integralmente o local de trabalho, realizamos os testes preliminares de tensão e ancoragem, recebemos e estamos utilizando todos os EPIs/EPCs aplicáveis e estamos cientes do Direito de Recusa. Sob nenhuma circunstância iniciaremos ou continuaremos o serviço caso qualquer condição de risco crítico surja.
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 9.5px;">
          <tr>
            <td style="width: 33%; text-align: center; vertical-align: bottom; padding: 10px;">
              <div style="border-bottom: 1px solid #000; margin-bottom: 4px; height: 35px;"></div>
              <strong>SUPERVISOR / INSTRUTOR TÉCNICO</strong><br/>
              <span>Registro CFT / CREA / Conselho Profissional</span>
            </td>
            <td style="width: 33%; text-align: center; vertical-align: bottom; padding: 10px;">
              <div style="border-bottom: 1px solid #000; margin-bottom: 4px; height: 35px;"></div>
              <strong>TÉCNICO EXECUTANTE TITULAR</strong><br/>
              <span>CPF / Assinatura do Instalador</span>
            </td>
            <td style="width: 33%; text-align: center; vertical-align: bottom; padding: 10px;">
              <div style="border-bottom: 1px solid #000; margin-bottom: 4px; height: 35px;"></div>
              <strong>TÉCNICO AUXILIAR / DUPLA</strong><br/>
              <span>CPF / Assinatura do Auxiliar</span>
            </td>
          </tr>
        </table>

        <div style="text-align: center; font-size: 8px; color: #64748b; margin-top: 15px; border-top: 1px dashed #cbd5e1; padding-top: 6px;">
          Plataforma de Climatização Profissional • Módulo Segurança e Vida (SST) • Emitido em conformidade com o 1º Semestre de 2026
        </div>
      </div>
    `;

    printHtml(aprHtml, {
      title: `APR_Oficial_${codigoApr}`,
      pageMargin: "10mm 8mm",
    });
  };

  // Se o usuário for aluno e a ferramenta estiver bloqueada para a turma ativa
  if (!isProfessor && !isLiberado) {
    return (
      <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-500">
        <ConteudoBloqueadoCard
          titulo="Segurança e Vida (SST) na Climatização"
          categoria="ferramenta"
          descricaoDetalhada="Módulo intensivo de tolerância zero com diretrizes operacionais de NR-35, NR-10, fluidos inflamáveis A2L, simulador financeiro de acidentes e emissão de APR de campo."
        />
      </div>
    );
  }

  const formatBRL = (val: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* ============================================================ */}
      {/* 1. CABEÇALHO IMPOSTO & STATUS DO INSTRUTOR                    */}
      {/* ============================================================ */}
      <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Glow de fundo */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-red-600/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-600/15 border border-red-500/30 text-xs font-bold text-red-400 tracking-wide uppercase">
              <ShieldAlert className="w-4 h-4 text-red-500 animate-pulse" />
              <span>SST & Sobrevivência Operacional • Dados Consolidados 2026</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Tolerância Zero: Segurança e Sobrevivência em Climatização
            </h1>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              No setor HVAC-R, a diferença entre voltar para casa e o óbito é uma decisão de segundos.
              Dados consolidados do <strong>1º Semestre de 2026</strong> mostram que <strong>93% dos acidentes graves</strong> decorrem de excesso de confiança e negligência de procedimentos básicos de NR-35 e NR-10.
            </p>
          </div>

          {/* Botões de Ação do Cabeçalho */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={handlePrintAPR}
              className="flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-lg shadow-red-900/30 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir APR de Campo (PDF A4)</span>
            </button>

            {isProfessor && (
              <button
                onClick={handleToggleLiberacao}
                disabled={isTogglingPerm}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isLiberado
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                    : "bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20"
                }`}
                title="Alternar liberação para a turma ativa"
              >
                {isLiberado ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                <span>
                  {isLiberado ? "Turma: Liberado" : "Turma: Bloqueado"}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* DIRETRIZES DE COMPETÊNCIA PROFISSIONAL (MATRIZ MSEP / SST) */}
      <DiretrizesCompetenciaCard data={COMPETENCIAS_MODULOS["seguranca_sst"]} defaultExpanded={false} />

      {/* ============================================================ */}
      {/* 2. PAINEL ESTATÍSTICO REAL (1º SEMESTRE DE 2026)             */}
      {/* ============================================================ */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
              <Activity className="w-6 h-6 text-red-500" />
              <span>Choque de Realidade: Estatísticas Reais do Setor (2026)</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Fonte: Observatório de SST & Dados Consolidados das Associações Técnicas de HVAC-R (1º Semestre de 2026).
            </p>
          </div>
          <span className="text-xs font-mono text-red-400 bg-red-950/40 border border-red-500/20 px-3 py-1 rounded-full self-start sm:self-auto">
            Amostra de 1.840 Ocorrências Notificadas
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: NR-35 */}
          <div className="bg-black/40 backdrop-blur-md border border-red-500/20 rounded-2xl p-6 relative overflow-hidden group hover:border-red-500/40 transition-all shadow-xl">
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/10 rounded-full blur-2xl group-hover:bg-red-600/20 transition-all pointer-events-none" />
            <div className="flex items-center justify-between mb-4">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20">
                NR-35 • Altura
              </span>
              <AlertOctagon className="w-6 h-6 text-red-500" />
            </div>

            <div className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-2">
              42,8%
            </div>
            <h3 className="text-base font-bold text-red-400 mb-2">
              Quedas em Fachadas, Escadas e Telhados
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed mb-4">
              Responsáveis pela grande maioria das mortes e invalidez permanente no 1º semestre de 2026.
              Quedas a partir de <strong>2,0 metros</strong> sem ancoragem independente concentram o maior índice de
              <strong> politraumatismo craniano e paraplegia irreversível</strong>.
            </p>
            <div className="p-3 rounded-xl bg-red-950/20 border border-red-500/20 text-[11px] text-red-300">
              <strong>Fator Crítico:</strong> 87% das vítimas não usavam linha de vida independente ou improvisaram apoio sobre condensadoras.
            </div>
          </div>

          {/* Card 2: NR-10 */}
          <div className="bg-black/40 backdrop-blur-md border border-amber-500/20 rounded-2xl p-6 relative overflow-hidden group hover:border-amber-500/40 transition-all shadow-xl">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-600/10 rounded-full blur-2xl group-hover:bg-amber-600/20 transition-all pointer-events-none" />
            <div className="flex items-center justify-between mb-4">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
                NR-10 • Eletricidade
              </span>
              <Zap className="w-6 h-6 text-amber-500" />
            </div>

            <div className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-2">
              &gt;68%
            </div>
            <h3 className="text-base font-bold text-amber-400 mb-2">
              Eletrocussões Fatais em Baixa Tensão e Inverter
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed mb-4">
              Ocorreram em tensões rotineiras de <strong>220V AC</strong> e nos barramentos de corrente contínua
              (<strong>310V a 380V DC</strong>) de condensadoras Inverter por falta de desenergização e ausência de bloqueio (LOTO).
            </p>
            <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/20 text-[11px] text-amber-300">
              <strong>Alerta Mortal:</strong> Capacitores eletrolíticos de placas Inverter mantêm carga letal por até 10 minutos após desligar o disjuntor.
            </div>
          </div>

          {/* Card 3: NR-13 & A2L */}
          <div className="bg-black/40 backdrop-blur-md border border-orange-500/20 rounded-2xl p-6 relative overflow-hidden group hover:border-orange-500/40 transition-all shadow-xl">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-600/10 rounded-full blur-2xl group-hover:bg-orange-600/20 transition-all pointer-events-none" />
            <div className="flex items-center justify-between mb-4">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-orange-500/10 text-orange-400 border border-orange-500/20">
                NR-13 & A2L • Explosões
              </span>
              <Flame className="w-6 h-6 text-orange-500" />
            </div>

            <div className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-2">
              28,4%
            </div>
            <h3 className="text-base font-bold text-orange-400 mb-2">
              Explosões Mecânicas e Queimaduras Severas
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed mb-4">
              Incidentes graves causados por pressurização indevida com <strong>Oxigênio (O₂)</strong> gerando detonação
              espontânea por <em>Efeito Diesel</em>, ignição de fluido <strong>Classe A2L (R-32)</strong> e queimaduras criogênicas a -40°C.
            </p>
            <div className="p-3 rounded-xl bg-orange-950/20 border border-orange-500/20 text-[11px] text-orange-300">
              <strong>Regra de Ferro:</strong> O uso de oxigênio para teste de estanqueidade transforma a tubulação em uma bomba de fragmentação.
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. SIMULADOR FINANCEIRO DE CUSTOS DE ACIDENTES               */}
      {/* ============================================================ */}
      <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-xs font-semibold text-red-400 mb-2">
              <DollarSign className="w-3.5 h-3.5" />
              <span>Simulador Financeiro de Sinistro</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              Impacto no Bolso: Quanto Custa Negligenciar a SST?
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Veja a conta real de um acidente de trabalho para o técnico autônomo, para o condomínio/cliente e para a empresa instaladora.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-2 rounded-xl text-xs text-gray-300">
            <Scale className="w-4 h-4 text-amber-400" />
            <span>Código Civil Art. 932 + CLT Art. 157</span>
          </div>
        </div>

        {/* Controles do Simulador */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Seletor de Renda */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
              1. Selecione ou Digite Sua Renda Mensal Média (Líquida)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[4000, 6000, 9000, 12000].map((renda) => (
                <button
                  key={renda}
                  onClick={() => {
                    setIncomeType(renda);
                    setCustomIncome("");
                  }}
                  className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                    incomeType === renda && customIncome === ""
                      ? "bg-red-600 text-white border-red-500 shadow-md shadow-red-900/30"
                      : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"
                  }`}
                >
                  {formatBRL(renda)}
                </button>
              ))}
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Ou digite outro valor mensal (Ex: R$ 8.500)"
                value={customIncome}
                onChange={(e) => setCustomIncome(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Seletor de Cenário de Acidente */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
              2. Escolha o Cenário Crítico de Sinistro
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={() => setSelectedScenario("queda")}
                className={`p-3 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                  selectedScenario === "queda"
                    ? "bg-red-600/20 border-red-500 text-white"
                    : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                }`}
              >
                <span className="text-xs font-bold block mb-1">Queda de Altura</span>
                <span className="text-[10px] text-gray-400">6 Meses Afastado</span>
              </button>

              <button
                onClick={() => setSelectedScenario("choque")}
                className={`p-3 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                  selectedScenario === "choque"
                    ? "bg-amber-600/20 border-amber-500 text-white"
                    : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                }`}
              >
                <span className="text-xs font-bold block mb-1">Choque / Arco DC</span>
                <span className="text-[10px] text-gray-400">4 Meses Afastado</span>
              </button>

              <button
                onClick={() => setSelectedScenario("explosao")}
                className={`p-3 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                  selectedScenario === "explosao"
                    ? "bg-orange-600/20 border-orange-500 text-white"
                    : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                }`}
              >
                <span className="text-xs font-bold block mb-1">Explosão O₂ / N₂</span>
                <span className="text-[10px] text-gray-400">8 Meses Afastado</span>
              </button>
            </div>
          </div>
        </div>

        {/* Resultados Dinâmicos: 3 Esferas de Impacto */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
          {/* Esfera 1: Técnico Autônomo */}
          <div className="bg-gradient-to-b from-red-950/40 to-black/60 border border-red-500/30 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-red-500/20 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 block">
                  Impacto Individual
                </span>
                <h4 className="text-base font-bold text-white">Prejuízo no Bolso do Técnico</h4>
              </div>
              <UserX className="w-6 h-6 text-red-500" />
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-gray-300">
                <span>Lucro Cessante ({simulationResults.mesesAfastado} meses):</span>
                <strong className="text-white">{formatBRL(simulationResults.lucroCessante)}</strong>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Despesas Médicas & Remédios:</span>
                <strong className="text-white">{formatBRL(simulationResults.custosMedicos)}</strong>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Perda de Clientes Fiéis:</span>
                <strong className="text-white">{formatBRL(simulationResults.perdaCarteira)}</strong>
              </div>
            </div>

            <div className="pt-3 border-t border-red-500/20">
              <span className="text-[11px] text-gray-400 block">Prejuízo Pessoal Acumulado:</span>
              <div className="text-2xl sm:text-3xl font-black text-red-400 mt-0.5">
                {formatBRL(simulationResults.prejuizoTotal)}
              </div>
              <p className="text-[11px] text-red-300/80 mt-2 leading-relaxed">
                {simulationResults.diagnostico} O benefício do INSS, quando pago, demora até 90 dias e cobre apenas o piso básico.
              </p>
            </div>
          </div>

          {/* Esfera 2: Cliente / Condomínio */}
          <div className="bg-gradient-to-b from-slate-900/60 to-black/60 border border-white/10 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                  Responsabilidade Solidária
                </span>
                <h4 className="text-base font-bold text-white">Risco do Cliente / Síndico</h4>
              </div>
              <Building2 className="w-6 h-6 text-amber-400" />
            </div>

            <div className="space-y-2 text-xs text-gray-300">
              <p className="leading-relaxed">
                Pela Súmula 331 do TST e Art. 932 do Código Civil, quem contrata responde civil e criminalmente
                caso não exija APR, ASO e comprovação de ancoragem.
              </p>
            </div>

            <div className="pt-3 border-t border-white/10">
              <span className="text-[11px] text-gray-400 block">Indenização Média Arbitrada:</span>
              <div className="text-xl sm:text-2xl font-black text-amber-400 mt-0.5">
                {formatBRL(simulationResults.danosClienteMin)} a {formatBRL(simulationResults.danosClienteMax)}
              </div>
              <p className="text-[11px] text-gray-400 mt-2 leading-relaxed">
                {simulationResults.detalheCliente}
              </p>
            </div>
          </div>

          {/* Esfera 3: Empresa Instaladora / CNPJ */}
          <div className="bg-gradient-to-b from-slate-900/60 to-black/60 border border-white/10 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 block">
                  Autuações & Fiscalização
                </span>
                <h4 className="text-base font-bold text-white">Penalidades para a Prestadora</h4>
              </div>
              <FileSpreadsheet className="w-6 h-6 text-sky-400" />
            </div>

            <div className="space-y-2 text-xs text-gray-300">
              <p className="leading-relaxed">
                Fiscalização do MTE com aplicação de multas pesadas por infração das NRs, além de abertura de
                <strong> Ação Regressiva Previdenciária pelo INSS</strong> contra o CNPJ da prestadora.
              </p>
            </div>

            <div className="pt-3 border-t border-white/10">
              <span className="text-[11px] text-gray-400 block">Multas MTE + Ação Regressiva:</span>
              <div className="text-xl sm:text-2xl font-black text-sky-400 mt-0.5">
                {formatBRL(simulationResults.multasEmpresaMin)} a {formatBRL(simulationResults.multasEmpresaMax)}
              </div>
              <p className="text-[11px] text-gray-400 mt-2 leading-relaxed">
                {simulationResults.detalheEmpresa}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4. 8 REGRAS DE SOBREVIVÊNCIA OPERACIONAL                      */}
      {/* ============================================================ */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <span>8 Regras de Sobrevivência Operacional</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Diretrizes inegociáveis para trabalho em campo. A regra, o risco real e o procedimento obrigatório.
            </p>
          </div>

          {/* Filtros de Categoria */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {[
              { id: "todas", label: "Todas (8)" },
              { id: "altura", label: "NR-35 (Altura)" },
              { id: "eletrica", label: "NR-10 (Elétrica)" },
              { id: "pressao", label: "Fluidos & Pressão" },
              { id: "ergonomia", label: "Trabalho em Dupla" },
              { id: "quimica", label: "Química & Limpeza" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                  selectedCategory === cat.id
                    ? "bg-red-600 text-white border-red-500 shadow-sm"
                    : "bg-white/5 text-gray-400 border-white/10 hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de Cards das 8 Regras */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRules.map((rule) => {
            const isExpanded = expandedRule === rule.id;

            return (
              <div
                key={rule.id}
                className="bg-black/40 backdrop-blur-md border border-white/10 hover:border-white/20 rounded-2xl p-6 transition-all shadow-xl flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Topo do Card */}
                  <div className="flex items-start justify-between gap-3">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-red-600/10 text-red-400 border border-red-500/20">
                      {rule.nrBadge}
                    </span>
                    <span className="text-xs font-black text-gray-500 font-mono">
                      {rule.number}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                    {rule.title}
                  </h3>

                  {/* A Regra */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                      A Regra Básica
                    </span>
                    <p className="text-xs sm:text-sm text-gray-200 leading-relaxed bg-white/5 border border-white/5 p-3 rounded-xl">
                      {rule.theRule}
                    </p>
                  </div>

                  {/* O Risco Real */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                      <span>O Risco Real da Violação</span>
                    </span>
                    <p className="text-xs text-red-300 leading-relaxed bg-red-950/20 border border-red-500/20 p-3 rounded-xl">
                      {rule.realRisk}
                    </p>
                  </div>

                  {/* Procedimento Obrigatório */}
                  <div className="space-y-2 pt-1">
                    <button
                      onClick={() => setExpandedRule(isExpanded ? null : rule.id)}
                      className="w-full flex items-center justify-between text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors py-1 cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>Procedimento Técnico Obrigatório ({rule.procedure.length} passos)</span>
                      </span>
                      <span className="text-gray-400 text-[11px]">
                        {isExpanded ? "Ocultar" : "Ver Passos"}
                      </span>
                    </button>

                    {isExpanded && (
                      <ul className="space-y-2 bg-emerald-950/15 border border-emerald-500/20 p-3.5 rounded-xl text-xs text-gray-200 animate-in fade-in duration-200">
                        {rule.procedure.map((step, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-emerald-400 font-bold font-mono shrink-0">
                              {idx + 1}.
                            </span>
                            <span className="leading-relaxed">{step}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 5. MULTIMÍDIA E VÍDEOS REFLEXIVOS (CONSCIENTIZAÇÃO)          */}
      {/* ============================================================ */}
      <div className="space-y-6">
        <div className="border-b border-white/10 pb-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-500/20 text-xs font-semibold text-red-400 mb-2">
            <PlayCircle className="w-3.5 h-3.5" />
            <span>Vídeos Didáticos & Casos Reais</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
            Conscientização Visual: Análise de Falhas e Acidentes Reais
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Assista às reconstituições periciais e aulas práticas para blindar sua mente contra desvios operacionais.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {VIDEOS_DATA.map((vid) => {
            const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
              vid.query
            )}`;

            return (
              <div
                key={vid.id}
                className="bg-black/40 backdrop-blur-md border border-white/10 hover:border-red-500/30 rounded-2xl p-6 transition-all shadow-xl flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Banner/Placeholder do Vídeo */}
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-white/10 flex items-center justify-center group-hover:border-red-500/40 transition-all">
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    <div className="w-14 h-14 rounded-full bg-red-600/80 group-hover:bg-red-600 flex items-center justify-center text-white shadow-xl transition-all group-hover:scale-110 z-10">
                      <PlayCircle className="w-8 h-8" />
                    </div>
                    <div className="absolute top-3 left-3 z-10">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-red-400 border border-white/10">
                        {vid.tag}
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3 z-10">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-black/80 text-white">
                        {vid.duration}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-red-400 transition-colors">
                      {vid.title}
                    </h3>
                    <p className="text-xs text-gray-300 mt-1.5 leading-relaxed">
                      {vid.description}
                    </p>
                  </div>

                  {/* Pontos Chave */}
                  <div className="space-y-1.5 bg-white/5 p-3 rounded-xl border border-white/5">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                      Tópicos Abordados
                    </span>
                    {vid.keyPoints.map((pt, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-gray-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <a
                  href={youtubeSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-white/10 hover:bg-red-600 text-white text-xs font-bold transition-all border border-white/10 hover:border-red-500 shadow cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Assistir Análise Completa no YouTube</span>
                </a>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 6. CHECKLIST INTERATIVO PRÉ-OPERATÓRIO (8 ITENS)             */}
      {/* ============================================================ */}
      <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 mb-2">
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Verificação Pré-Operatória em Campo</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
              Checklist Interativo de Liberação de Serviço (8 Requisitos)
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Antes de pegar na primeira chave de fenda ou ligar a fita métrica, marque os 8 itens de segurança.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => handleSelectAllChecklist(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition-all cursor-pointer"
            >
              Marcar Todos
            </button>
            <button
              onClick={() => handleSelectAllChecklist(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-gray-400 border border-white/10 transition-all cursor-pointer"
            >
              Limpar
            </button>
          </div>
        </div>

        {/* Barra de Progresso */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold">
            <span className="text-gray-300">
              Progresso de Segurança: {checkedCount} de 8 itens auditados
            </span>
            <span
              className={`font-mono ${
                checkedCount === 8 ? "text-emerald-400" : "text-amber-400"
              }`}
            >
              {Math.round((checkedCount / 8) * 100)}%
            </span>
          </div>
          <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                checkedCount === 8 ? "bg-emerald-500" : "bg-red-500"
              }`}
              style={{ width: `${(checkedCount / 8) * 100}%` }}
            />
          </div>
        </div>

        {/* Banner Dinâmico de Bloqueio vs Liberação */}
        {checkedCount < 8 ? (
          <div className="p-4 sm:p-5 rounded-2xl bg-red-950/30 border-2 border-red-500/40 flex items-start gap-3.5 animate-pulse">
            <XCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm sm:text-base font-black text-red-400 uppercase tracking-wide">
                🔴 SERVIÇO BLOQUEADO: RISCO CRÍTICO DE ACIDENTE — NÃO INICIE O TRABALHO
              </h4>
              <p className="text-xs sm:text-sm text-gray-300 mt-1 leading-relaxed">
                Faltam <strong>{8 - checkedCount} item(ns)</strong> de segurança obrigatórios para garantir a vida da equipe.
                No setor de climatização, 1 único item negligenciado é suficiente para causar morte por queda ou choque elétrico.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 sm:p-5 rounded-2xl bg-emerald-950/30 border-2 border-emerald-500/50 flex items-start gap-3.5 shadow-lg shadow-emerald-950/50">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm sm:text-base font-black text-emerald-400 uppercase tracking-wide">
                🟢 OPERAÇÃO SEGURA LIBERADA — EQUIPE AUTORIZADA COM TOLERÂNCIA ZERO A DESVIOS
              </h4>
              <p className="text-xs sm:text-sm text-gray-200 mt-1 leading-relaxed">
                Todos os 8 requisitos de NR-35, NR-10 e NR-13 foram rigorosamente verificados.
                Trabalhe com calma, mantenha a comunicação com a sua dupla e suspenda o serviço imediatamente se as condições climáticas mudarem.
              </p>
            </div>
          </div>
        )}

        {/* Lista de Checkboxes dos 8 Itens */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {CHECKLIST_ITEMS.map((item) => {
            const isChecked = Boolean(checklist[item.id]);

            return (
              <div
                key={item.id}
                onClick={() => toggleCheckItem(item.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 select-none ${
                  isChecked
                    ? "bg-emerald-950/15 border-emerald-500/40 text-white"
                    : "bg-white/[0.02] border-white/10 hover:border-white/20 text-gray-300"
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isChecked ? (
                    <CheckSquare className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Square className="w-5 h-5 text-gray-500" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-400">
                      {item.nr}
                    </span>
                    <h5 className="text-sm font-bold text-white leading-tight">
                      {item.label}
                    </h5>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 7. BOTÃO FINAL DE EMISSÃO DA APR                              */}
      {/* ============================================================ */}
      <div className="bg-gradient-to-r from-red-950/40 via-black to-slate-950 border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-lg sm:text-xl font-black text-white flex items-center justify-center md:justify-start gap-2">
            <FileText className="w-5 h-5 text-red-500" />
            <span>Documentação Obrigatória: Leve a APR Impressa para a Obra</span>
          </h3>
          <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
            A Análise Preliminar de Risco assinada é a única salvaguarda legal que protege a sua vida e comprova a boa-fé
            do técnico perante o Ministério do Trabalho, peritos judiciais e clientes corporativos.
          </p>
        </div>

        <button
          onClick={handlePrintAPR}
          className="w-full md:w-auto px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-sm shadow-xl shadow-red-900/40 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2.5 shrink-0"
        >
          <Printer className="w-5 h-5" />
          <span>Imprimir APR Oficial (A4 PDF)</span>
        </button>
      </div>
    </div>
  );
}
