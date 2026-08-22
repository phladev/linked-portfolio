import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

const ADMIN_HOST = process.env.ADMIN_HOST ?? 'painel.phladev.com.br'
// Em dev, http://painel.localhost:3000 simula o subdomínio sem mexer no /etc/hosts
// nem no DNS real -- localhost puro continua servindo o site público normalmente.
const DEV_ADMIN_HOST = 'painel.localhost'

function isAdminHostname(host: string) {
  const hostname = host.split(':')[0]
  if (hostname === ADMIN_HOST) return true
  return process.env.NODE_ENV !== 'production' && hostname === DEV_ADMIN_HOST
}

export default auth((req) => {
  const host = req.headers.get('host') ?? ''
  const isAdminHost = isAdminHostname(host)
  const { pathname } = req.nextUrl

  const isAdminPath = pathname.startsWith('/admin')
  const isAuthPath = pathname.startsWith('/api/auth')

  // /admin nunca responde fora do host do painel
  if (isAdminPath && !isAdminHost) {
    return new NextResponse('Not Found', { status: 404 })
  }

  if (isAdminHost) {
    // o host do painel só serve /admin/* (e a API de auth)
    if (!isAdminPath && !isAuthPath) {
      return NextResponse.redirect(new URL('/admin', req.url))
    }

    const isLoginPage = pathname === '/admin/login'

    if (!req.auth && isAdminPath && !isLoginPage) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }

    if (req.auth && isLoginPage) {
      return NextResponse.redirect(new URL('/admin', req.url))
    }
  }
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.svg).*)'],
}
