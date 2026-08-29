import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("Admin123!", 12);

  await prisma.user.upsert({
    where: { email: "admin@azveb.com" },
    update: {},
    create: {
      email: "admin@azveb.com",
      name: "Admin User",
      role: "ADMIN",
      passwordHash: adminPassword,
    },
  });

  await prisma.career.createMany({
    data: [
      {
        title: "Senior Frontend Developer",
        department: "Engineering",
        location: "Remote / Istanbul",
        type: "Full-time",
        description: "We are looking for an experienced frontend developer to join our team.",
        requirements: ["5+ years React experience", "TypeScript", "Next.js", "Tailwind CSS"],
      },
      {
        title: "Social Media Manager",
        department: "Marketing",
        location: "Istanbul",
        type: "Full-time",
        description: "Lead social media strategies for our diverse client portfolio.",
        requirements: ["3+ years experience", "Content creation", "Analytics tools", "Turkish & English"],
      },
      {
        title: "SEO Specialist",
        department: "Marketing",
        location: "Remote",
        type: "Full-time",
        description: "Drive organic growth through technical and content SEO.",
        requirements: ["Technical SEO", "Content strategy", "Google Analytics", "SEMrush/Ahrefs"],
      },
    ],
  });

  await prisma.caseStudy.createMany({
    data: [
      {
        title: "E-Commerce Brand Transformation",
        slug: "ecommerce-brand-transformation",
        client: "ModaX",
        industry: "E-Commerce",
        summary: "Complete digital transformation for a leading fashion retailer.",
        challenge: "Declining organic traffic and low conversion rates.",
        solution: "Implemented comprehensive SEO strategy, redesigned UX, and optimized conversion funnel.",
        results: "340% increase in organic traffic, 2.5x conversion rate improvement.",
        tags: ["SEO", "UX Design", "CRO"],
        published: true,
      },
      {
        title: "SaaS Startup Launch Campaign",
        slug: "saas-startup-launch",
        client: "CloudSync",
        industry: "SaaS",
        summary: "End-to-end marketing campaign for a B2B SaaS product launch.",
        challenge: "Zero brand awareness in a competitive market.",
        solution: "Multi-channel campaign combining paid ads, content marketing, and influencer partnerships.",
        results: "10,000 signups in first month, $2M ARR within 6 months.",
        tags: ["Paid Ads", "Content Marketing", "Brand Strategy"],
        published: true,
      },
      {
        title: "Restaurant Chain Social Growth",
        slug: "restaurant-social-growth",
        client: "Lezzet Grill",
        industry: "Food & Beverage",
        summary: "Social media growth strategy for a national restaurant chain.",
        challenge: "Inconsistent brand voice and low engagement across platforms.",
        solution: "Developed content calendar, brand guidelines, and community management system.",
        results: "500K followers gained in 8 months, 4x engagement rate.",
        tags: ["Social Media", "Content Strategy", "Community Management"],
        published: true,
      },
    ],
  });

  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
