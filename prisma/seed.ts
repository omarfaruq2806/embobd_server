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
  console.log("Seeding Embroidery Categories, Companies, and 10 Bulk Jobs...");

  // 1. Seed Users (Employers & Admins)
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

  const boutiqueOwner = await prisma.user.upsert({
    where: {
      email: "boutique@embobd.com",
    },
    update: {},
    create: {
      id: "usr_boutique_02",
      name: "Anokhi Fashion Studio",
      email: "boutique@embobd.com",
      role: "EMPLOYER",
    },
  });

  // 2. Seed Embroidery Categories
  const categoriesData = [
    {
      name: "Wilcom & Machine Digitizing",
      description: "উইলকম ES, EMB, DST ডিজিটাইজিং, স্টিচ ডেনসিটি ও আন্ডারলে অপটিমাইজেশন।",
    },
    {
      name: "Karchupi & Bridal Handcraft",
      description: "আরি কাজ, জারদৌসি, রেশম জরি ও এক্সক্লুসিভ ব্রাইডাল হস্তশিল্প।",
    },
    {
      name: "Industrial Garment Production",
      description: "মাল্টি-হেড তাজিমা ও বারুদান মেশিন অপারেটর, ফ্লোর সুপারভাইজার ও কিউসি।",
    },
    {
      name: "3D Puff & Custom Badges",
      description: "ক্যাপ এমব্রয়ডারি, স্পোর্টসওয়্যার ক্রেস্ট, ৩ডি ফোম ও লেজার-কাট প্যাচ।",
    },
    {
      name: "Boutique & Fashion Patterns",
      description: "পাঞ্জাবি চেস্ট মোটিফ, শাড়ি ও সালোয়ার কামিজ প্যাটার্ন ডিজাইন।",
    },
    {
      name: "Machine Technicians & Setup",
      description: "কম্পিউটারাইজড মেশিন মেরামত, মাদারবোর্ড সার্ভিসিং ও পার্টস মেইনটেন্যান্স।",
    },
  ];

  const createdCategories: Record<string, any> = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.upsert({
      where: { name: cat.name },
      update: { description: cat.description },
      create: cat,
    });
    createdCategories[cat.name] = created;
  }

  // 3. Seed Companies
  const companiesData = [
    {
      id: "comp_apex_01",
      name: "এপেক্স টেক্সটাইল অ্যান্ড অ্যাপারেলস লিমিটেড (Apex Textile)",
      description: "বাংলাদেশের শীর্ষ ১০০% রপ্তানিমুখী কম্পোজিট নিটওয়্যার ও হাই-টেক এমব্রয়ডারি কারখানা।",
      website: "https://apextextile.example.com",
      logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=120&auto=format&fit=crop&q=80",
      ownerUserId: employer.id,
    },
    {
      id: "comp_anokhi_02",
      name: "অনুখী হট কুচিউর (Anokhi Haute Couture)",
      description: "লাক্সারি ব্রাইডাল ওয়্যার, এক্সক্লুসিভ লেহেঙ্গা ও ঐতিহ্যবাহী কারচুপি বুটিক হাউস।",
      website: "https://anokhiboutique.example.com",
      logo: "https://images.unsplash.com/photo-1544441893-675973e31985?w=120&auto=format&fit=crop&q=80",
      ownerUserId: boutiqueOwner.id,
    },
    {
      id: "comp_stitchlab_03",
      name: "গ্লোবাল স্টিচল্যাব বিডি (Global Stitch Studio)",
      description: "ইউএস ও ইউরোপের ক্লায়েন্টদের জন্য প্রিমিয়াম ৩ডি পাফ ও ভেক্টর ডিজিটাইজিং স্টুডিও।",
      website: "https://stitchlab.example.com",
      logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=120&auto=format&fit=crop&q=80",
      ownerUserId: employer.id,
    },
    {
      id: "comp_bexi_04",
      name: "বেক্সি এমব্রয়ডারি জোন (Bexi Embroidery Zone)",
      description: "সাভার ইপিজেডে অবস্থিত ৩০+ মাল্টি-হেড তাজিমা মেশিনের সর্বাধুনিক প্রোডাকশন ইউনিট।",
      website: "https://bexiembroidery.example.com",
      logo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=120&auto=format&fit=crop&q=80",
      ownerUserId: employer.id,
    },
    {
      id: "comp_aarong_05",
      name: "আড়ং হেরিটেজ স্টুডিও (Heritage Crafts Studio)",
      description: "বাংলার ঐতিহ্যবাহী নকশী কাঁথা ও হ্যান্ডলুম ফ্যাশন ডিজাইনিং সেন্টার।",
      website: "https://heritagecrafts.example.com",
      logo: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=120&auto=format&fit=crop&q=80",
      ownerUserId: boutiqueOwner.id,
    },
    {
      id: "comp_machinery_06",
      name: "সাউথ চায়না এমব্রয়ডারি মেশিনারিজ অ্যান্ড পার্টস",
      description: "তাজিমা, বারুদান ও রিকোমা মেশিনের অফিসিয়াল যন্ত্রাংশ ও টেকনিক্যাল সার্ভিস প্রোভাইডার।",
      website: "https://chinamachinery.example.com",
      logo: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=120&auto=format&fit=crop&q=80",
      ownerUserId: employer.id,
    },
  ];

  const createdCompanies: Record<string, any> = {};
  for (const comp of companiesData) {
    const created = await prisma.company.upsert({
      where: { id: comp.id },
      update: {
        name: comp.name,
        description: comp.description,
        website: comp.website,
        logo: comp.logo,
      },
      create: comp,
    });
    createdCompanies[comp.id] = created;
  }

  // 4. Seed 10 Realistic Bulk Jobs
  const bulkJobsData = [
    {
      id: "job_seed_01",
      title: "সিনিয়র উইলকম ES ডিজিটাইজার (গার্মেন্টস এক্সপোর্ট)",
      description: `আমাদের ১০০% রপ্তানিমুখী নিটওয়্যার কারখানার জন্য অত্যন্ত অভিজ্ঞ সিনিয়র উইলকম ডিজিটাইজার প্রয়োজন।

দায়িত্বসমূহ:
- হাই-স্পিড তাজিমা ও বারুদান মেশিনের জন্য শতভাগ ত্রুটিমুক্ত EMB এবং DST ফাইল তৈরি করা।
- পিকে পোলো, সিঙ্গেল জার্সি এবং ফ্লিস কাপড়ে পুল-কম্পেনসেশন ও সঠিক আন্ডারলে সেটিং নিশ্চিত করা।
- প্রোডাকশন ফ্লোরে সুতা কাটা (Thread breaks) ও অতিরিক্ত ট্রিম ন্যূনতম পর্যায়ে নামিয়ে আনা।
- স্যাম্পল সেকশনের সাথে সরাসরি কাজ করে টেস্ট স্টিচআউট অনুমোদন করা।

যোগ্যতা ও অভিজ্ঞতা:
- উইলকম e4.2 বা e4.5 সফটওয়্যারে ন্যূনতম ৪-৫ বছরের বাস্তব অভিজ্ঞতা।
- এক্সপোর্ট স্ট্যান্ডার্ড অ্যাপ্লিক ও সিকোয়েন্স কাজের গভীর ধারণা।
- দ্রুত কাজ করার দক্ষতা এবং ডেডলাইন বজায় রাখার মানসিকতা।`,
      salaryMin: 45000,
      salaryMax: 65000,
      salaryCurrency: "BDT",
      location: "গাজীপুর চৌরাস্তা, ঢাকা (অন-সাইট)",
      jobType: "FULL_TIME",
      workplaceType: "ONSITE",
      status: "PUBLISHED",
      publishedAt: new Date(),
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      companyId: createdCompanies["comp_apex_01"].id,
      categoryId: createdCategories["Wilcom & Machine Digitizing"].id,
      ownerUserId: employer.id,
      applyEmail: "careers@apextextile.com.bd",
    },
    {
      id: "job_seed_02",
      title: "প্রধান কারচুপি ও জারদৌসি ব্রাইডাল মাস্টার",
      description: `অনুখী হট কুচিউরের এক্সক্লুসিভ ব্রাইডাল কালেকশনের জন্য একজন সুদক্ষ ও সৃজনশীল কারচুপি মাস্টার নিয়োগ দেওয়া হবে।

দায়িত্বসমূহ:
- খাঁটি রেশম সিল্ক, নেট ও ভেলভেটের ওপর জারদৌসি, ডাবকা, আরি এবং পুঁতি-জরির নিখুঁত হাতের কাজ সম্পাদন করা।
- ফ্যাশন ডিজাইনারের স্কেচ দেখে ব্রাইডাল লেহেঙ্গা, দোপাট্টা এবং শাড়ির সীমানা (Border) লেআউট তৈরি করা।
- জুনিয়র কারিগরদের কাজের তদারকি ও প্রিমিয়াম ফিনিশিং নিশ্চিত করা।

যোগ্যতা:
- লাক্সারি ব্রাইডাল ওয়্যারে ন্যূনতম ৬-৮ বছরের কাজের অভিজ্ঞতা।
- জারদৌসি ও মেটালিক জারি সুতা ব্যবহারের সর্বোচ্চ দক্ষতা।`,
      salaryMin: 35000,
      salaryMax: 50000,
      salaryCurrency: "BDT",
      location: "গুলশান-২, ঢাকা",
      jobType: "FULL_TIME",
      workplaceType: "ONSITE",
      status: "PUBLISHED",
      publishedAt: new Date(),
      deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      companyId: createdCompanies["comp_anokhi_02"].id,
      categoryId: createdCategories["Karchupi & Bridal Handcraft"].id,
      ownerUserId: boutiqueOwner.id,
      applyEmail: "design@anokhiboutique.com",
    },
    {
      id: "job_seed_03",
      title: "ফ্রিল্যান্স ৩ডি পাফ ও ক্যাপ প্যাচ ডিজিটাইজার (রিমোট)",
      description: `ইউএস ও ইউরোপের বায়ারদের কাস্টম ক্যাপ এবং স্পোর্টসওয়্যার ক্রেস্টের জন্য নিয়মিত ফ্রিল্যান্স ৩ডি পাফ পাঞ্চার প্রয়োজন।

কাজের বিবরণ:
- ভেক্টর ফাইল থেকে হাই-ডেনসিটি ৩ডি ইভিএ ফোম ক্যাপ ডিজাইন তৈরি করা।
- প্রতি ডিজাইনের জন্য ৪ থেকে ৬ ঘণ্টার মধ্যে DST ও EMB সোর্স ফাইল ডেলিভারি দেওয়া।
- পারফেক্ট ক্যাপ হুপিং ও স্টিচ ডিরেকশন বজায় রাখা।

সুবিধাসমূহ:
- প্রতি ডিজাইনের জন্য আকর্ষণীয় ফিক্সড রেট ও ইনস্ট্যান্ট পেমেন্ট।
- সম্পূর্ণ ঘরে বসে কাজ করার সুযোগ।`,
      salaryMin: 1500,
      salaryMax: 3000,
      salaryCurrency: "BDT",
      location: "রিমোট (সারাদেশ)",
      jobType: "FREELANCE",
      workplaceType: "REMOTE",
      status: "PUBLISHED",
      publishedAt: new Date(),
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      companyId: createdCompanies["comp_stitchlab_03"].id,
      categoryId: createdCategories["3D Puff & Custom Badges"].id,
      ownerUserId: employer.id,
      applyEmail: "remote-jobs@stitchlab.com",
    },
    {
      id: "job_seed_04",
      title: "তাজিমা ২০-হেড মেশিন শিফট ইন-চার্জ / ফ্লোর সুপারভাইজার",
      description: `বেক্সি এমব্রয়ডারি জোনে মাল্টি-হেড তাজিমা মেশিন পরিচালনার জন্য অভিজ্ঞ শিফট ইন-চার্জ আবশ্যক।

দায়িত্বসমূহ:
- ৪টি ২০-হেড তাজিমা মেশিনের শিফট পরিচালনা ও অপারেটরদের কাজের শিডিউলিং।
- সুতার টেনশন, সুই পরিবর্তন ও ফ্রেমিং সংক্রান্ত প্রযুক্তিগত সমস্যার দ্রুত সমাধান।
- দৈনিক প্রোডাকশন টার্গেট পূরণ এবং রিজেকশন রেট ০.৫% এর নিচে রাখা।

প্রয়োজনীয় অভিজ্ঞতা:
- কম্পিউটরাইজড ইন্ডাস্ট্রিয়াল এমব্রয়ডারি কারখানায় ন্যূনতম ৫ বছরের বাস্তব অভিজ্ঞতা।`,
      salaryMin: 40000,
      salaryMax: 55000,
      salaryCurrency: "BDT",
      location: "সাভার ইপিজেড, ঢাকা",
      jobType: "FULL_TIME",
      workplaceType: "ONSITE",
      status: "PUBLISHED",
      publishedAt: new Date(),
      deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      companyId: createdCompanies["comp_bexi_04"].id,
      categoryId: createdCategories["Industrial Garment Production"].id,
      ownerUserId: employer.id,
      applyEmail: "hr@bexiembroidery.com",
    },
    {
      id: "job_seed_05",
      title: "এক্সক্লুসিভ পাঞ্জাবি চেস্ট ও বুটিক প্যাটার্ন ডিজাইনার",
      description: `ঈদ ও উৎসবের জন্য এক্সক্লুসিভ পুরুষদের পাঞ্জাবি চেস্ট মোটিফ, কলার ও কাফ ডিজাইন তৈরির জন্য দক্ষ ক্রিয়েটিভ ডিজাইনার প্রয়োজন।

দায়িত্বসমূহ:
- প্রিমিয়াম কটন, সিল্ক ও তসর কাপড়ের ওপর ফ্লোরাল ও জ্যামিতিক প্যাটার্ন তৈরি করা।
- আধুনিক ট্রেন্ড অনুযায়ী মিনিমালিস্ট ও লাক্সারি এমব্রয়ডারি লেআউট প্রস্তুত করা।
- স্যাম্পল স্টিচআউট দেখে নিখুঁত কালার কম্বিনেশন নির্বাচন করা।

যোগ্যতা:
- বুটিক বা লাইফস্টাইল ব্র্যান্ডে ৩+ বছরের অভিজ্ঞতা।
- উইলকম ও অ্যাডোবি ইলাস্ট্রেটরে সমান পারদর্শিতা।`,
      salaryMin: 32000,
      salaryMax: 48000,
      salaryCurrency: "BDT",
      location: "ধানমন্ডি, ঢাকা (হাইব্রিড)",
      jobType: "FULL_TIME",
      workplaceType: "HYBRID",
      status: "PUBLISHED",
      publishedAt: new Date(),
      deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
      companyId: createdCompanies["comp_aarong_05"].id,
      categoryId: createdCategories["Boutique & Fashion Patterns"].id,
      ownerUserId: boutiqueOwner.id,
      applyEmail: "careers@heritagecrafts.com",
    },
    {
      id: "job_seed_06",
      title: "বারুদান ও তাজিমা মেশিন ইলেকট্রনিক্স টেকনিশিয়ান",
      description: `ইন্ডাস্ট্রিয়াল এমব্রয়ডারি মেশিনের মাদারবোর্ড, ড্রাইভার বোর্ড ও মোটর সার্ভিসিংয়ের জন্য অভিজ্ঞ ইলেকট্রনিক্স টেকনিশিয়ান নিয়োগ দেওয়া হবে।

কাজের বিবরণ:
- মেশিনের কম্পিউটার সার্কিট ও এনকোডার ত্রুটি নির্ণয় ও মেরামত।
- সার্ভো মোটর ক্যালিব্রেশন এবং হেড মেকানিজম সার্ভিসিং।
- অন-কল সার্ভিসিংয়ের জন্য বিভিন্ন ফ্যাক্টরি ভিজিট করা।

অভিজ্ঞতা:
- এমব্রয়ডারি মেশিন ইলেকট্রনিক্সে ন্যূনতম ৪ বছরের অভিজ্ঞতা ও ডিপ্লোমা ইন ইলেকট্রনিক্স/মেকাট্রনিক্স।`,
      salaryMin: 38000,
      salaryMax: 52000,
      salaryCurrency: "BDT",
      location: "নারায়ণগঞ্জ ও গাজীপুর জোন",
      jobType: "FULL_TIME",
      workplaceType: "ONSITE",
      status: "PUBLISHED",
      publishedAt: new Date(),
      deadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
      companyId: createdCompanies["comp_machinery_06"].id,
      categoryId: createdCategories["Machine Technicians & Setup"].id,
      ownerUserId: employer.id,
      applyEmail: "service@chinamachinery.com",
    },
    {
      id: "job_seed_07",
      title: "লেজার-কাট ও সিকোয়েন্স অ্যাপ্লিক স্পেশালিস্ট",
      description: `হাই-ফ্যাশন ড্রেস এবং কিডস ওয়্যারের জন্য লেজার-কাট প্যাচ ও রিভার্সিবল সিকোয়েন্স এমব্রয়ডারি এক্সপার্ট প্রয়োজন।

দায়িত্বসমূহ:
- লেজার ব্রিজ মেশিনের মাধ্যমে নির্ভুল কাটিং ও পজিশনিং ফাইল রেডি করা।
- ৯মিমি ও ৫মিমি ডুয়াল সিকোয়েন্স ডিভাইসের জন্য উইলকম প্রোগ্রামিং তৈরি করা।
- ফ্যাব্রিক বার্নিং রোধে সঠিক লেজার পাওয়ার ক্যালিব্রেশন করা।`,
      salaryMin: 42000,
      salaryMax: 58000,
      salaryCurrency: "BDT",
      location: "আশুলিয়া, ঢাকা",
      jobType: "FULL_TIME",
      workplaceType: "ONSITE",
      status: "PUBLISHED",
      publishedAt: new Date(),
      deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
      companyId: createdCompanies["comp_apex_01"].id,
      categoryId: createdCategories["Wilcom & Machine Digitizing"].id,
      ownerUserId: employer.id,
      applyEmail: "recruitment@apextextile.com.bd",
    },
    {
      id: "job_seed_08",
      title: "জুনিয়র পাঞ্চার ও ভেক্টর টু স্টিচ আর্টিস্ট",
      description: `ডিজিটাইজিং স্টুডিওতে নতুনদের জন্য চমৎকার সুযোগ! ছবি বা ভেক্টর আর্টওয়ার্ককে প্রাথমিক এমব্রয়ডারি ফাইলে রূপান্তর করার কাজে সহায়তা করতে হবে।

দায়িত্ব:
- কাস্টমার লোগো ভেক্টরাইজেশন ও আন্ডারলে তৈরি করা।
- বেসিক টেক্সট ও মনোগ্রাম পাঞ্চিং।
- সিনিয়র ডিজিটাইজারের অধীনে থেকে অ্যাডভান্সড স্কিল ডেভেলপমেন্ট।

যোগ্যতা:
- উইলকম ও ইলাস্ট্রেটরের প্রাথমিক জ্ঞান থাকা আবশ্যক। ডিপ্লোমা বা ট্রেনিং সার্টিফিকেট অগ্রাধিকার পাবে।`,
      salaryMin: 18000,
      salaryMax: 25000,
      salaryCurrency: "BDT",
      location: "মিরপুর-১০, ঢাকা (পার্ট-টাইম / চুক্তিভিত্তিক)",
      jobType: "CONTRACT",
      workplaceType: "HYBRID",
      status: "PUBLISHED",
      publishedAt: new Date(),
      deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      companyId: createdCompanies["comp_stitchlab_03"].id,
      categoryId: createdCategories["Wilcom & Machine Digitizing"].id,
      ownerUserId: employer.id,
      applyEmail: "junior-jobs@stitchlab.com",
    },
    {
      id: "job_seed_09",
      title: "নকশী কাঁথা ও হ্যান্ড-স্টিচ ক্রাফট কো-অর্ডিনেটর",
      description: `গ্রামীণ নারী কারিগরদের সাথে সমন্বয় করে এক্সক্লুসিভ নকশী কাঁথা ও ঐতিহ্যবাহী কাঁথা স্টিচের প্রজেক্ট পরিচালনার জন্য কো-অর্ডিনেটর আবশ্যক।

দায়িত্বসমূহ:
- কারিগরদের মধ্যে সুতা ও কাপড় বণ্টন এবং স্টিচ কোয়ালিটি নিরীক্ষণ।
- ঐতিহ্যবাহী মোটিফ সংরক্ষণ ও সমসাময়িক কালার প্যালেটে রূপান্তর।
- নির্ধারিত সময়ে বায়ারের শিপমেন্টের জন্য স্যাম্পল ডেলিভারি নিশ্চিত করা।`,
      salaryMin: 28000,
      salaryMax: 40000,
      salaryCurrency: "BDT",
      location: "টাঙ্গাইল / ঢাকা",
      jobType: "FULL_TIME",
      workplaceType: "ONSITE",
      status: "PUBLISHED",
      publishedAt: new Date(),
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      companyId: createdCompanies["comp_aarong_05"].id,
      categoryId: createdCategories["Karchupi & Bridal Handcraft"].id,
      ownerUserId: boutiqueOwner.id,
      applyEmail: "crafts@heritagecrafts.com",
    },
    {
      id: "job_seed_10",
      title: "এমব্রয়ডারি স্যাম্পল সেকশন কোয়ালিটি কন্ট্রোলার (QC Inspector)",
      description: `পোশাক কারখানার এমব্রয়ডারি ফ্লোরে স্যাম্পল ও বাল্ক প্রোডাকশনের স্টিচিং মান পরীক্ষার জন্য অভিজ্ঞ কিউসি পরিদর্শক প্রয়োজন।

দায়িত্ব:
- বায়ারের টেক-প্যাক অনুযায়ী স্টিচ কাউন্ট, ডাইমেনশন ও কালার শেড শতভাগ মেলানো।
- কোনো মিস-স্টিচ, লুজ থ্রেড বা নিডল ড্যামেজ চিহ্নিত করে সাথে সাথে সমাধান করা।
- ফাইনাল অডিটের জন্য কিউসি রিপোর্ট প্রস্তুত করা।

প্রয়োজনীয় অভিজ্ঞতা:
- গার্মেন্টস এমব্রয়ডারি কোয়ালিটি কন্ট্রোলে ৩+ বছরের অভিজ্ঞতা।`,
      salaryMin: 26000,
      salaryMax: 36000,
      salaryCurrency: "BDT",
      location: "টঙ্গী, গাজীপুর",
      jobType: "FULL_TIME",
      workplaceType: "ONSITE",
      status: "PUBLISHED",
      publishedAt: new Date(),
      deadline: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
      companyId: createdCompanies["comp_bexi_04"].id,
      categoryId: createdCategories["Industrial Garment Production"].id,
      ownerUserId: employer.id,
      applyEmail: "qc@bexiembroidery.com",
    },
  ];

  // Clean existing seed jobs to prevent duplication if run multiple times
  for (const job of bulkJobsData) {
    await prisma.job.upsert({
      where: { id: job.id },
      update: {
        title: job.title,
        description: job.description,
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        salaryCurrency: job.salaryCurrency,
        location: job.location,
        jobType: job.jobType as any,
        workplaceType: job.workplaceType as any,
        status: job.status as any,
        deadline: job.deadline,
        companyId: job.companyId,
        categoryId: job.categoryId,
        ownerUserId: job.ownerUserId,
        applyEmail: job.applyEmail,
      },
      create: job as any,
    });
  }

  // 5. Seed 5 Rich Community Posts
  const communityPostsData = [
    {
      id: "post_seed_01",
      title: "পিকে পোলো শার্টে তাজিমা ও বারুদান মেশিনে সুতা ছেঁড়া রোধ করার সহজ সমাধান",
      slug: "pique-polo-thread-break-solution-tajima",
      category: "টেকনিক্যাল গাইড",
      excerpt: "১০০% কটন পিকে পোলো ফেব্রিক্সে হাই-স্পিড এমব্রয়ডারি করার সময় ঘন ঘন সুতা ছেঁড়া ও কাপড়ে টান পড়া রোধে ৫টি প্রমাণিত ফ্যাক্টরি টিপস।",
      content: `## পিকে পোলো কাপড়ে নিখুঁত এমব্রয়ডারি করার গোপন কৌশল

গার্মেন্টস ফ্যাক্টরিগুলোতে পিকে পোলো (Pique Polo) শার্টে এমব্রয়ডারি করার সময় সবচেয়ে সাধারণ সমস্যা হলো বারবার সুতা ছেঁড়া (Thread breaks) এবং কাপড়ে কুঁচকে যাওয়া (Puckering)। নিচে অভিজ্ঞ ডিজিটাইজারদের ৫টি কার্যকর টিপস শেয়ার করা হলো:

### ১. সঠিক আন্ডারলে (Underlay) নির্বাচন
পিকে কাপড়ের বুনন অসমান হওয়ায় সরাসরি ফিল স্টিচ না দিয়ে প্রথমে একটি **ডাবল ট্যাটামি (Double Tatami)** অথবা **এজ ওয়াক (Edge Walk) সহ জিকজ্যাক আন্ডারলে** ব্যবহার করুন। এতে ফেব্রিক্স শক্ত ভিত্তি পায়।

### ২. পুল কমপেনসেশন (Pull Compensation) ০.৩৫মিমি থেকে ০.৪৫মিমি রাখুন
পিকে কটন সুতার টানে ভেতরের দিকে চেপে যায়। তাই উইলকমে পুল কমপেনসেশন বাড়িয়ে দিলে ডিজাইনের বর্ডার ফাঁকা হয়ে যাবে না।

### ৩. সুই নির্বাচন (Needle Specification)
সবসময় **Ball Point (SES / FFG) Size 75/11** সুই ব্যবহার করুন। শার্প নিডল পিকে কাপড়ের সুতা কেটে ফুটো তৈরি করে।

### ৪. ব্যাকিং বা ফিউজিং (Stabilizer)
কমপক্ষে **৬৫-৭৫ GSM টিয়ারঅ্যাওয়ে (Tearaway)** বা **নন-ওভেন কাটঅ্যাওয়ে (Cutaway)** ব্যাকিং নিশ্চিত করুন।

### ৫. থ্রেড টেনশন ব্যালান্স
ববিন টেনশন ২৫-৩০ গ্রাম এবং টপ থ্রেড টেনশন ১১০-১২০ গ্রামে ক্যালিব্রেট করুন।`,
      coverImage: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80",
      tags: ["উইলকম_টিপস", "তাজিমা", "সুতা_কাটা_রোধ", "পোলো_শার্ট"],
      views: 482,
      isPinned: true,
      status: "APPROVED",
      authorId: employer.id,
      approvedBy: employer.id,
      approvedAt: new Date(),
    },
    {
      id: "post_seed_02",
      title: "✨ রয়েল গোল্ড জরি নকশী ব্রাইডাল বর্ডার – ৮৫ ঘণ্টার নিখুঁত হাতের কাজের সমাপ্তি",
      slug: "royal-gold-zari-bridal-border-showcase",
      category: "শোকেস",
      excerpt: "খাঁটি মসলিন বেনারসি শাড়ির আঁচল ও বর্ডারের জন্য তৈরি করা এক্সক্লুসিভ জারদৌসি, আরি এবং ডাবকা কাজের বিস্তারিত স্টিচ ডেসক্রিপশন।",
      content: `## ঐতিহ্য ও আধুনিকতার মেলবন্ধন: ৮৫ ঘণ্টার হস্তশিল্প শোকেস

আমাদের কুচিউর স্টুডিওতে সম্প্রতি সম্পন্ন হলো একটি এক্সক্লুসিভ ব্রাইডাল শাড়ির বর্ডার প্রজেক্ট। এতে ঐতিহ্যবাহী মুঘল ফ্লোরাল মোটিফ এবং আধুনিক লাইটওয়েট রেশম জরির নিখুঁত কাজ ফুটিয়ে তোলা হয়েছে।

### ব্যবহার করা উপকরণসমূহ:
- **সুতা**: ফ্রেঞ্চ মেটালিক গোল্ড জরি ও রেশমি সুতা।
- **উপাদান**: মাইক্রো কাট দানা, জাপানি সিকোয়েন্স এবং এন্টিক ডাবকা।
- **বেস ফেব্রিক্স**: খাঁটি পিওর অর্গাঞ্জা ও সিল্ক ভেলভেট।

### কাজের বিশেষত্ব:
১. মোট ৫ জন কারিগর একটানা ৮৫ ঘণ্টা কাজ করেছেন।  
২. প্রতিটি ফ্লাওয়ার পেটালে থ্রি-ডাইমেনশনাল জারদৌসি প্যাডিং দেওয়া হয়েছে।  
৩. প্রান্তগুলোতে কোনো প্রকার দৃশ্যমান ব্যাক-নট নেই, ফলে বর্ডারটি অত্যন্ত মসৃণ।

আমাদের কারিগরদের এই কাজের ব্যাপারে আপনাদের মূল্যবান মতামত কমেন্টে জানাতে ভুলবেন না!`,
      coverImage: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80",
      tags: ["হাতের_এমব্রয়ডারি", "জারদৌসি", "ব্রাইডাল_কালেকশন", "নকশী"],
      views: 934,
      isPinned: false,
      status: "APPROVED",
      authorId: boutiqueOwner.id,
      approvedBy: employer.id,
      approvedAt: new Date(),
    },
    {
      id: "post_seed_03",
      title: "🎁 ফ্রি EMB ও DST ফাইল: ঈদ পাঞ্জাবি কালেকশন ২০২৬ এর জন্য এক্সক্লুসিভ ফ্লোরাল মোটিফ",
      slug: "free-emb-dst-panjabi-chest-motifs-2026",
      category: "ফ্রি এসেট",
      excerpt: "উইলকম e4.5 এ তৈরি সম্পূর্ণ এডিটেবল পাঞ্জাবি চেস্ট, কলার ও কাফ মোটিফের হাই-কোয়ালিটি স্টিচ ফাইল সবার জন্য ফ্রি ডাউনলোড লিংক সহ।",
      content: `## ঈদ কালেকশন ২০২৬: ডিজাইনার পাঞ্জাবি চেস্ট মোটিফ (Free Download)

সবাইকে শুভেচ্ছা! আসন্ন ঈদ কালেকশনের কথা মাথায় রেখে আমরা ডিজিটাইজার ও বুটিক মালিকদের জন্য নিয়ে এসেছি একটি এক্সক্লুসিভ ফ্লোরাল মিনিমালিস্ট চেস্ট ও কলার মোটিফ প্যাক।

### ফাইলের বিবরণ:
- **সফটওয়্যার**: Wilcom EmbroideryStudio e4.5 (e2 / 2006 ডাউন-কনভার্ট করা সম্ভব)
- **ফরম্যাট**: .EMB (Source) এবং .DST (Machine Ready)
- **স্টিচ কাউন্ট**: ৮,৪৫০ স্টিচ
- **কালার চেঞ্জ**: মাত্র ৩টি (প্রোডাকশনে সময় ও খরচ কমবে)
- **প্রস্তাবিত ফেব্রিক্স**: ফাইন কটন, লাক্সারি সিল্ক ও তসর।

### ডিজাইনের বৈশিষ্ট্য:
- নিখুঁত আন্ডারলে থাকায় কোনো পুকারিং হবে না।
- অটো-ব্রাঞ্চিং করা, ফলে অযথা সুতা কাটার জাম্প থাকবে না।

পোস্টটি ভালো লাগলে লাইক দিন এবং আপনার এমব্রয়ডারি বন্ধুদের সাথে শেয়ার করুন!`,
      coverImage: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format&fit=crop&q=80",
      tags: ["ফ্রি_স্টিচ_ফাইল", "উইলকম_EMB", "পাঞ্জাবি_ডিজাইন", "ঈদ_২০২৬"],
      views: 1540,
      isPinned: false,
      status: "APPROVED",
      authorId: employer.id,
      approvedBy: employer.id,
      approvedAt: new Date(),
    },
    {
      id: "post_seed_04",
      title: "ক্যাপ এমব্রয়ডারিতে পারফেক্ট ৩ডি পাফ (3D Foam) ডিজিটাইজিং করার সম্পূর্ণ গাইডলাইন",
      slug: "3d-puff-foam-cap-digitizing-masterclass",
      category: "টিউটোরিয়াল",
      excerpt: "ফোম কাটিং, ক্যাপ এন্ডিং ক্যাপসুল স্টিচ ও সঠিক ডেনসিটি সেটিং করে প্রফেশনাল ৩ডি পাফ ব্যাজ তৈরির ধাপে ধাপে নির্দেশিকা।",
      content: `## ৩ডি পাফ (3D Puff) এমব্রয়ডারি মাস্টারিং: সফল হওয়ার মূল কৌশল

ক্যাপ এবং স্পোর্টস জ্যাকেটে ৩ডি পাফ এমব্রয়ডারি এখন আন্তর্জাতিক বায়ারদের সবচেয়ে পছন্দের কাজ। তবে অনেকেই ফোম পরিষ্কার কাটতে না পারা বা ফোম বের হয়ে থাকার সমস্যায় পড়েন।

### ৩ডি ডিজিটাইজিংয়ের মূল সূত্র:
1. **স্যাটিন ডেনসিটি (Density)**: নরমাল এমব্রয়ডারিতে যেখানে ০.৪০ ডেনসিটি থাকে, ৩ডি পাফের ক্ষেত্রে তা **০.১৬ থেকে ০.২০** রাখতে হবে। ডেনসিটি বেশি না হলে ফোম পুরোপুরি ঢাকবে না।
2. **ক্যাপসুল এন্ডিং (Capping Stitch)**: প্রতিটি অক্ষরের শুরুতে ও শেষে আড়াআড়ি স্যাটিন স্টিচ দিয়ে 'ক্যাপসুল' তৈরি করুন যা ফোমকে কেটে ভেতরে আটকে রাখবে।
3. **সঠিক ফোম নির্বাচন**: হাই-ডেনসিটি ২মিমি বা ৩মিমি EVA Foam ব্যবহার করুন।
4. **সুইয়ের ধরণ**: Sharp Point নিডল ব্যবহার করুন যাতে ফোম সহজেই পাঞ্চ হয়ে ছিঁড়ে যায়।

আপনার ৩ডি ডিজিটাইজিং প্রজেক্টে কোনো জটিলতা থাকলে নিচে কমেন্ট বক্সে প্রশ্ন করতে পারেন।`,
      coverImage: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&auto=format&fit=crop&q=80",
      tags: ["৩ডি_পাফ", "ক্যাপ_ডিজিটাইজিং", "উইলকম_মাস্টারক্লাস", "ইভিএ_ফোম"],
      views: 712,
      isPinned: false,
      status: "APPROVED",
      authorId: employer.id,
      approvedBy: employer.id,
      approvedAt: new Date(),
    },
    {
      id: "post_seed_05",
      title: "এমব্রয়ডারি মেশিনের রোটারি হুক টাইমিং ও টেনশন স্প্রিং সেটিং ঠিক করার নিয়ম",
      slug: "embroidery-rotary-hook-timing-calibration-guide",
      category: "মেশিন সার্ভিসিং",
      excerpt: "লুপ তৈরি না হওয়া, নিডল ব্রেক হওয়া এবং সুতা গুটি পাকা সমস্যা থেকে বাঁচতে রোটারি হুক ক্যালিব্রেশনের সহজ পদ্ধতি।",
      content: `## তাজিমা ও বারুদান মেশিনের হুক টাইমিং ফিক্স করার টেকনিক্যাল গাইড

এমব্রয়ডারি মেশিনে যদি ঘন ঘন সুই ভাঙা শুরু হয় অথবা সুতা মিস করে স্টিচ না বসে, তবে ৯৫% ক্ষেত্রে এর কারণ হলো রোটারি হুকের টাইমিং সরে যাওয়া (Hook out of timing)।

### কীভাবে হুক টাইমিং করবেন:
1. **মেশিন ২০০ ডিগ্রিতে নিন**: মেশিনের ফ্লাইহুইল ঘুরিয়ে নিডল বারকে ২০০° অথবা ১৯৬° (মডেলভেদে) পজিশনে আনুন।
2. **নিডল ও হুক পয়েন্টের দূরত্ব**: হুকের সূঁচালো পয়েন্টটি সুঁচের স্কার্ফের (Scarf) ঠিক মাঝখানে ০.০৫ মিমি থেকে ০.১ মিমি ফাঁকা রেখে সেট করুন।
3. **হুক স্ক্রু টাইট দিন**: তিনটি স্ক্রু সমানভাবে টাইট দিন যাতে কোনো ভাইব্রেশনে হুক স্লিপ না করে।
4. **টেনশন স্প্রিং চেক**: চেক-স্প্রিং যেন সুইয়ের কাপড়ে প্রবেশের ঠিক আগ মুহূর্তে সুতা রিলিজ করে।

নিয়মিত প্রতিদিন কাজ শুরুর আগে রোটারি হুকে ২ ফোঁটা তেল (White Spindle Oil) দিলে মেশিনের স্থায়িত্ব বহুগুণ বৃদ্ধি পায়।`,
      coverImage: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
      tags: ["মেশিন_সার্ভিসিং", "রোটারি_হুক", "তাজিমা_মেরামত", "টেনশন_ক্যালিব্রেশন"],
      views: 520,
      isPinned: false,
      status: "APPROVED",
      authorId: employer.id,
      approvedBy: employer.id,
      approvedAt: new Date(),
    },
  ];

  for (const post of communityPostsData) {
    await prisma.communityPost.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        coverImage: post.coverImage,
        category: post.category,
        tags: post.tags,
        views: post.views,
        isPinned: post.isPinned,
        status: post.status as any,
        authorId: post.authorId,
        approvedBy: post.approvedBy,
        approvedAt: post.approvedAt,
      },
      create: post as any,
    });
  }

  // 6. Seed 5 Verified Businesses & Directories
  const businessesData = [
    {
      id: "biz_seed_01",
      name: "এপেক্স হাই-টেক এমব্রয়ডারি কমপ্লেক্স (Apex Embroidery)",
      slug: "apex-embroidery-complex-gazipur",
      type: "FACTORY",
      description: "৪০+ মাল্টি-হেড তাজিমা ও বারুদান মেশিন সমৃদ্ধ ১০০% এক্সপোর্ট ওভেন ও নিটওয়্যার এমব্রয়ডারি প্রোডাকশন ইউনিট। লেজার কাটিং ও সিকোয়েন্স কাজের বিশেষ সুবিধা।",
      brands: ["Tajima", "Barudan", "Wilcom", "Madeira"],
      phone: "+8801711000111",
      email: "factory@apextextile.com.bd",
      website: "https://apextextile.example.com",
      address: "প্লট নং ১২-১৪, কোনাবাড়ী ইন্ডাস্ট্রিয়াল এরিয়া",
      area: "কোনাবাড়ী",
      district: "গাজীপুর",
      country: "Bangladesh",
      status: "APPROVED",
      isVerified: true,
      source: "MODERATOR",
      logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=120&auto=format&fit=crop&q=80",
      submittedBy: employer.id,
      approvedBy: employer.id,
      approvedAt: new Date(),
      lastVerifiedAt: new Date(),
    },
    {
      id: "biz_seed_02",
      name: "মদিনা থ্রেড অ্যান্ড এমব্রয়ডারি মেটেরিয়ালস (Madina Threads)",
      slug: "madina-threads-and-materials-dhaka",
      type: "SUPPLIER",
      description: "জার্মান মেটালিক গোল্ড ও সিলভার জারি, পলিয়েস্টার ও ভিসকোস রেয়ন সুতা, ব্যাকিং পেপার ও ওয়াটার-সল্যুবল ফিউজিংয়ের প্রধান পাইকারি আমদানিকারক।",
      brands: ["Madeira", "Gunold", "Marathon", "Astra"],
      phone: "+8801819223344",
      email: "sales@madinathreads.com",
      website: "https://madinathreads.example.com",
      address: "৮৮/১ ইসলামপুর রোড, বাবুবাজার",
      area: "ইসলামপুর",
      district: "ঢাকা",
      country: "Bangladesh",
      status: "APPROVED",
      isVerified: true,
      source: "MODERATOR",
      logo: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=120&auto=format&fit=crop&q=80",
      submittedBy: employer.id,
      approvedBy: employer.id,
      approvedAt: new Date(),
      lastVerifiedAt: new Date(),
    },
    {
      id: "biz_seed_03",
      name: "সাউথ চায়না এমব্রয়ডারি মেশিনারিজ অ্যান্ড পার্টস",
      slug: "south-china-embroidery-machinery-narayanganj",
      type: "DEALER",
      description: "কম্পিউটারাইজড সিঙ্গেল ও মাল্টি-হেড তাজিমা ও রিকোমা এমব্রয়ডারি মেশিন, লেজার ব্রিজ, রোটারি হুক, ববিন ও স্পেয়ার পার্টস আমদানিকারক ও বিক্রয়োত্তর সেবা কেন্দ্র।",
      brands: ["Tajima", "Ricoma", "Feiya", "Koban", "Towa"],
      phone: "+8801914556677",
      email: "info@chinamachinery.com",
      website: "https://chinamachinery.example.com",
      address: "২২ বিকেএমইএ ভবন রোড, চাষাড়া",
      area: "চাষাড়া",
      district: "নারায়ণগঞ্জ",
      country: "Bangladesh",
      status: "APPROVED",
      isVerified: true,
      source: "MODERATOR",
      logo: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=120&auto=format&fit=crop&q=80",
      submittedBy: employer.id,
      approvedBy: employer.id,
      approvedAt: new Date(),
      lastVerifiedAt: new Date(),
    },
    {
      id: "biz_seed_04",
      name: "রয়েল কারচুপি ও ব্রাইডাল এমব্রয়ডারি হাউস",
      slug: "royal-karchupi-bridal-house-dhaka",
      type: "SHOP",
      description: "এক্সক্লুসিভ ব্রাইডাল লেহেঙ্গা, বেনারসি শাড়ি, শেরওয়ানি ও গাউনের কাস্টমাইজড কারচুপি, জারদৌসি, ডাবকা ও আরি কাজের বিশেষায়িত লাক্সারি বুটিক।",
      brands: ["Royal Crafts", "Pure Silk", "Bridal Zari"],
      phone: "+8801712889900",
      email: "order@royalkarchupi.com",
      website: "https://royalkarchupi.example.com",
      address: "দোকান নং ৪২, দ্বিতীয় তলা, পিংক সিটি শপিং কমপ্লেক্স",
      area: "গুলশান-২",
      district: "ঢাকা",
      country: "Bangladesh",
      status: "APPROVED",
      isVerified: true,
      source: "BUSINESS_REQUEST",
      logo: "https://images.unsplash.com/photo-1544441893-675973e31985?w=120&auto=format&fit=crop&q=80",
      submittedBy: boutiqueOwner.id,
      approvedBy: employer.id,
      approvedAt: new Date(),
      lastVerifiedAt: new Date(),
    },
    {
      id: "biz_seed_05",
      name: "স্টিচল্যাব ডিজিটাইজিং অ্যান্ড ভেক্টর স্টুডিও",
      slug: "stitchlab-digitizing-vector-studio-chittagong",
      type: "COMPANY",
      description: "ইউএস, কানাডা ও ইউরোপের বায়ারদের জন্য ২৪/৭ সুপার-ফাস্ট টার্নঅ্যারাউন্ড সময়ে Wilcom EMB, DST, ৩ডি পাফ ও লেজার-কাট ডিজিটাইজিং সেবা কেন্দ্র।",
      brands: ["Wilcom", "Tajima", "CorelDraw", "Illustrator"],
      phone: "+8801611334455",
      email: "support@stitchlabbd.com",
      website: "https://stitchlabbd.example.com",
      address: "লেভেল ৫, নাসিরাবাদ হাউজিং সোসাইটি",
      area: "জিইসি মোড়",
      district: "চট্টগ্রাম",
      country: "Bangladesh",
      status: "APPROVED",
      isVerified: true,
      source: "MODERATOR",
      logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=120&auto=format&fit=crop&q=80",
      submittedBy: employer.id,
      approvedBy: employer.id,
      approvedAt: new Date(),
      lastVerifiedAt: new Date(),
    },
  ];

  for (const biz of businessesData) {
    await prisma.business.upsert({
      where: { slug: biz.slug },
      update: {
        name: biz.name,
        type: biz.type as any,
        description: biz.description,
        brands: biz.brands,
        phone: biz.phone,
        email: biz.email,
        website: biz.website,
        address: biz.address,
        area: biz.area,
        district: biz.district,
        country: biz.country,
        status: biz.status as any,
        isVerified: biz.isVerified,
        source: biz.source as any,
        logo: biz.logo,
        submittedBy: biz.submittedBy,
        approvedBy: biz.approvedBy,
        approvedAt: biz.approvedAt,
        lastVerifiedAt: biz.lastVerifiedAt,
      },
      create: biz as any,
    });
  }

  console.log("Successfully seeded 10 bulk jobs, 5 community posts, and 5 verified businesses! 🎉");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });