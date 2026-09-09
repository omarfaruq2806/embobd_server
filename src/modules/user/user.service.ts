import crypto from "crypto";
import prisma from "../../config/prisma";

const createUser = async (data: any) => {
  const { profile, ...userData } = data;
  const id = data.id || crypto.randomUUID();

  const result = await prisma.user.create({
    data: {
      id,
      ...userData,
      profile: profile
        ? {
            create: profile,
          }
        : undefined,
    },
    include: {
      profile: true,
    },
  });
  return result;
};

const getAllUsers = async (role?: string) => {
  const where: any = {};
  if (role) {
    where.role = role;
  }

  const result = await prisma.user.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      profile: true,
      _count: {
        select: {
          jobs: true,
          companies: true,
        },
      },
    },
  });
  return result;
};

const getUserById = async (id: string) => {
  const result = await prisma.user.findUnique({
    where: { id },
    include: {
      profile: true,
      companies: true,
      jobs: {
        orderBy: {
          createdAt: "desc",
        },
      },
      _count: {
        select: {
          jobs: true,
          companies: true,
        },
      },
    },
  });
  return result;
};

const updateUser = async (id: string, data: any, currentUser?: any) => {
  if (currentUser) {
    const isSelf = currentUser.id === id;
    const isAdmin = currentUser.role === "ADMIN";

    if (!isSelf && !isAdmin) {
      throw new Error("Forbidden! You are not authorized to update this user.");
    }

    // Only Admin can change user roles
    if (data.role && !isAdmin) {
      delete data.role;
    }
  }

  const { profile, ...userData } = data;

  const result = await prisma.user.update({
    where: { id },
    data: {
      ...userData,
      profile: profile
        ? {
            upsert: {
              create: profile,
              update: profile,
            },
          }
        : undefined,
    },
    include: {
      profile: true,
    },
  });
  return result;
};

const updateProfile = async (userId: string, data: any, currentUser?: any) => {
  if (currentUser) {
    const isSelf = currentUser.id === userId;
    const isAdmin = currentUser.role === "ADMIN";

    if (!isSelf && !isAdmin) {
      throw new Error("Forbidden! You are not authorized to update this profile.");
    }
  }

  const result = await prisma.profile.upsert({
    where: { userId },
    create: {
      userId,
      ...data,
    },
    update: data,
  });
  return result;
};

const deleteUser = async (id: string, currentUser?: any) => {
  if (currentUser) {
    if (currentUser.role !== "ADMIN") {
      throw new Error("Forbidden! Only administrators can delete users.");
    }
    if (currentUser.id === id) {
      throw new Error("Cannot delete your own admin account.");
    }
  }

  const result = await prisma.user.delete({
    where: { id },
  });
  return result;
};


export const UserService = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  updateProfile,
  deleteUser,
};
