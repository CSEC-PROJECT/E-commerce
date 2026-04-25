import express from "express";
import { 
    createPost, 
    getPosts, 
    likePost, 
    repostPost, 
    commentPost, 
    reportPost 
} from "../controllers/communityPost.controller.js";
import { authenticate } from "../middleware/role.middleware.js";

const router = express.Router();

router.get("/", getPosts);
router.post("/", authenticate, createPost);
router.post("/:id/like", authenticate, likePost);
router.post("/:id/repost", authenticate, repostPost);
router.post("/:id/comment", authenticate, commentPost);
router.post("/:id/report", authenticate, reportPost);

export default router;
