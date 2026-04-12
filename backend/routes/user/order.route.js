import express from 'express';
import { createOrder, getMyOrder, getOrderById } from "../../controllers/user/order.controller.js";
import { authenticate } from "../../middleware/role.middleware.js";

const router = express.Router();

router.post('/orders', authenticate, createOrder);
router.get('/orders/my', authenticate, getMyOrder);
router.get('/orders/:id', authenticate, getOrderById);

export default router;

