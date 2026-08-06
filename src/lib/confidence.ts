export type Confidence = "verified" | "likely" | "inference" | "unverified" | "not_found" | string | null | undefined;

export const confidenceStyles: Record<string, string> = {
  verified: "bg-emerald-950 text-emerald-300 border-emerald-800",
  likely: "bg-sky-950 text-sky-300 border-sky-800",
  inference: "bg-amber-950 text-amber-300 border-amber-800 italic",
  unverified: "bg-zinc-800 text-zinc-400 border-zinc-700",
  not_found: "bg-red-950 text-red-300 border-red-800",
};

export function confidenceClass(c: Confidence): string {
  if (!c) return confidenceStyles.unverified;
  return confidenceStyles[c] ?? confidenceStyles.unverified;
}

export const confidenceLabel: Record<string, string> = {
  verified: "Verified",
  likely: "Likely",
  inference: "Inference",
  unverified: "Unverified",
  not_found: "Not found",
};
