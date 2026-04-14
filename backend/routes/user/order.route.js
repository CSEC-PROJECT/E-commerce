// backend/routes/user/order.route.js
import express from 'express';
import { createOrder, getMyOrder, getOrderById } from "../../controllers/user/order.controller.js";
import { authenticate } from "../../middleware/role.middleware.js";

const router = express.Router();

router.post('/', authenticate, createOrder);
router.get('/my', authenticate, getMyOrder);
router.get('/:id', authenticate, getOrderById);

export default router;

