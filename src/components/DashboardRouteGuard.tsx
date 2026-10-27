"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useTurma } from "@/contexts/TurmaContext";
import { Lock, Loader2 } from "lucide-react";

const ALLOWED_STUDENT_ROUTES = ["/dashboard", "/dashboard/welcome"];

export default function DashboardRouteGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isProfessor, alunoStatusAprovacao, isLoadingTurmas, turmaAtiva } = useTurma();

  const isRestrictedRoute = !ALLOWED_STUDENT_ROUTES.includes(pathname);
  const isAprovado = alunoStatusAprovacao === "aprovado";
  const isBlocked = !isProfessor && (!turmaAtiva || !isAprovado) && isRestrictedRoute;

  useEffect(() => {
    if (!isLoadingTurmas && isBlocked) {
      router.replace("/dashboard");
    }
  }, [isLoadingTurmas, isBlocked, router]);

  if (isLoadingTurmas && isRestrictedRoute && !isProfessor) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-[60vh] text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin mb-3 text-red-500" />
        <p className="text-sm">Verificando autorização de acesso...</p>
      </div>
    );
  }

  if (!isLoadingTurmas && isBlocked) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-[70vh] p-6 text-center animate-in fade-in duration-300">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4 text-red-500 shadow-lg shadow-red-500/10">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Acesso Restrito ao Conteúdo</h2>
        <p className="text-gray-400 max-w-md text-sm leading-relaxed mb-6">
          O acesso aos módulos técnicos, guia de componentes e ferramentas de cálculo é exclusivo para alunos aprovados pelo Instrutor na turma ativa.
        </p>
        <button
          onClick={() => router.replace("/dashboard")}
          className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-xl transition-colors cursor-pointer"
        >
          Voltar ao Painel da Turma
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
