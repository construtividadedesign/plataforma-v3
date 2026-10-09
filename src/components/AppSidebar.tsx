"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Library, LineChart, Home, Users, ChevronDown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useTurma } from "@/contexts/TurmaContext";

export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  
  const { turmas, turmaAtiva, selecionarTurma } = useTurma();

  const navItems = [
    { name: "Boas-Vindas", href: "/dashboard/welcome", icon: Home },
    { name: "Painel da Turma", href: "/dashboard", icon: LayoutDashboard },
    { name: "Módulos de Aulas", href: "/dashboard/modules", icon: Library },
    { name: "Meu Progresso", href: "/dashboard/progress", icon: LineChart },
  ];

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <aside className="w-72 h-screen flex flex-col justify-between bg-black/40 backdrop-blur-md border-r border-white/10 shrink-0 text-gray-300 shadow-2xl relative z-20">
      
      <div className="flex flex-col h-full">
        {/* Cabeçalho do Menu */}
        <div className="p-6 pb-4">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-white flex flex-col gap-1">
              <span>Plataforma de</span>
              <span className="text-red-600">Climatização</span>
            </h1>
          </div>

          {/* Seletor Global de Turmas */}
          <div className="relative group mb-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Users className="w-3 h-3" /> Turma Atual
            </label>
            <div className="relative">
              <select
                className="w-full appearance-none bg-black/50 border border-white/10 text-white text-sm rounded-lg pl-3 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-600/50 focus:border-red-500 transition-all cursor-pointer"
                value={turmaAtiva?.id || ""}
                onChange={(e) => {
                  if (e.target.value === "nova") {
                    router.push("/dashboard");
                  } else {
                    selecionarTurma(e.target.value);
                  }
                }}
              >
                <option value="" disabled className="bg-gray-900 text-gray-400">
                  Selecione uma turma...
                </option>
                {turmas.map((t) => (
                  <option key={t.id} value={t.id} className="bg-gray-900 text-white">
                    {t.nome}
                  </option>
                ))}
                <option value="nova" className="bg-gray-900 text-red-400 font-medium">
                  + Criar Nova Turma
                </option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 pb-2">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        </div>

        {/* Links de Navegação */}
        <div className="p-6 pt-2 flex-1 overflow-y-auto">
          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href + "/"));
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "bg-red-600 text-white shadow-lg shadow-red-900/30"
                      : "hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Rodapé do Menu (Logout e Direitos de Autor) */}
      <div className="p-4 border-t border-white/5 bg-black/20 flex flex-col">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-300 text-sm font-medium cursor-pointer mb-3"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-red-900 border border-white/10 flex items-center justify-center text-xs font-bold text-white shadow-inner">
            L
          </div>
          <div className="flex flex-col items-start">
            <span className="text-white font-medium">Instrutor Leonardo</span>
            <span className="text-gray-500 text-xs">Terminar Sessão</span>
          </div>
        </button>

        {/* Área de Direitos Intelectuais - Discreta e Profissional */}
        <div className="text-[10px] text-gray-500/50 text-center leading-tight select-none">
          &copy; {new Date().getFullYear()} Direitos intelectuais reservados.<br />
          Criado por Cleverson Leonardo.<br />
          Não pode ser vendida ou distribuída.
        </div>
      </div>
      
    </aside>
  );
}