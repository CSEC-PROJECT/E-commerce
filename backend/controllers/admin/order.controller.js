// backend/controllers/admin/order.controller.js
import mongoose from "mongoose";
import Order from "../../models/order.model.js";


const getAllOrder = async (req,res) =>{
    try{
        const orders = await Order.find().populate("userId", "name email").sort({ createdAt: -1 });
        return res.status(200).json({ orders });

    }catch(error){
        console.error("Error fetching orders:", error);
        return res.status(500).json({message:"Server Error",error:error.message})
    }
}

const updateOrderStatus = async (req,res) =>{
    const { id } = req.params;
    const { status } = req.body;
    try{
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid order ID" });
        }
        if (!status) {
            return res.status(400).json({ message: "Status is required" });
        }

        const validStatuses = ["pending", "paid", "shipped", "delivered"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }
        const order = await Order.findById(id);
        if(!order){
            return res.status(404).json({message:"Order not found"});
        }
        order.status = status;
        await order.save();
        return res.status(200).json({
            message:"Order status updated successfully",
            order
        });


    }catch(error){
        console.error("Error updating order status:", error);
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
}


export {getAllOrder,updateOrderStatus}