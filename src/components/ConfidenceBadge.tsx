import { confidenceClass, confidenceLabel, type Confidence } from "@/lib/confidence";

export function ConfidenceBadge({ confidence }: { confidence: Confidence }) {
  const key = confidence ?? "unverified";
  return (
    <span
      className={`inline-block rounded border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${confidenceClass(
        confidence
      )}`}
    >
      {confidenceLabel[key] ?? key}
    </span>
  );
}
