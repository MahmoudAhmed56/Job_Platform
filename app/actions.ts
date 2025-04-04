"use server";

import { companySchema } from "@/lib/validation";
import { requireUser } from "./utils/requireUser";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function createCompany(data: z.infer<typeof companySchema>) {
  const session = await requireUser();

  const validateData = companySchema.safeParse(data);
  if (!validateData.success) {
    throw new Error("Invalid company data");
  }

  await prisma.user.update({
    where: { id: session?.id },
    data: {
      onboardingCompleted: true,
      userType: "COMPANY",
      company: {
        create: {
          ...validateData.data,
        },
      },
    },
  });
  return redirect("/");
}
