import express from "express";
import { createProduct, updateProduct, deleteProduct } from "../../controllers/admin/product.controller.js";
import { authenticate, authorize } from "../../middleware/role.middleware.js";

const router = express.Router();

router.post("/", authenticate, authorize(["admin"]), createProduct);
router.put("/:id", authenticate, authorize(["admin"]), updateProduct);
router.delete("/:id", authenticate, authorize(["admin"]), deleteProduct);

export default router;