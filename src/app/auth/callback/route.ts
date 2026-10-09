import { NextResponse } from 'next/server'
// Importação do cliente Supabase específico para o servidor
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  // O parâmetro 'next' é opcional e serve para reencaminhar para uma página específica
  // após o login. Se não existir, usamos '/dashboard' por defeito.
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const cookieStore = await cookies()
    
    // Inicializar o cliente Supabase para o ambiente de servidor
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )

    // Trocar o código pela sessão do utilizador
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    } else {
      console.error("Erro na autenticação:", error.message)
    }
  }

  // Em caso de erro ou se não houver código, redireciona para uma página de erro genérica ou para o login
  return NextResponse.redirect(`${origin}/login?error=auth-failed`)
}
