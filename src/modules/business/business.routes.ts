import { Router } from "express";
import { BusinessController } from "./business.controller";
import { requireAuth, requireRole } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { BusinessValidation } from "./business.validation";
import { createResourceLimiter } from "../../middlewares/rateLimiter";

const router = Router();

// Public read routes
router.get("/", BusinessController.getAllBusinesses);
router.get("/slug/:slug", BusinessController.getBusinessBySlug);
router.get("/:id", BusinessController.getBusinessById);

// Protected routes (Authentication / Login Mandatory)
router.post(
  "/",
  createResourceLimiter,
  requireAuth,
  validateRequest(BusinessValidation.createBusinessSchema),
  BusinessController.createBusiness
);


router.patch(
  "/:id",
  requireAuth,
  validateRequest(BusinessValidation.updateBusinessSchema),
  BusinessController.updateBusiness
);

// Admin & Moderator actions
router.patch(
  "/:id/approve",
  requireAuth,
  requireRole("ADMIN", "MODERATOR"),
  BusinessController.approveBusiness
);

router.patch(
  "/:id/reject",
  requireAuth,
  requireRole("ADMIN", "MODERATOR"),
  validateRequest(BusinessValidation.rejectBusinessSchema),
  BusinessController.rejectBusiness
);

// Delete action (Admin only)
router.delete(
  "/:id",
  requireAuth,
  requireRole("ADMIN"),
  BusinessController.deleteBusiness
);

export const BusinessRoutes = router;

