import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CompaniesPage() {
  const companies = await prisma.company.findMany({
    orderBy: { name: "asc" },
    include: {
      jobs: true,
      researchGaps: true,
      research: true,
    },
  });

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-6 flex items-baseline justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-100">Companies</h1>
          <p className="mt-1 text-sm text-zinc-400">
            {companies.length} companies tracked · {companies.filter((c) => c.researchStatus === "researched").length} researched ·{" "}
            {companies.reduce((n, c) => n + c.jobs.filter((j) => j.status === "open").length, 0)} open target-role signals
          </p>
        </div>
        <Link href="/" className="text-sm text-sky-400 hover:underline">
          &larr; Dashboard
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg border border-zinc-800">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-zinc-900 text-xs uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">HQ</th>
              <th className="px-4 py-3">Funding</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Open Roles</th>
              <th className="px-4 py-3">Research</th>
              <th className="px-4 py-3">Gaps</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {companies.map((c) => {
              const openJobs = c.jobs.filter((j) => j.status === "open");
              return (
                <tr key={c.id} className="hover:bg-zinc-900/60">
                  <td className="px-4 py-3">
                    <Link href={`/companies/${c.id}`} className="font-medium text-zinc-100 hover:text-sky-400">
                      {c.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-zinc-400">{c.hqCity}</td>
                  <td className="px-4 py-3 text-zinc-400">
                    {c.fundingStage}
                    {c.totalFunding ? ` · ${c.totalFunding}` : ""}
                  </td>
                  <td className="px-4 py-3 text-zinc-400">{c.category}</td>
                  <td className="px-4 py-3">
                    {openJobs.length > 0 ? (
                      <span className="rounded bg-emerald-950 px-2 py-0.5 text-xs font-medium text-emerald-300">
                        {openJobs.length} open
                      </span>
                    ) : (
                      <span className="rounded bg-zinc-800 px-2 py-0.5 text-xs text-zinc-500">none confirmed</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-zinc-400">{c.research ? "10 sections" : "—"}</td>
                  <td className="px-4 py-3 text-zinc-400">{c.researchGaps.length}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
