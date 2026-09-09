import { Router } from "express";
import { CompanyController } from "./company.controller";
import { requireAuth, requireRole } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { CompanyValidation } from "./company.validation";

const router = Router();

// Public routes
router.get("/", CompanyController.getAllCompanies);
router.get("/:id", CompanyController.getCompanyById);

// Protected routes (Only Employer or Admin can create, owner/admin can edit/delete)
router.post(
  "/",
  requireAuth,
  requireRole("EMPLOYER", "ADMIN"),
  validateRequest(CompanyValidation.createCompanySchema),
  CompanyController.createCompany
);

router.patch(
  "/:id",
  requireAuth,
  validateRequest(CompanyValidation.updateCompanySchema),
  CompanyController.updateCompany
);

router.delete(
  "/:id",
  requireAuth,
  CompanyController.deleteCompany
);

export const CompanyRoutes = router;

