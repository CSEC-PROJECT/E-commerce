import { mongo } from "mongoose";
import Product from "../../models/product.model.js";

const createProduct = async(req,res) =>{
    const { name, description, price, category, imageUrl, stock, status } = req.body;
    try{
        if (!name || !description || !category || !imageUrl || price == null || stock == null) {
            return res.status(400).json({ message: "All fields are required" });
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
            imageUrl,
            stock,
            status
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
        if(mongo.ObjectId.isValid(id) === false){
            return res.status(400).json({message:"Invalid product ID"})
        }
        const UpdateProduct = await Product.findByIdAndUpdate(
            id,
            {$set:req.body},
            {new:true,runValidators:true}
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
        if(mongo.ObjectId.isValid(id) === false){
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