import express from "express";
import {
	login,
	register,
	verifyEmail,
	refreshToken,
	logout,
	requestPasswordReset,
	confirmPasswordReset,
	changePassword,
} from "../controllers/user.controller.js";
import { upload } from "../config/cloudinaryConfig.js";
import { authenticate } from "../middleware/role.middleware.js";

const router = express.Router();

router.post("/register", upload.single('profilePic'), register);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/logout", logout);
router.post("/password-reset/request", requestPasswordReset);
router.post("/password-reset/confirm", confirmPasswordReset);
router.post("/change-password", authenticate, changePassword);
router.get("/verify", verifyEmail);

export default router;