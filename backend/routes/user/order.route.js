import express from 'express';
import {createOrder,getMyOrder,getOrderById} from "../../controllers/user/order.controller"

const router = express.Router();

router.post('/orders',createOrder)
router.get('/orders/my',getMyOrder)
router.get('/orders/:id',getOrderById)

// POST /api/orders        → create order (checkout)
// GET /api/orders/my      → user orders
// GET /api/orders/:id     → single order