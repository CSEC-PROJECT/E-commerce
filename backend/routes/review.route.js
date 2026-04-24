import express from "express";
import { getProductReviews, getReviewEligibility, upsertProductReview } from "../controllers/review.controller.js";
import { authenticate } from "../middleware/role.middleware.js";

const router = express.Router({ mergeParams: true });

router.get("/", getProductReviews);
router.get("/eligibility", authenticate, getReviewEligibility);
router.post("/", authenticate, upsertProductReview);

export default router;
