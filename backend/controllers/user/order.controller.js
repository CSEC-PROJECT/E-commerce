import mongoose from "mongoose";
import Order from "../../models/order.model.js";

// createOrder,getMyOrder,getOrderById

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

        const newOrder = new Order({
            userId,
            items,
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
        return res.status(500).json({message:"Server Error",error:error.message})
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
        // Enforce ownership: only the order owner or an admin can access
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