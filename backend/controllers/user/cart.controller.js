import mongoose from "mongoose";
import Cart from "../../models/cart.model.js";
import Product from "../../models/product.model.js";

const calculateDiscountedUnitPrice = (price, discount) => {
    const basePrice = Number(price) || 0;
    const discountPct = Number(discount) || 0;
    return Number((basePrice - (basePrice * discountPct) / 100).toFixed(2));
};

const normalizeAndPriceItems = async (items) => {
    if (!Array.isArray(items) || items.length === 0) {
        return { normalizedItems: [], totalPrice: 0 };
    }

    const rawProductIds = items.map((it) => it.product || it.productId).filter(Boolean);
    const productIds = rawProductIds.filter((id) => mongoose.Types.ObjectId.isValid(id));
    if (productIds.length !== items.length) {
        throw new Error("Each item must include a valid product or productId");
    }

    const products = await Product.find({ _id: { $in: productIds } }).select("price discount");
    const productMap = new Map(products.map((p) => [String(p._id), p]));

    const normalizedItems = items.map((it) => {
        const productId = String(it.product || it.productId);
        const product = productMap.get(productId);
        if (!product) {
            throw new Error(`Product not found: ${productId}`);
        }

        const quantity = Math.max(1, Number(it.quantity) || 1);
        const unitPrice = calculateDiscountedUnitPrice(product.price, product.discount);

        return {
            product: product._id,
            quantity,
            price: unitPrice,
        };
    });

    const totalPrice = Number(
        normalizedItems.reduce((sum, it) => sum + it.price * it.quantity, 0).toFixed(2)
    );

    return { normalizedItems, totalPrice };
};

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
        const { items } = req.body;

        if (!items || !Array.isArray(items)) {
            return res.status(400).json({ message: "Invalid or missing items array" });
        }

        const { normalizedItems, totalPrice } = await normalizeAndPriceItems(items);

        let cart = await Cart.findOne({ user: userId });
        if (cart) {
            cart.items = normalizedItems;
            cart.totalPrice = totalPrice;
            await cart.save();
            cart = await Cart.findById(cart._id).populate("items.product");
            return res.status(200).json({ message: "Cart updated successfully", cart });
        }

        const newCart = new Cart({ user: userId, items: normalizedItems, totalPrice });
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

        const { items } = req.body;
        if (items && Array.isArray(items)) {
            const { normalizedItems, totalPrice } = await normalizeAndPriceItems(items);
            cart.items = normalizedItems;
            cart.totalPrice = totalPrice;
        }

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