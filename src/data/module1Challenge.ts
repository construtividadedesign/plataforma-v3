export type ChallengeGroup = {
  groupNumber: number;
  groupTitle: string;
  focusTopics: string;
  scenario: string;
  missions: string[];
};

export type ModuleChallengeData = {
  title: string;
  subtitle: string;
  objective: string;
  dynamics: string[];
  groups: ChallengeGroup[];
};

export const module1ChallengeData: ModuleChallengeData = {
  title: "Desafio Prático Integrado: A Auditoria do Split Inverter",
  subtitle: "Atividade Oficial de Encerramento do Módulo 1 • Metodologia SENAI de Oficina",
  objective:
    "Simular uma situação real de campo onde um sistema Split Inverter apresenta anomalias complexas. Os alunos são divididos em até 4 equipes especializadas para debater, raciocinar criticamente e fundamentar a solução técnica com base nas apostilas do módulo.",
  dynamics: [
    "Fase 1 (15 min): As equipes reúnem-se nas bancadas, consultam as apostilas técnicas em PDF e estruturam a argumentação do dossiê atribuído.",
    "Fase 2 (15 min): Cada grupo expõe o seu diagnóstico técnico para os demais colegas, promovendo a interação cruzada de ideias e o raciocínio clínico.",
    "Fase 3 (15 min): O Instrutor atua como mediador, validando os conceitos de termodinâmica, manometria, segurança e normas."
  ],
  groups: [
    {
      groupNumber: 1,
      groupTitle: "Equipe de Carga Térmica e Termometria",
      focusTopics: "Foco: Aulas 01 e 02 (Calor e Temperatura)",
      scenario:
        "Um cliente reclama que o ambiente da sala de estar (25 m²) atinge a temperatura desejada no painel (22 °C), mas os usuários continuam suando e sentindo o ar 'pesado e abafado', com alta umidade relativa. O termômetro de bulbo seco marca 22 °C, mas o desconforto persiste.",
      missions: [
        "Explicar a diferença termodinâmica entre Calor Sensível e Calor Latente aplicada a este caso.",
        "Identificar se o problema está na remoção de umidade e qual a relação direta com a temperatura de evaporação da serpentina.",
        "Indicar como a medição correta de Bulbo Seco vs. Bulbo Úmido auxiliaria a diagnosticar a carga térmica real do ambiente."
      ]
    },
    {
      groupNumber: 2,
      groupTitle: "Equipe de Dinâmica de Fluidos e Termodinâmica",
      focusTopics: "Foco: Aulas 03 e 04 (Pressão e Ciclo Frigorífico)",
      scenario:
        "Durante a verificação de rotina em um Split Inverter, o técnico acopla o Manifold e constata que a linha de sucção está excessivamente fria (quase congelando na entrada do compressor), enquanto a pressão manométrica de baixa está abaixo da tabela de saturação do R-32, e o tubo de líquido apresenta comportamento irregular.",
      missions: [
        "Mapear o comportamento do ciclo nos 4 componentes fundamentais (Compressor, Condensador, EEV e Evaporador).",
        "Explicar como a queda anômala de pressão na linha afeta o ponto de ebulição do fluido refrigerante.",
        "Conceituar o Superaquecimento (SA) e o Subresfriamento (SR) necessários para provar se há restrição na expansão ou falta de fluido."
      ]
    },
    {
      groupNumber: 3,
      groupTitle: "Equipe de Normas e Segurança Operacional",
      focusTopics: "Foco: Aula 05 (Segurança, Recolhimento e Vácuo)",
      scenario:
        "Um instalador iniciante foi fotografado preparando uma linha frigorífica antiga. Ele conectou um cilindro de oxigênio industrial para fazer um 'teste rápido de vazamento sob alta pressão' e pretendia pular a etapa de vácuo profundo, alegando que 'purgar com um pouco de gás do próprio aparelho resolve a umidade'.",
      missions: [
        "Identificar todas as infrações normativas e de segurança cometidas na cena (destacando o perigo mortal do oxigênio com óleo POE).",
        "Apresentar o procedimento correto de teste de estanqueidade exigido por norma (uso exclusivo de Nitrogênio Seco com regulador).",
        "Justificar tecnicamente por que o vácuo profundo abaixo de 500 Microns aferido por vacuômetro digital é obrigatório antes da liberação."
      ]
    },
    {
      groupNumber: 4,
      groupTitle: "Equipe de Engenharia de Fluidos e Sustentabilidade",
      focusTopics: "Foco: Aula 06 (Fluidos Alternativos e ASHRAE 34)",
      scenario:
        "Uma empresa contratante quer substituir uma frota antiga de aparelhos à base de R-22 por novos modelos ecológicos. A diretoria está em dúvida entre adotar equipamentos com R-410A (Classe A1) ou R-32 (Classe A2L), e ouviu falar sobre os cuidados com hidrocarbonetos (R-290).",
      missions: [
        "Comparar os índices ambientais ODP e GWP entre os fluidos legados e os da nova geração.",
        "Explicar o significado da classificação de segurança ASHRAE 34 (Classe A2L) do R-32, detalhando os cuidados especiais de ventilação e brasagem.",
        "Defender perante a diretoria qual a melhor escolha técnica de longo prazo para a climatização comercial."
      ]
    }
  ]
};