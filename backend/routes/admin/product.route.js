import express from "express";
import { createProduct, updateProduct, deleteProduct } from "../../controllers/admin/product.controller.js";

const router = express.Router();

router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router