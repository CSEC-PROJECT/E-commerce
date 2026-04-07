import express from "express";
import {
	login,
	register,
	verifyEmail,
	refreshToken,
	logout,
	requestPasswordReset,
	confirmPasswordReset,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/logout", logout);
router.post("/password-reset/request", requestPasswordReset);
router.post("/password-reset/confirm", confirmPasswordReset);
router.get("/verify", verifyEmail);

export default router;