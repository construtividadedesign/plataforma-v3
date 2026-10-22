"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { db } from "@/lib/firebase/client";
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot
} from "firebase/firestore";
import {
  Wrench,
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  Printer,
  Search,
  Building2,
  Check,
  X,
  Package,
  Layers
} from "lucide-react";
import { toast } from "sonner";

// ==============================================================================
// 1. REQUISITOS REGULAMENTARES DE INFRAESTRUTURA (ARRAY CANÔNICO)
// ==============================================================================
export const REQUISITOS_INFRAESTRUTURA = [
  "Espaço físico mínimo para 16 alunos + professor (30 m²)",
  "Banheiros Feminino e Masculino",
  "Tomadas com proteção (disjuntores) na tensão 220v",
  "Projetor e tela de projeção",
  "Flip Chart",
  "Lousa",
  "Bancada de apoio para Brasagem",
  "Mesa de apoio para as ferramentas",
  "Cadeiras para os alunos (mínimo 16) + a do professor",
  "Bebedouro com água potável",
  "Mesa para o professor",
  "Acesso à internet",
];

// ==============================================================================
// 2. CATEGORIAS DE ITENS (EXPANSÃO NÃO-DESTRUTIVA)
// ==============================================================================
export const CATEGORIAS_ITENS = [
  // Categorias Expandidas Solicitadas
  "Material de consumo",
  "Ferramentas",
  "EPI",
  "EPC",
  "Equipamentos",
  // Categorias Legadas Preservadas (Regressão Zero)
  "Ferramentas Manuais",
  "Ferramentas Elétricas",
  "Instrumentos de Medição",
  "Tubulação e Conexões",
  "Insumos e Químicos",
  "Segurança e EPI",
  "Outros",
];

export interface ItemInventario {
  id: string;
  nome: string;
  codigo?: string;
  categoria: string;
  kit: string;
  quantidade: number;
  unidade?: string;
  foto?: string;
  avaria?: boolean; // Novo campo opcional (legados são undefined -> tratados como false)
  observacoes?: string;
}

export interface KitData {
  id: string;
  nome: string;
  recursosInfraestrutura: string[]; // Array de requisitos selecionados
  updatedAt?: string;
}

