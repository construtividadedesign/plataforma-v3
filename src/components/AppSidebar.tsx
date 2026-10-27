"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Library, LineChart, Home, Users, ChevronDown, Menu, X, Cpu, Stethoscope, Calculator, Wind, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useTurma, getProfessorDisplayName, getProfessorInitial } from "@/contexts/TurmaContext";
import ThemeToggle from "@/components/ThemeToggle";

export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const { turmas, turmaAtiva, selecionarTurma, isProfessor, userName, userEmail, alunoStatusAprovacao } = useTurma();

  // Fecha o menu mobile automaticamente ao trocar de rota
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const navItems = [
    { name: "Boas-Vindas", href: "/dashboard/welcome", icon: Home },
    { name: "Painel da Turma", href: "/dashboard", icon: LayoutDashboard },
    { name: "Módulos de Aulas", href: "/dashboard/modules", icon: Library },
    { name: "Tipos de Climatização", href: "/dashboard/systems", icon: Wind },
    { name: "Guia de Componentes", href: "/dashboard/components", icon: Cpu },
    { name: "Diagnóstico e Falhas", href: "/dashboard/troubleshooting", icon: Stethoscope },
    { name: "Dimensionamento (BTUs)", href: "/dashboard/sizing", icon: Calculator },
    { name: "Meu Progresso", href: "/dashboard/progress", icon: LineChart },
  ];

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const inicialNome = isProfessor
    ? getProfessorInitial(userEmail, userName)
    : (userName ? userName.charAt(0).toUpperCase() : "A");

  const nomeExibicao = isProfessor
    ? getProfessorDisplayName(userEmail, userName)
    : (userName || "Aluno");

  return (
    <>
      {/* BARRA SUPERIOR MOBILE (Visível apenas em celulares/tablets menores que md) */}
      <header className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3.5 bg-white/90 dark:bg-black/80 backdrop-blur-md border-b border-slate-200 dark:border-white/10 w-full shrink-0">
        <div className="flex items-center gap-2">
          <h1 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <span>Plataforma de</span>
            <span className="text-red-600">Climatização</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Seletor de Tema no Mobile */}
          <ThemeToggle variant="icon" />

          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label="Abrir ou fechar menu"
            className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-gray-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            {isMobileOpen ? <X className="w-5 h-5 text-red-500" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* OVERLAY ESCURO NO MOBILE QUANDO O MENU ESTÁ ABERTO */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="md:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
        />
      )}

      {/* BARRA LATERAL (Fixa no Desktop, Gaveta deslizante no Mobile) */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 md:z-20 w-72 h-screen flex flex-col justify-between bg-white/95 md:bg-white/80 dark:bg-black/90 md:dark:bg-black/40 backdrop-blur-xl md:backdrop-blur-md border-r border-slate-200 dark:border-white/10 shrink-0 text-slate-700 dark:text-gray-300 shadow-2xl transition-transform duration-300 ease-in-out ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Cabeçalho do Menu */}
          <div className="p-6 pb-4">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white flex flex-col gap-1">
                <span>Plataforma de</span>
                <span className="text-red-600">Climatização</span>
              </h1>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="md:hidden p-1.5 rounded-lg text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                aria-label="Fechar menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Seletor Global de Turmas */}
            <div className="relative group mb-2">
              <label className="text-xs font-semibold text-slate-500 dark:text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Users className="w-3 h-3" /> Turma Atual
              </label>
              <div className="relative">
                <select
                  className="w-full appearance-none bg-slate-100 dark:bg-black/50 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm rounded-lg pl-3 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-600/50 focus:border-red-500 transition-all cursor-pointer"
                  value={turmaAtiva?.id || ""}
                  onChange={(e) => {
                    if (e.target.value === "nova") {
                      router.push("/dashboard");
                      setIsMobileOpen(false);
                    } else {
                      selecionarTurma(e.target.value);
                    }
                  }}
                >
                  <option value="" disabled className="bg-white dark:bg-gray-900 text-slate-400 dark:text-gray-400">
                    Selecione uma turma...
                  </option>
                  {turmas.map((t) => (
                    <option key={t.id} value={t.id} className="bg-white dark:bg-gray-900 text-slate-900 dark:text-white">
                      {t.nome}
                    </option>
                  ))}
                  {isProfessor && (
                    <option value="nova" className="bg-white dark:bg-gray-900 text-red-600 dark:text-red-400 font-medium">
                      + Criar Nova Turma
                    </option>
                  )}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400 dark:text-gray-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 pb-2">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent"></div>
          </div>

          {/* Links de Navegação */}
          <div className="p-6 pt-2 flex-1 overflow-y-auto">
            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname?.startsWith(item.href + "/"));
                const Icon = item.icon;

                const isPublicStudentRoute = item.href === "/dashboard" || item.href === "/dashboard/welcome";
                const isLocked = !isProfessor && (!turmaAtiva || alunoStatusAprovacao !== "aprovado") && !isPublicStudentRoute;

                if (isLocked) {
                  return (
                    <div
                      key={item.name}
                      title="Conteúdo restrito: aguarde aprovação do Instrutor na turma ativa"
                      className="flex items-center justify-between px-4 py-3 rounded-xl opacity-40 cursor-not-allowed select-none bg-slate-100/50 dark:bg-white/[0.02] text-slate-400 dark:text-gray-500"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 shrink-0" />
                        <span className="text-sm font-medium">{item.name}</span>
                      </div>
                      <Lock className="w-3.5 h-3.5 text-amber-500/80 shrink-0" />
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer ${
                      isActive
                        ? "bg-red-600 text-white shadow-lg shadow-red-900/30 font-semibold"
                        : "text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white font-medium"
                    }`}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span className="text-sm">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Rodapé do Menu (Alternador de Tema, Logout e Direitos de Autor) */}
        <div className="p-4 border-t border-slate-200 dark:border-white/5 bg-slate-50/80 dark:bg-black/20 flex flex-col shrink-0 gap-3">
          {/* Alternador Global de Tema Claro / Escuro */}
          <ThemeToggle variant="sidebar" />

          {/* Botão de Perfil / Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl hover:bg-slate-200/60 dark:hover:bg-white/10 transition-all duration-300 text-sm font-medium cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-red-900 border border-white/10 flex items-center justify-center text-xs font-bold text-white shadow-inner shrink-0">
              {inicialNome}
            </div>
            <div className="flex flex-col items-start overflow-hidden text-left">
              <span className="text-slate-900 dark:text-white font-medium truncate w-full">
                {nomeExibicao}
              </span>
              <span className="text-slate-500 dark:text-gray-500 text-xs">
                {isProfessor ? "Sessão do Instrutor • Sair" : "Modo Aluno • Sair"}
              </span>
            </div>
          </button>

          {/* Área de Direitos Intelectuais - Discreta e Profissional */}
          <div className="text-[10px] text-slate-400 dark:text-gray-500/50 text-center leading-tight select-none">
            &copy; {new Date().getFullYear()} Direitos intelectuais reservados.<br />
            Criado por Cleverson Leonardo.<br />
            Não pode ser vendida ou distribuída.
          </div>
        </div>
      </aside>
    </>
  );
}
