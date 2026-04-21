import mongoose from "mongoose";
import Order from "../../models/order.model.js";
import Product from "../../models/product.model.js";

const createOrder = async (req,res) =>{
    const { items, totalPrice, status } = req.body;
    try{
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const userId = req.user._id;

        if(!items || !Array.isArray(items) || items.length === 0 || !totalPrice){
            return res.status(400).json({ message: "Missing required fields" })
        }

        // Fetch product details from the database to ensure data integrity
        const productIds = items
            .map(item => item.productId)
            .filter((id) => mongoose.Types.ObjectId.isValid(id));

        if (productIds.length !== items.length) {
            return res.status(400).json({ message: "Each item must include a valid productId" });
        }

        const products = await Product.find({ '_id': { $in: productIds } });

        const productMap = products.reduce((map, product) => {
            map[product._id.toString()] = product;
            return map;
        }, {});

        const missingProductId = items.find((item) => !productMap[item.productId])?.productId;
        if (missingProductId) {
            return res.status(400).json({ message: `Product with ID ${missingProductId} not found` });
        }

        const orderItems = items.map(item => {
            const product = productMap[item.productId];
            return {
                productId: item.productId,
                name: product.name,
                price: product.price, // Or apply discount logic if needed
                quantity: item.quantity,
            };
        });

        const newOrder = new Order({
            userId,
            items: orderItems,
            totalPrice,
            status
        })
        await newOrder.save();

        return res.status(201).json({
            message:"Order created successfully",
            order:newOrder
        })

    }catch(error){
        console.error("Error creating order:", error);
        return res.status(500).json({ message: "Server Error", error: error.message })
    }
}

const getMyOrder = async(req,res) =>{
    if (!req.user || !req.user._id) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const userId = req.user._id;
    try{
        const orders = await Order.find({userId}).sort({ createdAt: -1 });
        return res.status(200).json({ orders });
        
    }catch(error){
        console.error("Error fetching order:", error);
        return res.status(500).json({message:"Internal server error"})
    }
}

const getOrderById = async(req,res) =>{
    const { id } = req.params;
    try{
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({message:"Invalid order ID"})
        }
        const order = await Order.findById(id);
        if(!order){
            return res.status(404).json({message:"Order not found"});
        }
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const isAdmin = req.user.role === 'admin' || (Array.isArray(req.user.role) && req.user.role.includes('admin'));
        if (!isAdmin && order.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Forbidden" });
        }
        return res.status(200).json({order})


    }catch(error){
        console.error("Error fetching order:", error);
        return res.status(500).json({message:"Internal server error"})
    }
}

export { createOrder, getMyOrder, getOrderById }