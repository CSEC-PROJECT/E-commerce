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
    status:{
        type:String,
        enum:["used","slightly used","new"],
        default:"new"
    },
    category:{
        type:String,
        required: true,
        trim: true
    },
    madeIn: {
        type: String,
        trim: true,
    },
    material: {
        type: String,
        trim: true,
    },
    coverImage: {
        type: String,
        required: true,
        trim: true,
    },
    detailImages: {
        type: [String],
        validate: {
            validator: function (arr) {
                return arr.length <= 3;
            },
            message: "detailImages can contain at most 3 images",
        },
        default: [],
    },
    stock:{
        type:Number,
        required: true,
    },

},{timestamps:true});

const Product = mongoose.model("Product",productSchema);
export default Product;

