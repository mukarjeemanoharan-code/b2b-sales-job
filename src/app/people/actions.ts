"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateManualFields(formData: FormData) {
  const id = formData.get("id") as string;
  const manualLinkedin = (formData.get("manualLinkedin") as string) || null;
  const manualEmail = (formData.get("manualEmail") as string) || null;
  const manualPhone = (formData.get("manualPhone") as string) || null;
  const notes = (formData.get("notes") as string) || null;

  await prisma.person.update({
    where: { id },
    data: { manualLinkedin, manualEmail, manualPhone, notes },
  });

  revalidatePath("/people");
}
