import { ConfidenceBadge } from "./ConfidenceBadge";

type Bullet = { text: string; source_url: string; confidence: string };

export function BulletList({ bullets }: { bullets: Bullet[] }) {
  if (!bullets || bullets.length === 0) {
    return <p className="text-sm text-zinc-500 italic">No data on file.</p>;
  }
  return (
    <ul className="space-y-3">
      {bullets.map((bul, i) => {
        const isInference = bul.confidence === "inference";
        return (
          <li
            key={i}
            className={`border-l-2 pl-3 text-sm leading-relaxed ${
              isInference ? "border-amber-700 text-amber-200/90 italic" : "border-zinc-700 text-zinc-200"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <span>{bul.text}</span>
              <ConfidenceBadge confidence={bul.confidence} />
            </div>
            {bul.source_url && bul.source_url !== "analyst-judgment" && (
              <a
                href={bul.source_url}
                target="_blank"
                rel="noreferrer"
                className="mt-1 block truncate text-xs text-zinc-500 hover:text-sky-400 hover:underline"
              >
                {bul.source_url}
              </a>
            )}
          </li>
        );
      })}
    </ul>
  );
}
