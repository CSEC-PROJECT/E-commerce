import express from "express";
import { getAllOrder, updateOrderStatus } from "../../controllers/admin/order.controller.js";
import { authenticate, authorize } from "../../middleware/role.middleware.js";

const router = express.Router();

router.get("/", authenticate, authorize(["admin"]), getAllOrder);
router.put("/:id", authenticate, authorize(["admin"]), updateOrderStatus);

export default router;