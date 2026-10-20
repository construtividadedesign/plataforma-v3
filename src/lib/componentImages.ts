export const STORAGE_KEY_CUSTOM_IMAGES = "plataforma_v3_custom_component_images";
export const LEGACY_STORAGE_KEY = "hvac_custom_component_images";

export function loadCustomComponentImages(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw =
      localStorage.getItem(STORAGE_KEY_CUSTOM_IMAGES) ||
      localStorage.getItem(LEGACY_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveCustomComponentImage(
  componentKey: string,
  imageSource: string
): Record<string, string> {
  if (typeof window === "undefined") return {};
  const current = loadCustomComponentImages();
  const updated = { ...current, [componentKey]: imageSource };
  try {
    localStorage.setItem(STORAGE_KEY_CUSTOM_IMAGES, JSON.stringify(updated));
    localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Erro ao salvar imagem no armazenamento local:", e);
  }
  return updated;
}

export function removeCustomComponentImage(componentKey: string): Record<string, string> {
  if (typeof window === "undefined") return {};
  const current = loadCustomComponentImages();
  delete current[componentKey];
  try {
    localStorage.setItem(STORAGE_KEY_CUSTOM_IMAGES, JSON.stringify(current));
    localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(current));
  } catch (e) {
    console.error("Erro ao remover imagem:", e);
  }
  return { ...current };
}

export function compressImageFileToDataUrl(
  file: File,
  maxWidth = 900,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Falha ao criar contexto 2D"));
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/webp", quality));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Catálogo Curado de Fotografias Reais de Equipamentos e Componentes de Climatização (HVAC-R)
 * URLs públicas de alta estabilidade e resolução
 */
export const HVAC_STOCK_IMAGES = {
  // Evaporadoras e Unidade Interna
  evaporadora_unit: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80",
  evaporadora_front: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80",
  
  // Condensadoras e Unidade Externa
  condensadora_unit: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80",
  
  // Compressores e Motores
  compressor_inverter: "https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=800&q=80",
  motor_eletrico: "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?auto=format&fit=crop&w=800&q=80",
  
  // Tubulações, Cobre e Conexões
  tubulacao_cobre: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&w=800&q=80",
  conexoes_flanges: "https://images.unsplash.com/photo-1581092583537-20d51b4b4f1b?auto=format&fit=crop&w=800&q=80",
  
  // Placas Eletrônicas e Eletrônica Inverter
  placa_inverter: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
  microcontrolador_ipm: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80",
  capacitores_circuito: "https://images.unsplash.com/photo-1597733336794-12d05021d510?auto=format&fit=crop&w=800&q=80",
  
  // Fiação Elétrica, Disjuntores e Bornes
  eletrica_disjuntor: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
  chicote_cabos: "https://images.unsplash.com/photo-1581092446327-9b52bd1570c2?auto=format&fit=crop&w=800&q=80",
  
  // Instrumentos de Medição e Manometria
  manometria_manifold: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
  multimetro_medicao: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
  
  // Ferramental, Serviços e Sensores
  ferramentas_servico: "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80",
  sensores_temperatura: "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&w=800&q=80",
  engenharia_mecanica: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
  valvulas_refrigeracao: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80",
  ventilacao_axial: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80",
  textura_industrial: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80"
};

/**
 * Resolvedor Inteligente de Imagens Reais para Componentes de Climatização
 */
export function getComponentRealImage(
  component: {
    id?: string | number;
    name: string;
    category?: string;
    imageUrl?: string;
  },
  customImagesMap?: Record<string, string>
): string {
  const compIdStr = component.id !== undefined ? String(component.id) : "";
  const compName = component.name || "";
  const compNameLower = compName.toLowerCase();
  const catLower = (component.category || "").toLowerCase();

  // Prioridade 1: Imagem personalizada enviada pelo professor (por ID ou Nome)
  if (customImagesMap) {
    if (compIdStr && customImagesMap[compIdStr]) {
      return customImagesMap[compIdStr];
    }
    if (compName && customImagesMap[compName]) {
      return customImagesMap[compName];
    }
  }

  // Prioridade 2: Imagem preenchida no objeto do componente
  if (component.imageUrl && component.imageUrl.trim() !== "") {
    return component.imageUrl;
  }

  // Prioridade 3: Mapeamento inteligente por palavras-chave e categorias

  // 1. Compressores e conjunto hermético
  if (
    compNameLower.includes("compressor") ||
    compNameLower.includes("acumulador de sucção") ||
    compNameLower.includes("separador de óleo") ||
    compNameLower.includes("reservatório de líquido")
  ) {
    return HVAC_STOCK_IMAGES.compressor_inverter;
  }

  // 2. Válvulas (EEV, Solenoide, Reversora 4 vias, Schrader, Serviço)
  if (
    compNameLower.includes("válvula") ||
    compNameLower.includes("valvula") ||
    compNameLower.includes("schrader") ||
    compNameLower.includes("solenoide") ||
    compNameLower.includes("reversora") ||
    compNameLower.includes("agulha e orifício") ||
    compNameLower.includes("tubo capilar") ||
    compNameLower.includes("pressostato")
  ) {
    return HVAC_STOCK_IMAGES.valvulas_refrigeracao;
  }

  // 3. Eletrônica Inverter, Placas, IPM, Microcontroladores e Fontes
  if (
    compNameLower.includes("ipm") ||
    compNameLower.includes("igbt") ||
    compNameLower.includes("microcontrolador") ||
    compNameLower.includes("ponte retificadora") ||
    compNameLower.includes("memória") ||
    compNameLower.includes("firmware")
  ) {
    return HVAC_STOCK_IMAGES.microcontrolador_ipm;
  }

  if (
    compNameLower.includes("placa eletrônica") ||
    compNameLower.includes("placa eletronica") ||
    compNameLower.includes("filtro emi") ||
    compNameLower.includes("driver") ||
    compNameLower.includes("circuito pfc") ||
    compNameLower.includes("fonte de alimentação") ||
    compNameLower.includes("dissipador")
  ) {
    return HVAC_STOCK_IMAGES.placa_inverter;
  }

  if (
    compNameLower.includes("capacitor") ||
    compNameLower.includes("varistor") ||
    compNameLower.includes("fusível") ||
    compNameLower.includes("fusivel") ||
    compNameLower.includes("reator") ||
    compNameLower.includes("indutor") ||
    compNameLower.includes("resistor") ||
    compNameLower.includes("relé") ||
    compNameLower.includes("rele")
  ) {
    return HVAC_STOCK_IMAGES.capacitores_circuito;
  }

  // 4. Sensores NTC, Sensores de Corrente, Tensão e Temperatura
  if (
    compNameLower.includes("sensor") ||
    compNameLower.includes("ntc") ||
    compNameLower.includes("termistor") ||
    compNameLower.includes("termopar") ||
    compNameLower.includes("protetor térmico") ||
    compNameLower.includes("proteção térmica")
  ) {
    return HVAC_STOCK_IMAGES.sensores_temperatura;
  }

  // 5. Tubos de Cobre, Isolamento Elastomérico e Linhas Frigoríficas
  if (
    compNameLower.includes("tubo") ||
    compNameLower.includes("cobre") ||
    compNameLower.includes("linha de sucção") ||
    compNameLower.includes("linha de líquido") ||
    compNameLower.includes("linha de descarga") ||
    compNameLower.includes("isolamento elastomérico") ||
    compNameLower.includes("isolamento térmico") ||
    compNameLower.includes("canaleta")
  ) {
    return HVAC_STOCK_IMAGES.tubulacao_cobre;
  }

  // 6. Conexões, Porcas Flangeadas, Flanges e Curvas
  if (
    compNameLower.includes("flange") ||
    compNameLower.includes("porca") ||
    compNameLower.includes("conexão") ||
    compNameLower.includes("conexao") ||
    compNameLower.includes("curva") ||
    compNameLower.includes("distribuidor")
  ) {
    return HVAC_STOCK_IMAGES.conexoes_flanges;
  }

  // 7. Manômetro, Manifold, Vácuo e Ferramental de Diagnóstico
  if (
    compNameLower.includes("manômetro") ||
    compNameLower.includes("manometro") ||
    compNameLower.includes("manifold") ||
    compNameLower.includes("porta de serviço") ||
    compNameLower.includes("visor de líquido") ||
    compNameLower.includes("filtro secador")
  ) {
    return HVAC_STOCK_IMAGES.manometria_manifold;
  }

  if (
    compNameLower.includes("multímetro") ||
    compNameLower.includes("multimetro") ||
    compNameLower.includes("terminais de teste") ||
    compNameLower.includes("código") ||
    compNameLower.includes("diagnóstico")
  ) {
    return HVAC_STOCK_IMAGES.multimetro_medicao;
  }

  // 8. Fiação, Bornes, Cabos, Disjuntores e Alimentação
  if (
    compNameLower.includes("cabo") ||
    compNameLower.includes("fio") ||
    compNameLower.includes("borne") ||
    compNameLower.includes("disjuntor") ||
    compNameLower.includes("dr") ||
    compNameLower.includes("eletroduto") ||
    compNameLower.includes("aterramento") ||
    compNameLower.includes("chicote") ||
    compNameLower.includes("conector")
  ) {
    return HVAC_STOCK_IMAGES.eletrica_disjuntor;
  }

  // 9. Turbina, Ventilador Axial, Hélice e Motores de Ventilação
  if (
    compNameLower.includes("turbina") ||
    compNameLower.includes("ventilador") ||
    compNameLower.includes("hélice") ||
    compNameLower.includes("helice") ||
    compNameLower.includes("mancal") ||
    compNameLower.includes("aleta")
  ) {
    return HVAC_STOCK_IMAGES.ventilacao_axial;
  }

  if (compNameLower.includes("motor")) {
    return HVAC_STOCK_IMAGES.motor_eletrico;
  }

  // 10. Serpentinas (Trocadores de Calor)
  if (compNameLower.includes("serpentina") || compNameLower.includes("trocador")) {
    return HVAC_STOCK_IMAGES.textura_industrial;
  }

  // 11. Filtros e Drenagem
  if (
    compNameLower.includes("filtro") ||
    compNameLower.includes("bandeja") ||
    compNameLower.includes("dreno") ||
    compNameLower.includes("mangueira")
  ) {
    return HVAC_STOCK_IMAGES.evaporadora_front;
  }

  // 12. Suportes, Chassi, Gabinetes e Coxins
  if (
    compNameLower.includes("suporte") ||
    compNameLower.includes("gabinete") ||
    compNameLower.includes("chassi") ||
    compNameLower.includes("base") ||
    compNameLower.includes("coxim") ||
    compNameLower.includes("painel") ||
    compNameLower.includes("tampa")
  ) {
    if (catLower.includes("condensadora") || catLower.includes("externa")) {
      return HVAC_STOCK_IMAGES.condensadora_unit;
    }
    return HVAC_STOCK_IMAGES.evaporadora_unit;
  }

  // 13. Agrupamento por Categoria caso o nome não tenha capturado
  if (catLower.includes("evaporadora") || catLower.includes("interna")) {
    return HVAC_STOCK_IMAGES.evaporadora_unit;
  }
  if (catLower.includes("condensadora") || catLower.includes("externa")) {
    return HVAC_STOCK_IMAGES.condensadora_unit;
  }
  if (catLower.includes("frigorífico") || catLower.includes("refrigeração")) {
    return HVAC_STOCK_IMAGES.valvulas_refrigeracao;
  }
  if (catLower.includes("instalação") || catLower.includes("tubula")) {
    return HVAC_STOCK_IMAGES.tubulacao_cobre;
  }
  if (catLower.includes("eletrônica") || catLower.includes("inverter")) {
    return HVAC_STOCK_IMAGES.placa_inverter;
  }
  if (catLower.includes("sensores") || catLower.includes("controle")) {
    return HVAC_STOCK_IMAGES.sensores_temperatura;
  }
  if (catLower.includes("manutenção") || catLower.includes("serviço")) {
    return HVAC_STOCK_IMAGES.ferramentas_servico;
  }

  // Fallback padrão de alta qualidade para HVAC
  return HVAC_STOCK_IMAGES.engenharia_mecanica;
}
