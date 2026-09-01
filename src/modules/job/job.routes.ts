import { Router } from "express";
import { JobController } from "./job.controller";

const router = Router();

router.post("/", JobController.createJob);
router.get("/", JobController.getAllJobs);
router.get("/:id", JobController.getJobById);
router.patch("/:id", JobController.updateJob);
router.delete("/:id", JobController.deleteJob);

export const JobRoutes = router;
