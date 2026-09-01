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
  console.log("Seeding Embroidery Categories, Companies, and Jobs...");

  // Users
  const employer = await prisma.user.upsert({
    where: {
      email: "employer@embobd.com",
    },
    update: {},
    create: {
      id: "usr_employer_01",
      name: "Apex Apparels HR",
      email: "employer@embobd.com",
      role: "EMPLOYER",
    },
  });

  // Embroidery Categories
  const categoriesData = [
    {
      name: "Wilcom & Machine Digitizing",
      description: "Wilcom e4, EMB, DST digitizing, stitch density, and underlay optimization.",
    },
    {
      name: "Karchupi & Bridal Handcraft",
      description: "Aari work, Zardosi, Nakshi Kantha, and luxury couture bridal embroidery.",
    },
    {
      name: "Industrial Garment Production",
      description: "Multi-head Tajima & Barudan machine operators, floor supervisors, and QC.",
    },
    {
      name: "3D Puff & Custom Badges",
      description: "Cap embroidery, sportswear emblems, laser-cut & tactical patches.",
    },
    {
      name: "Boutique & Fashion Patterns",
      description: "Kameez, Panjabi chest motifs, Saree borders, and Western apparel layouts.",
    },
    {
      name: "Machine Technicians & Setup",
      description: "Embroidery machine servicing, motherboard repair, calibration, and maintenance.",
    },
  ];

  const createdCategories: any = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.upsert({
      where: { name: cat.name },
      update: { description: cat.description },
      create: cat,
    });
    createdCategories[cat.name] = created;
  }

  // Companies
  const apexCompany = await prisma.company.upsert({
    where: { id: "comp_apex_01" },
    update: {},
    create: {
      id: "comp_apex_01",
      name: "Apex Textile & Apparels Ltd",
      description: "Leading 100% export oriented garment & embroidery manufacturing unit.",
      website: "https://apexapparels.example.com",
      logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=120&auto=format&fit=crop&q=80",
      ownerUserId: employer.id,
    },
  });

  const anokhiCompany = await prisma.company.upsert({
    where: { id: "comp_anokhi_02" },
    update: {},
    create: {
      id: "comp_anokhi_02",
      name: "Anokhi Haute Couture",
      description: "Luxury bridal and couture embroidery boutique based in Gulshan.",
      website: "https://anokhiboutique.example.com",
      logo: "https://images.unsplash.com/photo-1544441893-675973e31985?w=120&auto=format&fit=crop&q=80",
      ownerUserId: employer.id,
    },
  });

  const stitchLabCompany = await prisma.company.upsert({
    where: { id: "comp_stitchlab_03" },
    update: {},
    create: {
      id: "comp_stitchlab_03",
      name: "Global Stitch Studio",
      description: "High-precision digital embroidery and custom 3D patch studio.",
      website: "https://stitchlab.example.com",
      logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=120&auto=format&fit=crop&q=80",
      ownerUserId: employer.id,
    },
  });

  // Jobs
  const jobsData = [
    {
      title: "Senior Wilcom ES Digitizer (Export Knitwear)",
      description: `We are looking for an experienced Wilcom ES (e4.2 / e4.5) Digitizer for our export division.
      
Responsibilities:
- Create error-free EMB and DST files for high-speed multi-head Tajima embroidery machines.
- Optimize stitch density, underlay, and pull compensation for pique, single jersey, and fleece.
- Minimize thread breaks and trims during production runs.
- Work closely with the sampling department to test and verify stitchouts.

Requirements:
- 4+ years of professional experience with Wilcom ES.
- Strong knowledge of machine embroidery file formats (EMB, DST, PES).
- Experience with applique and sequin embroidery is a plus.`,
      salaryMin: 45000,
      salaryMax: 60000,
      salaryCurrency: "BDT",
      location: "Gazipur, Dhaka",
      jobType: "FULL_TIME",
      workplaceType: "ONSITE",
      status: "PUBLISHED",
      publishedAt: new Date(),
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      companyId: apexCompany.id,
      categoryId: createdCategories["Wilcom & Machine Digitizing"].id,
      ownerUserId: employer.id,
      applyEmail: "careers@apexapparels.com",
    },
    {
      title: "Master Karchupi & Zardosi Bridal Craftsman",
      description: `Anokhi Haute Couture is seeking a Master Karchupi & Aari needle artisan for our luxury bridal wear collection.

Responsibilities:
- Execute intricate Zari, Dabka, Sequins, and Resham threadwork on fine silk, net, and velvet fabrics.
- Translate designer sketches into handcrafted bridal lehenga borders, dupattas, and sarees.
- Oversee apprentice artisans and ensure immaculate finishing and symmetry.

Requirements:
- Minimum 6+ years of verified hand embroidery / Karchupi craft experience.
- Impeccable hand control and speed.
- Ability to work with authentic metallic zari and semi-precious beadwork.`,
      salaryMin: 35000,
      salaryMax: 50000,
      salaryCurrency: "BDT",
      location: "Gulshan-2, Dhaka",
      jobType: "FULL_TIME",
      workplaceType: "ONSITE",
      status: "PUBLISHED",
      publishedAt: new Date(),
      deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      companyId: anokhiCompany.id,
      categoryId: createdCategories["Karchupi & Bridal Handcraft"].id,
      ownerUserId: employer.id,
      applyEmail: "design@anokhiboutique.com",
    },
    {
      title: "Freelance 3D Puff Cap Patch Specialist",
      description: `We need an expert freelance digitizer to convert vector logos into high-density 3D Puff cap designs for overseas clients.

Responsibilities:
- Digitize custom cap crests and emblems with perfect foam capping and clean borders.
- Deliver DST and EMB source files within 4 to 8 hours turn-around time.
- Provide stitch simulation reports and recommended needle/thread specs.

Requirements:
- Proven track record with 3D Puff digitizing on structured 6-panel caps.
- High attention to underlay density and stitch direction.`,
      salaryMin: 1200,
      salaryMax: 2500,
      salaryCurrency: "BDT",
      location: "Remote (Bangladesh)",
      jobType: "FREELANCE",
      workplaceType: "REMOTE",
      status: "PUBLISHED",
      publishedAt: new Date(),
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      companyId: stitchLabCompany.id,
      categoryId: createdCategories["3D Puff & Custom Badges"].id,
      ownerUserId: employer.id,
      applyEmail: "digitizing@stitchlab.com",
    },
    {
      title: "Tajima 20-Head Embroidery Shift Master",
      description: `Apex Textile requires an experienced Shift Supervisor for our 20-head Tajima embroidery plant.

Responsibilities:
- Supervise 4 multi-head Tajima machines and operating crews.
- Perform needle replacements, thread tension calibration, and framing adjustments.
- Maintain daily output targets and ensure zero defective stitchouts.

Requirements:
- 5+ years working on computerized industrial embroidery machines.
- Troubleshooting basic machine errors and mechanical jams.`,
      salaryMin: 40000,
      salaryMax: 55000,
      salaryCurrency: "BDT",
      location: "Savar EPZ, Dhaka",
      jobType: "FULL_TIME",
      workplaceType: "ONSITE",
      status: "PUBLISHED",
      publishedAt: new Date(),
      deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      companyId: apexCompany.id,
      categoryId: createdCategories["Industrial Garment Production"].id,
      ownerUserId: employer.id,
      applyEmail: "jobs@apexapparels.com",
    },
  ];

  for (const job of jobsData) {
    await prisma.job.create({
      data: job as any,
    });
  }

  console.log("Successfully seeded Embroidery categories, companies, and jobs! 🎉");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });