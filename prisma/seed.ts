import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  // Users
  const admin = await prisma.user.upsert({
    where: {
      email: "admin@example.com",
    },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@example.com",
      role: "ADMIN",
    },
  });

  const employer = await prisma.user.upsert({
    where: {
      email: "employer@example.com",
    },
    update: {},
    create: {
      name: "Employer User",
      email: "employer@example.com",
      role: "EMPLOYER",
    },
  });

  const candidate = await prisma.user.upsert({
    where: {
      email: "candidate@example.com",
    },
    update: {},
    create: {
      name: "Candidate User",
      email: "candidate@example.com",
      role: "CANDIDATE",
    },
  });

  // Categories
  const software = await prisma.category.upsert({
    where: {
      name: "Software Engineering",
    },
    update: {},
    create: {
      name: "Software Engineering",
      description: "Software development and engineering jobs",
    },
  });

  const marketing = await prisma.category.upsert({
    where: {
      name: "Marketing",
    },
    update: {},
    create: {
      name: "Marketing",
      description: "Marketing and digital marketing jobs",
    },
  });

  // Company
  const company = await prisma.company.create({
    data: {
      name: "EMBOBD",
      description: "A sample company for development",
      website: "https://example.com",
      ownerUserId: employer.id,
    },
  });

  // Job
  await prisma.job.create({
    data: {
      title: "Junior Software Engineer",
      description: "A sample software engineering position.",
      salaryMin: 30000,
      salaryMax: 50000,
      salaryCurrency: "BDT",
      location: "Dhaka",
      jobType: "FULL_TIME",
      workplaceType: "HYBRID",
      status: "PUBLISHED",
      publishedAt: new Date(),
      companyId: company.id,
      categoryId: software.id,
      ownerUserId: employer.id,
      applyEmail: "jobs@example.com",
    },
  });

  console.log("Seed completed successfully!");
  console.log({
    admin: admin.email,
    employer: employer.email,
    candidate: candidate.email,
    company: company.name,
    categories: [software.name, marketing.name],
  });
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });