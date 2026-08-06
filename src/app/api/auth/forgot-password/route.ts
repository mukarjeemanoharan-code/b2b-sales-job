import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { randomBytes } from 'crypto'

export async function POST(req: NextRequest) {
  const { email } = await req.json()
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    // Don't reveal whether the email exists
    return NextResponse.json({ token: null })
  }

  // Delete any existing reset tokens for this email
  await prisma.passwordReset.deleteMany({ where: { email } })

  const token = randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

  await prisma.passwordReset.create({ data: { email, token, expiresAt } })

  return NextResponse.json({ token })
}
