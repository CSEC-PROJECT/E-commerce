import Product from "../../models/product.model.js";
import mongoose from "mongoose";

const createProduct = async(req,res) =>{
    console.log("1. Request received at controller");
    console.log("Body:", req.body);
    console.log("Files:", req.files);

    const { name, description, price, category, stock, status, madeIn, material } = req.body;
    const coverImage = req.body.coverImage || (req.files && req.files.coverImage && req.files.coverImage[0] && req.files.coverImage[0].path);
    const detailImages = [];
    if (req.files && req.files.detailImages) {
        for (const f of req.files.detailImages) {
            if (f && f.path) detailImages.push(f.path);
        }
    }
    try{
        if (!name || !description || !category || !coverImage || price == null || stock == null) {
            return res.status(400).json({ message: "Required fields missing: name, description, category, coverImage, price, stock" });
        }
        const validStatuses = ["used", "slightly used", "new"];
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }
        if (Number(price) < 0) {
            return res.status(400).json({ message: "Invalid price value" });
        }
        if (Number(stock) < 0) {
            return res.status(400).json({ message: "Invalid stock value" });
        }

        const newProduct = new Product({
            name,
            description,
            price,
            category,
            stock,
            status,
            madeIn,
            material,
            coverImage,
            detailImages,
        });
        await newProduct.save();
        return res.status(201).json({
            message:"Product created successfully",
            product:newProduct
        })


    }catch(error){
        console.error("Error creating product:", error);
        return res.status(500).json({message:"Server Error",error:error.message})
    }
}

const updateProduct = async(req,res) =>{
    const {id} = req.params;
    try{
        if(mongoose.Types.ObjectId.isValid(id) === false){
            return res.status(400).json({message:"Invalid product ID"})
        }
        const updateData = { ...req.body };
        Object.keys(updateData).forEach(key => {
            if (updateData[key] === "" || updateData[key] === null) {
                delete updateData[key];
            }
        });

        if (req.files && req.files.coverImage && req.files.coverImage[0]) {
            updateData.coverImage = req.files.coverImage[0].path;
        }
        if (req.files && req.files.detailImages && req.files.detailImages.length > 0) {
            updateData.detailImages = req.files.detailImages.map(f => f.path).slice(0, 3);
        }

        const UpdateProduct = await Product.findByIdAndUpdate(
            id,
            {$set:updateData},
            {new:true,runValidators:true,context: 'query'}
        );
        if(!UpdateProduct){
            return res.status(404).json({message:"Product not found"})
        }
        return res.status(200).json({
            message:"Product updated successfully",
            product:UpdateProduct
        });

    }catch(error){
        console.error("Error updating product:", error);
        return res.status(500).json({message:"Server Error",error:error.message})
    }
}

const deleteProduct = async(req,res) =>{
    const {id} = req.params;
    try{
        if(mongoose.Types.ObjectId.isValid(id) === false){
            return res.status(400).json({message:"Invalid product ID"})
        }
        const product = await Product.findByIdAndDelete(id);
        if(!product){
            return res.status(404).json({message:"Product not found"})
        }
        return res.status(200).json({
            message:"Product deleted successfully"
        });

    }catch(error){
        console.error("Error deleting product:", error);
        return res.status(500).json({message:"Server Error",error:error.message})
    }
}

export {createProduct,updateProduct,deleteProduct}