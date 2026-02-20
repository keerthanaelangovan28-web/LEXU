import { NextRequest, NextResponse } from 'next/server'

// Protected routes that require authentication
const protectedRoutes = ['/dashboard', '/api/users', '/api/admin']
const authRoutes = ['/auth/login', '/auth/register']
const publicRoutes = ['/']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const authToken = request.cookies.get('auth-token')?.value

  // Allow public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Redirect authenticated users away from auth routes
  if (authRoutes.some(route => pathname.startsWith(route)) && authToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Protect dashboard routes
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !authToken) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Add security headers
  const response = NextResponse.next()

  // HTTPS enforcement and HSTS
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')

  // CSP (Content Security Policy)
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https:; frame-ancestors 'none';"
  )

  // X-Content-Type-Options
  response.headers.set('X-Content-Type-Options', 'nosniff')

  // X-Frame-Options
  response.headers.set('X-Frame-Options', 'DENY')

  // X-XSS-Protection
  response.headers.set('X-XSS-Protection', '1; mode=block')

  // Referrer-Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // Permissions-Policy
  response.headers.set(
    'Permissions-Policy',
    'geolocation=(), microphone=(), camera=(), payment=()'
  )

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
