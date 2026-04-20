import mongoose from "mongoose";
import Product from "../models/product.model.js";

const withDiscountedPrice = (productDoc) => {
    const product = productDoc.toObject ? productDoc.toObject() : productDoc;
    const price = Number(product.price) || 0;
    const discount = Number(product.discount) || 0;
    const discountedPrice = Number((price - (price * discount) / 100).toFixed(2));
    return { ...product, discountedPrice };
};

const getProducts = async (req, res) => {
    try{
        const { search, category, minPrice, maxPrice, status, page = 1, limit = 10 } = req.query;

        const pageNum = Number(page) || 1;
        const limitNum = Number(limit) || 10;

        const filter = {};
        if (search) {
            filter.name = { $regex: search, $options: "i" };
        }
        if (category) {
            filter.category = { $regex: `^${category}$`, $options: "i" };
        }
        if (status) {
            filter.status = status;
        }
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) {
                filter.price.$gte = Number(minPrice);
            }
            if (maxPrice) {
                filter.price.$lte = Number(maxPrice);
            }
        }

        const [products, total] = await Promise.all([
            Product.find(filter)
                .skip((pageNum - 1) * limitNum)
                .limit(limitNum)
                .sort({ createdAt: -1 }),
            Product.countDocuments(filter),
        ]);

        const productsWithDiscount = products.map(withDiscountedPrice);

        return res.status(200).json({ products: productsWithDiscount, total, page: pageNum, limit: limitNum });


    }catch(error){
        console.error("Error fetching products:", error);
        return res.status(500).json({message:"Server Error",error:error.message})
    }
}

const getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        return res.status(200).json({ product: withDiscountedPrice(product) });

    } catch (error) {
        console.error("Error fetching product:", error);
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export {getProducts,getProductById}