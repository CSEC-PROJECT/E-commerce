import express from "express";
import { createProduct, updateProduct, deleteProduct } from "../../controllers/admin/product.controller.js";
import { authenticate, authorize } from "../../middleware/role.middleware.js";
import { upload } from "../../config/cloudinaryConfig.js";

const router = express.Router();

router.post("/", authenticate, authorize(["admin"]), upload.fields([
	{ name: 'coverImage', maxCount: 1 },
	{ name: 'detailImages', maxCount: 3 },
]), createProduct);
router.put("/:id", authenticate, authorize(["admin"]), upload.fields([
	{ name: 'coverImage', maxCount: 1 },
	{ name: 'detailImages', maxCount: 3 },
]), updateProduct);
router.delete("/:id", authenticate, authorize(["admin"]), deleteProduct);

export default router;