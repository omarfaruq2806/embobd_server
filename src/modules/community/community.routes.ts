import { Router } from "express";
import { CommunityController } from "./community.controller";
import { requireAuth, optionalAuth, requireRole } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { CommunityValidation } from "./community.validation";
import { createResourceLimiter } from "../../middlewares/rateLimiter";

const router = Router();

// Meta / Taxonomy routes
router.get("/categories", CommunityController.getCommunityCategories);
router.get("/tags", CommunityController.getPopularTags);

// Authenticated user's personal posts
router.get("/my-posts", requireAuth, CommunityController.getMyPosts);

// Public / Filterable posts list
router.get("/", optionalAuth, CommunityController.getAllPosts);
router.get("/posts", optionalAuth, CommunityController.getAllPosts);

// Single post view & atomic views increment (by slug or id)
router.get("/posts/:idOrSlug", CommunityController.getPostByIdOrSlug);
router.get("/:idOrSlug", CommunityController.getPostByIdOrSlug);

// Post creation & management (Authentication required)
router.post(
  "/",
  createResourceLimiter,
  requireAuth,
  validateRequest(CommunityValidation.createPostSchema),
  CommunityController.createPost
);
router.post(
  "/posts",
  createResourceLimiter,
  requireAuth,
  validateRequest(CommunityValidation.createPostSchema),
  CommunityController.createPost
);


router.patch(
  "/posts/:id",
  requireAuth,
  validateRequest(CommunityValidation.updatePostSchema),
  CommunityController.updatePost
);
router.patch(
  "/:id",
  requireAuth,
  validateRequest(CommunityValidation.updatePostSchema),
  CommunityController.updatePost
);

// Admin & Moderator approval/rejection
router.patch(
  "/posts/:id/approve",
  requireAuth,
  requireRole("ADMIN", "MODERATOR"),
  CommunityController.approvePost
);
router.patch(
  "/:id/approve",
  requireAuth,
  requireRole("ADMIN", "MODERATOR"),
  CommunityController.approvePost
);

router.patch(
  "/posts/:id/reject",
  requireAuth,
  requireRole("ADMIN", "MODERATOR"),
  validateRequest(CommunityValidation.rejectPostSchema),
  CommunityController.rejectPost
);
router.patch(
  "/:id/reject",
  requireAuth,
  requireRole("ADMIN", "MODERATOR"),
  validateRequest(CommunityValidation.rejectPostSchema),
  CommunityController.rejectPost
);

// Deletion (Author or Admin/Moderator)
router.delete("/posts/:id", requireAuth, CommunityController.deletePost);
router.delete("/:id", requireAuth, CommunityController.deletePost);

export const CommunityRoutes = router;

