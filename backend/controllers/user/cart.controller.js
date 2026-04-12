import mongoose from "mongoose";
import Cart from "../../models/cart.model.js";

const getCart = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const userId = req.user._id;
        const cart = await Cart.findOne({ user: userId }).populate("items.product");
        if (!cart) {
            return res.status(200).json({ cart: { user: userId, items: [], totalPrice: 0 } });
        }
        return res.status(200).json({ cart });
    } catch (error) {
        console.error("Error fetching cart:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const createCart = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const userId = req.user._id;
        const { items, totalPrice } = req.body;

        if (!items || !Array.isArray(items)) {
            return res.status(400).json({ message: "Invalid or missing items array" });
        }

        const computedTotal = items.reduce((sum, it) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 1), 0);
        const finalTotal = typeof totalPrice === "number" ? totalPrice : computedTotal;

        let cart = await Cart.findOne({ user: userId });
        if (cart) {
            cart.items = items;
            cart.totalPrice = finalTotal;
            await cart.save();
            cart = await Cart.findById(cart._id).populate("items.product");
            return res.status(200).json({ message: "Cart updated successfully", cart });
        }

        const newCart = new Cart({ user: userId, items, totalPrice: finalTotal });
        await newCart.save();
        const populated = await Cart.findById(newCart._id).populate("items.product");
        return res.status(201).json({ message: "Cart created successfully", cart: populated });
    } catch (error) {
        console.error("Error creating/updating cart:", error);
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
};

const updateCartById = async (req, res) => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid cart ID" });
        }
        const cart = await Cart.findById(id);
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const isAdmin = req.user.role === "admin" || (Array.isArray(req.user.role) && req.user.role.includes("admin"));
        if (!isAdmin && cart.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const { items, totalPrice } = req.body;
        if (items && Array.isArray(items)) cart.items = items;
        if (typeof totalPrice === "number") cart.totalPrice = totalPrice;

        await cart.save();
        const populated = await Cart.findById(cart._id).populate("items.product");
        return res.status(200).json({ message: "Cart updated", cart: populated });
    } catch (error) {
        console.error("Error updating cart:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const deleteCartById = async (req, res) => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid cart ID" });
        }
        const cart = await Cart.findById(id);
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const isAdmin = req.user.role === "admin" || (Array.isArray(req.user.role) && req.user.role.includes("admin"));
        if (!isAdmin && cart.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Forbidden" });
        }

        await cart.remove();
        return res.status(200).json({ message: "Cart deleted successfully" });
    } catch (error) {
        console.error("Error deleting cart:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export { getCart, createCart, updateCartById, deleteCartById };