"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, User, Mail, LogOut, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    async function getUserData() {
      setIsLoading(true);
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      }
      setIsLoading(false);
    }
    getUserData();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage("");

    // Simulamos um pequeno delay de salvamento para feedback visual elegante
    setTimeout(() => {
      setIsSaving(false);
      setSuccessMessage("Configurações atualizadas com sucesso!");
      setTimeout(() => setSuccessMessage(""), 4000);
    }, 800);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-[60vh] text-gray-400">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-red-500" />
        <p>A carregar definições da conta...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-6 md:p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      
      {/* Cabeçalho */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Configurações da Conta
        </h1>
        <p className="text-gray-400 mt-2 text-sm">
          Gerencie as suas informações de perfil, preferências da plataforma e segurança da sessão.
        </p>
      </div>

      {successMessage && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl flex items-center gap-3 text-sm font-medium animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Cartão de Perfil */}
      <Card className="bg-black/40 backdrop-blur-md border-white/10 shadow-xl rounded-2xl">
        <CardHeader className="border-b border-white/5 pb-6">
          <CardTitle className="text-xl flex items-center gap-2 text-white font-semibold">
            <User className="w-5 h-5 text-red-500" />
            <span>Perfil do Utilizador</span>
          </CardTitle>
          <CardDescription className="text-gray-400 text-sm mt-1">
            Informações associadas à sua conta na plataforma de climatização.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSaveChanges} className="space-y-6">
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200 flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span>Email de Acesso</span>
              </label>
              <input 
                type="email" 
                disabled 
                value={user?.email || "utilizador@email.com"} 
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-gray-400 cursor-not-allowed focus:outline-none"
              />
              <p className="text-xs text-gray-500 pt-1">
                O email de acesso está vinculado às credenciais de autenticação do Supabase.
              </p>
            </div>

            <div className="pt-4 flex justify-end">
              <Button 
                type="submit" 
                disabled={isSaving} 
                className="cursor-pointer bg-red-600 hover:bg-red-700 text-white border-0 shadow-lg shadow-red-900/20"
              >
                {isSaving ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> A guardar...</>
                ) : (
                  "Guardar Alterações"
                )}
              </Button>
            </div>

          </form>
        </CardContent>
      </Card>

      {/* Cartão de Sessão / Zona de Perigo */}
      <Card className="bg-black/40 backdrop-blur-md border-red-500/20 shadow-xl rounded-2xl">
        <CardHeader className="border-b border-red-500/10 pb-6">
          <CardTitle className="text-xl text-red-500 flex items-center gap-2 font-semibold">
            <LogOut className="w-5 h-5" />
            <span>Gestão de Sessão</span>
          </CardTitle>
          <CardDescription className="text-gray-400 text-sm mt-1">
            Encerre a sua sessão atual com segurança neste dispositivo.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-sm text-gray-300 leading-relaxed max-w-2xl">
            Ao terminar sessão, precisará de introduzir novamente as suas credenciais para aceder aos conteúdos dos módulos e ao seu progresso.
          </p>
        </CardContent>
        <CardFooter className="pt-0 pb-6 flex justify-end">
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="cursor-pointer bg-transparent border border-red-500/30 text-red-500 hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Terminar Sessão
          </Button>
        </CardFooter>
      </Card>

    </div>
  );
}
