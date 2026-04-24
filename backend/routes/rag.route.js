import express from "express";
import { ragChat } from "../controllers/rag.controller.js";

const router = express.Router();

router.post("/chat", ragChat);

export default router;
