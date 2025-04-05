"use server";

import { companySchema, jobSeekerSchema } from "@/lib/validation";
import { requireUser } from "./utils/requireUser";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import arcjet, { detectBot, shield } from "./utils/arcjet";
import { request } from "@arcjet/next";

const aj = arcjet.withRule(shield({})).withRule(
  detectBot({
    mode: "LIVE",
    allow: ["CATEGORY:SEARCH_ENGINE"],
  })
);

export async function createCompany(data: z.infer<typeof companySchema>) {
  const session = await requireUser();

  const req = await request();
  const decision = await aj.protect(req);
  if (decision.isDenied()) {
    throw new Error("Forbidden");
  }

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

export async function createJobSeeker(data: z.infer<typeof jobSeekerSchema>) {
  const user = await requireUser();

  const req = await request();
  const decision = await aj.protect(req);
  if (decision.isDenied()) {
    throw new Error("Forbidden");
  }

  const validateData = jobSeekerSchema.parse(data);
  await prisma.user.update({
    where: {
      id: user?.id as string,
    },
    data: {
      onboardingCompleted: true,
      userType: "jOB_SEEKER",
      JobSeeker: {
        create: {
          ...validateData,
        },
      },
    },
  });
  return redirect("/");
}
