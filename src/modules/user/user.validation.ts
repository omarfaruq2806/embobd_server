import { z } from "zod";

const RoleEnum = z.enum(["ADMIN", "MODERATOR", "EMPLOYER", "CANDIDATE"]);

const updateUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100).trim().optional(),
  image: z.string().optional().nullable(),
  role: RoleEnum.optional(),
  profile: z
    .object({
      avatar: z.string().optional().nullable(),
      bio: z.string().max(1000).optional().nullable(),
      phone: z.string().max(30).optional().nullable(),
      location: z.string().max(100).optional().nullable(),
      title: z.string().max(100).optional().nullable(),
      skills: z.array(z.string()).optional(),
      resumeUrl: z.string().optional().nullable(),
      portfolioUrl: z.string().optional().nullable(),
    })
    .optional(),
});

const updateProfileSchema = z.object({
  avatar: z.string().optional().nullable(),
  bio: z.string().max(1000, "Bio cannot exceed 1000 characters").optional().nullable(),
  phone: z.string().max(30, "Phone number cannot exceed 30 characters").optional().nullable(),
  location: z.string().max(100, "Location cannot exceed 100 characters").optional().nullable(),
  title: z.string().max(100, "Title cannot exceed 100 characters").optional().nullable(),
  skills: z.array(z.string()).optional(),
  resumeUrl: z.string().optional().nullable(),
  portfolioUrl: z.string().optional().nullable(),
});

export const UserValidation = {
  updateUserSchema,
  updateProfileSchema,
};
