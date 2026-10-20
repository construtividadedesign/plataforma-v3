"use client";

import React from "react";
import { X, Printer, Users, Award } from "lucide-react";
import { module1ChallengeData, ModuleChallengeData } from "@/data/module1Challenge";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  challengeData?: ModuleChallengeData;
};

export default function PrintableChallengeModal({ isOpen, onClose, challengeData }: Props) {
  if (!isOpen) return null;

  const data = challengeData || module1ChallengeData;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto print:static print:bg-white print:p-0 print:block">
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-challenge-sheet,
          #printable-challenge-sheet * {
            visibility: visible;
          }
          #printable-challenge-sheet {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: #ffffff !important;
            color: #0f172a !important;
            box-shadow: none !important;
            margin: 0 !important;
            padding: 12mm !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="bg-zinc-950 border border-white/15 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden print:max-w-none print:max-h-none print:border-none print:rounded-none print:bg-white">
        
        <div className="no-print flex items-center justify-between px-6 py-4 bg-black/80 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <Users className="w-5 h-5 text-red-500" />
            <span className="text-sm font-semibold text-white">Desafio Prático Oficial • Formato A4 Imprimível</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer shadow-lg shadow-red-900/30"
            >
              <Printer className="w-4 h-4" />
              Imprimir / Salvar em PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Fechar desafio"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto p-4 sm:p-8 bg-zinc-900/60 print:p-0 print:bg-white">
          <div
            id="printable-challenge-sheet"
            className="bg-white text-slate-900 rounded-xl p-6 sm:p-10 shadow-xl max-w-3xl mx-auto space-y-6 border border-slate-200"
          >
            <div className="border-b-2 border-red-600 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-red-600">
                  Plataforma de Climatização • Atividade Prática de Oficina
                </p>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
                  {data.title}
                </h1>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  {data.subtitle} • Autor: Prof. Cleverson Leonardo
                </p>
              </div>
              <div className="bg-slate-100 border border-slate-300 rounded-lg px-3 py-2 text-right shrink-0">
                <span className="text-[10px] font-bold uppercase text-slate-700 block">Atividade em Grupo</span>
                <span className="text-xs font-extrabold text-red-700">ATÉ 4 EQUIPES</span>
              </div>
            </div>

            <div className="bg-slate-50 border-l-4 border-red-600 p-4 rounded-r-lg space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Objetivo Pedagógico da Atividade
              </h2>
              <p className="text-sm font-medium text-slate-800 leading-relaxed">
                {data.objective}
              </p>
              <div className="border-t border-slate-200 pt-3 space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                  Dinâmica de Execução em Aula:
                </span>
                {data.dynamics.map((d, dIdx) => (
                  <p key={dIdx} className="text-xs text-slate-700 leading-relaxed flex items-start gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span>{d}</span>
                  </p>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-1.5 flex items-center gap-2">
                <Award className="w-5 h-5 text-red-600" />
                Dossiês Técnicos para as 4 Equipes
              </h3>

              {data.groups.map((g) => (
                <div key={g.groupNumber} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold px-2.5 py-1 rounded bg-red-600 text-white">
                      Equipe {g.groupNumber}
                    </span>
                    <span className="text-xs font-bold text-slate-600">{g.focusTopics}</span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900">{g.groupTitle}</h4>

                  <div className="bg-white border border-slate-200 p-3 rounded-lg text-xs text-slate-700 leading-relaxed">
                    <strong className="text-slate-900 block mb-1">Cenário do Dossiê de Campo:</strong>
                    {g.scenario}
                  </div>

                  <div className="space-y-1 pt-1">
                    <span className="text-[11px] font-bold uppercase text-slate-600 block">Missões da Equipe:</span>
                    <ul className="space-y-1">
                      {g.missions.map((m, mIdx) => (
                        <li key={mIdx} className="text-xs text-slate-700 flex items-start gap-2">
                          <span className="text-red-600 font-bold">✔</span>
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t-2 border-slate-300 pt-4 mt-8 text-center space-y-1">
              <p className="text-xs font-bold text-slate-800">
                © {new Date().getFullYear()} Direitos Intelectuais Reservados • Criado por Prof. Cleverson Leonardo.
              </p>
              <p className="text-[11px] text-red-700 font-semibold">
                PROIBIDA A VENDA, REPRODUÇÃO OU DISTRIBUIÇÃO SEM DEVIDA AUTORIZAÇÃO PRÉVIA DO AUTOR.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}