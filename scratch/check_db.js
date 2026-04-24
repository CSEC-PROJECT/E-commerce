import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', 'backend', '.env') });

const productSchema = new mongoose.Schema({
    name: String,
});

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

async function checkProducts() {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            console.error('MONGO_URI not found in .env');
            process.exit(1);
        }
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');
        
        const count = await Product.countDocuments();
        console.log(`Total products in database: ${count}`);
        
        if (count > 0) {
            const products = await Product.find().limit(5);
            console.log('Sample products:');
            products.forEach(p => console.log(`- ${p.name}`));
        } else {
            console.log('No products found in the database.');
        }
        
        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
}

checkProducts();
