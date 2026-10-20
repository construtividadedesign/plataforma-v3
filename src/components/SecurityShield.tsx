"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";

/**
 * Escudo de Blindagem de Propriedade Intelectual e Anti-Inspeção
 * Protege apostilas, exames, códigos de diagnóstico e dados autorais contra cópia não autorizada.
 */
export default function SecurityShield() {
  const lastToastTimeRef = useRef<number>(0);

  useEffect(() => {
    // Atua em ambiente de produção para blindagem
    const isProduction = process.env.NODE_ENV === "production";

    // 1. Blindagem de Console em Produção (impede vazamento de objetos/estados)
    if (isProduction && typeof window !== "undefined") {
      try {
        const noop = () => {};
        console.log = noop;
        console.debug = noop;
        console.info = noop;
      } catch {
        // Fallback silencioso
      }
    }

    const notifyProtectedAction = (message: string) => {
      const now = Date.now();
      // Rate-limit de 3 segundos para evitar spam de alertas
      if (now - lastToastTimeRef.current > 3000) {
        lastToastTimeRef.current = now;
        toast.info(message, {
          duration: 2500,
        });
      }
    };

    // 2. Proteção de Clique com Botão Direito (Context Menu)
    const handleContextMenu = (e: MouseEvent) => {
      if (!isProduction) return;

      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Permite o menu de contexto em campos de formulário para não prejudicar digitação/colagem do aluno
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable ||
        target.closest("input, textarea, select, [contenteditable='true']");

      if (isInput) return;

      // Bloqueia em áreas de conteúdo didático, tabelas, diagramas e apostilas
      e.preventDefault();
      notifyProtectedAction("Material didático e técnico protegido por direitos intelectuais.");
    };

    // 3. Bloqueio de Atalhos Comuns de Inspeção e Extração de Código
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isProduction) return;

      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      // Atalhos comuns de DevTools e View Source
      // F12
      const isF12 = e.key === "F12" || e.keyCode === 123;
      // Ctrl+Shift+I / Cmd+Option+I (Inspecionar)
      const isInspect =
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        (e.key === "I" || e.key === "i" || e.keyCode === 73);
      // Ctrl+Shift+J / Cmd+Option+J (Console)
      const isConsole =
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        (e.key === "J" || e.key === "j" || e.keyCode === 74);
      // Ctrl+Shift+C / Cmd+Option+C (Inspecionar Elemento)
      const isInspectElement =
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        (e.key === "C" || e.key === "c" || e.keyCode === 67);
      // Ctrl+U / Cmd+U (Ver Código-Fonte)
      const isViewSource =
        (e.ctrlKey || e.metaKey) &&
        !e.shiftKey &&
        (e.key === "u" || e.key === "U" || e.keyCode === 85);
      // Ctrl+S / Cmd+S (Salvar Página HTML Completa)
      const isSavePage =
        (e.ctrlKey || e.metaKey) &&
        !e.shiftKey &&
        (e.key === "s" || e.key === "S" || e.keyCode === 83) &&
        !isInput;

      if (isF12 || isInspect || isConsole || isInspectElement || isViewSource || isSavePage) {
        e.preventDefault();
        e.stopPropagation();
        notifyProtectedAction("Acesso direto ao código-fonte restrito em ambiente de produção.");
      }
    };

    window.addEventListener("contextmenu", handleContextMenu, { capture: true });
    window.addEventListener("keydown", handleKeyDown, { capture: true });

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu, { capture: true });
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
    };
  }, []);

  return null;
}
