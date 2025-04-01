import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

export async function middleware(req) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get('auth_token')?.value // Zsynchronizuj nazwę cookie z API

  // Public routes
  const publicRoutes = ['/admin/login']

  // Bypass auth for public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    if (!token) {
      const loginUrl = new URL('/admin/login', req.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET)
      const { payload } = await jwtVerify(token, secret)
      console.log('Zalogowany admin ID:', payload.id)
      return NextResponse.next()
    } catch (error) {
      console.error('Błąd weryfikacji tokenu:', error.message)
      const loginUrl = new URL('/admin/login', req.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}