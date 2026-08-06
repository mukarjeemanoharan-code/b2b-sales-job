import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ConfidenceBadge } from "@/components/ConfidenceBadge";
import { BulletList } from "@/components/BulletList";

export const dynamic = "force-dynamic";

const SECTIONS: { key: keyof NonNullable<Awaited<ReturnType<typeof getCompany>>>["research"] & object; title: string }[] = [
  { key: "overview" as never, title: "1. Company Overview" },
  { key: "businessModelAndTargetMarket" as never, title: "2. Business Model & Target Market" },
  { key: "leadershipAndOrgSignals" as never, title: "3. Leadership & Organizational Signals" },
  { key: "technologyStack" as never, title: "4. Technology Stack" },
  { key: "recentDevelopmentsAndTriggers" as never, title: "5. Recent Developments & Trigger Events" },
  { key: "buyingSignalsAndIntent" as never, title: "6. Buying Signals & Intent Indicators" },
  { key: "competitiveLandscape" as never, title: "7. Competitive Landscape" },
  { key: "identifiedPainPoints" as never, title: "8. Identified Pain Points" },
  { key: "recommendedEngagementStrategy" as never, title: "9. Recommended Engagement Strategy" },
  { key: "accountFitAssessment" as never, title: "10. Account Fit Assessment & Recommendation" },
];

async function getCompany(id: string) {
  return prisma.company.findUnique({
    where: { id },
    include: {
      research: true,
      jobs: { orderBy: { status: "asc" } },
      people: true,
      signals: { orderBy: { eventDate: "desc" } },
      researchGaps: true,
    },
  });
}

export default async function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const company = await getCompany(id);
  if (!company) notFound();

  const investors = (company.investors as string[] | null) ?? [];

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <Link href="/companies" className="text-sm text-sky-400 hover:underline">
        &larr; All companies
      </Link>

      <div className="mt-4 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-zinc-100">{company.name}</h1>
          <p className="mt-1 text-zinc-400">{company.icpSummary}</p>
        </div>
        <ConfidenceBadge confidence={company.confidence} />
      </div>

      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-zinc-400">
        {company.website && (
          <a href={company.website} target="_blank" rel="noreferrer" className="hover:text-sky-400 hover:underline">
            {company.website}
          </a>
        )}
        {company.linkedinCompanyUrl && (
          <a href={company.linkedinCompanyUrl} target="_blank" rel="noreferrer" className="hover:text-sky-400 hover:underline">
            LinkedIn
          </a>
        )}
        <span>{company.hqCity}</span>
        <span>
          {company.fundingStage}
          {company.totalFunding ? ` · ${company.totalFunding}` : ""}
        </span>
        {company.headcount && <span>~{company.headcount} employees</span>}
        {company.atsProvider && (
          <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-xs text-zinc-400">
            ATS: {company.atsProvider}/{company.atsSlug}
          </span>
        )}
      </div>

      {investors.length > 0 && (
        <p className="mt-2 text-xs text-zinc-500">Investors: {investors.join(", ")}</p>
      )}

      {/* Roles */}
      <section className="mt-10">
        <h2 className="mb-3 text-lg font-semibold text-zinc-100">Roles</h2>
        {company.jobs.length === 0 ? (
          <p className="text-sm text-zinc-500 italic">No target-role openings currently confirmed for this company.</p>
        ) : (
          <ul className="space-y-2">
            {company.jobs.map((j) => (
              <li key={j.id} className="rounded border border-zinc-800 p-3 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-zinc-100">
                    {j.title}
                    {j.normalizedTitle && (
                      <span className="ml-2 rounded bg-sky-950 px-1.5 py-0.5 text-[10px] uppercase text-sky-300">
                        {j.normalizedTitle}
                      </span>
                    )}
                  </span>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] uppercase ${
                      j.status === "open" ? "bg-emerald-950 text-emerald-300" : "bg-zinc-800 text-zinc-500"
                    }`}
                  >
                    {j.status}
                  </span>
                </div>
                <div className="mt-1 text-zinc-400">
                  {j.city && <span>{j.city} · </span>}
                  {j.experienceRange && <span>{j.experienceRange} · </span>}
                  <a href={j.sourceUrl ?? undefined} target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-sky-400 hover:underline">
                    source
                  </a>
                </div>
                {j.jdText && <p className="mt-1 text-xs text-zinc-500">{j.jdText}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* People */}
      <section className="mt-10">
        <h2 className="mb-3 text-lg font-semibold text-zinc-100">People</h2>
        <ul className="space-y-2">
          {company.people.map((p) => (
            <li key={p.id} className="flex items-center justify-between rounded border border-zinc-800 p-3 text-sm">
              <div>
                <span className="font-medium text-zinc-100">{p.fullName}</span>
                <span className="ml-2 text-zinc-400">{p.title}</span>
                <span className="ml-2 rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] uppercase text-zinc-400">
                  {p.roleCategory}
                </span>
              </div>
              {p.linkedinUrl ? (
                <a href={p.linkedinUrl} target="_blank" rel="noreferrer" className="text-xs text-sky-400 hover:underline">
                  LinkedIn
                </a>
              ) : (
                <span className="text-xs text-zinc-600 italic">no LinkedIn on file — add manually</span>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* Ten research sections */}
      <section className="mt-10 space-y-8">
        <h2 className="text-lg font-semibold text-zinc-100">Research</h2>
        {company.research ? (
          SECTIONS.map((s) => (
            <div key={String(s.key)}>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-400">{s.title}</h3>
              <BulletList bullets={(company.research as unknown as Record<string, { text: string; source_url: string; confidence: string }[]>)[s.key as string]} />
            </div>
          ))
        ) : (
          <p className="text-sm text-zinc-500 italic">Not yet researched.</p>
        )}
      </section>

      {/* Signals */}
      <section className="mt-10">
        <h2 className="mb-3 text-lg font-semibold text-zinc-100">Timeline / Signals</h2>
        {company.signals.length === 0 ? (
          <p className="text-sm text-zinc-500 italic">No signals on file.</p>
        ) : (
          <ul className="space-y-2">
            {company.signals.map((s) => (
              <li key={s.id} className="border-l-2 border-zinc-700 pl-3 text-sm">
                <div className="flex items-center gap-2 text-zinc-400">
                  <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] uppercase">{s.type}</span>
                  {s.eventDate && <span>{new Date(s.eventDate).toISOString().slice(0, 10)}</span>}
                  <ConfidenceBadge confidence={s.confidence} />
                </div>
                <p className="text-zinc-200">{s.detail}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Research gaps */}
      <section className="mt-10 mb-16">
        <h2 className="mb-3 text-lg font-semibold text-zinc-100">Research Gaps</h2>
        {company.researchGaps.length === 0 ? (
          <p className="text-sm text-zinc-500 italic">No gaps logged.</p>
        ) : (
          <ul className="space-y-2">
            {company.researchGaps.map((g) => (
              <li key={g.id} className="rounded border border-red-900/50 bg-red-950/20 p-3 text-sm">
                <span className="font-medium text-red-300">{g.fieldName}</span>
                <p className="mt-1 text-zinc-400">{g.note}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
