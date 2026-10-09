import DashboardHeader from "@/components/DashboardHeader";
import CourseModules from "@/components/CourseModules";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-start p-6 md:p-12 text-foreground relative">
      <DashboardHeader />
      
      <div className="w-full max-w-5xl bg-card/95 border border-border/40 rounded-xl p-6 text-center mb-2 shadow-xl backdrop-blur-sm">
        <h2 className="text-lg font-semibold text-foreground">Próxima Aula Recomendada</h2>
        <p className="text-muted-foreground text-sm mt-2">Procedimentos de Vácuo e Carga de Gás R32 em Sistemas Inverter.</p>
        <button className="mt-4 px-6 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-sm rounded-lg transition-colors shadow-lg cursor-pointer">
          Aceder ao Módulo
        </button>
      </div>

      <CourseModules />
    </main>
  );
}