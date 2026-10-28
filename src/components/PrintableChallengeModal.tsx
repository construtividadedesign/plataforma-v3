"use client";

import React from "react";
import { X, Printer, Users, Award, ClipboardCheck } from "lucide-react";
import { module1ChallengeData, ModuleChallengeData } from "@/data/module1Challenge";
import { printElementById } from "@/lib/printUtils";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  challengeData?: ModuleChallengeData;
};

export default function PrintableChallengeModal({ isOpen, onClose, challengeData }: Props) {
  if (!isOpen) return null;

  const data = challengeData || module1ChallengeData;

  const handlePrint = () => {
    printElementById("printable-challenge-sheet", {
      title: `${data.title} • Atividade Prática Oficial A4`,
      pageMargin: "10mm 10mm",
    });
  };

  // Higienização e neutralização estrita de marca para tela e impressão
  const neutralizedSubtitle = data.subtitle
    .replace("Metodologia SENAI de Oficina", "Metodologia Oficial de Oficina Técnica").replace(/\bSENAI\b/g, "Ensino Técnico")
    .replace(/\bMSEP\b/g, "Metodologia Oficial de Ensino Técnico");

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto print:static print:bg-white print:p-0 print:block">
      <div className="bg-zinc-950 border border-white/15 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden print:max-w-none print:max-h-none print:border-none print:rounded-none print:bg-white">
        
        <div className="no-print print:hidden flex items-center justify-between px-6 py-4 bg-black/80 border-b border-white/10 shrink-0">
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
                  {neutralizedSubtitle} • Autor: Prof. Cleverson Leonardo
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
                <div
                  key={g.groupNumber}
                  className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-2.5 break-inside-avoid print-break-inside-avoid dossier-card"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold px-2.5 py-1 rounded bg-red-600 text-white">
                      Equipe {g.groupNumber}
                    </span>
                    <span className="text-xs font-bold text-slate-600">{g.focusTopics}</span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900">{g.groupTitle}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed italic bg-white p-3 rounded-lg border border-slate-200">
                    "{g.scenario}"
                  </p>

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

            {/* Matriz Oficial de Avaliação e Pontuação de Bancada */}
            <div className="space-y-3 pt-2 border-t border-slate-200 break-inside-avoid print-break-inside-avoid">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                  <ClipboardCheck className="w-5 h-5 text-red-600" />
                  Matriz de Avaliação Técnica e Veredito de Bancada (Metodologia de Oficina Técnica)
                </h3>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                  Escala Avaliativa: 0 a 10 Pontos
                </span>
              </div>

              <div className="overflow-x-auto rounded-lg border border-slate-300">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-900">
                      <th className="border border-slate-300 p-2 font-bold">Critério Técnico Avaliativo</th>
                      <th className="border border-slate-300 p-2 font-bold w-20 text-center">Peso</th>
                      <th className="border border-slate-300 p-2 font-bold w-14 text-center">Eq. 1</th>
                      <th className="border border-slate-300 p-2 font-bold w-14 text-center">Eq. 2</th>
                      <th className="border border-slate-300 p-2 font-bold w-14 text-center">Eq. 3</th>
                      <th className="border border-slate-300 p-2 font-bold w-14 text-center">Eq. 4</th>
                      <th className="border border-slate-300 p-2 font-bold">Parecer / Veredito do Instrutor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-700 bg-white">
                    <tr>
                      <td className="border border-slate-300 p-2 font-medium">
                        1. Domínio Conceitual e Diagnóstico Técnico
                        <span className="block text-[10px] text-slate-500">Fundamentação correta baseada no ciclo, grandezas e apostilas oficiais.</span>
                      </td>
                      <td className="border border-slate-300 p-2 text-center font-bold">2,5 pts</td>
                      <td className="border border-slate-300 p-2 text-center font-mono text-slate-400">___</td>
                      <td className="border border-slate-300 p-2 text-center font-mono text-slate-400">___</td>
                      <td className="border border-slate-300 p-2 text-center font-mono text-slate-400">___</td>
                      <td className="border border-slate-300 p-2 text-center font-mono text-slate-400">___</td>
                      <td className="border border-slate-300 p-2 text-[10px] text-slate-500 italic">Visto do Docente</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 p-2 font-medium">
                        2. Segurança e Conformidade Normativa (ABNT / NR)
                        <span className="block text-[10px] text-slate-500">Respeito às normas de segurança, EPIs, NBR 5410, NBR 16655 e NR-10/NR-35.</span>
                      </td>
                      <td className="border border-slate-300 p-2 text-center font-bold">2,5 pts</td>
                      <td className="border border-slate-300 p-2 text-center font-mono text-slate-400">___</td>
                      <td className="border border-slate-300 p-2 text-center font-mono text-slate-400">___</td>
                      <td className="border border-slate-300 p-2 text-center font-mono text-slate-400">___</td>
                      <td className="border border-slate-300 p-2 text-center font-mono text-slate-400">___</td>
                      <td className="border border-slate-300 p-2 text-[10px] text-slate-500 italic">Visto do Docente</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 p-2 font-medium">
                        3. Resolução Completa das Missões do Dossiê
                        <span className="block text-[10px] text-slate-500">Assertividade nas respostas, cálculos, manobras e identificação da causa-raiz.</span>
                      </td>
                      <td className="border border-slate-300 p-2 text-center font-bold">2,5 pts</td>
                      <td className="border border-slate-300 p-2 text-center font-mono text-slate-400">___</td>
                      <td className="border border-slate-300 p-2 text-center font-mono text-slate-400">___</td>
                      <td className="border border-slate-300 p-2 text-center font-mono text-slate-400">___</td>
                      <td className="border border-slate-300 p-2 text-center font-mono text-slate-400">___</td>
                      <td className="border border-slate-300 p-2 text-[10px] text-slate-500 italic">Visto do Docente</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 p-2 font-medium">
                        4. Apresentação em Grupo e Raciocínio Clínico
                        <span className="block text-[10px] text-slate-500">Clareza na defesa técnica perante a turma e postura profissional na bancada.</span>
                      </td>
                      <td className="border border-slate-300 p-2 text-center font-bold">2,5 pts</td>
                      <td className="border border-slate-300 p-2 text-center font-mono text-slate-400">___</td>
                      <td className="border border-slate-300 p-2 text-center font-mono text-slate-400">___</td>
                      <td className="border border-slate-300 p-2 text-center font-mono text-slate-400">___</td>
                      <td className="border border-slate-300 p-2 text-center font-mono text-slate-400">___</td>
                      <td className="border border-slate-300 p-2 text-[10px] text-slate-500 italic">Visto do Docente</td>
                    </tr>
                    <tr className="bg-slate-50 font-bold text-slate-900">
                      <td className="border border-slate-300 p-2 text-right">Nota Final / Homologação da Equipe:</td>
                      <td className="border border-slate-300 p-2 text-center">10,0 pts</td>
                      <td className="border border-slate-300 p-2 text-center font-mono">/ 10</td>
                      <td className="border border-slate-300 p-2 text-center font-mono">/ 10</td>
                      <td className="border border-slate-300 p-2 text-center font-mono">/ 10</td>
                      <td className="border border-slate-300 p-2 text-center font-mono">/ 10</td>
                      <td className="border border-slate-300 p-2 text-[10px] font-semibold text-red-700">
                        [ ] Aprovado &nbsp; [ ] Em Revisão
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 text-xs text-slate-600">
                <div className="border-t border-slate-300 pt-2">
                  <span className="font-bold text-slate-800 block">Data da Atividade Prática:</span>
                  <span>___/___/2026 • Bancadas de Climatização</span>
                </div>
                <div className="border-t border-slate-300 pt-2 sm:text-right">
                  <span className="font-bold text-slate-800 block">Instrutor Responsável:</span>
                  <span>Prof. Cleverson Leonardo • Docente de Refrigeração</span>
                </div>
              </div>
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
