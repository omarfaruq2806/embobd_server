import { Router } from "express";
import { UserController } from "./user.controller";
import { requireAuth, requireRole } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserValidation } from "./user.validation";

const router = Router();

// Only Admin or Moderator can view list of all users
router.get("/", requireAuth, requireRole("ADMIN", "MODERATOR"), UserController.getAllUsers);

// Authenticated users can view user profiles
router.get("/:id", requireAuth, UserController.getUserById);

// Update user details (name, image, role)
router.patch(
  "/:id",
  requireAuth,
  validateRequest(UserValidation.updateUserSchema),
  UserController.updateUser
);

// Update candidate/employer profile fields (bio, skills, phone, resumeUrl, portfolioUrl)
router.patch(
  "/:id/profile",
  requireAuth,
  validateRequest(UserValidation.updateProfileSchema),
  UserController.updateProfile
);

// Only Admin can delete users
router.delete("/:id", requireAuth, requireRole("ADMIN"), UserController.deleteUser);

export const UserRoutes = router;

