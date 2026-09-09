import { z } from "zod";

const JobTypeEnum = z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "FREELANCE"]);
const WorkplaceTypeEnum = z.enum(["ONSITE", "REMOTE", "HYBRID"]);
const JobStatusEnum = z.enum(["DRAFT", "PUBLISHED", "CLOSED"]);

const createJobSchema = z.object({
  title: z
    .string()
    .min(3, "Job title must be at least 3 characters")
    .max(200, "Job title cannot exceed 200 characters")
    .trim(),
  description: z
    .string()
    .min(10, "Job description must be at least 10 characters"),
  jobType: JobTypeEnum,
  workplaceType: WorkplaceTypeEnum,
  categoryId: z.string().min(1, "Category is required"),
  companyId: z.string().optional().nullable(),
  companyName: z.string().optional().nullable(),
  companyDescription: z.string().optional().nullable(),
  companyWebsite: z.string().optional().nullable(),
  companyLogo: z.string().optional().nullable(),
  location: z.string().max(200, "Location cannot exceed 200 characters").optional().nullable(),
  salaryMin: z.number().int().nonnegative().optional().nullable(),
  salaryMax: z.number().int().nonnegative().optional().nullable(),
  salaryCurrency: z.string().default("BDT").optional(),
  applyEmail: z.string().email("Invalid application email address"),
  deadline: z.string().optional().nullable(),
  status: JobStatusEnum.optional().default("DRAFT"),
});

const updateJobSchema = z.object({
  title: z.string().min(3).max(200).trim().optional(),
  description: z.string().min(10).optional(),
  jobType: JobTypeEnum.optional(),
  workplaceType: WorkplaceTypeEnum.optional(),
  categoryId: z.string().min(1).optional(),
  companyId: z.string().optional().nullable(),
  location: z.string().max(200).optional().nullable(),
  salaryMin: z.number().int().nonnegative().optional().nullable(),
  salaryMax: z.number().int().nonnegative().optional().nullable(),
  salaryCurrency: z.string().optional(),
  applyEmail: z.string().email("Invalid application email address").optional(),
  deadline: z.string().optional().nullable(),
  status: JobStatusEnum.optional(),
});

export const JobValidation = {
  createJobSchema,
  updateJobSchema,
};
