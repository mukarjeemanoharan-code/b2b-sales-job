import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { createSession } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()
  if (!email || !password) return NextResponse.json({ error: 'Email and password required' }, { status: 400 })

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })

  const ok = await bcrypt.compare(password, user.password)
  if (!ok) return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })

  await createSession({ id: user.id, email: user.email, name: user.name })
  return NextResponse.json({ ok: true })
}
