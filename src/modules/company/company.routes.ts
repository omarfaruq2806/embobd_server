import { Router } from "express";
import { CompanyController } from "./company.controller";

const router = Router();

router.post("/", CompanyController.createCompany);
router.get("/", CompanyController.getAllCompanies);
router.get("/:id", CompanyController.getCompanyById);
router.patch("/:id", CompanyController.updateCompany);
router.delete("/:id", CompanyController.deleteCompany);

export const CompanyRoutes = router;
