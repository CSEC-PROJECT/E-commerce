import express from "express";
import {getDashboardStats,getWeeklySalesPerformance,getRecentTransactions,getBestSellingProducts} from "../../controllers/admin/dashboard.controller.js";
import { authenticate, authorize } from "../../middleware/role.middleware.js";

const router = express.Router();
router.get("/stats",authenticate,authorize(["admin"]),getDashboardStats);
router.get("/sales-performance",authenticate,authorize(["admin"]),getWeeklySalesPerformance);
router.get("/recent-transactions",authenticate,authorize(["admin"]),getRecentTransactions);
router.get("/best-selling",authenticate,authorize(["admin"]),getBestSellingProducts);

export default router;