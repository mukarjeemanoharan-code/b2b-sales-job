import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  const { token, password } = await req.json()
  if (!token || !password) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  if (password.length < 6) return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })

  const reset = await prisma.passwordReset.findUnique({ where: { token } })
  if (!reset) return NextResponse.json({ error: 'Invalid or expired reset link' }, { status: 400 })
  if (reset.expiresAt < new Date()) {
    await prisma.passwordReset.delete({ where: { token } })
    return NextResponse.json({ error: 'Reset link has expired. Please request a new one.' }, { status: 400 })
  }

  const hashed = await bcrypt.hash(password, 10)
  await prisma.user.update({ where: { email: reset.email }, data: { password: hashed } })
  await prisma.passwordReset.delete({ where: { token } })

  return NextResponse.json({ ok: true })
}
