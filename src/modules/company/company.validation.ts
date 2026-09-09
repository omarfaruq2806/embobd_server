import { z } from "zod";

const createCompanySchema = z.object({
  name: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(150, "Company name cannot exceed 150 characters")
    .trim(),
  description: z.string().max(2000, "Description cannot exceed 2000 characters").optional().nullable(),
  website: z.string().url("Invalid website URL").optional().nullable().or(z.literal("")),
  logo: z.string().optional().nullable(),
  ownerUserId: z.string().optional(),
});

const updateCompanySchema = z.object({
  name: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(150, "Company name cannot exceed 150 characters")
    .trim()
    .optional(),
  description: z.string().max(2000, "Description cannot exceed 2000 characters").optional().nullable(),
  website: z.string().url("Invalid website URL").optional().nullable().or(z.literal("")),
  logo: z.string().optional().nullable(),
});

export const CompanyValidation = {
  createCompanySchema,
  updateCompanySchema,
};
