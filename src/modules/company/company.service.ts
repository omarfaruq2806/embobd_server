import prisma from "../../config/prisma";

const createCompany = async (data: any) => {
  const result = await prisma.company.create({
    data,
  });
  return result;
};

const getAllCompanies = async () => {
  const result = await prisma.company.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      _count: {
        select: {
          jobs: true,
        },
      },
    },
  });
  return result;
};

const getCompanyById = async (id: string) => {
  const result = await prisma.company.findUnique({
    where: { id },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      jobs: true,
      _count: {
        select: {
          jobs: true,
        },
      },
    },
  });
  return result;
};

const updateCompany = async (id: string, data: any) => {
  const result = await prisma.company.update({
    where: { id },
    data,
  });
  return result;
};

const deleteCompany = async (id: string) => {
  const result = await prisma.company.delete({
    where: { id },
  });
  return result;
};

export const CompanyService = {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
};
