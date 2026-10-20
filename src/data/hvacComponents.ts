export type ComponentItem = {
  id: number;
  name: string;
  description: string;
  category: string;
  imageUrl?: string;
};

export const hvacComponentsData: { categoryName: string; description: string; items: ComponentItem[] }[] = [
  {
    categoryName: "1. Unidade Interna — Evaporadora",
    description: "Absorve calor do ambiente, devolve o ar resfriado, realiza a filtragem e recolhe a água da condensação.",
    items: [
      { id: 1, name: "Gabinete ou carcaça", description: "Estrutura que sustenta e protege os componentes internos.", category: "Evaporadora" },
      { id: 2, name: "Painel frontal", description: "Tampa articulada ou removível que permite acesso aos filtros e ao interior do aparelho.", category: "Evaporadora" },
      { id: 3, name: "Aletas direcionadoras horizontais", description: "Direcionam o fluxo de ar para cima ou para baixo.", category: "Evaporadora" },
      { id: 4, name: "Aletas direcionadoras verticais", description: "Distribuem o ar lateralmente, manual ou automaticamente, conforme o modelo.", category: "Evaporadora" },
      { id: 5, name: "Filtros de ar laváveis", description: "Retêm poeira e partículas maiores antes que o ar passe pela serpentina.", category: "Evaporadora" },
      { id: 6, name: "Filtro adicional de alta eficiência", description: "Auxilia na retenção de partículas menores, conforme a tecnologia empregada.", category: "Evaporadora" },
      { id: 7, name: "Suporte de fixação", description: "Mantém a evaporadora presa à parede.", category: "Evaporadora" },
      { id: 8, name: "Serpentina da evaporadora", description: "Trocador de calor pelo qual circula o refrigerante; absorve calor do ar interno.", category: "Evaporadora" },
      { id: 9, name: "Tubos de cobre da serpentina", description: "Conduzem o refrigerante pelo trocador de calor.", category: "Evaporadora" },
      { id: 10, name: "Aletas de alumínio", description: "Aumentam a área de contato e melhoram a transferência de calor entre o ar e a serpentina.", category: "Evaporadora" },
      { id: 11, name: "Distribuidor de refrigerante", description: "Divide o fluxo de refrigerante entre os circuitos da serpentina.", category: "Evaporadora" },
      { id: 12, name: "Bandeja de condensado", description: "Recolhe a água que se forma na superfície fria da serpentina.", category: "Evaporadora" },
      { id: 13, name: "Mangueira de drenagem", description: "Conduz a água condensada até um ponto de descarte.", category: "Evaporadora" },
      { id: 14, name: "Turbina tangencial (cross-flow)", description: "Movimenta o ar através dos filtros e da serpentina.", category: "Evaporadora" },
      { id: 15, name: "Motor da turbina", description: "Aciona o ventilador para produzir a vazão de ar necessária.", category: "Evaporadora" },
      { id: 16, name: "Mancais ou buchas do ventilador", description: "Apoiam o eixo da turbina e permitem sua rotação.", category: "Evaporadora" },
      { id: 17, name: "Sensor NTC da serpentina", description: "Mede a temperatura da serpentina para controle de operação e proteção.", category: "Evaporadora" },
      { id: 18, name: "Sensor NTC de retorno de ar", description: "Mede a temperatura do ar que entra na evaporadora, auxiliando o controle.", category: "Evaporadora" },
      { id: 19, name: "Sensor de umidade", description: "Mede a umidade relativa do ar para funções específicas do equipamento.", category: "Evaporadora" },
      { id: 20, name: "Placa eletrônica da evaporadora", description: "Gerencia comandos, sensores, ventilador e comunicação com a condensadora.", category: "Evaporadora" },
      { id: 21, name: "Receptor infravermelho", description: "Recebe os comandos enviados pelo controle remoto.", category: "Evaporadora" },
      { id: 22, name: "Display ou painel indicador", description: "Exibe temperatura, modo de funcionamento e códigos de falha.", category: "Evaporadora" },
      { id: 23, name: "LEDs indicadores", description: "Sinalizam funcionamento, temporização e eventuais condições de erro.", category: "Evaporadora" },
      { id: 24, name: "Motor das aletas automáticas", description: "Movimenta as aletas de direcionamento de ar.", category: "Evaporadora" },
      { id: 25, name: "Chicote elétrico interno", description: "Interliga sensores, motores, placa eletrônica e demais dispositivos.", category: "Evaporadora" },
      { id: 26, name: "Conectores elétricos", description: "Permitem a conexão e a desconexão dos circuitos elétricos.", category: "Evaporadora" },
      { id: 27, name: "Bornes de interligação", description: "Conectam a alimentação ou os cabos de comunicação.", category: "Evaporadora" },
      { id: 28, name: "Isolamento térmico interno", description: "Reduz perdas térmicas e ajuda a evitar condensação indesejada.", category: "Evaporadora" },
      { id: 29, name: "Terminais e suportes de sensores", description: "Posicionam os sensores para que meçam corretamente a temperatura.", category: "Evaporadora" },
      { id: 30, name: "Tampa da caixa elétrica", description: "Protege a placa e as conexões elétricas contra contato acidental.", category: "Evaporadora" }
    ]
  },
  {
    categoryName: "2. Unidade Externa — Condensadora",
    description: "Abriga os componentes responsáveis por rejeitar calor para o ambiente externo, comprimir e controlar o sistema inverter.",
    items: [
      { id: 31, name: "Gabinete da condensadora", description: "Protege os componentes contra impactos e exposição ao ambiente.", category: "Condensadora" },
      { id: 32, name: "Base ou chassi", description: "Sustenta o compressor, a serpentina e os demais componentes.", category: "Condensadora" },
      { id: 33, name: "Tampa superior", description: "Protege a parte superior da unidade.", category: "Condensadora" },
      { id: 34, name: "Grade de proteção do ventilador", description: "Evita o contato acidental com as pás do ventilador.", category: "Condensadora" },
      { id: 35, name: "Serpentina do condensador", description: "Permite a troca de calor entre o refrigerante e o ar externo.", category: "Condensadora" },
      { id: 36, name: "Tubos de cobre ou alumínio", description: "Conduzem o refrigerante pelo trocador de calor externo.", category: "Condensadora" },
      { id: 37, name: "Aletas de alumínio da condensadora", description: "Aumentam a superfície de troca térmica.", category: "Condensadora" },
      { id: 38, name: "Ventilador axial", description: "Movimenta o ar externo através da serpentina.", category: "Condensadora" },
      { id: 39, name: "Motor do ventilador externo", description: "Aciona o ventilador para dissipar o calor.", category: "Condensadora" },
      { id: 40, name: "Hélice do ventilador", description: "Produz o fluxo de ar necessário para a troca térmica.", category: "Condensadora" },
      { id: 41, name: "Suporte do motor do ventilador", description: "Mantém o motor alinhado e fixado.", category: "Condensadora" },
      { id: 42, name: "Compressor inverter", description: "Comprime o refrigerante e circula pelo circuito com rotação variável.", category: "Condensadora" },
      { id: 43, name: "Terminais elétricos do compressor", description: "Permitem a conexão elétrica dos enrolamentos.", category: "Condensadora" },
      { id: 44, name: "Isoladores ou coxins antivibração", description: "Reduzem a transmissão de vibrações para o chassi.", category: "Condensadora" },
      { id: 45, name: "Acumulador de sucção", description: "Retém líquido que possa retornar pela linha de sucção.", category: "Condensadora" },
      { id: 46, name: "Separador de óleo", description: "Separa parte do óleo transportado e auxilia no seu retorno ao compressor.", category: "Condensadora" },
      { id: 47, name: "Reservatório de líquido", description: "Armazena refrigerante líquido e auxilia na gestão da carga.", category: "Condensadora" },
      { id: 48, name: "Placa eletrônica inverter", description: "Controla a potência fornecida ao compressor e motores.", category: "Condensadora" },
      { id: 49, name: "Módulo de potência IPM", description: "Contém semicondutores para acionar o compressor inverter.", category: "Condensadora" },
      { id: 50, name: "Ponte retificadora", description: "Converte corrente alternada em contínua.", category: "Condensadora" },
      { id: 51, name: "Capacitores do barramento CC", description: "Armazenam energia e estabilizam a tensão contínua.", category: "Condensadora" },
      { id: 52, name: "Reator ou indutor elétrico", description: "Limita correntes e reduz distorções elétricas.", category: "Condensadora" },
      { id: 53, name: "Dissipador de calor eletrônico", description: "Remove calor dos semicondutores de potência.", category: "Condensadora" },
      { id: 54, name: "Ventilador da placa eletrônica", description: "Auxilia o resfriamento dos componentes eletrônicos.", category: "Condensadora" },
      { id: 55, name: "Sensor NTC da serpentina externa", description: "Mede a temperatura da serpentina para controle e proteções.", category: "Condensadora" },
      { id: 56, name: "Sensor de temperatura de descarga", description: "Monitora a temperatura na saída do compressor.", category: "Condensadora" },
      { id: 57, name: "Sensor de temperatura ambiente externa", description: "Mede a temperatura do ar externo.", category: "Condensadora" },
      { id: 58, name: "Sensor de sucção", description: "Monitora a temperatura na entrada do compressor.", category: "Condensadora" },
      { id: 59, name: "Sensor de corrente", description: "Mede a corrente elétrica para proteção do sistema.", category: "Condensadora" },
      { id: 60, name: "Sensor de tensão", description: "Monitora a tensão elétrica de alimentação.", category: "Condensadora" },
      { id: 61, name: "Fusível elétrico", description: "Interrompe o circuito em condições de sobrecorrente.", category: "Condensadora" },
      { id: 62, name: "Varistor (DPS)", description: "Limita sobretensões transitórias na entrada elétrica.", category: "Condensadora" },
      { id: 63, name: "Relé de comutação", description: "Comuta circuitos auxiliares ou de alimentação.", category: "Condensadora" },
      { id: 64, name: "Bornes de alimentação e interligação", description: "Recebem os cabos elétricos e de comunicação.", category: "Condensadora" },
      { id: 65, name: "Chicote elétrico da condensadora", description: "Interliga placa, sensores, compressor e motores.", category: "Condensadora" },
      { id: 66, name: "Válvulas de serviço", description: "Permitem acesso técnico ao circuito frigorífico.", category: "Condensadora" },
      { id: 67, name: "Conexões flangeadas", description: "Ligam as tubulações frigoríficas à unidade externa.", category: "Condensadora" },
      { id: 68, name: "Tampa das válvulas de serviço", description: "Protege as conexões e os pontos de acesso.", category: "Condensadora" },
      { id: 69, name: "Suportes de fixação ou pés", description: "Permitem instalar a unidade sobre base ou suportes.", category: "Condensadora" },
      { id: 70, name: "Protetores e barreiras elétricas", description: "Reduzem o risco de contato com partes energizadas.", category: "Condensadora" }
    ]
  },
  {
    categoryName: "3. Circuito Frigorífico",
    description: "Circuito que transporta energia térmica por meio da circulação do fluido refrigerante.",
    items: [
      { id: 71, name: "Fluido refrigerante (R-32 / R-410A)", description: "Transporta calor ao evaporar e condensar dentro do circuito.", category: "Frigorífico" },
      { id: 72, name: "Compressor", description: "Eleva a pressão e a temperatura do vapor refrigerante.", category: "Frigorífico" },
      { id: 73, name: "Linha de descarga", description: "Conduz vapor quente de alta pressão para o condensador.", category: "Frigorífico" },
      { id: 74, name: "Condensador", description: "Transfere calor para o ar externo e condensa o refrigerante.", category: "Frigorífico" },
      { id: 75, name: "Linha de líquido", description: "Conduz refrigerante líquido em direção ao dispositivo de expansão.", category: "Frigorífico" },
      { id: 76, name: "Filtro secador", description: "Retém partículas e absorve umidade do refrigerante.", category: "Frigorífico" },
      { id: 77, name: "Visor de líquido", description: "Permite observar o fluxo e condições de umidade.", category: "Frigorífico" },
      { id: 78, name: "Válvula de expansão eletrônica (EEV)", description: "Dosifica o refrigerante para a evaporadora conforme a demanda.", category: "Frigorífico" },
      { id: 79, name: "Motor de passo da EEV", description: "Posiciona a agulha da válvula eletrônica com precisão.", category: "Frigorífico" },
      { id: 80, name: "Agulha e orifício de expansão", description: "Criam a restrição que provoca queda de pressão.", category: "Frigorífico" },
      { id: 81, name: "Tubo capilar", description: "Atua como dispositivo de restrição em projetos específicos.", category: "Frigorífico" },
      { id: 82, name: "Distribuidor de refrigerante", description: "Divide o fluxo entre os circuitos da serpentina.", category: "Frigorífico" },
      { id: 83, name: "Evaporador", description: "Absorve calor do ambiente interno e promove evaporação.", category: "Frigorífico" },
      { id: 84, name: "Linha de sucção", description: "Conduz vapor de baixa pressão de volta ao compressor.", category: "Frigorífico" },
      { id: 85, name: "Válvulas de retenção", description: "Permitem o fluxo em sentido único.", category: "Frigorífico" },
      { id: 86, name: "Válvulas solenoides", description: "Abrem ou bloqueiam trechos do circuito.", category: "Frigorífico" },
      { id: 87, name: "Válvula de quatro vias", description: "Inverte o fluxo para refrigeração ou aquecimento.", category: "Frigorífico" },
      { id: 88, name: "Tubo de equalização", description: "Equilibra pressões em determinados conjuntos.", category: "Frigorífico" },
      { id: 89, name: "Conexões e curvas frigoríficas", description: "Interligam as peças e conduzem o refrigerante.", category: "Frigorífico" },
      { id: 90, name: "Tampas e núcleos de serviço", description: "Vedam os pontos de acesso do circuito.", category: "Frigorífico" },
      { id: 91, name: "Isolamento térmico das tubulações", description: "Evita perdas e condensação na linha fria.", category: "Frigorífico" },
      { id: 92, name: "Óleo lubrificante do compressor", description: "Lubrifica partes móveis e reduz atrito.", category: "Frigorífico" }
    ]
  },
  {
    categoryName: "4. Tubulações e Instalação",
    description: "Elementos de interligação física, elétrica e de drenagem entre as unidades interna e externa.",
    items: [
      { id: 93, name: "Tubo de cobre da linha de sucção", description: "Transporta vapor refrigerante de retorno (com isolamento).", category: "Instalação" },
      { id: 94, name: "Tubo de cobre da linha de líquido", description: "Conduz o refrigerante líquido até a expansão.", category: "Instalação" },
      { id: 95, name: "Isolamento elastomérico", description: "Evita ganhos de calor e condensação nas tubulações frias.", category: "Instalação" },
      { id: 96, name: "Porcas flangeadas", description: "Unem as tubulações às conexões apropriadas.", category: "Instalação" },
      { id: 97, name: "Flanges de cobre", description: "Criam superfícies de vedação nas conexões.", category: "Instalação" },
      { id: 98, name: "Curvas e conexões de cobre", description: "Permitem mudanças de direção na tubulação.", category: "Instalação" },
      { id: 99, name: "Cabo de alimentação elétrica", description: "Fornece energia ao equipamento.", category: "Instalação" },
      { id: 100, name: "Cabo de interligação e comunicação", description: "Transporta sinais de controle entre as unidades.", category: "Instalação" },
      { id: 101, name: "Condutores de aterramento", description: "Conectam partes metálicas ao sistema de proteção.", category: "Instalação" },
      { id: 102, name: "Disjuntor de proteção", description: "Protege contra sobrecorrentes e curtos-circuitos.", category: "Instalação" },
      { id: 103, name: "Dispositivo DR", description: "Proteção adicional contra correntes de fuga.", category: "Instalação" },
      { id: 104, name: "Eletroduto ou canaleta", description: "Protege e organiza os cabos elétricos.", category: "Instalação" },
      { id: 105, name: "Canaleta frigorífica", description: "Acomoda tubulações, cabos e dreno.", category: "Instalação" },
      { id: 106, name: "Abraçadeiras e suportes", description: "Fixam tubulações e cabos.", category: "Instalação" },
      { id: 107, name: "Fita de acabamento", description: "Protege e dá acabamento ao conjunto isolado.", category: "Instalação" },
      { id: 108, name: "Suporte da condensadora", description: "Sustenta a unidade externa na parede ou piso.", category: "Instalação" },
      { id: 109, name: "Coxins antivibração da base", description: "Reduzem vibrações para a estrutura de apoio.", category: "Instalação" },
      { id: 110, name: "Dreno e acessórios", description: "Conduzem a água condensada para local adequado.", category: "Instalação" }
    ]
  },
  {
    categoryName: "5. Sensores e Controle",
    description: "Dispositivos que informam temperaturas e condições para o microcontrolador ajustar capacidade e proteção.",
    items: [
      { id: 111, name: "Sensor NTC de ambiente interno", description: "Informa a temperatura do ar de retorno.", category: "Sensores" },
      { id: 112, name: "Sensor NTC da serpentina interna", description: "Monitora a temperatura do evaporador.", category: "Sensores" },
      { id: 113, name: "Sensor NTC de ambiente externo", description: "Informa a temperatura do ar externo.", category: "Sensores" },
      { id: 114, name: "Sensor NTC da serpentina externa", description: "Monitora a temperatura do condensador.", category: "Sensores" },
      { id: 115, name: "Sensor de descarga do compressor", description: "Detecta temperaturas elevadas na saída do compressor.", category: "Sensores" },
      { id: 116, name: "Sensor de sucção", description: "Monitora temperatura na entrada do compressor.", category: "Sensores" },
      { id: 117, name: "Sensor de corrente", description: "Auxilia no monitoramento da corrente elétrica.", category: "Sensores" },
      { id: 118, name: "Circuito de monitoramento de tensão", description: "Detecta condições de tensão inadequadas.", category: "Sensores" },
      { id: 119, name: "Sensor de rotação (realimentação)", description: "Informa a velocidade de motores eletrônicos.", category: "Sensores" },
      { id: 120, name: "Sensor de posição das aletas", description: "Controla a posição do direcionador de ar.", category: "Sensores" },
      { id: 121, name: "Protetores térmicos", description: "Interrompem a operação diante de condições térmicas limite.", category: "Sensores" },
      { id: 122, name: "Pressostatos de alta/baixa", description: "Atuam em pressões fora dos limites previstos.", category: "Sensores" },
      { id: 123, name: "Proteção térmica do compressor", description: "Protege contra sobreaquecimento interno.", category: "Sensores" },
      { id: 124, name: "Circuito de comunicação", description: "Permite troca de dados entre evaporadora e condensadora.", category: "Sensores" },
      { id: 125, name: "Firmware / Software", description: "Define a lógica de funcionamento e proteções.", category: "Sensores" }
    ]
  },
  {
    categoryName: "6. Eletrônica Inverter",
    description: "Circuitos de potência, conversão e processamento que viabilizam a tecnologia inverter.",
    items: [
      { id: 126, name: "Circuito de entrada de alimentação", description: "Recebe e condiciona a energia elétrica.", category: "Eletrônica" },
      { id: 127, name: "Filtro EMI/RFI", description: "Reduz interferências eletromagnéticas.", category: "Eletrônica" },
      { id: 128, name: "Circuito PFC (Correção Fator Potência)", description: "Melhora o fator de potência e controla corrente.", category: "Eletrônica" },
      { id: 129, name: "Barramento de corrente contínua", description: "Distribui tensão contínua ao inversor.", category: "Eletrônica" },
      { id: 130, name: "Módulo IGBT / MOSFET", description: "Comuta energia para controlar o compressor.", category: "Eletrônica" },
      { id: 131, name: "Driver de acionamento", description: "Comanda os transistores de potência.", category: "Eletrônica" },
      { id: 132, name: "Microcontrolador", description: "Processa sensores e executa lógica de controle.", category: "Eletrônica" },
      { id: 133, name: "Memória eletrônica", description: "Armazena parâmetros de funcionamento.", category: "Eletrônica" },
      { id: 134, name: "Fonte de alimentação auxiliar", description: "Fornece baixas tensões aos circuitos lógicos.", category: "Eletrônica" },
      { id: 135, name: "Circuito de detecção de falhas", description: "Identifica anomalias e interrompe operação se necessário.", category: "Eletrônica" },
      { id: 136, name: "Resistores de descarga", description: "Descarregam capacitores após desenergização.", category: "Eletrônica" },
      { id: 137, name: "Termistores de proteção", description: "Limitam corrente inicial de pico.", category: "Eletrônica" },
      { id: 138, name: "Motor BLDC / PMSM do compressor", description: "Converte energia elétrica em rotação mecânica.", category: "Eletrônica" },
      { id: 139, name: "Motor eletrônico do ventilador", description: "Permite variar velocidade do ventilador.", category: "Eletrônica" }
    ]
  },
  {
    categoryName: "7. Modelos Quente/Frio",
    description: "Componentes adicionais dedicados à inversão de ciclo para aquecimento.",
    items: [
      { id: 140, name: "Válvula reversora (4 vias)", description: "Inverte o sentido do fluxo frigorífico.", category: "Quente/Frio" },
      { id: 141, name: "Bobina solenoide da reversora", description: "Aciona a mudança de posição da válvula.", category: "Quente/Frio" },
      { id: 142, name: "Corpo deslizante interno", description: "Redireciona sucção e descarga.", category: "Quente/Frio" },
      { id: 143, name: "Lógica de degelo (Defrost)", description: "Controla degelo da serpentina externa no aquecimento.", category: "Quente/Frio" },
      { id: 144, name: "Controle de temperatura de descarga", description: "Limita excessos térmicos no aquecimento.", category: "Quente/Frio" },
      { id: 145, name: "Resistência de aquecimento auxiliar", description: "Fornece calor complementar quando aplicável.", category: "Quente/Frio" },
      { id: 146, name: "Bandeja e dreno da condensadora", description: "Escoam água produzida durante o degelo.", category: "Quente/Frio" }
    ]
  },
  {
    categoryName: "8. Manutenção e Serviço",
    description: "Ferramentas de acesso técnico e diagnóstico para o profissional de climatização.",
    items: [
      { id: 147, name: "Válvula Schrader", description: "Permite acesso ao circuito por conexão de serviço.", category: "Manutenção" },
      { id: 148, name: "Núcleo da válvula Schrader", description: "Controla a vedação do ponto de acesso.", category: "Manutenção" },
      { id: 149, name: "Tampa de vedação", description: "Protege o acesso à válvula de serviço.", category: "Manutenção" },
      { id: 150, name: "Porta de serviço", description: "Conecta manómetro e instrumentos de medição.", category: "Manutenção" },
      { id: 151, name: "Terminais de teste da placa", description: "Permitem medições elétricas de diagnóstico.", category: "Manutenção" },
      { id: 152, name: "Códigos de diagnóstico / LEDs", description: "Auxiliam na identificação de falhas.", category: "Manutenção" }
    ]
  }
];