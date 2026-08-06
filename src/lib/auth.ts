import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-dev-secret-change-in-prod'
)
const COOKIE = 'mi_session'

export interface SessionUser {
  id: string
  email: string
  name?: string | null
}

export async function createSession(user: SessionUser) {
  const token = await new SignJWT({ id: user.id, email: user.email, name: user.name })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('30d')
    .sign(SECRET)

  const jar = await cookies()
  jar.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  })
}

export async function getSession(): Promise<SessionUser | null> {
  try {
    const jar = await cookies()
    const token = jar.get(COOKIE)?.value
    if (!token) return null
    const { payload } = await jwtVerify(token, SECRET)
    return { id: payload.id as string, email: payload.email as string, name: payload.name as string | null }
  } catch {
    return null
  }
}

export async function deleteSession() {
  const jar = await cookies()
  jar.delete(COOKIE)
}
