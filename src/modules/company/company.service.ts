import prisma from "../../config/prisma";

const createCompany = async (data: any, user: any) => {
  if (!user || !user.id) {
    throw new Error("Authentication required to create a company.");
  }

  // Ensure ownerUserId is set to current user if not an admin overriding
  if (!data.ownerUserId || user.role !== "ADMIN") {
    data.ownerUserId = user.id;
  }

  const result = await prisma.company.create({
    data,
    include: {
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

const updateCompany = async (id: string, data: any, user: any) => {
  const existing = await prisma.company.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("Company not found.");
  }

  if (user.role !== "ADMIN" && existing.ownerUserId !== user.id) {
    throw new Error("Forbidden! You are not authorized to update this company.");
  }

  const result = await prisma.company.update({
    where: { id },
    data,
    include: {
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

const deleteCompany = async (id: string, user: any) => {
  const existing = await prisma.company.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("Company not found.");
  }

  if (user.role !== "ADMIN" && existing.ownerUserId !== user.id) {
    throw new Error("Forbidden! You are not authorized to delete this company.");
  }

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

