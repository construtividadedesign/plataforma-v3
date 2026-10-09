import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardHeader() {
  return (
    <Card className="w-full max-w-5xl border-border/40 shadow-xl backdrop-blur-sm bg-card/95 mb-8">
      <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6">
        <div>
          <span className="px-3 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-full border border-primary/20">
            Área do Aluno • Ar Condicionado Split
          </span>
          <CardTitle className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mt-2">
            Painel de Controlo Técnico
          </CardTitle>
          <p className="text-muted-foreground text-sm mt-1">
            Gestão de módulos, diagnósticos R32 e protocolos de instalação.
          </p>
        </div>
        
        <div className="flex items-center gap-3 bg-background/50 px-4 py-3 rounded-lg border border-border/40">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
          <div className="text-left">
            <p className="text-xs text-muted-foreground">Estado da Plataforma</p>
            <p className="text-sm font-medium text-foreground">Online & Seguro</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border/40">
        <div className="bg-background/40 p-4 rounded-lg border border-border/30">
          <p className="text-muted-foreground text-xs">Módulos Disponíveis</p>
          <p className="text-xl font-bold text-foreground mt-1">04 Módulos</p>
        </div>
        <div className="bg-background/40 p-4 rounded-lg border border-border/30">
          <p className="text-muted-foreground text-xs">Aulas Práticas</p>
          <p className="text-xl font-bold text-foreground mt-1">12 Conteúdos</p>
        </div>
        <div className="bg-background/40 p-4 rounded-lg border border-border/30">
          <p className="text-muted-foreground text-xs">Progresso Geral</p>
          <p className="text-xl font-bold text-emerald-400 mt-1">Iniciado</p>
        </div>
      </CardContent>
    </Card>
  );
}