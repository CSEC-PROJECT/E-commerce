import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
        trim: true
    },
    description:{
        type:String,
        required: true,
        trim: true
    },
    price:{
        type:Number,
        required: true,
    },
    category:{
        type:String,
        required: true,
        trim: true
    },
    imageUrl:{
        type:String,
        required: true,
        trim: true
    },
    stock:{
        type:Number,
        required: true,
    },

},{timestamps:true});

const Product = mongoose.model("Product",productSchema);
export default Product;

