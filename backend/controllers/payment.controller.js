import Order from '../models/order.model.js';
import Transaction from '../models/transaction.model.js';
import User from '../models/user.model.js'; 
import crypto from 'crypto';
import axios from 'axios';

const initializePayment = async (req, res) => {
    try {
        const { amount, currency, email, orderId } = req.body;
        const userId = req.user?._id || req.body.userId; 

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const tx_ref = `TX-${orderId}-${Date.now()}`;

        const transaction = new Transaction({
            userId,
            orderId,
            email,
            amount,
            currency: currency || 'ETB',
            tx_ref,
        });
        await transaction.save();

        const chapaPayload = {
            amount,
            currency: currency || 'ETB',
            email,
            first_name: user.first_name || user.name || "Customer", // Pull from user model
            last_name: user.last_name || "User",
            tx_ref,
            callback_url: `https://your-api.com/api/payments/webhook`,
            return_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/transaction/success`,
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
        console.error("Chapa Initialization Error:", error.response?.data || error.message);
        return res.status(500).json({ 
            message: "Internal Server Error", 
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

        const chapaData = response.data.data;

        // 1. Check if payment actually succeeded at Chapa
        if (response.data.status === "success" && chapaData.status === "success") {
            
            // 2. Find and update the transaction
            const transaction = await Transaction.findOne({ tx_ref });
            
            if (!transaction) {
                return res.status(404).json({ message: "Transaction record not found in our DB" });
            }

            // 3. Idempotency Check: Don't process if already successful
            if (transaction.status === "success") {
                return res.status(200).json({ message: "Payment already verified", transaction });
            }

            // 4. Update Transaction and Order
            transaction.status = "success";
            transaction.chapa_reference = chapaData.reference;
            await transaction.save();

            await Order.findByIdAndUpdate(transaction.orderId, { paymentStatus: 'paid' });
            
            console.log(`✅ Success: Order ${transaction.orderId} is now PAID`);
            
            return res.status(200).json({ 
                message: "Payment verified successfully", 
                data: response.data 
            });

        } else {
            // Update our DB to reflect the failure seen on the dashboard
            await Transaction.findOneAndUpdate({ tx_ref }, { status: "failed" });
            return res.status(400).json({ 
                message: "Payment not successful", 
                status: chapaData.status 
            });
        }

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
    if (event.status === "success") {
        const transaction = await Transaction.findOneAndUpdate(
            { tx_ref: event.tx_ref },
            { status: "success", chapa_reference: event.reference },
            { new: true }
        );

        if (transaction) {
            await Order.findByIdAndUpdate(transaction.orderId, { paymentStatus: 'paid' });
        }
    } else {
        await Transaction.findOneAndUpdate({ tx_ref: event.tx_ref }, { status: "failed" });
    }

    res.status(200).send('Webhook Received');
}



export {
    initializePayment,
    verifyPayment,
    webhookHandler,
};