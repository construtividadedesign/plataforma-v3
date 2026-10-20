"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface ThemeToggleProps {
  variant?: "icon" | "sidebar" | "header";
  className?: string;
}

export default function ThemeToggle({ variant = "icon", className = "" }: ThemeToggleProps) {
  const { theme, toggleTheme, isDark } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Placeholder enquanto monta para evitar desvios no SSR
    if (variant === "sidebar") {
      return (
        <div className={`w-full h-10 rounded-xl bg-slate-200/40 dark:bg-white/5 animate-pulse ${className}`} />
      );
    }
    return (
      <div className={`w-9 h-9 rounded-lg bg-slate-200/40 dark:bg-white/5 animate-pulse ${className}`} />
    );
  }

  // Variante para a Barra Lateral (AppSidebar)
  if (variant === "sidebar") {
    return (
      <button
        onClick={toggleTheme}
        type="button"
        aria-label={isDark ? "Alternar para Modo Claro" : "Alternar para Modo Escuro"}
        className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl bg-slate-100/80 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-gray-300 transition-all text-xs font-semibold cursor-pointer shadow-sm group ${className}`}
        title={isDark ? "Mudar para Modo Claro" : "Mudar para Modo Escuro"}
      >
        <div className="flex items-center gap-2.5">
          {isDark ? (
            <Moon className="w-4 h-4 text-amber-400 transition-transform group-hover:-rotate-12" />
          ) : (
            <Sun className="w-4 h-4 text-amber-500 transition-transform group-hover:rotate-45" />
          )}
          <span>{isDark ? "Modo Escuro" : "Modo Claro"}</span>
        </div>
        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-200/80 dark:bg-black/40 text-slate-600 dark:text-gray-400 border border-slate-300/60 dark:border-white/5">
          {isDark ? "Dark" : "Light"}
        </span>
      </button>
    );
  }

  // Variante para Cabeçalhos (DashboardHeader)
  if (variant === "header") {
    return (
      <button
        onClick={toggleTheme}
        type="button"
        aria-label={isDark ? "Alternar para Modo Claro" : "Alternar para Modo Escuro"}
        className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-background/60 hover:bg-background border border-border/60 text-foreground transition-all text-xs font-medium cursor-pointer shadow-sm ${className}`}
        title={isDark ? "Mudar para Modo Claro" : "Mudar para Modo Escuro"}
      >
        {isDark ? (
          <Moon className="w-4 h-4 text-amber-400" />
        ) : (
          <Sun className="w-4 h-4 text-amber-500" />
        )}
        <span className="hidden sm:inline">{isDark ? "Tema Escuro" : "Tema Claro"}</span>
      </button>
    );
  }

  // Variante Ícone Padrão (Compacto para Mobile ou Ações rápidas)
  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={isDark ? "Alternar para Modo Claro" : "Alternar para Modo Escuro"}
      className={`p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-gray-200 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer shadow-sm ${className}`}
      title={isDark ? "Mudar para Modo Claro" : "Mudar para Modo Escuro"}
    >
      {isDark ? (
        <Moon className="w-4 h-4 text-amber-400" />
      ) : (
        <Sun className="w-4 h-4 text-amber-500" />
      )}
    </button>
  );
}
