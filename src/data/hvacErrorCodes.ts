export interface ErrorDiagnosticItem {
  id: string;
  brand: "Daikin" | "LG" | "Samsung" | "Gree" | "Midea / Carrier" | "Universal / Eletromecânico";
  errorCode: string; // Ex: "CH 05", "E1", "F6", "Erro de Comunicação"
  faultTitle: string; // Ex: "Falha de Comunicação Serial (Unidade Interna x Externa)"
  whatToAnalyze: string; // O que analisar passo a passo
  diagnosticStep: string; // Diagnóstico técnico detalhado (multímetro, osciloscópio, pressões)
  correctiveAction: string; // O que corrigir ou trocar definitivamente
  severity: "Crítico (Trava o Sistema)" | "Moderado (Alerta / Baixo Rendimento)" | "Preventivo";
}

export const hvacErrorCodesData: ErrorDiagnosticItem[] = [
  // --- DAIKIN ---
  {
    id: "daikin-u4",
    brand: "Daikin",
    errorCode: "U4",
    faultTitle: "Falha de Transmissão entre Unidade Interna e Externa",
    whatToAnalyze: "Verificar continuidade e integridade do cabo de interligação nos bornes F1/F2 (ou sinal). Checar tensão CC oscilante entre as vias.",
    diagnosticStep: "Com o multímetro em escala DC, meça entre F1 e F2. Se a tensão estiver travada em 0V ou fixa sem oscilar, há interrupção no cabo de comunicação ou placa IPM/comunicação avariada por surto de rede.",
    correctiveAction: "Substituir o cabo PP caso esteja emendado ou corrompido. Se a fiação estiver perfeita, testar e substituir o varistor ou a placa eletrônica de comunicação.",
    severity: "Crítico (Trava o Sistema)"
  },
  {
    id: "daikin-a6",
    brand: "Daikin",
    errorCode: "A6",
    faultTitle: "Anomalia no Motor do Ventilador da Unidade Interna (PG Motor)",
    whatToAnalyze: "Verificar se a turbina tangencial gira livremente sem travamento mecânico por sujeira/gelo. Testar conector do sensor Hall na placa.",
    diagnosticStep: "Desligue a rede, tente girar o ventilador manualmente. Se estiver duro, o rolamento ou bucha travou. Com o multímetro, verifique se a placa envia 12V/300V para o motor.",
    correctiveAction: "Realizar limpeza mecânica/química do conjunto ou substituir o motor ventilador interno e/ou a placa principal se o circuito de acionamento estiver queimado.",
    severity: "Crítico (Trava o Sistema)"
  },
  {
    id: "daikin-c4",
    brand: "Daikin",
    errorCode: "C4",
    faultTitle: "Defeito no Sensor de Temperatura do Trocador de Calor (Evaporador)",
    whatToAnalyze: "Inspecionar o chicote do sensor termistor fixado nas dobras da serpentina interna. Verificar se há cabo partido ou mau contato no conector da placa.",
    diagnosticStep: "Retirar o sensor e medir sua resistência ôhmica (ex: 10k ohms a 25°C) usando o multímetro na escala de resistência, comparando com a tabela do fabricante ou aquecendo levemente com a mão para ver a variação.",
    correctiveAction: "Substituir o sensor termistor NTC defeituoso por um original de mesma especificação ôhmica.",
    severity: "Moderado (Alerta / Baixo Rendimento)"
  },
  {
    id: "daikin-e7",
    brand: "Daikin",
    errorCode: "E7",
    faultTitle: "Falha no Motor do Ventilador da Unidade Externa (BLDC)",
    whatToAnalyze: "Verificar se a hélice do condensador está travada por galhos, sujeira ou deformação da grade. Inspecionar conector do motor DC.",
    diagnosticStep: "Girar a hélice manualmente com a máquina desenergizada. Medir com multímetro as tensões de alimentação do motor DC (Vdc ~310V, Vcc 15V e Vsp 0-6V de controle de velocidade).",
    correctiveAction: "Remover a obstrução física da hélice ou substituir o motor ventilador DC externo e verificar o circuito driver da placa condensadora.",
    severity: "Crítico (Trava o Sistema)"
  },
  {
    id: "daikin-l5",
    brand: "Daikin",
    errorCode: "L5",
    faultTitle: "Sobrecorrente Instantânea no Compressor Inverter",
    whatToAnalyze: "Verificar se o compressor partiu travado mecanicamente, se há curto nos enrolamentos U-V-W ou se a válvula de expansão EEV está 100% bloqueada.",
    diagnosticStep: "Desconectar o chicote do compressor e medir as resistências entre U-V, V-W e U-W (devem ser perfeitamente iguais e simétricas, ~1.5 a 3.0 ohms). Testar isolamento para o terra com megômetro.",
    correctiveAction: "Substituir o compressor caso as bobinas apresentem resistência assimétrica ou fuga para a massa. Se o compressor estiver bom, substituir o módulo IPM da placa externa.",
    severity: "Crítico (Trava o Sistema)"
  },

  // --- LG ---
  {
    id: "lg-ch05",
    brand: "LG",
    errorCode: "CH 05",
    faultTitle: "Erro de Comunicação (Transmission Error) entre Indoor e Outdoor",
    whatToAnalyze: "Inspecionar bornes de interligação (1, 2, 3 ou L, N, S). Procurar por oxidação, cabo blindado mal aterrado ou emendas mal feitas.",
    diagnosticStep: "Verificar com o multímetro se há curto-circuito entre o cabo de sinal e o terra. Conferir se a placa da evaporadora alimenta a linha serial de dados com pulsos em corrente contínua oscilando entre 0V e 24V DC.",
    correctiveAction: "Refazer a fiação de interligação utilizando cabo PP certificado e contínuo sem emendas. Se persistir, testar os acopladores ópticos e trocar a placa eletrônica correspondente.",
    severity: "Crítico (Trava o Sistema)"
  },
  {
    id: "lg-ch10",
    brand: "LG",
    errorCode: "CH 10",
    faultTitle: "Falha de Rotação do Motor Ventilador Interno",
    whatToAnalyze: "Verificar obstrução física na turbina tangencial, acúmulo de pó e travamento do eixo.",
    diagnosticStep: "Testar o sinal de feedback do sensor Hall do motor. Se a placa não recebe o pulso de rotação, ela desarme a máquina em poucos segundos após a partida para evitar sobreaquecimento.",
    correctiveAction: "Desobstruir e lubrificar o eixo ou substituir o motor do ventilador interno.",
    severity: "Crítico (Trava o Sistema)"
  },
  {
    id: "lg-ch21",
    brand: "LG",
    errorCode: "CH 21",
    faultTitle: "Erro de Sobretensão ou Falha no Módulo Inverter (IPM Fault)",
    whatToAnalyze: "Checar instabilidade na rede elétrica local (quedas severas de tensão ou surtos). Verificar se o dissipador de calor do IPM está limpo.",
    diagnosticStep: "Medir a tensão de entrada na rede (220V). Desligar o equipamento e testar os diodos da ponte retificadora e os IGBTs do IPM na escala de semicondutores do multímetro.",
    correctiveAction: "Corrigir a infraestrutura elétrica com disjuntor e bitola adequados (NBR 5410). Se o IPM estiver em curto, substituir a placa eletrônica externa.",
    severity: "Crítico (Trava o Sistema)"
  },
  {
    id: "lg-ch26",
    brand: "LG",
    errorCode: "CH 26",
    faultTitle: "Falha de Posicionamento do Compressor Inverter (DC Peak Current)",
    whatToAnalyze: "Verificar se o compressor tenta partir e vibra sem girar, indicando perda de sincronismo do campo magnético ou IPM danificado.",
    diagnosticStep: "Medir o equilíbrio de corrente em cada uma das 3 fases do compressor com alicate amperímetro na partida. Testar se há curto entre pinos U-V-W e o dissipador metálico.",
    correctiveAction: "Revisar conexões da borneira hermética do compressor. Se os enrolamentos estiverem equilibrados e sem curto, substituir a placa principal da condensadora.",
    severity: "Crítico (Trava o Sistema)"
  },

  // --- SAMSUNG ---
  {
    id: "samsung-e101",
    brand: "Samsung",
    errorCode: "E101",
    faultTitle: "Erro de Comunicação Geral entre Unidade Interna e Externa",
    whatToAnalyze: "Conferir a ordem correta dos cabos de comunicação e alimentação. Verificar inversão acidental de bornes.",
    diagnosticStep: "Testar a continuidade do cabo de sinal. Verificar se há queda de tensão acentuada devido a cabos muito longos e finos (abaixo de 1.5mm²).",
    correctiveAction: "Corrigir a bitola e a ordem dos cabos conforme diagrama elétrico da tampa. Substituir cabo danificado.",
    severity: "Crítico (Trava o Sistema)"
  },
  {
    id: "samsung-e221",
    brand: "Samsung",
    errorCode: "E221",
    faultTitle: "Erro no Sensor de Temperatura Ambiente (Indoor Room Sensor)",
    whatToAnalyze: "Inspecionar o bulbo do termistor de ar ambiente na entrada da serpentina.",
    diagnosticStep: "Testar a resistência do NTC com multímetro. Verificar se o sensor está deslocado de seu suporte e medindo o calor da própria placa eletrônica.",
    correctiveAction: "Reposicionar corretamente o sensor em seu clipe de suporte ou substituir a peça caso esteja aberta/em curto.",
    severity: "Moderado (Alerta / Baixo Rendimento)"
  },
  {
    id: "samsung-e458",
    brand: "Samsung",
    errorCode: "E458",
    faultTitle: "Anomalia no Motor do Ventilador da Unidade Externa (Outdoor Fan Error)",
    whatToAnalyze: "Verificar acúmulo de poeira e teias na hélice, rotação mecânica manual e conector Fan Motor na placa condensadora.",
    diagnosticStep: "Medir as tensões do conector BLDC: 310V no terminal de potência, 15V de controle e sinal PWM. Se o motor não responder aos pulsos, diagnosticar falha interna no estator.",
    correctiveAction: "Substituir o motor BLDC externo ou reparar o circuito de acionamento do ventilador na placa condensadora.",
    severity: "Crítico (Trava o Sistema)"
  },
  {
    id: "samsung-e464",
    brand: "Samsung",
    errorCode: "E464",
    faultTitle: "Proteção contra Sobrecorrente de Pico no Módulo IPM",
    whatToAnalyze: "Inspecionar serpentina da condensadora entupida por sujeira, provocando alta pressão de condensação e sobrecarga elétrica.",
    diagnosticStep: "Medir pressão de alta no manifold. Verificar se a pasta térmica do dissipador do IPM está ressecada. Medir corrente RMS de pico na linha de alimentação.",
    correctiveAction: "Lavar e higienizar a serpentina externa, renovar a pasta térmica do dissipador do módulo IPM ou substituir a placa externa.",
    severity: "Crítico (Trava o Sistema)"
  },

  // --- GREE ---
  {
    id: "gree-e1",
    brand: "Gree",
    errorCode: "E1",
    faultTitle: "Proteção de Alta Pressão no Sistema Frigorífico",
    whatToAnalyze: "Inspecionar condensador sujo, ventilador externo inoperante, excesso de gás refrigerante ou tubulação estrangulada na linha de descarga.",
    diagnosticStep: "Acoplar manifold de alta. Se a pressão ultrapassar 450-500 PSI em R-410A/R-32, o pressostato de alta atua. Verificar se a serpentina externa está bloqueada de ventilação.",
    correctiveAction: "Limpar o condensador, verificar a rotação do ventilador externo, purgar excesso de fluido pesando na balança digital.",
    severity: "Crítico (Trava o Sistema)"
  },
  {
    id: "gree-e5",
    brand: "Gree",
    errorCode: "E5",
    faultTitle: "Proteção de Sobrecorrente (Overcurrent Protection)",
    whatToAnalyze: "Verificar condensador sujo/entupido, excesso de fluido refrigerante na linha ou tensão de alimentação muito baixa.",
    diagnosticStep: "Medir a corrente elétrica (A) com o alicate amperímetro True RMS na partida do compressor. Comparar com o valor nominal da etiqueta.",
    correctiveAction: "Realizar limpeza química do condensador, corrigir a carga de fluido por massa na balança ou estabilizar a rede elétrica.",
    severity: "Crítico (Trava o Sistema)"
  },
  {
    id: "gree-h6",
    brand: "Gree",
    errorCode: "H6",
    faultTitle: "Falha no Retorno de Pulso do Motor Ventilador Interno",
    whatToAnalyze: "Verificar se o conector do motor está frouxo na placa principal ou se há travamento mecânico na turbina.",
    diagnosticStep: "Checar se o eixo gira livremente. Testar continuidade do chicote elétrico de sinal do motor e presença de pulsos no sensor de efeito Hall.",
    correctiveAction: "Reconectar firmemente o chicote ou trocar o motor ventilador interno.",
    severity: "Crítico (Trava o Sistema)"
  },
  {
    id: "gree-f0",
    brand: "Gree",
    errorCode: "F0",
    faultTitle: "Perda de Carga de Fluido Refrigerante ou Restrição de Expansão",
    whatToAnalyze: "Inspecionar vazamentos em conexões flangeadas, soldas e válvulas de serviço. Verificar congelamento na linha de expansão.",
    diagnosticStep: "Conectar manifold e vacuômetro. Aferir o superaquecimento (SA). Se a pressão estiver muito baixa e o SA elevado (>15 K), há falta de gás.",
    correctiveAction: "Pressurizar com Nitrogênio a 400 PSI, localizar o ponto de vazamento com água e sabão, sanar, realizar vácuo profundo e recarregar por peso.",
    severity: "Crítico (Trava o Sistema)"
  },

  // --- MIDEA / CARRIER ---
  {
    id: "midea-e1",
    brand: "Midea / Carrier",
    errorCode: "E1",
    faultTitle: "Erro de Comunicação Serial entre Unidade Interna e Externa",
    whatToAnalyze: "Verificar sequência dos bornes 1(L), 2(N), S(Comunicação) e PE(Terra). Checar emendas no cabo de comunicação.",
    diagnosticStep: "Medir com o multímetro em escala de tensão contínua (VDC) entre os bornes N e S. A tensão deve oscilar continuamente entre 0V e 24V. Se estiver travada em 0V ou 24V fixos, a comunicação está interrompida.",
    correctiveAction: "Substituir o cabo de interligação por cabo PP novo e sem emendas. Se o cabo estiver perfeito, substituir a placa eletrônica danificada.",
    severity: "Crítico (Trava o Sistema)"
  },
  {
    id: "midea-e3",
    brand: "Midea / Carrier",
    errorCode: "E3",
    faultTitle: "Erro de Velocidade do Ventilador da Unidade Interna",
    whatToAnalyze: "Inspecionar acúmulo de biofilme e sujeira extrema na turbina tangencial, gerando peso excessivo no eixo.",
    diagnosticStep: "Girar a turbina manualmente. Medir se a placa envia tensão para o motor. Se o motor tentar girar e travar, o circuito protetor atua.",
    correctiveAction: "Executar higienização completa com bolsa de lavagem ou substituir o motor ventilador.",
    severity: "Crítico (Trava o Sistema)"
  },
  {
    id: "midea-f1",
    brand: "Midea / Carrier",
    errorCode: "F1",
    faultTitle: "Falha no Sensor de Temperatura da Serpentina Interna",
    whatToAnalyze: "Verificar conexão do chicote do sensor de cobre na placa principal da evaporadora.",
    diagnosticStep: "Testar resistência ôhmica do sensor NTC. Verificar se há rompimento do fio por vibração ou ação de roedores.",
    correctiveAction: "Substituir o sensor termistor NTC correspondente.",
    severity: "Moderado (Alerta / Baixo Rendimento)"
  },
  {
    id: "midea-ec",
    brand: "Midea / Carrier",
    errorCode: "EC",
    faultTitle: "Detecção Automática de Vazamento de Fluido Refrigerante",
    whatToAnalyze: "A placa detecta que a serpentina do evaporador não atinge a temperatura esperada mesmo após o compressor operar por minutos consecutivos.",
    diagnosticStep: "Conferir pressões manométricas e salto térmico (Delta T) entre ar de retorno e insuflação. Se Delta T for inferior a 8°C e a sucção estiver baixa, o fluido escapou.",
    correctiveAction: "Localizar e sanar vazamento em flanges ou soldas, fazer vácuo abaixo de 500 Microns e completar a carga por peso com balança digital.",
    severity: "Crítico (Trava o Sistema)"
  },

  // --- UNIVERSAL / ELETROMECÂNICO ---
  {
    id: "univ-low-gas",
    brand: "Universal / Eletromecânico",
    errorCode: "Baixa Pressão / Gelo",
    faultTitle: "Subdimensionamento ou Vazamento de Fluido Refrigerante (Falta de Gás)",
    whatToAnalyze: "Inspecionar manchas de óleo nas porcas flangeadas e soldas. Verificar formação de gelo na primeira volta do evaporador.",
    diagnosticStep: "Conectar o Manifold e o Vacuômetro. Avaliar Superaquecimento (SH) elevado e pressão de sucção abaixo da tabela de saturação do gás.",
    correctiveAction: "Executar teste de estanqueidade com Nitrogênio (400 PSI), sanar o vazamento, fazer vácuo profundo (< 500 μmHg) e recarregar por massa na balança.",
    severity: "Crítico (Trava o Sistema)"
  },
  {
    id: "univ-capacitor",
    brand: "Universal / Eletromecânico",
    errorCode: "Compressor Não Venta/Partes",
    faultTitle: "Defeito no Capacitor de Marcha (On/Off) ou Klixon Desarmado",
    whatToAnalyze: "Verificar se o capacitor está estufado, vazando óleo ou com capacitância abaixo da especificação nominal (medida em uF no multímetro).",
    diagnosticStep: "Descarregar o capacitor com chave isolada. Medir a capacitância com capacímetro. Testar continuidade dos bornes C-S-R do compressor.",
    correctiveAction: "Substituir o capacitor esgotado por outro de mesma especificação (uF e VAC) e verificar protetor térmico (Klixon).",
    severity: "Crítico (Trava o Sistema)"
  },
  {
    id: "univ-sh-elevado",
    brand: "Universal / Eletromecânico",
    errorCode: "Superaquecimento Alto",
    faultTitle: "Restrição no Dispositivo de Expansão (EEV / Tubo Capilar / Filtro Secador)",
    whatToAnalyze: "Inspecionar queda de temperatura abrupta antes e depois do filtro secador (filtro suando ou congelando na saída).",
    diagnosticStep: "Medir pressão de sucção e temperatura na linha de sucção para cálculo do Superaquecimento. Se SH > 15K e a pressão de baixa estiver em vácuo ou muito deprimida, há entupimento mecânico por carepa ou umidade.",
    correctiveAction: "Substituir o filtro secador e/ou a válvula EEV. Fazer limpeza interna da tubulação com fluido solvente (ex: 141b / substitutos), vácuo profundo e nova carga de fluido.",
    severity: "Crítico (Trava o Sistema)"
  },
  {
    id: "univ-fuga-massa",
    brand: "Universal / Eletromecânico",
    errorCode: "Desarme do Disjuntor / DR",
    faultTitle: "Fuga de Corrente Elétrica para a Carcaça (Compressor em Massa)",
    whatToAnalyze: "O disjuntor geral ou dispositivo DR desarma no exato segundo em que a contatora/revezamento aciona o compressor.",
    diagnosticStep: "Com o circuito 100% desenergizado, desconectar os fios dos bornes herméticos. Colocar o multímetro na maior escala de resistência (ou usar Megômetro a 500V) entre cada borne e a tubulação de cobre limpa sem tinta. Qualquer continuidade indica curto.",
    correctiveAction: "Substituição obrigatória do compressor elétrico hermético e limpeza do sistema contra queima ácida de óleo lubrificante.",
    severity: "Crítico (Trava o Sistema)"
  }
];
