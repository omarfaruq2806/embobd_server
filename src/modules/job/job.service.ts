import prisma from "../../config/prisma";

interface GetAllJobsFilters {
  status?: string;
  ownerUserId?: string;
  categoryId?: string;
  category?: string;
  jobType?: string;
  workplaceType?: string;
  location?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number | string;
  limit?: number | string;
}

const createJob = async (data: any, user: any) => {
  if (!user || !user.id) {
    throw new Error("Authentication required to post a job.");
  }

  // Associate ownerUserId with authenticated user
  data.ownerUserId = user.id;

  // Determine status: ADMIN and MODERATOR can directly publish, EMPLOYER defaults to DRAFT
  if (user.role === "ADMIN" || user.role === "MODERATOR") {
    data.status = data.status || "PUBLISHED";
  } else {
    data.status = "DRAFT";
  }

  if (data.status === "PUBLISHED" && !data.publishedAt) {
    data.publishedAt = new Date();
  }

  // If companyId is not directly passed but companyName is provided
  if (!data.companyId && data.companyName) {
    let company = await prisma.company.findFirst({
      where: { name: data.companyName },
    });
    if (!company) {
      company = await prisma.company.create({
        data: {
          name: data.companyName,
          description: data.companyDescription || null,
          website: data.companyWebsite || null,
          logo: data.companyLogo || null,
          ownerUserId: data.ownerUserId,
        },
      });
    }
    data.companyId = company.id;
  }

  // Clean up any extra helper fields not in Job model
  delete data.companyName;
  delete data.companyDescription;
  delete data.companyWebsite;
  delete data.companyLogo;

  const result = await prisma.job.create({
    data,
    include: {
      company: true,
      category: true,
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });
  return result;
};


const getAllJobs = async (filters: GetAllJobsFilters = {}) => {
  const where: any = {};

  if (filters.status && filters.status !== "ALL") {
    where.status = filters.status;
  }

  if (filters.jobType && filters.jobType !== "ALL") {
    where.jobType = filters.jobType;
  }

  if (filters.workplaceType && filters.workplaceType !== "ALL") {
    where.workplaceType = filters.workplaceType;
  }

  if (filters.ownerUserId) {
    where.ownerUserId = filters.ownerUserId;
  }

  if (filters.categoryId && filters.categoryId !== "ALL") {
    where.categoryId = filters.categoryId;
  }

  if (filters.category && filters.category !== "ALL") {
    where.category = {
      name: { equals: filters.category, mode: "insensitive" },
    };
  }

  if (filters.location && filters.location !== "ALL") {
    where.location = {
      contains: filters.location,
      mode: "insensitive",
    };
  }

  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
      { location: { contains: filters.search, mode: "insensitive" } },
      { company: { name: { contains: filters.search, mode: "insensitive" } } },
      { category: { name: { contains: filters.search, mode: "insensitive" } } },
    ];
  }

  // Sorting
  const sortField = filters.sortBy || "createdAt";
  const sortOrder = filters.sortOrder === "asc" ? "asc" : "desc";
  const orderBy = { [sortField]: sortOrder };

  // Pagination (Optional limit/page)
  const page = Number(filters.page) || 1;
  const limit = Number(filters.limit) || 50;
  const skip = (page - 1) * limit;

  const result = await prisma.job.findMany({
    where,
    orderBy,
    skip: filters.page ? skip : undefined,
    take: filters.limit ? limit : undefined,
    include: {
      company: {
        select: {
          id: true,
          name: true,
          logo: true,
          website: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });

  return result;
};

const getJobById = async (id: string) => {
  const result = await prisma.job.findUnique({
    where: { id },
    include: {
      company: true,
      category: true,
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });
  return result;
};

const updateJob = async (id: string, data: any, user: any) => {
  const existing = await prisma.job.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("Job not found.");
  }

  const isOwner = existing.ownerUserId === user.id;
  const isAdminOrMod = user.role === "ADMIN" || user.role === "MODERATOR";

  if (!isOwner && !isAdminOrMod) {
    throw new Error("Forbidden! You are not authorized to update this job.");
  }

  // Only Admin/Moderator can publish a job (Employers can only submit as DRAFT or set CLOSED)
  if (!isAdminOrMod && data.status === "PUBLISHED" && existing.status !== "PUBLISHED") {
    delete data.status;
  }

  if (data.status === "PUBLISHED" && !existing.publishedAt) {
    data.publishedAt = new Date();
  }

  const result = await prisma.job.update({
    where: { id },
    data,
    include: {
      company: true,
      category: true,
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });
  return result;
};

const deleteJob = async (id: string, user: any) => {
  const existing = await prisma.job.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("Job not found.");
  }

  const isOwner = existing.ownerUserId === user.id;
  const isAdmin = user.role === "ADMIN";

  if (!isOwner && !isAdmin) {
    throw new Error("Forbidden! You are not authorized to delete this job.");
  }

  const result = await prisma.job.delete({
    where: { id },
  });
  return result;
};


export const JobService = {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
};
