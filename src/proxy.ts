import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-dev-secret-change-in-prod'
)

const PUBLIC = ['/login', '/register', '/api/auth']

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (PUBLIC.some((p) => pathname.startsWith(p))) return NextResponse.next()

  const token = req.cookies.get('mi_session')?.value
  if (!token) return NextResponse.redirect(new URL('/login', req.url))

  try {
    await jwtVerify(token, SECRET)
    return NextResponse.next()
  } catch {
    return NextResponse.redirect(new URL('/login', req.url))
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/status/:path*'],
}
