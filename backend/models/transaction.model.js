import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    orderId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Order"
    },
    email:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    currency:{
        type:String,
        required:true
    },
    tx_ref:{
        type:String,
        required:true,
        unique:true
    },
    status:{
        type:String,
        enum:["pending","success","failed"],
        default:"pending"
    },
    chapa_reference:{
        type:String,
    }

},{timestamps:true})

export default mongoose.model('Transaction',transactionSchema) 