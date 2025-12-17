import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // 1. Cria uma resposta padrão
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // 2. Conecta no Supabase para ver se tem alguém logado
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 3. Verifica o usuário
  const { data: { user } } = await supabase.auth.getUser()

  // 4. A REGRA DE OURO DA PORTA INVISÍVEL
  // Se o usuário tentar acessar "/admin" E não estiver logado...
  if (request.nextUrl.pathname.startsWith('/admin') && !user) {
    // ...Redireciona para a Home (ninguém sabe que o admin existe)
    return NextResponse.redirect(new URL('/', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/admin/:path*', // Protege tudo dentro do admin
  ],
}