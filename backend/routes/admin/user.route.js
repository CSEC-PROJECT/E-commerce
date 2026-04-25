import express from "express";
import { getAllUsers, getUserById, deleteUser, toggleBanUser } from "../../controllers/admin/user.controller.js";
import { authenticate, authorize } from "../../middleware/role.middleware.js";

const router = express.Router();

router.get("/", authenticate, authorize(["admin"]), getAllUsers);
router.get("/:id", authenticate, authorize(["admin"]), getUserById);
router.delete("/:id", authenticate, authorize(["admin"]), deleteUser);
router.post("/:id/toggle-ban", authenticate, authorize(["admin"]), toggleBanUser);

export default router;