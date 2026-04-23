import express from "express"
import {getProducts,getProductById} from "../controllers/product.controller.js"
import reviewRoutes from "./review.route.js";

const router = express.Router();

router.use("/:id/reviews", reviewRoutes);
router.get("/",getProducts)
router.get("/:id",getProductById)

export default router

