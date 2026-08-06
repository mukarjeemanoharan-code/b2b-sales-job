import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const statuses = await prisma.prospectStatus.findMany({ where: { userId: session.id } })
  const map: Record<number, string> = {}
  statuses.forEach((s) => { map[s.companyId] = s.status })
  return NextResponse.json(map)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { companyId, status } = await req.json()
  const valid = ['new', 'interested', 'applied', 'rejected', 'parked']
  if (!valid.includes(status)) return NextResponse.json({ error: 'Invalid status' }, { status: 400 })

  await prisma.prospectStatus.upsert({
    where: { userId_companyId: { userId: session.id, companyId } },
    update: { status },
    create: { userId: session.id, companyId, status },
  })
  return NextResponse.json({ ok: true })
}
