import { Router } from "express";
import { JobController } from "./job.controller";
import { requireAuth, requireRole } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { JobValidation } from "./job.validation";
import { createResourceLimiter } from "../../middlewares/rateLimiter";

const router = Router();

// Public routes
router.get("/", JobController.getAllJobs);
router.get("/:id", JobController.getJobById);

// Protected routes (Employers and Admins can post jobs)
router.post(
  "/",
  createResourceLimiter,
  requireAuth,
  requireRole("EMPLOYER", "ADMIN"),
  validateRequest(JobValidation.createJobSchema),
  JobController.createJob
);


router.patch(
  "/:id",
  requireAuth,
  validateRequest(JobValidation.updateJobSchema),
  JobController.updateJob
);

router.delete(
  "/:id",
  requireAuth,
  JobController.deleteJob
);

export const JobRoutes = router;

