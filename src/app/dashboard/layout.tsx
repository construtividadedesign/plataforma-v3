import { ClimateBackground } from "@/components/ClimateBackground";
import AppSidebar from "@/components/AppSidebar";
import { TurmaProvider } from "@/contexts/TurmaContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex bg-background text-foreground overflow-x-hidden">
      {/* O Fundo Dinâmico */}
      <ClimateBackground />

      {/* O Cérebro que abraça a Dashboard */}
      <TurmaProvider>
        <div className="relative z-10 flex flex-col md:flex-row w-full min-h-screen">
          {/* A Barra Lateral (Adaptativa para Mobile e Desktop) */}
          <AppSidebar />

          {/* A Área Central */}
          <main className="flex-1 w-full overflow-y-auto">
            {children}
          </main>
        </div>
      </TurmaProvider>
    </div>
  );
}