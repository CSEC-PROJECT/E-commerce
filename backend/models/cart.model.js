import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
	product: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Product",
		required: true,
	},
	quantity: {
		type: Number,
		required: true,
		min: 1,
		default: 1,
	},
	price: {
		type: Number,
		required: true,
		min: 0,
	},
}, { _id: false });

const cartSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			unique: true,
		},
		items: {
			type: [cartItemSchema],
			default: [],
		},
		totalPrice: {
			type: Number,
			required: true,
			min: 0,
			default: 0,
		},
	},
	{ timestamps: true }
);

const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);

export default Cart;