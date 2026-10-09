"use client";

import React from "react";

export function ClimateBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none bg-black">
      
      {/* 1. Imagem de Fundo (Mais Nítida: Opacidade aumentada para 65%) */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 opacity-65" 
        style={{
          backgroundImage: "url('/assets/background-climatizacao.png')",
          animation: "climateSlowZoom 25s ease-in-out infinite alternate",
        }}
      />

      {/* 2. Camada de Transparência (Mais leve no centro e direita) */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(
              90deg,
              rgba(10, 10, 15, 0.95) 0%,   /* Escuro na esquerda para proteger a Sidebar */
              rgba(10, 10, 15, 0.65) 45%,  /* Mais transparente no centro para revelar o técnico */
              rgba(10, 10, 15, 0.45) 100%  /* Leve na direita */
            )
          `,
        }}
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