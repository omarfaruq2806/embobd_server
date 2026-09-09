import { z } from "zod";

const createCategorySchema = z.object({
  name: z
    .string()
    .min(2, "Category name must be at least 2 characters")
    .max(100, "Category name cannot exceed 100 characters")
    .trim(),
  description: z.string().max(500, "Description cannot exceed 500 characters").optional().nullable(),
});

const updateCategorySchema = z.object({
  name: z
    .string()
    .min(2, "Category name must be at least 2 characters")
    .max(100, "Category name cannot exceed 100 characters")
    .trim()
    .optional(),
  description: z.string().max(500, "Description cannot exceed 500 characters").optional().nullable(),
});

export const CategoryValidation = {
  createCategorySchema,
  updateCategorySchema,
};
