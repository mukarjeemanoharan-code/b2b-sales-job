import companiesRaw from '@/data/companies.json'
import leadershipRaw from '@/data/leadership.json'
import intelRaw from '@/data/company_intelligence.json'
import gtmRaw from '@/data/gtm_intelligence.json'

export interface Leader {
  name: string
  title: string
  role_category: string
  linkedin_url: string | null
  data_source: string
  verified: boolean
}

export interface Company {
  company_id: number
  company_name: string
  linkedin_url: string
  website: string
  industry: string
  saas_category: string
  employee_count: string
  hq: string | null
  founded: string | null
  about: string
  company_stage: string
  hiring_roles: string[]
  job_urls: string[]
  hiring_locations: string[]
  hiring_mode: string[]
  posting_dates: string[]
  excluded: boolean
  leaders: Leader[]
  intel: {
    product_summary: string
    icp: string
    funding: { total_raised: string; last_round: string | null; investors: string[]; stage: string }
    revenue_estimate: string
    competitors: string[]
    recent_news: string
  } | null
  gtm: {
    gtm_motion: string
    sales_motion: string
    hiring_signal: string
    observable_gtm_gaps: string[]
    outreach_angle: string
    target_market: string
    hiring_urgency: string
  } | null
}

const leadersMap = new Map(
  (leadershipRaw as any[]).map((l) => [l.company_id, l.leaders as Leader[]])
)
const intelMap = new Map((intelRaw as any[]).map((i) => [i.company_id, i]))
const gtmMap = new Map((gtmRaw as any[]).map((g) => [g.company_id, g]))

export const companies: Company[] = (companiesRaw as any[])
  .filter((c) => !c.excluded)
  .map((c) => ({
    ...c,
    leaders: leadersMap.get(c.company_id) ?? [],
    intel: intelMap.get(c.company_id) ?? null,
    gtm: gtmMap.get(c.company_id) ?? null,
  }))

export const frequentHirers = new Set(
  (companiesRaw as any[])
    .filter((c) => !c.excluded && c.hiring_roles?.length > 1)
    .map((c) => c.company_id)
)
