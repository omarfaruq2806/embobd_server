import { z } from "zod";

const PostStatusEnum = z.enum(["PENDING", "APPROVED", "REJECTED"]);

const createPostSchema = z.object({
  title: z
    .string()
    .min(3, "Post title must be at least 3 characters")
    .max(250, "Post title cannot exceed 250 characters")
    .trim(),
  content: z
    .string()
    .min(10, "Post content must be at least 10 characters"),
  excerpt: z.string().max(300, "Excerpt cannot exceed 300 characters").optional().nullable(),
  coverImage: z.string().optional().nullable(),
  category: z.string().max(100).default("General").optional(),
  tags: z.union([z.array(z.string()), z.string()]).optional(),
  isPinned: z.boolean().optional(),
  status: PostStatusEnum.optional(),
});

const updatePostSchema = z.object({
  title: z.string().min(3).max(250).trim().optional(),
  content: z.string().min(10).optional(),
  excerpt: z.string().max(300).optional().nullable(),
  coverImage: z.string().optional().nullable(),
  category: z.string().max(100).optional(),
  tags: z.union([z.array(z.string()), z.string()]).optional(),
  isPinned: z.boolean().optional(),
  status: PostStatusEnum.optional(),
});

const rejectPostSchema = z.object({
  rejectionReason: z
    .string()
    .min(5, "Rejection reason must be at least 5 characters")
    .max(500, "Rejection reason cannot exceed 500 characters")
    .trim(),
});

export const CommunityValidation = {
  createPostSchema,
  updatePostSchema,
  rejectPostSchema,
};
