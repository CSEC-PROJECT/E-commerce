import Transaction from '../models/transaction.model.js';
import express from 'express';
import {initializePayment,verifyPayment,webhookHandler} from '../controllers/payment.controller.js';
import { authenticate } from '../middleware/role.middleware.js';

const router = express.Router();

router.post("/",authenticate,initializePayment);
router.get('/verify/:tx_ref',verifyPayment)
router.post('/webhook',webhookHandler)

export default router