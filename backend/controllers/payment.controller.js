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

        const nameParts = (user.name || 'Customer User').trim().split(' ');
        const firstName = nameParts[0] || 'Customer';
        const lastName = nameParts.slice(1).join(' ') || 'User';

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
            amount: String(amount),  
            currency: currency || 'ETB',
            email,
            first_name: firstName,
            last_name: lastName,
            phone_number: user.phone || '0900000000',  
            tx_ref,
            callback_url: `${process.env.SERVER_URL || 'https://e-commerce-he4h.onrender.com'}/api/pay/webhook`,
            return_url: `${process.env.FRONTEND_URL || 'https://e-commerce-olive-delta.vercel.app'}/transaction/success?tx_ref=${tx_ref}`,
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

        const chapaData = response.data.data;

        if (response.data.status === "success" && chapaData.status === "success") {
            
            const transaction = await Transaction.findOne({ tx_ref });
            
            if (!transaction) {
                return res.status(404).json({ message: "Transaction record not found in our DB" });
            }

            if (transaction.status === "success") {
                return res.status(200).json({ message: "Payment already verified", transaction });
            }

            transaction.status = "success";
            transaction.chapa_reference = chapaData.reference;
            await transaction.save();

            await Order.findByIdAndUpdate(transaction.orderId, { paymentStatus: 'paid' });
            
            console.log(`✅ Success: Order ${transaction.orderId} is now PAID`);
            
            return res.status(200).json({ 
                message: "Payment verified successfully", 
                status: 'success',
                data: response.data 
            });

        } else {
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