import express from "express";
import {getFinancialOverview,getRevenueOverTime,getOrdersVsRefunds,getRecentTransactions} from "../../controllers/admin/finance.controller.js";
import { authenticate, authorize } from "../../middleware/role.middleware.js";

const router = express.Router();

router.get("/overview",authenticate,authorize(["admin"]),getFinancialOverview);
router.get("/revenue-over-time",authenticate,authorize(["admin"]),getRevenueOverTime);
router.get("/orders-vs-refunds",authenticate,authorize(["admin"]),getOrdersVsRefunds);
router.get("/transactions",authenticate,authorize(["admin"]),getRecentTransactions);

export default router;