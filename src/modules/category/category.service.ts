import prisma from "../../config/prisma";

const createCategory = async (data: any) => {
  const result = await prisma.category.create({
    data,
  });
  return result;
};

const getAllCategories = async () => {
  const result = await prisma.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          jobs: true,
        },
      },
    },
  });
  return result;
};

const getCategoryById = async (id: string) => {
  const result = await prisma.category.findUnique({
    where: { id },
    include: {
      jobs: true,
    },
  });
  return result;
};

const updateCategory = async (id: string, data: any) => {
  const result = await prisma.category.update({
    where: { id },
    data,
  });
  return result;
};

const deleteCategory = async (id: string) => {
  const result = await prisma.category.delete({
    where: { id },
  });
  return result;
};

export const CategoryService = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
