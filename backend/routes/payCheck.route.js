import mongoose from 'mongoose'
import express from 'express'
import {successMessage} from '../controllers/paymentCheck.controller.js';

const router = express.Router();

router.get('/success/:tx_ref', successMessage);

export default router