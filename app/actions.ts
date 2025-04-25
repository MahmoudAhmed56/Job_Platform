"use server";

import { companySchema, jobSchema, jobSeekerSchema } from "@/lib/validation";
import { requireUser } from "./utils/requireUser";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import arcjet, { detectBot, shield } from "./utils/arcjet";
import { request } from "@arcjet/next";
import { stripe } from "./utils/stripe";
import { jobListingDurationPricing } from "./utils/pricingTiers";
import { inngest } from "./utils/inngest/client";

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

export async function createJob(data: z.infer<typeof jobSchema>) {
  const user = await requireUser();
  if (!user) {
    redirect("/login");
  }
  const req = await request();
  const decision = await aj.protect(req);
  if (decision.isDenied()) {
    throw new Error("Forbidden");
  }
  const validatedData = jobSchema.parse(data);
  const company = await prisma.company.findUnique({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
      user: {
        select: {
          stripeCustomerId: true,
        },
      },
    },
  });
  if (!company?.id) {
    redirect("/");
  }

  let stripeCustomerId = company.user.stripeCustomerId;

  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user.email as string,
      name: user.name as string,
    });
    stripeCustomerId = customer.id;
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        stripeCustomerId: customer.id,
      },
    });
  }

  const jobPost = await prisma.jobPost.create({
    data: {
      companyId: company.id,
      jobDescription: validatedData.jobDescription,
      jobTitle: validatedData.jobTitle,
      employmentType: validatedData.employmentType,
      location: validatedData.location,
      salaryFrom: validatedData.salaryFrom,
      salaryTo: validatedData.salaryTo,
      listingDuration: validatedData.listingDuration,
      benefits: validatedData.benefits,
    },
    select: {
      id: true,
    },
  });
    // Trigger the job expiration function
    await inngest.send({
      name: "job/created",
      data: {
        jobId: jobPost.id,
        expirationDays: validatedData.listingDuration,
      },
    });
  

  const pricingTier = jobListingDurationPricing.find(
    (tier) => tier.days === validatedData.listingDuration
  );
  if (!pricingTier) {
    throw new Error("Invalid listing duration selected");
  }
  const isFreeTier = pricingTier === jobListingDurationPricing[0];

  const session = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    line_items: [
      {
        price_data: {
          product_data: {
            name: `Job Posting - ${pricingTier.days} Days`,
            description: pricingTier.description,
            images: [
              "https://e3vjorsq2d.ufs.sh/f/W7yr2XXPC0tAX5RgfGGSO3EmdSgsHYNRj5FVWfUL0T4zMhAZ",
            ],
          },
          currency: "USD",
          unit_amount: pricingTier.price * 100, // Convert to cents for Stripe
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    metadata: {
      jobId: jobPost.id,
    },
    success_url: `${process.env.NEXT_PUBLIC_URL}/payment/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/payment/cancel`,
  });

  if (isFreeTier) {
    return redirect(`/`);
  }
  return redirect(session.url as string);
}
