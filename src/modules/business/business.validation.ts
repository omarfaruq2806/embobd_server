import { z } from "zod";

const BusinessTypeEnum = z.enum(["SHOP", "FACTORY", "COMPANY", "DEALER", "DISTRIBUTOR", "SUPPLIER"]);
const BusinessStatusEnum = z.enum(["PENDING", "APPROVED", "REJECTED"]);
const BusinessSourceEnum = z.enum(["MODERATOR", "BUSINESS_REQUEST", "IMPORT"]);

const createBusinessSchema = z.object({
  name: z
    .string()
    .min(2, "Business name must be at least 2 characters")
    .max(150, "Business name cannot exceed 150 characters")
    .trim(),
  type: BusinessTypeEnum,
  logo: z.string().optional().nullable(),
  description: z.string().max(3000, "Description cannot exceed 3000 characters").optional().nullable(),
  brands: z.union([z.array(z.string()), z.string()]).optional(),
  phone: z
    .string()
    .min(6, "Phone number must be at least 6 digits")
    .max(30, "Phone number cannot exceed 30 characters")
    .trim(),
  email: z.string().email("Invalid email address").optional().nullable().or(z.literal("")),
  website: z.string().url("Invalid website URL").optional().nullable().or(z.literal("")),
  address: z
    .string()
    .min(3, "Address must be at least 3 characters")
    .max(300, "Address cannot exceed 300 characters")
    .trim(),
  area: z.string().max(100, "Area name cannot exceed 100 characters").optional().nullable(),
  district: z
    .string()
    .min(2, "District name is required")
    .max(100, "District name cannot exceed 100 characters")
    .trim(),
  country: z.string().default("Bangladesh").optional(),
  source: BusinessSourceEnum.optional(),
  status: BusinessStatusEnum.optional(),
});

const updateBusinessSchema = z.object({
  name: z.string().min(2).max(150).trim().optional(),
  type: BusinessTypeEnum.optional(),
  logo: z.string().optional().nullable(),
  description: z.string().max(3000).optional().nullable(),
  brands: z.union([z.array(z.string()), z.string()]).optional(),
  phone: z.string().min(6).max(30).trim().optional(),
  email: z.string().email("Invalid email address").optional().nullable().or(z.literal("")),
  website: z.string().url("Invalid website URL").optional().nullable().or(z.literal("")),
  address: z.string().min(3).max(300).trim().optional(),
  area: z.string().max(100).optional().nullable(),
  district: z.string().min(2).max(100).trim().optional(),
  country: z.string().optional(),
  status: BusinessStatusEnum.optional(),
  isVerified: z.boolean().optional(),
});

const rejectBusinessSchema = z.object({
  rejectionReason: z
    .string()
    .min(5, "Rejection reason must be at least 5 characters")
    .max(500, "Rejection reason cannot exceed 500 characters")
    .trim(),
});

export const BusinessValidation = {
  createBusinessSchema,
  updateBusinessSchema,
  rejectBusinessSchema,
};
