'use client'
import { useState, useMemo } from 'react'
import type { Company } from '@/lib/companies'

const BLUE = '#0071E3'
const GREEN = '#34C759'
const ORANGE = '#FF9500'
const RED = '#FF3B30'
const PURPLE = '#AF52DE'

const STATUS_LABELS: Record<string, string> = {
  new: 'New', interested: 'Interested', applied: 'Applied', rejected: 'Rejected', parked: 'Parked',
}
const STATUS_COLORS: Record<string, string> = {
  new: '#86868B', interested: BLUE, applied: GREEN, rejected: RED, parked: ORANGE,
}
const STATUSES = ['new', 'interested', 'applied', 'rejected', 'parked']

function normalizeUrgency(u: string | undefined) {
  if (!u) return 'Medium'
  const l = u.toLowerCase()
  if (l.includes('high')) return 'High'
  if (l.includes('low')) return 'Low'
  return 'Medium'
}

function initials(name: string) {
  return name.split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()
}

function pill(label: string, bg: string, color: string) {
  return (
    <span key={label} style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 980, fontSize: 12, fontWeight: 500, background: bg, color, whiteSpace: 'nowrap' }}>
      {label}
    </span>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#86868B', marginBottom: 6 }}>{title}</div>
      {children}
    </div>
  )
}

function InfoText({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <p style={{ fontSize: 15, lineHeight: 1.55, color: '#1D1D1F', margin: 0, ...style }}>{children}</p>
}

function NotAvailable() {
  return <span style={{ color: '#86868B', fontSize: 14 }}>Not available</span>
}

function SourceLink({ url, label }: { url: string; label: string }) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
      style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: BLUE, textDecoration: 'none', marginTop: 6 }}>
      ↗ {label}
    </a>
  )
}

