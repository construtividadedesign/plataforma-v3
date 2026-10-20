"use client";

import React from "react";

export function ClimateBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none bg-slate-50 dark:bg-black transition-colors duration-500">
      
      {/* 1. Imagem de Fundo (Opacidade adaptativa: 15% em light, 65% em dark) */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700 opacity-15 dark:opacity-65" 
        style={{
          backgroundImage: "url('/assets/background-climatizacao.png')",
          animation: "climateSlowZoom 25s ease-in-out infinite alternate",
        }}
      />

      {/* 2. Camada de Transparência (Adapta gradiente para proteger o texto) */}
      <div 
        className="absolute inset-0 transition-all duration-700 bg-gradient-to-r from-slate-100/95 via-slate-100/75 to-slate-100/45 dark:from-[#0a0a0f]/95 dark:via-[#0a0a0f]/65 dark:to-[#0a0a0f]/45"
      />

      {/* 3. Efeito Discreto de Profundidade */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_80%_20%,rgba(56,189,248,0.1),transparent_50%)]"
      />

      {/* Estilos Inline para Animações */}
      <style jsx global>{`
        @keyframes climateSlowZoom {
          0% {
            transform: scale(1) translate(0px, 0px);
          }
          100% {
            transform: scale(1.02) translate(-5px, -2px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          div[style*="climateSlowZoom"] {
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>

    </div>
  );
}
