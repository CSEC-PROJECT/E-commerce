import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            name: { type: String },
            price: { type: Number },
            quantity: { type: Number, required: true },
        },
    ],
    totalPrice: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "paid", "shipped", "delivered"],
        default: "pending",
    },

}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);
export default Order;