import prisma from "../../config/prisma";

// Helper function to create a clean URL-friendly slug
const generateSlug = async (name: string): Promise<string> => {
  const baseSlug = name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  let slug = baseSlug || "business";
  let count = 1;

  // Ensure slug uniqueness
  while (true) {
    const existing = await prisma.business.findUnique({
      where: { slug },
    });
    if (!existing) break;
    slug = `${baseSlug}-${count++}`;
  }

  return slug;
};

interface GetAllBusinessesFilters {
  status?: string;
  type?: string;
  district?: string;
  area?: string;
  brand?: string;
  isVerified?: boolean | string;
  source?: string;
  search?: string;
  submittedBy?: string;
}

const createBusiness = async (data: any, user: any) => {
  if (!user || !user.id) {
    throw new Error("Authentication required! You must be logged in to create or submit a business.");
  }

  // Generate unique slug if not provided
  if (!data.slug) {
    data.slug = await generateSlug(data.name);
  }

  // Set submittedBy to authenticated user ID
  data.submittedBy = user.id;

  // Determine source & default status based on user role
  if (user.role === "ADMIN" || user.role === "MODERATOR") {
    data.source = data.source || "MODERATOR";
    data.status = data.status || "APPROVED";
    if (data.status === "APPROVED") {
      data.approvedBy = user.id;
      data.approvedAt = new Date();
      data.isVerified = data.isVerified ?? true;
    }
  } else {
    data.source = "BUSINESS_REQUEST";
    data.status = "PENDING";
    data.isVerified = false;
  }

  // Ensure brands is string array
  if (typeof data.brands === "string") {
    data.brands = data.brands
      .split(",")
      .map((b: string) => b.trim())
      .filter(Boolean);
  } else if (!Array.isArray(data.brands)) {
    data.brands = [];
  }

  const result = await prisma.business.create({
    data,
    include: {
      submittedUser: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      approvedUser: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return result;
};

const getAllBusinesses = async (filters: GetAllBusinessesFilters = {}) => {
  const where: any = {};

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.type) {
    where.type = filters.type;
  }

  if (filters.district) {
    where.district = {
      contains: filters.district,
      mode: "insensitive",
    };
  }

  if (filters.area) {
    where.area = {
      contains: filters.area,
      mode: "insensitive",
    };
  }

  if (filters.source) {
    where.source = filters.source;
  }

  if (filters.submittedBy) {
    where.submittedBy = filters.submittedBy;
  }

  if (filters.isVerified !== undefined) {
    where.isVerified =
      filters.isVerified === true || filters.isVerified === "true";
  }

  if (filters.brand) {
    where.brands = {
      has: filters.brand,
    };
  }

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
      { address: { contains: filters.search, mode: "insensitive" } },
      { district: { contains: filters.search, mode: "insensitive" } },
      { area: { contains: filters.search, mode: "insensitive" } },
      { brands: { has: filters.search } },
    ];
  }

  const result = await prisma.business.findMany({
    where,
    orderBy: [{ isVerified: "desc" }, { createdAt: "desc" }],
    include: {
      submittedUser: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      approvedUser: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return result;
};

const getBusinessById = async (id: string) => {
  const result = await prisma.business.findUnique({
    where: { id },
    include: {
      submittedUser: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      approvedUser: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return result;
};

const getBusinessBySlug = async (slug: string) => {
  const result = await prisma.business.findUnique({
    where: { slug },
    include: {
      submittedUser: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      approvedUser: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return result;
};

const updateBusiness = async (id: string, data: any) => {
  // Ensure brands format if provided
  if (data.brands && typeof data.brands === "string") {
    data.brands = data.brands
      .split(",")
      .map((b: string) => b.trim())
      .filter(Boolean);
  }

  const result = await prisma.business.update({
    where: { id },
    data,
    include: {
      submittedUser: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      approvedUser: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return result;
};

const approveBusiness = async (id: string, adminUserId?: string) => {
  const result = await prisma.business.update({
    where: { id },
    data: {
      status: "APPROVED",
      isVerified: true,
      approvedBy: adminUserId || null,
      approvedAt: new Date(),
      lastVerifiedAt: new Date(),
      rejectionReason: null,
    },
    include: {
      approvedUser: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return result;
};

const rejectBusiness = async (
  id: string,
  adminUserId?: string,
  rejectionReason?: string
) => {
  const result = await prisma.business.update({
    where: { id },
    data: {
      status: "REJECTED",
      approvedBy: adminUserId || null,
      rejectionReason: rejectionReason || "Did not meet verification criteria.",
    },
  });

  return result;
};

const deleteBusiness = async (id: string) => {
  const result = await prisma.business.delete({
    where: { id },
  });

  return result;
};

export const BusinessService = {
  createBusiness,
  getAllBusinesses,
  getBusinessById,
  getBusinessBySlug,
  updateBusiness,
  approveBusiness,
  rejectBusiness,
  deleteBusiness,
};
