import prisma from "../../config/prisma";

const createJob = async (data: any) => {
  if (data.status === "PUBLISHED" && !data.publishedAt) {
    data.publishedAt = new Date();
  }

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

const getAllJobs = async () => {
  const result = await prisma.job.findMany({
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
