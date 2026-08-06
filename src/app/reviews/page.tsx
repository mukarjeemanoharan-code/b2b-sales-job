import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ConfidenceBadge } from "@/components/ConfidenceBadge";
import { pasteReview } from "./actions";

export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
  const [companies, reviews] = await Promise.all([
    prisma.company.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.review.findMany({ include: { company: true }, orderBy: { createdAt: "desc" } }),
  ]);

  const companiesWithReviews = new Set(reviews.map((r) => r.companyId));
  const companiesWithoutReviews = companies.filter((c) => !companiesWithReviews.has(c.id));

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-6 flex items-baseline justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-100">Reviews</h1>
          <p className="mt-1 text-sm text-zinc-400">
            {reviews.length} reviews on file · Glassdoor/AmbitionBox/Indeed are never scraped. Paste review text you
            read yourself — nothing here is generated.
          </p>
        </div>
        <Link href="/" className="text-sm text-sky-400 hover:underline">
          &larr; Dashboard
        </Link>
      </div>

      <div className="rounded-lg border border-zinc-800 p-4">
        <h2 className="mb-3 text-sm font-semibold text-zinc-200">Paste a review</h2>
        <form action={pasteReview} className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <select name="companyId" required className="rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-zinc-200">
            <option value="">Company…</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <select name="reviewType" required className="rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-zinc-200">
            <option value="employee">Employee review</option>
            <option value="client">Client review</option>
          </select>
          <input name="source" placeholder="Source (e.g. Glassdoor, AmbitionBox)" className="rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-zinc-200 placeholder:text-zinc-600" />
          <input name="sourceUrl" placeholder="Source URL (if any)" className="rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-zinc-200 placeholder:text-zinc-600" />
          <input name="reviewerRole" placeholder="Reviewer role (e.g. SDR)" className="rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-zinc-200 placeholder:text-zinc-600" />
          <select name="reviewerStatus" className="rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-zinc-200">
            <option value="">Current/former…</option>
            <option value="current">Current employee</option>
            <option value="former">Former employee</option>
          </select>
          <input name="rating" type="number" step="0.1" min="1" max="5" placeholder="Rating (1-5, if given)" className="rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-zinc-200 placeholder:text-zinc-600" />
          <div />
          <textarea name="positives" placeholder="What they said was good (paste verbatim)" className="col-span-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-zinc-200 placeholder:text-zinc-600" rows={2} />
          <textarea name="negatives" placeholder="What they said was bad (paste verbatim)" className="col-span-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-zinc-200 placeholder:text-zinc-600" rows={2} />
          <button type="submit" className="col-span-full mt-1 w-fit rounded bg-sky-900 px-3 py-1 text-xs font-medium text-sky-200 hover:bg-sky-800">
            Save review
          </button>
        </form>
      </div>

      {reviews.length > 0 && (
        <div className="mt-8 space-y-3">
          <h2 className="text-sm font-semibold text-zinc-200">On file</h2>
          {reviews.map((r) => (
            <div key={r.id} className="rounded border border-zinc-800 p-3 text-sm">
              <div className="flex items-center gap-2">
                <Link href={`/companies/${r.companyId}`} className="font-medium text-zinc-100 hover:text-sky-400">
                  {r.company.name}
                </Link>
                <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] uppercase text-zinc-400">{r.reviewType}</span>
                {r.rating && <span className="text-zinc-400">{r.rating}/5</span>}
                <ConfidenceBadge confidence={r.confidence} />
              </div>
              {r.positives && <p className="mt-1 text-zinc-300">+ {r.positives}</p>}
              {r.negatives && <p className="text-zinc-400">- {r.negatives}</p>}
              <p className="mt-1 text-xs text-zinc-600">
                {r.source ?? "manual paste"} {r.reviewerRole && `· ${r.reviewerRole}`} {r.reviewerStatus && `(${r.reviewerStatus})`}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8">
        <h2 className="mb-2 text-sm font-semibold text-zinc-200">No reviews located ({companiesWithoutReviews.length})</h2>
        <p className="text-xs text-zinc-500">
          This is itself a real signal — several of these are very small teams with no public review footprint.
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {companiesWithoutReviews.map((c) => (
            <Link key={c.id} href={`/companies/${c.id}`} className="rounded bg-zinc-900 px-2 py-1 text-xs text-zinc-400 hover:text-sky-400">
              {c.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
