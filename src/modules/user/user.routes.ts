import { Router } from "express";
import { UserController } from "./user.controller";

const router = Router();

router.post("/", UserController.createUser);
router.get("/", UserController.getAllUsers);
router.get("/:id", UserController.getUserById);
router.patch("/:id", UserController.updateUser);
router.patch("/:id/profile", UserController.updateProfile);
router.delete("/:id", UserController.deleteUser);

export const UserRoutes = router;
