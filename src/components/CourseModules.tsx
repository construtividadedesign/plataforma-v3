import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CourseModules() {
  const modules = [
    {
      id: 1,
      title: "Fundamentos e Ciclo Refrigeração",
      duration: "4 Horas",
      status: "Concluído",
      description: "Princípios termodinâmicos, pressões, temperaturas e o comportamento dos fluidos refrigerantes.",
    },
    {
      id: 2,
      title: "Instalação Elétrica e Mecânica Split",
      duration: "6 Horas",
      status: "Em Andamento",
      description: "Dimensionamento de cabos, disjuntores, fixação de suportes e enfardamento de tubagens de cobre.",
    },
    {
      id: 3,
      title: "Técnicas de Vácuo e Carga de Gás R32",
      duration: "5 Horas",
      status: "Disponível",
      description: "Uso correto de vacuômetro digital, eliminação de humidade e carga correta por balança.",
    },
    {
      id: 4,
      title: "Diagnóstico Avançado de Erros Inverter",
      duration: "5 Horas",
      status: "Bloqueado",
      description: "Leitura de códigos de erro, testes em placas eletrónicas e motores BLDC.",
    },
  ];

  return (
    <div className="w-full max-w-5xl mt-8">
      <h3 className="text-xl font-bold text-foreground mb-4">Módulos do Curso de Climatização</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modules.map((mod) => (
          <Card 
            key={mod.id}
            className="border-border/40 shadow-lg backdrop-blur-sm bg-card/95 flex flex-col justify-between hover:border-border/80 transition-all"
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold px-2.5 py-1 bg-background text-muted-foreground rounded border border-border/40">
                  {mod.duration}
                </span>
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                  mod.status === "Concluído" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                  mod.status === "Em Andamento" ? "bg-primary/10 text-primary border border-primary/20" :
                  mod.status === "Disponível" ? "bg-sky-500/10 text-sky-400 border border-sky-500/20" :
                  "bg-muted text-muted-foreground"
                }`}>
                  {mod.status}
                </span>
              </div>
              <CardTitle className="text-lg font-semibold text-foreground">{mod.title}</CardTitle>
            </CardHeader>
            
            <CardContent className="flex flex-col justify-between flex-grow pt-0">
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">{mod.description}</p>
              
              <div className="pt-4 border-t border-border/40 flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Módulo 0{mod.id}</span>
                <Button 
                  disabled={mod.status === "Bloqueado"}
                  size="sm"
                  className={mod.status === "Bloqueado" ? "bg-muted text-muted-foreground cursor-not-allowed" : ""}
                >
                  {mod.status === "Bloqueado" ? "Indisponível" : "Ver Aulas"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}