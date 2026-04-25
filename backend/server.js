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
import dashboardAdminRoutes from "./routes/admin/dashboard.route.js";
import financeAdminRoutes from "./routes/admin/finance.route.js";
import ragRoutes from "./routes/rag.route.js";
import communityRoutes from "./routes/communityPost.route.js";



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

app.set('etag', false);

app.use(express.json());
app.use(cookieParser());
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'https://e-commerce-olive-delta.vercel.app'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {

      return callback(null, true); 
    }
    return callback(null, true);
  },
  credentials: true 
}));

app.use('/api', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

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
app.use("/api/admin/dashboard", dashboardAdminRoutes);
app.use("/api/admin/finance", financeAdminRoutes);
app.use("/api/rag", ragRoutes);
app.use("/api/community", communityRoutes);


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