import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { companies, frequentHirers } from '@/lib/companies'
import { prisma } from '@/lib/prisma'
import DashboardClient from '@/components/DashboardClient'

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const statusRows = await prisma.prospectStatus.findMany({ where: { userId: session.id } })
  const statusMap: Record<number, string> = {}
  statusRows.forEach((s) => { statusMap[s.companyId] = s.status })

  return (
    <DashboardClient
      companies={companies}
      frequentHirers={Array.from(frequentHirers)}
      initialStatuses={statusMap}
      user={{ name: session.name, email: session.email }}
    />
  )
}
