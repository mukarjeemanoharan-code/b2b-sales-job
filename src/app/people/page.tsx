import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ConfidenceBadge } from "@/components/ConfidenceBadge";
import { updateManualFields } from "./actions";

export const dynamic = "force-dynamic";

const ROLE_CATEGORIES = ["leader", "buyer_persona", "influencer", "champion", "recruiter"] as const;

export default async function PeoplePage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const { role } = await searchParams;
  const activeRole = role && ROLE_CATEGORIES.includes(role as (typeof ROLE_CATEGORIES)[number]) ? role : undefined;

  const [people, counts] = await Promise.all([
    prisma.person.findMany({
      where: activeRole ? { roleCategory: activeRole } : undefined,
      include: { company: true },
      orderBy: [{ roleCategory: "asc" }, { fullName: "asc" }],
    }),
    prisma.person.groupBy({ by: ["roleCategory"], _count: true }),
  ]);

  const countFor = (cat: string) => counts.find((c) => c.roleCategory === cat)?._count ?? 0;

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-6 flex items-baseline justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-100">People</h1>
          <p className="mt-1 text-sm text-zinc-400">
            {people.length} shown · Champion entries are inference, never fact — evidence shown, not certainty.
          </p>
        </div>
        <Link href="/" className="text-sm text-sky-400 hover:underline">
          &larr; Dashboard
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap gap-2 text-sm">
        <Link
          href="/people"
          className={`rounded-full border px-3 py-1 ${!activeRole ? "border-sky-700 bg-sky-950 text-sky-300" : "border-zinc-800 text-zinc-400"}`}
        >
          All ({counts.reduce((n, c) => n + c._count, 0)})
        </Link>
        {ROLE_CATEGORIES.map((cat) => (
          <Link
            key={cat}
            href={`/people?role=${cat}`}
            className={`rounded-full border px-3 py-1 capitalize ${
              activeRole === cat ? "border-sky-700 bg-sky-950 text-sky-300" : "border-zinc-800 text-zinc-400"
            }`}
          >
            {cat.replace("_", " ")} ({countFor(cat)})
          </Link>
        ))}
      </div>

      <div className="space-y-4">
        {people.map((p) => (
          <div key={p.id} className="rounded-lg border border-zinc-800 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-zinc-100">{p.fullName}</span>
                  <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] uppercase text-zinc-400">
                    {p.roleCategory?.replace("_", " ")}
                  </span>
                  <ConfidenceBadge confidence={p.roleCategoryConfidence} />
                </div>
                <p className="text-sm text-zinc-400">
                  {p.title} ·{" "}
                  <Link href={`/companies/${p.companyId}`} className="hover:text-sky-400 hover:underline">
                    {p.company.name}
                  </Link>
                </p>
                {p.evidence && (
                  <p className="mt-1 text-xs italic text-amber-300/80">Evidence (inference): {p.evidence}</p>
                )}
                {p.linkedinUrl && (
                  <a href={p.linkedinUrl} target="_blank" rel="noreferrer" className="mt-1 block text-xs text-sky-400 hover:underline">
                    {p.linkedinUrl} (sourced)
                  </a>
                )}
                {p.sourceUrl && (
                  <a href={p.sourceUrl} target="_blank" rel="noreferrer" className="mt-0.5 block truncate text-xs text-zinc-600 hover:text-sky-400 hover:underline">
                    source: {p.sourceUrl}
                  </a>
                )}
              </div>
            </div>

            <form action={updateManualFields} className="mt-3 grid grid-cols-1 gap-2 border-t border-zinc-800 pt-3 sm:grid-cols-2">
              <input type="hidden" name="id" value={p.id} />
              <input
                type="url"
                name="manualLinkedin"
                placeholder="Paste LinkedIn URL manually"
                defaultValue={p.manualLinkedin ?? ""}
                className="rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-zinc-200 placeholder:text-zinc-600"
              />
              <input
                type="email"
                name="manualEmail"
                placeholder="Email (from your own outreach)"
                defaultValue={p.manualEmail ?? ""}
                className="rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-zinc-200 placeholder:text-zinc-600"
              />
              <input
                type="text"
                name="manualPhone"
                placeholder="Phone"
                defaultValue={p.manualPhone ?? ""}
                className="rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-zinc-200 placeholder:text-zinc-600"
              />
              <input
                type="text"
                name="notes"
                placeholder="Notes"
                defaultValue={p.notes ?? ""}
                className="rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-zinc-200 placeholder:text-zinc-600"
              />
              <button
                type="submit"
                className="col-span-full mt-1 w-fit rounded bg-sky-900 px-3 py-1 text-xs font-medium text-sky-200 hover:bg-sky-800"
              >
                Save
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
