import Order from '../models/order.model.js';
import Transaction from '../models/transaction.model.js';
import User from '../models/user.model.js'; 
import Cart from '../models/cart.model.js';
import crypto from 'crypto';
import axios from 'axios';

const SUCCESS_PAYMENT_STATUSES = new Set(['success', 'successful', 'paid', 'completed', 'complete']);
const FAILED_PAYMENT_STATUSES = new Set(['failed', 'cancelled', 'canceled', 'error', 'expired']);

const normalizeStatus = (value) => String(value || '').trim().toLowerCase();

const parseMonetaryValue = (value) => {
    if (typeof value === 'number') {
        return Number.isFinite(value) ? value : 0;
    }

    if (typeof value === 'string') {
        const normalized = value.replace(/[^0-9.-]/g, '');
        const parsed = Number(normalized);
        return Number.isFinite(parsed) ? parsed : 0;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
};

const resolvePaymentStatus = (payload) => {
    const apiStatus = normalizeStatus(payload?.status);
    const paymentStatus = normalizeStatus(payload?.data?.status);
    const resolved = paymentStatus || apiStatus;

    if (SUCCESS_PAYMENT_STATUSES.has(resolved)) return 'success';
    if (FAILED_PAYMENT_STATUSES.has(resolved)) return 'failed';
    return 'pending';
};

const clearUserCartAfterPayment = async (userId) => {
    if (!userId) return;
    await Cart.findOneAndUpdate(
        { user: userId },
        { items: [], totalPrice: 0 },
        { new: true }
    );
};

const initializePayment = async (req, res) => {
    try {
        const { amount, currency, email, orderId } = req.body;
        const userId = req.user?._id || req.body.userId; 

        let finalAmount = parseMonetaryValue(amount);
        if (finalAmount <= 0 && orderId) {
            const existingOrder = await Order.findById(orderId).select('totalPrice');
            finalAmount = parseMonetaryValue(existingOrder?.totalPrice);
        }

        if (finalAmount <= 0) {
            return res.status(400).json({ message: 'Invalid payment amount' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const nameParts = (user.name || 'Customer User').trim().split(' ');
        const firstName = nameParts[0] || 'Customer';
        const lastName = nameParts.slice(1).join(' ') || 'User';

        const tx_ref = `TX-${orderId}-${Date.now()}`;

        const transaction = new Transaction({
            userId,
            orderId,
            email,
            amount: finalAmount,
            currency: currency || 'ETB',
            tx_ref,
        });
        await transaction.save();

        const chapaPayload = {
            amount: String(finalAmount),
            currency: currency || 'ETB',
            email,
            first_name: firstName,
            last_name: lastName,
            phone_number: user.phone || '0900000000',  
            tx_ref,
            callback_url: `${process.env.SERVER_URL || 'https://e-commerce-he4h.onrender.com'}/api/pay/webhook`,
            return_url: `${process.env.FRONTEND_URL || req.headers.origin || 'https://e-commerce-olive-delta.vercel.app'}/transaction/success?tx_ref=${tx_ref}`,
            customization: {
                title: "BaseCode Pay",
                description: `Order ${orderId}`,
            }
        };
        console.log("Chapa Payload being sent:", JSON.stringify(chapaPayload, null, 2));

        const response = await axios.post(
            'https://api.chapa.co/v1/transaction/initialize',
            chapaPayload,
            {
                headers: {
                    Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        res.status(200).json(response.data);

    } catch (error) {
        console.error("Chapa Initialization Error (full):", JSON.stringify(error.response?.data, null, 2));
        console.error("Chapa Initialization Error (message):", error.message);
        return res.status(500).json({ 
            message: "Internal Server Error", 
            chapaError: error.response?.data || null,
            error: error.response?.data?.message || error.message 
        });
    }
}

const verifyPayment = async (req, res) => {
    const { tx_ref } = req.params;

    try {
        const response = await axios.get(
            `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`
                }
            }
        );

        const chapaData = response.data?.data || {};
        const resolvedStatus = resolvePaymentStatus(response.data);
        const transaction = await Transaction.findOne({ tx_ref });

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction record not found in our DB' });
        }

        const verifiedAmount = parseMonetaryValue(chapaData.amount);
        if (verifiedAmount > 0) {
            transaction.amount = verifiedAmount;
        }

        if (chapaData.currency) {
            transaction.currency = String(chapaData.currency).toUpperCase();
        }

        if (chapaData.reference) {
            transaction.chapa_reference = chapaData.reference;
        }

        if (resolvedStatus === 'success') {
            const wasAlreadySuccessful = transaction.status === 'success';
            transaction.status = 'success';
            await transaction.save();

            await Order.findByIdAndUpdate(transaction.orderId, {
                paymentStatus: 'paid',
                status: 'paid',
            });
            await clearUserCartAfterPayment(transaction.userId);

            console.log(`Success: Order ${transaction.orderId} is now PAID`);

            return res.status(200).json({
                message: wasAlreadySuccessful ? 'Payment already verified' : 'Payment verified successfully',
                status: 'success',
                transaction,
                data: response.data,
            });
        }

        if (resolvedStatus === 'failed') {
            transaction.status = 'failed';
            await transaction.save();

            await Order.findByIdAndUpdate(transaction.orderId, { paymentStatus: 'failed' });

            return res.status(400).json({
                message: 'Payment not successful',
                status: 'failed',
                transaction,
            });
        }

        await transaction.save();
        return res.status(202).json({
            message: 'Payment is still pending confirmation',
            status: 'pending',
            transaction,
        });

    } catch (error) {
        console.error("Verification Error:", error.response?.data || error.message);
        console.error("Full error object:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const webhookHandler = async (req, res) => {
    const hash = crypto.createHmac('sha256', process.env.CHAPA_SECRET_KEY)
        .update(JSON.stringify(req.body))
        .digest('hex');

    if (hash !== req.headers['x-chapa-signature']) {
        return res.status(400).json({ message: "Invalid signature" });
    }

    const event = req.body;
    const resolvedStatus = resolvePaymentStatus({ data: event, status: event?.status });

    if (resolvedStatus === 'success') {
        const updatePayload = {
            status: 'success',
            chapa_reference: event.reference,
        };

        const eventAmount = parseMonetaryValue(event.amount);
        if (eventAmount > 0) {
            updatePayload.amount = eventAmount;
        }

        if (event.currency) {
            updatePayload.currency = String(event.currency).toUpperCase();
        }

        const transaction = await Transaction.findOneAndUpdate(
            { tx_ref: event.tx_ref },
            updatePayload,
            { new: true }
        );

        if (transaction) {
            await Order.findByIdAndUpdate(transaction.orderId, {
                paymentStatus: 'paid',
                status: 'paid',
            });
            await clearUserCartAfterPayment(transaction.userId);
        }
    } else if (resolvedStatus === 'failed') {
        await Transaction.findOneAndUpdate({ tx_ref: event.tx_ref }, { status: 'failed' });

        const failedTransaction = await Transaction.findOne({ tx_ref: event.tx_ref }).select('orderId');
        if (failedTransaction?.orderId) {
            await Order.findByIdAndUpdate(failedTransaction.orderId, { paymentStatus: 'failed' });
        }
    }

    res.status(200).send('Webhook Received');
}



export {
    initializePayment,
    verifyPayment,
    webhookHandler,
};