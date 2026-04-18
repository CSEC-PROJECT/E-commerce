import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import userRoutes from "./routes/user.route.js";
import productRoutes from "./routes/product.route.js";
import productAdminRoutes from "./routes/admin/product.route.js";
import userAdminRoutes from "./routes/admin/user.route.js";
import connectDB from './config/db.js';
import errorHandler from './middleware/error.middleware.js';
import orderAdminRoutes from "./routes/admin/order.route.js";
import orderUserRoutes from "./routes/user/order.route.js";
import cartUserRoutes from "./routes/user/cart.route.js";
import paymentRoutes from "./routes/payment.route.js"
import successMessage from './routes/payCheck.route.js';


import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerDocument = YAML.load(path.join(__dirname, "docs", "swagger.yaml"));


dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'https://e-commerce-olive-delta.vercel.app'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      // If the origin isn't present in allowedOrigins, it's blocked
      // We can also just return true here during dev
      return callback(null, true); 
    }
    return callback(null, true);
  },
  credentials: true 
}));

app.get('/', (req, res) => {
  res.send('Server is running 🚀');
});

app.use("/api/auth", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin/products", productAdminRoutes);
app.use("/api/admin/users", userAdminRoutes);
app.use("/api/admin/orders", orderAdminRoutes);
app.use("/api/user/orders", orderUserRoutes);
app.use("/api/user/cart", cartUserRoutes);
app.use("/api/pay",paymentRoutes)
app.use("/checkout",successMessage)

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();