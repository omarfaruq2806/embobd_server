import { Router } from "express";
import { CommunityController } from "./community.controller";
import { requireAuth, optionalAuth } from "../../middlewares/auth";

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
router.post("/", requireAuth, CommunityController.createPost);
router.post("/posts", requireAuth, CommunityController.createPost);

router.patch("/posts/:id", requireAuth, CommunityController.updatePost);
router.patch("/:id", requireAuth, CommunityController.updatePost);

router.patch("/posts/:id/approve", requireAuth, CommunityController.approvePost);
router.patch("/:id/approve", requireAuth, CommunityController.approvePost);

router.patch("/posts/:id/reject", requireAuth, CommunityController.rejectPost);
router.patch("/:id/reject", requireAuth, CommunityController.rejectPost);

router.delete("/posts/:id", requireAuth, CommunityController.deletePost);
router.delete("/:id", requireAuth, CommunityController.deletePost);

export const CommunityRoutes = router;
