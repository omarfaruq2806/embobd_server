import { Router } from "express";
import { CategoryController } from "./category.controller";
import { requireAuth, requireRole } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { CategoryValidation } from "./category.validation";

const router = Router();

// Public routes
router.get("/", CategoryController.getAllCategories);
router.get("/:id", CategoryController.getCategoryById);

// Admin-only protected routes
router.post(
  "/",
  requireAuth,
  requireRole("ADMIN"),
  validateRequest(CategoryValidation.createCategorySchema),
  CategoryController.createCategory
);

router.patch(
  "/:id",
  requireAuth,
  requireRole("ADMIN"),
  validateRequest(CategoryValidation.updateCategorySchema),
  CategoryController.updateCategory
);

router.delete(
  "/:id",
  requireAuth,
  requireRole("ADMIN"),
  CategoryController.deleteCategory
);

export const CategoryRoutes = router;

