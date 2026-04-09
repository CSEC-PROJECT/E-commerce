import mongoose from "mongoose"

const orderSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        require:true
    },
    items:[
        {
        productId:mongoose.Schema.Types.ObjectId,
        name:String,
        price:Number,
        quantity:Number
        }
    ],
    totalPrice:{
        type:Number,
        requird:true
    },
    status:{
        type:String,
        enum:["pending","paid","shipped","delivered"],
        default:"pending"
    },

},{ timestamps:true});

const Order = mongoose.model("Order",orderSchema);
export default Order;