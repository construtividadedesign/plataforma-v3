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
 * Catálogo Curado de Fotografias Técnicas Reais Oficiais de Climatização (HVAC-R)
 * Armazenadas localmente no projeto em /public/components e /public/systems
 * Zero imagens genéricas de banco externo (sem pessoas, florestas ou fotos aleatórias)
 */
export const HVAC_STOCK_IMAGES: Record<string, string> = {
  serpentina: "/components/serpentina.jpg",
  valvula_expansao: "/components/valvula-expansao.jpg",
  placa_inverter: "/components/placa-inverter.jpg",
  split_hiwall: "/systems/hiwall.jpg",
  split_duto: "/systems/duto.jpg",
  split_cassete: "/systems/cassete.jpg",
  piso_teto: "/systems/pisoteto.jpg",
  multi_split: "/systems/multisplit.png",
  chiller: "/systems/chiller.jpg",
  vrf_vrv: "/systems/vrf.png"
};

/**
 * Resolvedor Inteligente de Imagens Reais para Componentes de Climatização
 * Retorna a URL da fotografia técnica real ou string vazia ("") caso não haja foto fidedigna.
 * Quando retorna "", a interface renderiza o card técnico de engenharia com ícone Lucide.
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

  // Prioridade 3: Mapeamento de fotografias técnicas oficiais salvas localmente
  // Serpentina de evaporadora ou condensadora
  if (compNameLower.includes("serpentina")) {
    return "/components/serpentina.jpg";
  }

  // Válvula de Expansão Eletrônica (EEV)
  if (
    compNameLower.includes("válvula de expansão") ||
    compNameLower.includes("valvula de expansao") ||
    compNameLower.includes("eev")
  ) {
    return "/components/valvula-expansao.jpg";
  }

  // Placa Eletrônica / IPM / PCB Inverter
  if (
    compNameLower.includes("placa eletrônica") ||
    compNameLower.includes("placa eletronica") ||
    compNameLower.includes("placa inverter") ||
    compNameLower.includes("módulo de potência ipm") ||
    compNameLower.includes("modulo de potencia ipm") ||
    compNameLower.includes("ipm")
  ) {
    return "/components/placa-inverter.jpg";
  }

  // Fallback seguro: Retorna vazio para que a UI desenhe o card técnico de engenharia (zero fotos genéricas)
  return "";
}
