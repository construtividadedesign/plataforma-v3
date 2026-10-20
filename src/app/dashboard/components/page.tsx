"use client";

import { useState, useEffect, useRef } from "react";
import { useTurma } from "@/contexts/TurmaContext";
import { hvacComponentsData, ComponentItem } from "@/data/hvacComponents";
import {
  getComponentRealImage,
  loadCustomComponentImages,
  saveCustomComponentImage,
  removeCustomComponentImage,
  compressImageFileToDataUrl,
  HVAC_STOCK_IMAGES
} from "@/lib/componentImages";
import {
  Search,
  Lock,
  Unlock,
  Cpu,
  Camera,
  Upload,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  Sparkles,
  Trash2,
  Link as LinkIcon,
  Check,
  Eye
} from "lucide-react";
import { toast } from "sonner";

export default function ComponentsPage() {
  const { turmaAtiva, isProfessor } = useTurma();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Estado local para o professor liberar ou bloquear o conteúdo para a turma
  const [isLiberadoTurma, setIsLiberadoTurma] = useState(true);

  // Mapa de imagens customizadas do professor (localStorage)
  const [customImages, setCustomImages] = useState<Record<string, string>>({});

  // Lightbox e Zoom
  const [lightboxItem, setLightboxItem] = useState<ComponentItem | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Modal de Upload/Edição de Foto (Exclusivo Professor)
  const [editingItem, setEditingItem] = useState<ComponentItem | null>(null);
  const [uploadTab, setUploadTab] = useState<"file" | "url" | "presets">("file");
  const [customUrlInput, setCustomUrlInput] = useState("");
  const [pendingPreview, setPendingPreview] = useState<string>("");
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Carrega as imagens customizadas salvas no cliente
  useEffect(() => {
    setCustomImages(loadCustomComponentImages());
  }, []);

  const handleToggleLiberacao = () => {
    if (!isProfessor) {
      toast.error("Ação restrita ao Instrutor.");
      return;
    }
    setIsLiberadoTurma(!isLiberadoTurma);
    if (!isLiberadoTurma) {
      toast.success("Guia de Componentes liberado para a turma!");
    } else {
      toast.info("Guia de Componentes ocultado da turma.");
    }
  };

  // Filtragem dos componentes por nome ou descrição
  const filteredCategories = hvacComponentsData
    .map((cat) => {
      const filteredItems = cat.items.filter((item) => {
        const matchesSearch =
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
      });
      return { ...cat, items: filteredItems };
    })
    .filter((cat) => cat.items.length > 0);

  // Lista linear de itens filtrados para navegação anterior/próximo no Lightbox
  const allFilteredItems = filteredCategories.flatMap((cat) => cat.items);

  // Handlers do Lightbox
  const openLightbox = (item: ComponentItem) => {
    setLightboxItem(item);
    setZoomLevel(1);
  };

  const closeLightbox = () => {
    setLightboxItem(null);
    setZoomLevel(1);
  };

  const handleNextLightbox = () => {
    if (!lightboxItem || allFilteredItems.length === 0) return;
    const currentIndex = allFilteredItems.findIndex((i) => i.id === lightboxItem.id);
    const nextIndex = (currentIndex + 1) % allFilteredItems.length;
    setLightboxItem(allFilteredItems[nextIndex]);
    setZoomLevel(1);
  };

  const handlePrevLightbox = () => {
    if (!lightboxItem || allFilteredItems.length === 0) return;
    const currentIndex = allFilteredItems.findIndex((i) => i.id === lightboxItem.id);
    const prevIndex = (currentIndex - 1 + allFilteredItems.length) % allFilteredItems.length;
    setLightboxItem(allFilteredItems[prevIndex]);
    setZoomLevel(1);
  };

  // Atalhos de teclado no Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxItem) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") handleNextLightbox();
      if (e.key === "ArrowLeft") handlePrevLightbox();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxItem, allFilteredItems]);

  // Handlers do Modal de Upload
  const openEditModal = (item: ComponentItem) => {
    if (!isProfessor) {
      toast.error("Ação restrita ao Instrutor.");
      return;
    }
    setEditingItem(item);
    const existing = customImages[String(item.id)] || customImages[item.name] || "";
    setPendingPreview(existing || getComponentRealImage(item, customImages));
    setCustomUrlInput(existing.startsWith("data:") ? "" : existing);
    setUploadTab("file");
  };

  const closeEditModal = () => {
    setEditingItem(null);
    setPendingPreview("");
    setCustomUrlInput("");
    setIsProcessingFile(false);
  };

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, selecione um arquivo de imagem válido (JPG, PNG, WebP).");
      return;
    }
    setIsProcessingFile(true);
    try {
      const compressedDataUrl = await compressImageFileToDataUrl(file, 900, 0.82);
      setPendingPreview(compressedDataUrl);
      toast.success("Foto comprimida e pronta para aplicar!");
    } catch (err) {
      toast.error("Erro ao processar imagem.");
    } finally {
      setIsProcessingFile(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSaveCustomImage = () => {
    if (!isProfessor) {
      toast.error("Ação restrita ao Instrutor.");
      return;
    }
    if (!editingItem || !pendingPreview) return;
    const updated = saveCustomComponentImage(String(editingItem.id), pendingPreview);
    setCustomImages(updated);
    toast.success(`Foto real do componente #${editingItem.id} atualizada com sucesso!`);
    closeEditModal();
  };

  const handleRestoreDefaultImage = () => {
    if (!isProfessor) {
      toast.error("Ação restrita ao Instrutor.");
      return;
    }
    if (!editingItem) return;
    const updated = removeCustomComponentImage(String(editingItem.id));
    setCustomImages(updated);
    toast.info(`Foto do componente #${editingItem.id} restaurada para o padrão oficial.`);
    closeEditModal();
  };

  // Se for aluno e o professor tiver bloqueado/ocultado a visualização
  if (!isProfessor && !isLiberadoTurma) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-[70vh] p-6 text-center animate-in fade-in duration-700">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4 text-red-500">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Conteúdo em Breve</h2>
        <p className="text-gray-400 max-w-md text-sm leading-relaxed">
          O Guia Técnico de Componentes ainda não foi liberado pelo Instrutor para esta turma. Aguarde a liberação em aula.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      
      {/* Cabeçalho e Controlo do Professor */}
      <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300 mb-3">
            <Cpu className="w-3.5 h-3.5 text-red-500" />
            <span>Material Técnico Oficial • Split Hi-Wall Inverter</span>
            <span className="hidden sm:inline text-gray-600">•</span>
            <span className="hidden sm:inline text-amber-400 font-medium">152 Itens com Fotografia Real</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Guia de Componentes do Sistema</h2>
          <p className="text-gray-300 max-w-3xl text-sm leading-relaxed">
            Consulte a lista completa com fotos reais de alta definição, desde compressores inverter e válvulas EEV até placas eletrônicas, sensores NTC e tubulações.
          </p>
        </div>

        {/* Controlo exclusivo do Professor para Liberar/Bloquear */}
        {isProfessor && (
          <div className="flex flex-col items-end gap-2 shrink-0 w-full md:w-auto">
            <span className="text-xs text-gray-400">Controlo do Instrutor:</span>
            <button
              onClick={handleToggleLiberacao}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border w-full md:w-auto ${
                isLiberadoTurma 
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30" 
                  : "bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30"
              }`}
            >
              {isLiberadoTurma ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              {isLiberadoTurma ? "Liberado para a Turma" : "Bloqueado (Oculto)"}
            </button>
          </div>
        )}
      </div>

      {/* Barra de Pesquisa e Indicadores */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
            <Search className="w-5 h-5" />
          </span>
          <input
            type="text"
            placeholder="Pesquisar por peça (Ex: Compressor, NTC, EEV, Serpentina, Manômetro, Capacitor...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/50 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600/50 focus:border-red-500 transition-all shadow-lg"
          />
        </div>

        {isProfessor && (
          <div className="inline-flex items-center gap-2 px-4 py-3 bg-red-950/20 border border-red-500/20 rounded-xl text-xs text-red-300 shrink-0">
            <Camera className="w-4 h-4 text-red-400" />
            <span>Modo Instrutor: Passe o mouse nas fotos para personalizar</span>
          </div>
        )}
      </div>

      {/* Listagem por Categorias com Imagens Reais */}
      <div className="space-y-8">
        {filteredCategories.map((category, idx) => (
          <div key={idx} className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl">
            <div className="border-b border-white/5 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-xl font-bold text-white">{category.categoryName}</h3>
                <p className="text-sm text-gray-400 mt-1">{category.description}</p>
              </div>
              <span className="text-xs font-mono text-gray-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-md self-start sm:self-auto">
                {category.items.length} itens
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {category.items.map((item) => {
                const imageUrl = getComponentRealImage(item, customImages);
                const hasCustomPhoto = Boolean(
                  customImages[String(item.id)] || customImages[item.name]
                );

                return (
                  <div
                    key={item.id}
                    className="bg-zinc-900/60 border border-white/10 hover:border-red-500/40 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between group shadow-lg hover:shadow-red-950/20"
                  >
                    {/* CONTAINER DA FOTOGRAFIA REAL */}
                    <div className="relative aspect-video w-full bg-zinc-950 overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={item.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src = HVAC_STOCK_IMAGES.evaporadora_unit;
                        }}
                      />

                      {/* Gradiente de Proteção e Leitura */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                      {/* Badges de Identificação */}
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-red-400 border border-red-500/30">
                          #{item.id}
                        </span>
                        {hasCustomPhoto && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-500/90 text-black shadow">
                            <Sparkles className="w-2.5 h-2.5" />
                            Foto do Instrutor
                          </span>
                        )}
                      </div>

                      <div className="absolute top-2.5 right-2.5 z-10">
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-gray-300 border border-white/10 uppercase tracking-wider">
                          {item.category}
                        </span>
                      </div>

                      {/* Ações Rápidas ao passar o mouse */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 p-3">
                        <button
                          onClick={() => openLightbox(item)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-semibold cursor-pointer transition-transform hover:scale-105"
                          title="Ampliar Foto Real"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                          <span>Ver Foto</span>
                        </button>

                        {isProfessor && (
                          <button
                            onClick={() => openEditModal(item)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/90 hover:bg-red-600 text-white text-xs font-semibold cursor-pointer shadow-lg transition-transform hover:scale-105"
                            title="Trocar Foto Real"
                          >
                            <Camera className="w-3.5 h-3.5" />
                            <span>Trocar</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* CONTEÚDO TÉCNICO DO COMPONENTE */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-white font-semibold text-sm mb-1.5 line-clamp-1 group-hover:text-red-400 transition-colors">
                          {item.name}
                        </h4>
                        <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">
                          {item.description}
                        </p>
                      </div>

                      <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-500">
                        <span className="flex items-center gap-1">
                          <ImageIcon className="w-3 h-3 text-red-500/80" />
                          Foto Real
                        </span>
                        <button
                          onClick={() => openLightbox(item)}
                          className="text-red-400 hover:text-red-300 cursor-pointer font-medium inline-flex items-center gap-1"
                        >
                          Detalhes
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* ============================================================ */}
      {/* MODAL LIGHTBOX COM ZOOM E PROJEÇÃO EM TELA CHEIA             */}
      {/* ============================================================ */}
      {lightboxItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="relative w-full max-w-5xl bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
            
            {/* Barra Superior do Lightbox */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-zinc-900/80">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                  #{lightboxItem.id}
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                    {lightboxItem.name}
                  </h3>
                  <p className="text-xs text-gray-400">{lightboxItem.category}</p>
                </div>
              </div>

              {/* Controles de Zoom e Ações */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="hidden sm:flex items-center bg-black/50 border border-white/10 rounded-lg p-1 text-gray-300">
                  <button
                    onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 0.75))}
                    className="p-1.5 hover:text-white rounded hover:bg-white/10 cursor-pointer"
                    title="Diminuir Zoom"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-mono px-2">{Math.round(zoomLevel * 100)}%</span>
                  <button
                    onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 3))}
                    className="p-1.5 hover:text-white rounded hover:bg-white/10 cursor-pointer"
                    title="Aumentar Zoom"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setZoomLevel(1)}
                    className="p-1.5 hover:text-white rounded hover:bg-white/10 cursor-pointer ml-1 border-l border-white/10 pl-2"
                    title="Resetar Zoom"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>

                {isProfessor && (
                  <button
                    onClick={() => {
                      const item = lightboxItem;
                      closeLightbox();
                      openEditModal(item);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600/90 hover:bg-red-600 text-white rounded-lg text-xs font-semibold cursor-pointer shadow transition-all"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Substituir Foto</span>
                  </button>
                )}

                <button
                  onClick={closeLightbox}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Área Central da Imagem com Zoom */}
            <div className="relative flex-1 bg-black/95 flex items-center justify-center p-4 overflow-auto min-h-[300px] sm:min-h-[440px]">
              <img
                src={getComponentRealImage(lightboxItem, customImages)}
                alt={lightboxItem.name}
                style={{ transform: `scale(${zoomLevel})` }}
                className="max-h-[60vh] max-w-full object-contain rounded-lg transition-transform duration-200 select-none shadow-2xl"
                onError={(e) => {
                  e.currentTarget.src = HVAC_STOCK_IMAGES.evaporadora_unit;
                }}
              />

              {/* Botões de Navegação Anterior / Próximo */}
              <button
                onClick={handlePrevLightbox}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/10 backdrop-blur-md cursor-pointer transition-transform hover:scale-110"
                title="Componente Anterior (Seta Esquerda)"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextLightbox}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/10 backdrop-blur-md cursor-pointer transition-transform hover:scale-110"
                title="Próximo Componente (Seta Direita)"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Rodapé com Explicação Técnica Completa */}
            <div className="p-4 sm:p-5 bg-zinc-900 border-t border-white/10">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-red-500/10 text-red-500 shrink-0 mt-0.5">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white text-sm font-semibold mb-1">
                    Descrição Técnica e Função no Sistema
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                    {lightboxItem.description}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL DE UPLOAD / SUBSTITUIÇÃO DE FOTO DO PROFESSOR          */}
      {/* ============================================================ */}
      {editingItem && isProfessor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-xl bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            
            {/* Cabeçalho do Modal de Upload */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-zinc-900">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-red-500" />
                <h3 className="text-base font-bold text-white">
                  Personalizar Foto Real — #{editingItem.id} {editingItem.name}
                </h3>
              </div>
              <button
                onClick={closeEditModal}
                className="text-gray-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              
              {/* Abas: Arquivo / URL / Presets */}
              <div className="flex border-b border-white/10 text-xs font-semibold">
                <button
                  onClick={() => setUploadTab("file")}
                  className={`pb-2.5 px-3 flex items-center gap-1.5 border-b-2 cursor-pointer transition-colors ${
                    uploadTab === "file"
                      ? "border-red-500 text-red-400"
                      : "border-transparent text-gray-400 hover:text-gray-200"
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  Carregar do Computador / Celular
                </button>
                <button
                  onClick={() => setUploadTab("url")}
                  className={`pb-2.5 px-3 flex items-center gap-1.5 border-b-2 cursor-pointer transition-colors ${
                    uploadTab === "url"
                      ? "border-red-500 text-red-400"
                      : "border-transparent text-gray-400 hover:text-gray-200"
                  }`}
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  URL da Imagem
                </button>
                <button
                  onClick={() => setUploadTab("presets")}
                  className={`pb-2.5 px-3 flex items-center gap-1.5 border-b-2 cursor-pointer transition-colors ${
                    uploadTab === "presets"
                      ? "border-red-500 text-red-400"
                      : "border-transparent text-gray-400 hover:text-gray-200"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Biblioteca Técnica
                </button>
              </div>

              {/* Aba 1: Upload com Compressão Canvas */}
              {uploadTab === "file" && (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                    isDragging
                      ? "border-red-500 bg-red-950/20"
                      : "border-white/10 hover:border-white/20 bg-black/30"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileSelect(e.target.files[0]);
                      }
                    }}
                  />
                  <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-medium text-white">
                    {isProcessingFile ? "Otimizando imagem..." : "Arraste e solte a foto aqui"}
                  </p>
                  <p className="text-xs text-gray-400">
                    Ou clique para navegar no seu dispositivo (JPG, PNG, WebP)
                  </p>
                  <span className="text-[11px] text-gray-500 mt-1">
                    ⚡ Compressão automática inteligente em WebP (~40-80 KB)
                  </span>
                </div>
              )}

              {/* Aba 2: Inserção de URL Direta */}
              {uploadTab === "url" && (
                <div className="space-y-3">
                  <label className="text-xs font-medium text-gray-300 block">
                    Cole a URL direta da fotografia (HTTPS):
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://exemplo.com/foto-do-componente.jpg"
                      value={customUrlInput}
                      onChange={(e) => {
                        setCustomUrlInput(e.target.value);
                        setPendingPreview(e.target.value);
                      }}
                      className="flex-1 bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600/50"
                    />
                  </div>
                  <p className="text-[11px] text-gray-500">
                    Dica: Você também pode usar arquivos colocados em <code className="text-red-400">/components/{editingItem.id}.jpg</code>.
                  </p>
                </div>
              )}

              {/* Aba 3: Galeria Técnica Curada */}
              {uploadTab === "presets" && (
                <div className="space-y-2">
                  <p className="text-xs text-gray-400">Escolha uma foto da biblioteca oficial de HVAC:</p>
                  <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1">
                    {Object.entries(HVAC_STOCK_IMAGES).map(([key, url]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          setPendingPreview(url);
                          setCustomUrlInput(url);
                        }}
                        className={`aspect-video rounded-lg overflow-hidden border relative group cursor-pointer ${
                          pendingPreview === url ? "border-red-500 ring-2 ring-red-500/50" : "border-white/10"
                        }`}
                      >
                        <img src={url} alt={key} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors" />
                        {pendingPreview === url && (
                          <div className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Pré-visualização da Imagem */}
              {pendingPreview && (
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <span className="text-xs font-medium text-gray-400 block">Pré-visualização:</span>
                  <div className="relative aspect-video w-full max-h-48 bg-black rounded-xl overflow-hidden border border-white/10 flex items-center justify-center">
                    <img
                      src={pendingPreview}
                      alt="Pré-visualização"
                      className="max-h-full max-w-full object-contain"
                      onError={() => {
                        toast.error("Não foi possível carregar a imagem desta URL.");
                      }}
                    />
                  </div>
                </div>
              )}

            </div>

            {/* Rodapé com Ações */}
            <div className="px-5 py-4 border-t border-white/10 bg-zinc-900 flex items-center justify-between">
              <button
                type="button"
                onClick={handleRestoreDefaultImage}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-400 hover:text-red-400 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
                title="Remover foto personalizada e voltar ao padrão"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Restaurar Padrão
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 text-xs font-semibold text-gray-300 hover:text-white rounded-lg hover:bg-white/5 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveCustomImage}
                  disabled={!pendingPreview || isProcessingFile}
                  className="px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg cursor-pointer shadow-lg shadow-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  Salvar Foto
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
