"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError("Ocorreu um erro ao tentar aceder com o Google. Tente novamente.");
      setLoading(false);
    }
    // Nota: O redirecionamento em caso de sucesso é gerido automaticamente pelo Supabase OAuth.
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-sky-500/20 rounded-full blur-3xl opacity-20"></div>

      <Card className="w-full max-w-md border-border/40 bg-card/95 backdrop-blur-md shadow-2xl z-10 relative">
        <CardHeader className="space-y-1 text-center pb-6">
          <div className="w-14 h-14 bg-background rounded-2xl flex items-center justify-center mx-auto mb-4 border border-border shadow-sm">
            <span className="text-primary text-2xl font-bold">❄️</span>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
            Acesso Restrito
          </CardTitle>
          <CardDescription className="text-muted-foreground mt-2">
            Autentique-se utilizando a sua conta Google para aceder à Plataforma de Formação Técnica.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-5">
            {error && (
              <div className="p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg text-center font-medium">
                {error}
              </div>
            )}

            <Button 
              type="button" 
              onClick={handleGoogleLogin}
              className="w-full bg-white text-black hover:bg-gray-100 h-11 font-semibold text-md transition-all flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                "A redirecionar..."
              ) : (
                <>
                  <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    <path d="M1 1h22v22H1z" fill="none" />
                  </svg>
                  Continuar com o Google
                </>
              )}
            </Button>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4 border-t border-border/40 pt-6 mt-2">
          <p className="text-xs text-center text-muted-foreground">
            Apenas utilizadores previamente autorizados terão acesso ao conteúdo dos cursos após a autenticação.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}