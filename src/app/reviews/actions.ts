"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function pasteReview(formData: FormData) {
  const companyId = formData.get("companyId") as string;
  const reviewType = formData.get("reviewType") as string;
  const source = (formData.get("source") as string) || null;
  const sourceUrl = (formData.get("sourceUrl") as string) || null;
  const reviewerRole = (formData.get("reviewerRole") as string) || null;
  const reviewerStatus = (formData.get("reviewerStatus") as string) || null;
  const ratingRaw = formData.get("rating") as string;
  const positives = (formData.get("positives") as string) || null;
  const negatives = (formData.get("negatives") as string) || null;

  if (!companyId || !reviewType || (!positives && !negatives)) return;

  await prisma.review.create({
    data: {
      companyId,
      reviewType,
      source,
      sourceUrl,
      reviewerRole,
      reviewerStatus,
      rating: ratingRaw ? parseFloat(ratingRaw) : null,
      positives,
      negatives,
      confidence: "unverified", // owner-pasted, no independent verification of the review's authenticity
      ingestedVia: "manual_paste",
    },
  });

  revalidatePath("/reviews");
}
