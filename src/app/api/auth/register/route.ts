import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { createSession } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const { email, password, name } = await req.json()
  if (!email || !password) return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
  if (password.length < 6) return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return NextResponse.json({ error: 'Email already registered' }, { status: 409 })

  const hash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({ data: { email, password: hash, name: name || null } })

  await createSession({ id: user.id, email: user.email, name: user.name })
  return NextResponse.json({ ok: true })
}