function CompanyCard({ company, isFreq, status, onStatusChange }: {
  company: Company; isFreq: boolean; status: string; onStatusChange: (id: number, s: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState('overview')
  const [menuOpen, setMenuOpen] = useState(false)
  const urgency = normalizeUrgency(company.gtm?.hiring_urgency)
  const urgColor = urgency === 'High' ? RED : urgency === 'Low' ? GREEN : ORANGE
  const isRemote = company.hiring_mode?.some(m => m.toLowerCase().includes('remote'))

  function handleStatusPick(s: string) {
    onStatusChange(company.company_id, s)
    setMenuOpen(false)
  }

  const tabs = ['Overview', 'Leadership', 'Intelligence', 'Research', 'GTM & Outreach']

  return (
    <div style={{ background: '#fff', border: '1px solid #E8E8ED', borderRadius: 14, overflow: 'hidden', transition: 'box-shadow 0.2s' }}>
      {/* Header */}
      <div style={{ padding: '20px 24px', cursor: 'pointer', display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'start' }}
        onClick={() => setOpen(o => !o)}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {company.company_name}
            {isFreq && pill('Frequent Hirer', '#F3E8F9', PURPLE)}
          </div>
          <div style={{ fontSize: 14, color: '#6E6E73', marginTop: 3 }}>{company.saas_category}</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
            {pill(company.company_stage, '#E8F0FE', BLUE)}
            {pill(`${urgency} Urgency`, urgColor + '22', urgColor)}
            {isRemote && pill('Remote', '#E8F8ED', GREEN)}
            {pill(company.employee_count + ' emp', '#F5F5F7', '#6E6E73')}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
          <div style={{ position: 'relative' }}>
            <button
              onClick={e => { e.stopPropagation(); setMenuOpen(m => !m) }}
              style={{ padding: '6px 16px', borderRadius: 980, border: `1.5px solid ${STATUS_COLORS[status]}`, background: status === 'new' ? 'transparent' : STATUS_COLORS[status], color: status === 'new' ? '#86868B' : '#fff', fontSize: 13, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer' }}>
              {STATUS_LABELS[status]}
            </button>
            {menuOpen && (
              <div onClick={e => e.stopPropagation()} style={{ position: 'absolute', top: '100%', right: 0, marginTop: 4, background: '#fff', border: '1px solid #D2D2D7', borderRadius: 10, boxShadow: '0 8px 28px rgba(0,0,0,0.12)', zIndex: 100, minWidth: 140, overflow: 'hidden' }}>
                {STATUSES.map(s => (
                  <button key={s} onClick={() => handleStatusPick(s)}
                    style={{ display: 'block', width: '100%', padding: '10px 16px', border: 'none', background: s === status ? '#F5F5F7' : 'transparent', fontSize: 14, fontFamily: 'inherit', color: STATUS_COLORS[s], cursor: 'pointer', textAlign: 'left', fontWeight: s === status ? 600 : 400 }}>
                    {STATUS_LABELS[s]}
                  </button>
                ))}
              </div>
            )}
          </div>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#86868B" strokeWidth="2" strokeLinecap="round"
            style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s', marginRight: 2 }}>
            <polyline points="4 7 9 12 14 7" />
          </svg>
        </div>
      </div>

      {/* Detail */}
      {open && (
        <div style={{ borderTop: '1px solid #E8E8ED' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #E8E8ED', overflowX: 'auto', padding: '0 24px' }}>
            {tabs.map(t => (
              <button key={t} onClick={() => setTab(t.toLowerCase().replace(' & ', '-').replace(' ', '-'))}
                style={{ padding: '12px 16px', border: 'none', background: 'transparent', fontSize: 14, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer', whiteSpace: 'nowrap', color: tab === t.toLowerCase().replace(' & ', '-').replace(' ', '-') ? BLUE : '#86868B', borderBottom: tab === t.toLowerCase().replace(' & ', '-').replace(' ', '-') ? `2px solid ${BLUE}` : '2px solid transparent' }}>
                {t}
              </button>
            ))}
          </div>

          <div style={{ padding: '20px 24px' }}>

            {/* Overview tab */}
            {tab === 'overview' && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 20 }}>
                  {[
                    ['Headquarters', company.hq],
                    ['Founded', company.founded],
                    ['Employees', company.employee_count],
                    ['Website', company.website],
                    ['LinkedIn', company.linkedin_url],
                    ['Revenue', company.intel?.revenue_estimate],
                  ].map(([label, val]) => (
                    <div key={label as string}>
                      <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#86868B', marginBottom: 3 }}>{label}</div>
                      {val
                        ? (label === 'Website' || label === 'LinkedIn')
                          ? <a href={val as string} target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, color: BLUE, textDecoration: 'none' }}>{(val as string).replace(/https?:\/\//, '')}</a>
                          : <span style={{ fontSize: 14, color: '#1D1D1F' }}>{val as string}</span>
                        : <NotAvailable />}
                    </div>
                  ))}
                </div>
                <Section title="About">
                  <InfoText>{company.about || <NotAvailable />}</InfoText>
                </Section>
                <Section title="Open Roles">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {company.hiring_roles.map((role, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#F5F5F7', borderRadius: 10, gap: 12 }}>
                        <span style={{ fontSize: 14, fontWeight: 500 }}>{role}</span>
                        {company.job_urls[i] && (
                          <a href={company.job_urls[i]} target="_blank" rel="noopener noreferrer"
                            style={{ padding: '5px 14px', borderRadius: 980, background: BLUE, color: '#fff', fontSize: 12, fontWeight: 500, textDecoration: 'none' }}>
                            View Job ↗
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </Section>
              </div>
            )}

            {/* Leadership tab */}
            {tab === 'leadership' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {company.leaders.length === 0 && <NotAvailable />}
                {company.leaders.map((l, i) => {
                  const avatarBg = l.role_category === 'founder_ceo' ? BLUE : l.role_category === 'vp_sales' ? GREEN : l.role_category === 'head_sales' ? ORANGE : PURPLE
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 14px', background: '#F5F5F7', borderRadius: 10 }}>
                      <div style={{ width: 38, height: 38, borderRadius: '50%', background: avatarBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14, fontWeight: 600, flexShrink: 0 }}>
                        {initials(l.name)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 15 }}>{l.name}</div>
                        <div style={{ fontSize: 13, color: '#6E6E73' }}>{l.title}</div>
                      </div>
                      {l.linkedin_url
                        ? <a href={l.linkedin_url} target="_blank" rel="noopener noreferrer" style={{ padding: '5px 12px', borderRadius: 980, border: `1px solid ${BLUE}`, color: BLUE, fontSize: 12, fontWeight: 500, textDecoration: 'none' }}>LinkedIn ↗</a>
                        : <span style={{ padding: '5px 12px', borderRadius: 980, border: '1px solid #D2D2D7', color: '#86868B', fontSize: 12 }}>No Profile</span>}
                    </div>
                  )
                })}
              </div>
            )}

            {/* Intelligence tab */}
            {tab === 'intelligence' && (
              <div>
                <Section title="Product">
                  <InfoText>{company.intel?.product_summary || <NotAvailable />}</InfoText>
                </Section>
                <Section title="Ideal Customer Profile">
                  <InfoText>{company.intel?.icp || <NotAvailable />}</InfoText>
                </Section>
                <Section title="Funding">
                  {company.intel?.funding
                    ? <>
                        <InfoText>{company.intel.funding.total_raised}</InfoText>
                        {company.intel.funding.last_round && <InfoText>Last round: {company.intel.funding.last_round}</InfoText>}
                        {company.intel.funding.investors?.length > 0 && <InfoText>Investors: {company.intel.funding.investors.join(', ')}</InfoText>}
                      </>
                    : <NotAvailable />}
                </Section>
                <Section title="Revenue Estimate">
                  <InfoText>{company.intel?.revenue_estimate || <NotAvailable />}</InfoText>
                </Section>
                <Section title="Competitors">
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {company.intel?.competitors?.map(c => (
                      <span key={c} style={{ padding: '3px 10px', background: '#F5F5F7', border: '1px solid #E8E8ED', borderRadius: 980, fontSize: 12, color: '#6E6E73' }}>{c}</span>
                    )) || <NotAvailable />}
                  </div>
                </Section>
                <Section title="Recent News">
                  <InfoText>{company.intel?.recent_news || <NotAvailable />}</InfoText>
                  {company.linkedin_url && <SourceLink url={company.linkedin_url} label="Verify on LinkedIn" />}
                </Section>
              </div>
            )}

            {/* Research tab — 8 sections */}
            {tab === 'research' && (
              <div>
                <div style={{ padding: '10px 14px', background: '#FFF4E6', borderRadius: 10, marginBottom: 20, fontSize: 13, color: '#6E6E73', borderLeft: `3px solid ${ORANGE}` }}>
                  All data below is research-derived. Click source links to verify directly.
                </div>

                <Section title="1. Company Overview">
                  <InfoText>{company.about || <NotAvailable />}</InfoText>
                  {company.intel?.product_summary && <InfoText style={{ marginTop: 8 }}>{company.intel.product_summary}</InfoText>}
                  {company.website && <SourceLink url={company.website} label="Verify on company website" />}
                  {company.linkedin_url && <><br /><SourceLink url={company.linkedin_url} label="Verify on LinkedIn" /></>}
                </Section>

                <Section title="2. Business Model & Target Market">
                  {company.intel?.icp
                    ? <InfoText>{company.intel.icp}</InfoText>
                    : <NotAvailable />}
                  {company.gtm?.gtm_motion && <InfoText style={{ marginTop: 8 }}>{company.gtm.gtm_motion}</InfoText>}
                  {company.website && <SourceLink url={company.website} label="Verify on company website" />}
                </Section>

                <Section title="3. Leadership & Organizational Signals">
                  {company.leaders.length === 0
                    ? <NotAvailable />
                    : <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {company.leaders.map((l, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: '#F5F5F7', borderRadius: 8 }}>
                            <div style={{ flex: 1 }}>
                              <span style={{ fontWeight: 600, fontSize: 14 }}>{l.name}</span>
                              <span style={{ color: '#6E6E73', fontSize: 13 }}> — {l.title}</span>
                            </div>
                            {l.linkedin_url && <a href={l.linkedin_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: BLUE, textDecoration: 'none' }}>LinkedIn ↗</a>}
                          </div>
                        ))}
                      </div>}
                  {company.gtm?.hiring_signal && <InfoText style={{ marginTop: 10, padding: '8px 12px', background: '#E8F0FE', borderRadius: 8 }}>{company.gtm.hiring_signal}</InfoText>}
                </Section>

                <Section title="4. Technology Stack">
                  <NotAvailable />
                  <p style={{ fontSize: 13, color: '#86868B', marginTop: 4 }}>
                    Check{' '}
                    {company.website && <a href={`https://www.wappalyzer.com/lookup/${company.website.replace(/https?:\/\//, '')}`} target="_blank" rel="noopener noreferrer" style={{ color: BLUE }}>Wappalyzer ↗</a>}
                    {' '}or{' '}
                    {company.website && <a href={`https://builtwith.com/${company.website.replace(/https?:\/\//, '')}`} target="_blank" rel="noopener noreferrer" style={{ color: BLUE }}>BuiltWith ↗</a>}
                    {' '}for tech stack data.
                  </p>
                </Section>

                <Section title="5. Recent Developments & Trigger Events">
                  {company.intel?.recent_news
                    ? <InfoText>{company.intel.recent_news}</InfoText>
                    : <NotAvailable />}
                  {company.gtm?.hiring_signal && <InfoText style={{ marginTop: 8 }}>Hiring signal: {company.gtm.hiring_signal}</InfoText>}
                  {company.linkedin_url && <SourceLink url={company.linkedin_url} label="Check LinkedIn news" />}
                  {company.website && <><br /><SourceLink url={`https://news.google.com/search?q=${encodeURIComponent(company.company_name)}`} label="Search Google News" /></>}
                </Section>

                <Section title="6. Buying Signals & Intent Indicators">
                  {company.gtm?.observable_gtm_gaps
                    ? <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {company.gtm.observable_gtm_gaps.map((g, i) => (
                          <div key={i} style={{ padding: '8px 12px', background: '#FFF4E6', borderRadius: 8, fontSize: 14, lineHeight: 1.5 }}>{g}</div>
                        ))}
                      </div>
                    : <NotAvailable />}
                  {company.gtm?.target_market && <InfoText style={{ marginTop: 8 }}>Target market: {company.gtm.target_market}</InfoText>}
                </Section>

                <Section title="7. Competitive Landscape">
                  {company.intel?.competitors?.length
                    ? <>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                          {company.intel.competitors.map(c => (
                            <span key={c} style={{ padding: '4px 12px', background: '#F5F5F7', border: '1px solid #E8E8ED', borderRadius: 980, fontSize: 13, color: '#1D1D1F' }}>{c}</span>
                          ))}
                        </div>
                        <SourceLink url={`https://www.g2.com/search#q=${encodeURIComponent(company.company_name)}`} label="Verify on G2" />
                      </>
                    : <NotAvailable />}
                </Section>

                <Section title="8. Identified Pain Points">
                  {company.gtm?.observable_gtm_gaps
                    ? <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {company.gtm.observable_gtm_gaps.map((g, i) => (
                          <div key={i} style={{ padding: '8px 12px', background: '#FFEBEA', borderRadius: 8, fontSize: 14, lineHeight: 1.5 }}>{g}</div>
                        ))}
                      </div>
                    : <NotAvailable />}
                  {company.intel?.icp && <InfoText style={{ marginTop: 8 }}>ICP: {company.intel.icp}</InfoText>}
                </Section>
              </div>
            )}

            {/* GTM & Outreach tab */}
            {tab === 'gtm-&-outreach' && (
              <div>
                <Section title="GTM Motion">
                  <InfoText>{company.gtm?.gtm_motion || <NotAvailable />}</InfoText>
                </Section>
                <Section title="Sales Motion">
                  <InfoText>{company.gtm?.sales_motion || <NotAvailable />}</InfoText>
                </Section>
                <Section title="Observable GTM Gaps">
                  {company.gtm?.observable_gtm_gaps
                    ? company.gtm.observable_gtm_gaps.map((g, i) => (
                        <div key={i} style={{ padding: '8px 12px', background: '#FFF4E6', borderRadius: 8, fontSize: 14, lineHeight: 1.5, marginBottom: 6 }}>{g}</div>
                      ))
                    : <NotAvailable />}
                </Section>
                <Section title="Outreach Angle">
                  <div style={{ padding: '16px 18px', background: '#E8F0FE', borderRadius: 10, fontSize: 14, lineHeight: 1.55, borderLeft: `3px solid ${BLUE}` }}>
                    {company.gtm?.outreach_angle || <NotAvailable />}
                  </div>
                </Section>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  )
}

export default function DashboardClient({ companies, frequentHirers, initialStatuses, user }: {
  companies: Company[]
  frequentHirers: number[]
  initialStatuses: Record<number, string>
  user: { name?: string | null; email: string }
}) {
  const freqSet = useMemo(() => new Set(frequentHirers), [frequentHirers])
  const [statuses, setStatuses] = useState<Record<number, string>>(initialStatuses)
  const [search, setSearch] = useState('')
  const [stageFilter, setStageFilter] = useState('all')
  const [urgencyFilter, setUrgencyFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [freqFilter, setFreqFilter] = useState('all')

  async function handleStatusChange(companyId: number, status: string) {
    setStatuses(prev => ({ ...prev, [companyId]: status }))
    await fetch('/api/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ companyId, status }),
    })
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/login'
  }

  const filtered = useMemo(() => {
    return companies.filter(c => {
      if (stageFilter !== 'all' && c.company_stage !== stageFilter) return false
      const u = normalizeUrgency(c.gtm?.hiring_urgency)
      if (urgencyFilter !== 'all' && u !== urgencyFilter) return false
      const st = statuses[c.company_id] || 'new'
      if (statusFilter !== 'all' && st !== statusFilter) return false
      if (freqFilter === 'freq' && !freqSet.has(c.company_id)) return false
      if (search) {
        const q = search.toLowerCase()
        const hay = [c.company_name, c.saas_category, c.about, ...c.hiring_roles, ...(c.hiring_locations || [])].join(' ').toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [companies, stageFilter, urgencyFilter, statusFilter, freqFilter, search, statuses, freqSet])

  const stats = useMemo(() => ({
    total: filtered.length,
    high: filtered.filter(c => normalizeUrgency(c.gtm?.hiring_urgency) === 'High').length,
    interested: filtered.filter(c => (statuses[c.company_id] || 'new') === 'interested').length,
    applied: filtered.filter(c => (statuses[c.company_id] || 'new') === 'applied').length,
    freq: filtered.filter(c => freqSet.has(c.company_id)).length,
    remote: filtered.filter(c => c.hiring_mode?.some(m => m.toLowerCase().includes('remote'))).length,
  }), [filtered, statuses, freqSet])

  function SegControl({ options, value, onChange }: { options: { label: string; val: string }[]; value: string; onChange: (v: string) => void }) {
    return (
      <div style={{ display: 'inline-flex', background: '#fff', border: '1px solid #D2D2D7', borderRadius: 980, overflow: 'hidden' }}>
        {options.map(o => (
          <button key={o.val} onClick={() => onChange(o.val)}
            style={{ padding: '7px 14px', border: 'none', background: value === o.val ? BLUE : 'transparent', color: value === o.val ? '#fff' : '#6E6E73', fontSize: 13, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {o.label}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FBFBFD', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif', WebkitFontSmoothing: 'antialiased' }}>
      {/* Nav */}
      <nav style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #E8E8ED', position: 'sticky', top: 0, zIndex: 50, padding: '0 24px' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 52 }}>
          <span style={{ fontWeight: 700, fontSize: 17, color: '#1D1D1F' }}>📊 B2B Sales Job</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 14, color: '#6E6E73' }}>{user.name || user.email}</span>
            <button onClick={handleLogout} style={{ padding: '6px 14px', borderRadius: 980, border: '1px solid #D2D2D7', background: 'transparent', fontSize: 13, fontWeight: 500, fontFamily: 'inherit', color: '#1D1D1F', cursor: 'pointer' }}>Sign Out</button>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <div style={{ padding: '40px 0 24px' }}>
          <h1 style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-0.015em', color: '#1D1D1F', margin: 0 }}>Market Intelligence</h1>
          <p style={{ fontSize: 17, color: '#6E6E73', marginTop: 6 }}>20 B2B SaaS companies hiring SDR/BDR in India — Updated Aug 5, 2026</p>
        </div>

        {/* Search */}
        <div style={{ marginBottom: 16 }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search companies, roles, categories…"
            style={{ width: '100%', padding: '12px 20px 12px 44px', border: '1px solid #D2D2D7', borderRadius: 10, fontSize: 15, fontFamily: 'inherit', background: '#fff', color: '#1D1D1F', outline: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' fill='none' stroke='%2386868B' stroke-width='2' stroke-linecap='round'%3E%3Ccircle cx='8' cy='8' r='5.5'/%3E%3Cline x1='12' y1='12' x2='16' y2='16'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: '16px center', boxSizing: 'border-box' }} />
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
          <SegControl value={stageFilter} onChange={setStageFilter} options={[{ label: 'All Stages', val: 'all' }, { label: 'Startup', val: 'Startup' }, { label: 'Growth', val: 'High Growth Startup' }, { label: 'Scale-up', val: 'Scale-up' }, { label: 'Enterprise', val: 'Enterprise' }]} />
          <SegControl value={urgencyFilter} onChange={setUrgencyFilter} options={[{ label: 'All Urgency', val: 'all' }, { label: 'High', val: 'High' }, { label: 'Medium', val: 'Medium' }, { label: 'Low', val: 'Low' }]} />
          <SegControl value={statusFilter} onChange={setStatusFilter} options={[{ label: 'All Status', val: 'all' }, { label: 'New', val: 'new' }, { label: 'Interested', val: 'interested' }, { label: 'Applied', val: 'applied' }, { label: 'Rejected', val: 'rejected' }, { label: 'Parked', val: 'parked' }]} />
          <SegControl value={freqFilter} onChange={setFreqFilter} options={[{ label: 'All', val: 'all' }, { label: 'Frequent Hirer', val: 'freq' }]} />
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12, marginBottom: 24 }}>
          {[
            { label: 'Companies', val: stats.total, color: '#1D1D1F' },
            { label: 'High Urgency', val: stats.high, color: RED },
            { label: 'Interested', val: stats.interested, color: BLUE },
            { label: 'Applied', val: stats.applied, color: GREEN },
            { label: 'Frequent Hirers', val: stats.freq, color: PURPLE },
            { label: 'Remote', val: stats.remote, color: '#5AC8FA' },
          ].map(s => (
            <div key={s.label} style={{ background: '#fff', border: '1px solid #E8E8ED', borderRadius: 10, padding: '14px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: s.color, letterSpacing: '-0.02em' }}>{s.val}</div>
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#86868B', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Company list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingBottom: 60 }}>
          {filtered.length === 0
            ? <div style={{ textAlign: 'center', padding: '60px 24px', color: '#86868B', fontSize: 17 }}>No companies match your filters.</div>
            : filtered.map(c => (
                <CompanyCard
                  key={c.company_id}
                  company={c}
                  isFreq={freqSet.has(c.company_id)}
                  status={statuses[c.company_id] || 'new'}
                  onStatusChange={handleStatusChange}
                />
              ))}
        </div>
      </div>
    </div>
  )
}