export default function SgtClimaInventory() {
  const [itens, setItens] = useState<ItemInventario[]>([]);
  const [kits, setKits] = useState<Record<string, KitData>>({});
  const [selectedKit, setSelectedKit] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modais
  const [isItemModalOpen, setIsItemModalOpen] = useState<boolean>(false);
  const [isRecursosModalOpen, setIsRecursosModalOpen] = useState<boolean>(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Estado do Item em Edição / Criação
  const [formData, setFormData] = useState<Partial<ItemInventario>>({
    nome: "",
    codigo: "",
    categoria: "Ferramentas",
    kit: "Kit 1",
    quantidade: 1,
    unidade: "UN",
    foto: "",
    avaria: false,
    observacoes: "",
  });

  // Estado dos Recursos de Infraestrutura Selecionados (para o Kit Atual)
  const currentKitId = selectedKit === "all" ? "Kit 1" : selectedKit;
  const selectedRecursos = kits[currentKitId]?.recursosInfraestrutura || [];

  // ============================================================================
  // FALLBACK LOCALSTORAGE (DECLARADO ANTES DO EFEITO)
  // ============================================================================
  const carregarDoCacheLocal = useCallback(() => {
    if (typeof window === "undefined") return;
    const localItens = localStorage.getItem("climaInventory") || localStorage.getItem("sgt_itens_cache");
    const localKits = localStorage.getItem("sgt_kits_cache");
    if (localItens) {
      try {
        const parsed = JSON.parse(localItens) as Record<string, unknown>[];
        // Garante que cada item legado tenha avaria avaliado de forma segura
        const sanitized: ItemInventario[] = parsed.map((item) => ({
          id: String(item.id || `item_${Date.now()}`),
          nome: String(item.nome || "Item sem nome"),
          codigo: item.codigo ? String(item.codigo) : undefined,
          categoria: String(item.categoria || item.cat || "Outros"),
          kit: String(item.kit || "Kit 1"),
          quantidade: Number(item.quantidade) || 1,
          unidade: item.unidade ? String(item.unidade) : "UN",
          foto: item.foto ? String(item.foto) : undefined,
          avaria: Boolean(item.avaria ?? false),
          observacoes: item.observacoes ? String(item.observacoes) : undefined,
        }));
        setItens(sanitized);
      } catch {
        // Fallback silencioso
      }
    }
    if (localKits) {
      try {
        setKits(JSON.parse(localKits));
      } catch {
        // Fallback silencioso
      }
    }
    setIsLoading(false);
  }, []);

  // ============================================================================
  // LEITURA EM TEMPO REAL VIA FIRESTORE (COM FALLBACK EM LOCALSTORAGE)
  // ============================================================================
  useEffect(() => {
    let unsubscribeItens: (() => void) | null = null;
    let unsubscribeKits: (() => void) | null = null;

    try {
      // 1. Escuta Itens do Firestore
      const itensCol = collection(db, "itens");
      unsubscribeItens = onSnapshot(
        itensCol,
        (snapshot) => {
          const fetched: ItemInventario[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            fetched.push({
              id: docSnap.id,
              nome: data.nome || "Sem nome",
              codigo: data.codigo || "",
              categoria: data.categoria || "Outros",
              kit: data.kit || "Kit 1",
              quantidade: Number(data.quantidade) || 1,
              unidade: data.unidade || "UN",
              foto: data.foto || "",
              avaria: Boolean(data.avaria ?? false), // Garante false para legados
              observacoes: data.observacoes || "",
            });
          });
          setItens(fetched);
          setIsLoading(false);
          // Backup local em cache
          if (typeof window !== "undefined") {
            localStorage.setItem("sgt_itens_cache", JSON.stringify(fetched));
          }
        },
        (error) => {
          console.warn("Firestore Itens offline ou em configuração, lendo cache local:", error.message);
          carregarDoCacheLocal();
        }
      );

      // 2. Escuta Kits do Firestore (Recursos e Infraestrutura)
      const kitsCol = collection(db, "kits");
      unsubscribeKits = onSnapshot(
        kitsCol,
        (snapshot) => {
          const kitsMap: Record<string, KitData> = {};
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            kitsMap[docSnap.id] = {
              id: docSnap.id,
              nome: data.nome || docSnap.id,
              recursosInfraestrutura: Array.isArray(data.recursosInfraestrutura)
                ? data.recursosInfraestrutura
                : [],
              updatedAt: data.updatedAt,
            };
          });
          setKits(kitsMap);
          if (typeof window !== "undefined") {
            localStorage.setItem("sgt_kits_cache", JSON.stringify(kitsMap));
          }
        },
        (error) => {
          console.warn("Firestore Kits offline ou em configuração, lendo cache local:", error.message);
        }
      );
    } catch (err) {
      console.warn("Erro ao iniciar listeners do Firebase Firestore:", err);
      setTimeout(() => {
        carregarDoCacheLocal();
      }, 0);
    }

    return () => {
      if (unsubscribeItens) unsubscribeItens();
      if (unsubscribeKits) unsubscribeKits();
    };
  }, [carregarDoCacheLocal]);

  // ============================================================================
  // OPERAÇÕES NO FIRESTORE: SALVAR / ATUALIZAR ITEM COM STATUS DE AVARIA
  // ============================================================================
  const handleOpenAddModal = () => {
    setIsEditing(false);
    setFormData({
      nome: "",
      codigo: "",
      categoria: "Ferramentas",
      kit: selectedKit === "all" ? "Kit 1" : selectedKit,
      quantidade: 1,
      unidade: "UN",
      foto: "",
      avaria: false,
      observacoes: "",
    });
    setIsItemModalOpen(true);
  };

  const handleOpenEditModal = (item: ItemInventario) => {
    setIsEditing(true);
    setFormData({
      id: item.id,
      nome: item.nome,
      codigo: item.codigo,
      categoria: item.categoria,
      kit: item.kit,
      quantidade: item.quantidade,
      unidade: item.unidade,
      foto: item.foto,
      avaria: Boolean(item.avaria ?? false), // Garante false se ausente
      observacoes: item.observacoes,
    });
    setIsItemModalOpen(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome?.trim()) {
      toast.error("Informe o nome do item.");
      return;
    }

    const payload = {
      nome: formData.nome.trim(),
      codigo: formData.codigo?.trim() || "",
      categoria: formData.categoria || "Ferramentas",
      kit: formData.kit || "Kit 1",
      quantidade: Number(formData.quantidade) || 1,
      unidade: formData.unidade || "UN",
      foto: formData.foto || "",
      avaria: Boolean(formData.avaria ?? false), // Grava estritamente como boolean no Firestore
      observacoes: formData.observacoes?.trim() || "",
      updatedAt: new Date().toISOString(),
    };

    try {
      if (isEditing && formData.id) {
        // ATUALIZAÇÃO VIA SDK DO FIREBASE: updateDoc
        const itemDocRef = doc(db, "itens", formData.id);
        await updateDoc(itemDocRef, payload);
        toast.success("Item atualizado no Firestore com sucesso!");
      } else {
        // NOVO ITEM VIA SDK DO FIREBASE: setDoc com novo ID
        const newId = `item_${Date.now()}`;
        const itemDocRef = doc(db, "itens", newId);
        await setDoc(itemDocRef, { id: newId, ...payload });
        toast.success("Novo item cadastrado no Firestore!");
      }

      setIsItemModalOpen(false);
    } catch (err: unknown) {
      console.warn("Fallback para atualização local em caso de falha de conexão Firestore:", (err as Error).message);
      // Fallback local se estiver offline
      const id = formData.id || `item_${Date.now()}`;
      const updatedList = isEditing
        ? itens.map((i) => (i.id === id ? ({ ...i, ...payload, id } as ItemInventario) : i))
        : [...itens, { ...payload, id } as ItemInventario];

      setItens(updatedList);
      if (typeof window !== "undefined") {
        localStorage.setItem("sgt_itens_cache", JSON.stringify(updatedList));
      }
      setIsItemModalOpen(false);
      toast.success(isEditing ? "Item atualizado localmente." : "Item adicionado localmente.");
    }
  };

  const handleDeleteItem = async (item: ItemInventario) => {
    if (!confirm(`Deseja realmente excluir "${item.nome}"?`)) return;
    try {
      await deleteDoc(doc(db, "itens", item.id));
      toast.success("Item removido do Firestore.");
    } catch {
      const updated = itens.filter((i) => i.id !== item.id);
      setItens(updated);
      toast.info("Item removido localmente.");
    }
  };

  // ============================================================================
  // OPERAÇÕES NO FIRESTORE: SUBMISSÃO DE RECURSOS E INFRAESTRUTURA DO KIT
  // ============================================================================
  const handleToggleRecurso = (recurso: string) => {
    const kitId = currentKitId;
    const current = kits[kitId]?.recursosInfraestrutura || [];
    const exists = current.includes(recurso);
    const updated = exists ? current.filter((r) => r !== recurso) : [...current, recurso];

    setKits((prev) => ({
      ...prev,
      [kitId]: {
        id: kitId,
        nome: kitId,
        recursosInfraestrutura: updated,
      },
    }));
  };

  const handleSelectAllRecursos = () => {
    const kitId = currentKitId;
    setKits((prev) => ({
      ...prev,
      [kitId]: {
        id: kitId,
        nome: kitId,
        recursosInfraestrutura: [...REQUISITOS_INFRAESTRUTURA],
      },
    }));
  };

  const handleClearAllRecursos = () => {
    const kitId = currentKitId;
    setKits((prev) => ({
      ...prev,
      [kitId]: {
        id: kitId,
        nome: kitId,
        recursosInfraestrutura: [],
      },
    }));
  };

  const handleSaveRecursosKit = async () => {
    const kitId = currentKitId;
    const lista = kits[kitId]?.recursosInfraestrutura || [];

    try {
      // Submissão no Firebase Firestore: grava array de infraestrutura no doc do Kit
      const kitDocRef = doc(db, "kits", kitId);
      await setDoc(
        kitDocRef,
        {
          id: kitId,
          nome: kitId,
          recursosInfraestrutura: lista, // Array persistido no documento do Kit
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
      toast.success(`Checklist de Infraestrutura do ${kitId} salvo no Firestore!`);
      setIsRecursosModalOpen(false);
    } catch (err: unknown) {
      console.warn("Salvando recursos localmente por fallback:", (err as Error).message);
      if (typeof window !== "undefined") {
        localStorage.setItem("sgt_kits_cache", JSON.stringify(kits));
      }
      toast.info("Recursos salvos localmente.");
      setIsRecursosModalOpen(false);
    }
  };

  // ============================================================================
  // FILTRAGEM DE ITENS
  // ============================================================================
  const filteredItens = itens.filter((item) => {
    const matchKit = selectedKit === "all" || item.kit === selectedKit;
    const matchCat = selectedCategory === "all" || item.categoria === selectedCategory;
    const matchSearch =
      item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.codigo || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.observacoes || "").toLowerCase().includes(searchTerm.toLowerCase());
    return matchKit && matchCat && matchSearch;
  });

  const totalAvarias = itens.filter((i) => Boolean(i.avaria ?? false)).length;

  return (
    <div className="space-y-6">
      {/* ====================================================================== */}
      {/* PAINEL SUPERIOR: RESUMO, CONFORMIDADE E BOTÕES PRINCIPAIS */}
      {/* ====================================================================== */}
      <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Package className="w-6 h-6 text-red-500" />
              Gestão de Kits, Ferramentas e Recursos (SGT Clima)
            </h1>
          </div>
          <p className="text-sm text-gray-300">
            Controle de inventário, status de avaria e checklist de infraestrutura técnica.
          </p>

          {/* Pílulas de Status e Conformidade em Tempo Real */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {/* Pílula de Infraestrutura Dinâmica */}
            <button
              onClick={() => setIsRecursosModalOpen(true)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-600/20 border border-red-500/30 text-xs font-semibold text-red-400 hover:bg-red-600/30 transition-all cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-red-400" />
              <span>
                🏢 Infraestrutura ({currentKitId}): {selectedRecursos.length}/
                {REQUISITOS_INFRAESTRUTURA.length} Conforme
              </span>
            </button>

            {/* Pílula de Avarias */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-400">
              <AlertTriangle className="w-4 h-4" />
              <span>{totalAvarias} Itens em Avaria</span>
            </span>

            {/* Total de Itens */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-gray-300">
              <Layers className="w-4 h-4 text-gray-400" />
              <span>Total: {itens.length} itens</span>
            </span>
          </div>
        </div>

        {/* Ações do Topo */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setIsRecursosModalOpen(true)}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium border border-white/10 transition-colors"
          >
            <Building2 className="w-4 h-4 text-cyan-400" />
            Recursos e Infraestrutura
          </button>

          <button
            onClick={() => setIsPrintModalOpen(true)}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium border border-white/10 transition-colors"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            Imprimir A4
          </button>

          <button
            onClick={handleOpenAddModal}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium shadow-lg shadow-red-900/30 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Novo Item
          </button>
        </div>
      </div>

      {/* ====================================================================== */}
      {/* FILTROS E PESQUISA */}
      {/* ====================================================================== */}
      <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nome, código ou especificação..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {/* Seletor de Kit */}
          <select
            value={selectedKit}
            onChange={(e) => setSelectedKit(e.target.value)}
            className="px-3 py-2 bg-zinc-900 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-red-500"
          >
            <option value="all">Todos os Kits</option>
            <option value="Kit 1">Kit 1 (Equipe 1)</option>
            <option value="Kit 2">Kit 2 (Equipe 2)</option>
            <option value="Kit 3">Kit 3 (Equipe 3)</option>
            <option value="Kit 4">Kit 4 (Equipe 4)</option>
            <option value="Bancada Comum">Bancada Comum</option>
          </select>

          {/* Seletor de Categoria com Expansão Não-Destrutiva */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-zinc-900 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-red-500"
          >
            <option value="all">Todas as Categorias</option>
            {CATEGORIAS_ITENS.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ====================================================================== */}
      {/* GRID DE CARDS COM TARJA CONDICIONAL DE AVARIA */}
      {/* ====================================================================== */}
      {isLoading ? (
        <div className="p-12 text-center text-gray-400">
          <Package className="w-8 h-8 animate-bounce mx-auto mb-2 text-red-500" />
          Sincronizando inventário com o Firebase Firestore...
        </div>
      ) : filteredItens.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-white/10 rounded-2xl bg-white/5">
          <Package className="w-12 h-12 mx-auto mb-3 text-gray-500" />
          <h3 className="text-lg font-semibold text-white">Nenhum item localizado</h3>
          <p className="text-sm text-gray-400 mt-1">
            Altere os filtros acima ou cadastre um novo item no formulário.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredItens.map((item) => {
            // REGRA ABSOLUTA DE SEGURANÇA: trata ausência da chave 'avaria' como false
            const isAvariado = Boolean(item.avaria ?? false);

            return (
              <div
                key={item.id}
                className={`group relative bg-black/40 backdrop-blur-md rounded-xl overflow-hidden border transition-all duration-300 flex flex-col justify-between ${
                  isAvariado
                    ? "border-red-600/60 shadow-lg shadow-red-950/40"
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                {/* ÁREA DA IMAGEM COM A TARJA DIAGONAL CONDICIONAL DE AVARIA */}
                <div className="relative w-full h-44 bg-zinc-950/80 flex items-center justify-center overflow-hidden border-b border-white/5">
                  {/* Tarja diagonal de AVARIA (CSS absoluto + transform rotate) */}
                  {isAvariado && (
                    <div className="absolute top-4 -left-10 w-36 py-1 bg-red-600 text-white text-[11px] font-black tracking-widest text-center shadow-2xl -rotate-45 uppercase pointer-events-none z-20 border-y border-white/30">
                      AVARIA
                    </div>
                  )}

                  {/* Foto do Item ou Fallback Técnico */}
                  {item.foto ? (
                    item.foto.startsWith("http") || item.foto.startsWith("/") ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={item.foto}
                          alt={item.nome}
                          fill
                          unoptimized
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      /* Fallback para Base64 */
                      <div
                        className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                        style={{ backgroundImage: `url(${item.foto})` }}
                      />
                    )
                  ) : (
                    <div className="flex flex-col items-center justify-center text-zinc-600 p-4 text-center">
                      <Wrench className="w-10 h-10 mb-1 opacity-40 text-red-400" />
                      <span className="text-xs">Foto Técnica Padrão</span>
                    </div>
                  )}

                  {/* Badges Flutuantes sobre a Imagem */}
                  <div className="absolute top-2 right-2 flex flex-col gap-1 items-end z-10">
                    <span className="px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-medium text-white">
                      {item.kit}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-zinc-800/80 backdrop-blur-md border border-white/10 text-[10px] font-medium text-gray-300">
                      {item.categoria}
                    </span>
                  </div>
                </div>

                {/* CONTEÚDO E INFORMAÇÕES DO ITEM */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-white text-base leading-snug line-clamp-2">
                        {item.nome}
                      </h3>
                    </div>
                    {item.codigo && (
                      <p className="text-xs text-gray-400 font-mono mt-0.5">Cód: {item.codigo}</p>
                    )}
                    {item.observacoes && (
                      <p className="text-xs text-gray-400 mt-2 line-clamp-2 italic">
                        &ldquo;{item.observacoes}&rdquo;
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-gray-400 block">Qtd. no Kit</span>
                      <span className="text-sm font-bold text-white">
                        {item.quantidade} {item.unidade || "UN"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditModal(item)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                        title="Editar Item e Avaria"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ====================================================================== */}
      {/* MODAL 1: EDITAR / ADICIONAR ITEM (COM TOGGLE DE AVARIA E CATEGORIAS) */}
      {/* ====================================================================== */}
      {isItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-red-500" />
                {isEditing ? "Editar Item" : "Novo Cadastro de Item"}
              </h2>
              <button
                onClick={() => setIsItemModalOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">
                  Nome do Item / Ferramenta *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nome || ""}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Ex: Manifold Digital 2 Vias, Bomba de Vácuo 7 CFM..."
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">
                    Código / Tombamento
                  </label>
                  <input
                    type="text"
                    value={formData.codigo || ""}
                    onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                    placeholder="Ex: FER-042"
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">
                    Kit de Destino
                  </label>
                  <select
                    value={formData.kit || "Kit 1"}
                    onChange={(e) => setFormData({ ...formData, kit: e.target.value })}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="Kit 1">Kit 1 (Equipe 1)</option>
                    <option value="Kit 2">Kit 2 (Equipe 2)</option>
                    <option value="Kit 3">Kit 3 (Equipe 3)</option>
                    <option value="Kit 4">Kit 4 (Equipe 4)</option>
                    <option value="Bancada Comum">Bancada Comum</option>
                  </select>
                </div>
              </div>

              {/* EXPANSÃO NÃO-DESTRUTIVA DE CATEGORIAS NO FORMULÁRIO */}
              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">
                  Categoria Principal *
                </label>
                <select
                  value={formData.categoria || "Ferramentas"}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-red-500"
                >
                  {CATEGORIAS_ITENS.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">
                    Quantidade
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.quantidade ?? 1}
                    onChange={(e) => setFormData({ ...formData, quantidade: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">Unidade</label>
                  <input
                    type="text"
                    value={formData.unidade || "UN"}
                    onChange={(e) => setFormData({ ...formData, unidade: e.target.value })}
                    placeholder="UN, JG, MT, KG..."
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">
                  URL da Foto (ou imagem em base64)
                </label>
                <input
                  type="text"
                  value={formData.foto || ""}
                  onChange={(e) => setFormData({ ...formData, foto: e.target.value })}
                  placeholder="https://... ou caminho local da foto"
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-red-500"
                />
              </div>

              {/* ================================================================ */}
              {/* SISTEMA DE AVARIA: TOGGLE SWITCH ESTILIZADO */}
              {/* ================================================================ */}
              <div className="p-3.5 bg-red-950/20 border border-red-500/30 rounded-xl flex items-center justify-between">
                <div className="space-y-0.5">
                  <label
                    htmlFor="toggle-avaria"
                    className="text-sm font-semibold text-white cursor-pointer flex items-center gap-2"
                  >
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    Marcar Item com Avaria
                  </label>
                  <p className="text-xs text-gray-400">
                    Aplica a tarja diagonal vermelha de AVARIA e alerta a equipe técnica.
                  </p>
                </div>
                <input
                  id="toggle-avaria"
                  type="checkbox"
                  checked={Boolean(formData.avaria ?? false)}
                  onChange={(e) => setFormData({ ...formData, avaria: e.target.checked })}
                  className="w-5 h-5 accent-red-600 rounded cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">
                  Observações Técnicas
                </label>
                <textarea
                  rows={2}
                  value={formData.observacoes || ""}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  placeholder="Ex: Mangueira de 1/4 com leve desgaste no engate..."
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsItemModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-gray-300 text-sm font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium shadow-lg shadow-red-900/30 transition-colors"
                >
                  Salvar no Firestore
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* MODAL 2: CHECKLIST INTELIGENTE DE RECURSOS E INFRAESTRUTURA (FIRESTORE) */}
      {/* ====================================================================== */}
      {isRecursosModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-red-500" />
                  Recursos e Infraestrutura da Oficina / {currentKitId}
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Marque os requisitos de ambiente atendidos para salvar no documento do Kit no
                  Firestore.
                </p>
              </div>
              <button
                onClick={() => setIsRecursosModalOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Ações Rápidas de Seleção */}
            <div className="flex items-center justify-between py-3 border-b border-white/5">
              <span className="text-xs font-semibold text-gray-300">
                Selecionados: {selectedRecursos.length} de {REQUISITOS_INFRAESTRUTURA.length}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSelectAllRecursos}
                  className="text-xs text-cyan-400 hover:underline cursor-pointer"
                >
                  Marcar Todos
                </button>
                <span className="text-gray-600">|</span>
                <button
                  type="button"
                  onClick={handleClearAllRecursos}
                  className="text-xs text-gray-400 hover:text-red-400 cursor-pointer"
                >
                  Desmarcar Todos
                </button>
              </div>
            </div>

            {/* LISTA DE CHECKBOXES BASEADA NO ARRAY CANÔNICO DE 12 REQUISITOS */}
            <div className="mt-4 space-y-2.5">
              {REQUISITOS_INFRAESTRUTURA.map((req, idx) => {
                const isChecked = selectedRecursos.includes(req);
                return (
                  <label
                    key={req}
                    className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                      isChecked
                        ? "bg-red-950/20 border-red-500/40 text-white"
                        : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleRecurso(req)}
                      className="mt-0.5 w-4 h-4 accent-red-600 rounded cursor-pointer"
                    />
                    <div className="flex-1 text-sm">
                      <span className="font-medium">
                        {idx + 1}. {req}
                      </span>
                    </div>
                    {isChecked && <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
                  </label>
                );
              })}
            </div>

            <div className="flex justify-end gap-2 pt-4 mt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsRecursosModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-gray-300 text-sm font-medium transition-colors"
              >
                Fechar
              </button>
              <button
                type="button"
                onClick={handleSaveRecursosKit}
                className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium shadow-lg shadow-red-900/30 transition-colors"
              >
                Salvar Checklist no Kit (Firestore)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* MODAL 3: IMPRESSÃO OTIMIZADA PARA A4 (CHECKLIST FÍSICO COM INFRAESTRUTURA) */}
      {/* ====================================================================== */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white text-zinc-900 rounded-2xl w-full max-w-4xl p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto">
            {/* Barra de Ações do Modal de Impressão */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-200 print:hidden">
              <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                <Printer className="w-5 h-5 text-red-600" />
                Pré-Visualização do Checklist Físico (A4)
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold flex items-center gap-1.5 shadow"
                >
                  <Printer className="w-4 h-4" />
                  Imprimir Folha A4
                </button>
                <button
                  onClick={() => setIsPrintModalOpen(false)}
                  className="px-3 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-sm font-medium"
                >
                  Fechar
                </button>
              </div>
            </div>

            {/* FOLHA A4 FÍSICA RENDERIZADA */}
            <div className="mt-6 space-y-6 text-xs text-zinc-800 font-sans">
              {/* Cabeçalho Oficial */}
              <div className="border-b-2 border-red-600 pb-3 flex justify-between items-center">
                <div>
                  <h1 className="text-xl font-black text-red-700 tracking-tight">
                    SGT CLIMA - PLATAFORMA TÉCNICA DE CLIMATIZAÇÃO
                  </h1>
                  <p className="text-xs text-zinc-600">
                    Ficha de Inspeção Técnica, Inventário de Ferramental e Infraestrutura da Oficina
                  </p>
                </div>
                <div className="text-right text-[11px] text-zinc-500">
                  <p>Data: {new Date().toLocaleDateString("pt-BR")}</p>
                  <p>Destino: {currentKitId}</p>
                </div>
              </div>

              {/* SEÇÃO 1: RECURSOS E INFRAESTRUTURA DINÂMICOS DO KIT */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold bg-zinc-100 p-2 border-l-4 border-red-600 text-zinc-900 uppercase">
                  1. Recursos e Infraestrutura da Oficina Técnica ({currentKitId})
                </h3>
                <div className="grid grid-cols-2 gap-2 border border-zinc-200 rounded p-3">
                  {REQUISITOS_INFRAESTRUTURA.map((req, i) => {
                    const conforme = selectedRecursos.includes(req);
                    return (
                      <div key={req} className="flex items-center gap-2 text-[11px]">
                        <span
                          className={`font-mono font-bold ${
                            conforme ? "text-emerald-700" : "text-zinc-400"
                          }`}
                        >
                          {conforme ? "[X]" : "[ ]"}
                        </span>
                        <span className={conforme ? "font-medium text-zinc-900" : "text-zinc-500"}>
                          {i + 1}. {req}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SEÇÃO 2: TABELA DE ITENS COM IDENTIFICAÇÃO DE AVARIA */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold bg-zinc-100 p-2 border-l-4 border-red-600 text-zinc-900 uppercase">
                  2. Inventário de Materiais e Ferramentas ({filteredItens.length} itens)
                </h3>
                <table className="w-full text-left border-collapse border border-zinc-200">
                  <thead>
                    <tr className="bg-zinc-100 text-[10px] uppercase text-zinc-700">
                      <th className="border border-zinc-200 p-1.5 w-12 text-center">Item</th>
                      <th className="border border-zinc-200 p-1.5">Descrição do Item / Ferramenta</th>
                      <th className="border border-zinc-200 p-1.5 w-28">Categoria</th>
                      <th className="border border-zinc-200 p-1.5 w-16 text-center">Qtd</th>
                      <th className="border border-zinc-200 p-1.5 w-24 text-center">Condição</th>
                      <th className="border border-zinc-200 p-1.5 w-24 text-center">Visto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItens.map((item, index) => {
                      const avaria = Boolean(item.avaria ?? false);
                      return (
                        <tr
                          key={item.id}
                          className={avaria ? "bg-red-50 text-red-900 font-semibold" : ""}
                        >
                          <td className="border border-zinc-200 p-1 text-center">{index + 1}</td>
                          <td className="border border-zinc-200 p-1">
                            {item.nome}
                            {item.codigo && (
                              <span className="text-[10px] text-zinc-500 block">
                                Cód: {item.codigo}
                              </span>
                            )}
                          </td>
                          <td className="border border-zinc-200 p-1 text-[10px]">{item.categoria}</td>
                          <td className="border border-zinc-200 p-1 text-center font-bold">
                            {item.quantidade} {item.unidade || "UN"}
                          </td>
                          <td className="border border-zinc-200 p-1 text-center text-[10px]">
                            {avaria ? (
                              <span className="text-red-700 font-bold uppercase">AVARIA</span>
                            ) : (
                              <span className="text-emerald-700">Conforme</span>
                            )}
                          </td>
                          <td className="border border-zinc-200 p-1 text-center">[ &nbsp; &nbsp; ]</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* SEÇÃO 3: CAMPOS DE ASSINATURA E VALIDAÇÃO TÉCNICA */}
              <div className="grid grid-cols-2 gap-8 pt-8 border-t border-zinc-300">
                <div className="text-center">
                  <div className="border-t border-zinc-400 pt-1 text-[11px] font-semibold text-zinc-700">
                    Assinatura do Instrutor Técnico
                  </div>
                  <span className="text-[10px] text-zinc-500">Responsável pelo Laboratório</span>
                </div>
                <div className="text-center">
                  <div className="border-t border-zinc-400 pt-1 text-[11px] font-semibold text-zinc-700">
                    Líder da Equipe / Aluno
                  </div>
                  <span className="text-[10px] text-zinc-500">Conferência na Entrega / Devolução</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
