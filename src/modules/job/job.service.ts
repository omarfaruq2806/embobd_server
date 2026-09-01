import prisma from "../../config/prisma";

interface GetAllJobsFilters {
  status?: string;
  ownerUserId?: string;
  categoryId?: string;
  search?: string;
}

const createJob = async (data: any) => {
  // If no status is explicitly set, set to DRAFT (Pending Review)
  if (!data.status) {
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

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.ownerUserId) {
    where.ownerUserId = filters.ownerUserId;
  }

  if (filters.categoryId) {
    where.categoryId = filters.categoryId;
  }

  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
      { location: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  const result = await prisma.job.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
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

const updateJob = async (id: string, data: any) => {
  if (data.status === "PUBLISHED" && !data.publishedAt) {
    data.publishedAt = new Date();
  }

  const result = await prisma.job.update({
    where: { id },
    data,
    include: {
      company: true,
      category: true,
    },
  });
  return result;
};

const deleteJob = async (id: string) => {
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
