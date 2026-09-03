import { Router } from "express";
import { BusinessController } from "./business.controller";
import { requireAuth } from "../../middlewares/auth";

const router = Router();

// Public read routes
router.get("/", BusinessController.getAllBusinesses);
router.get("/slug/:slug", BusinessController.getBusinessBySlug);
router.get("/:id", BusinessController.getBusinessById);

// Protected routes (Authentication / Login Mandatory)
router.post("/", requireAuth, BusinessController.createBusiness);
router.patch("/:id", requireAuth, BusinessController.updateBusiness);
router.patch("/:id/approve", requireAuth, BusinessController.approveBusiness);
router.patch("/:id/reject", requireAuth, BusinessController.rejectBusiness);
router.delete("/:id", requireAuth, BusinessController.deleteBusiness);

export const BusinessRoutes = router;
