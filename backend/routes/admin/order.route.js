import express from "express";
import {getAllOrder,updateOrderStatus} from "../../controllers/admin/order.controller.js"

const router = express.Router();

router.get("/",getAllOrder)
router.put("/:id",updateOrderStatus)

export default router;