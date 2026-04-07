import express from "express";
import { login, register, verifyEmail } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/verify", verifyEmail); 

export default router;