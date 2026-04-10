import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import userRoutes from "./routes/user.route.js";
import productRoutes from "./routes/product.route.js";
import productAdminRoutes from "./routes/admin/product.route.js";
import connectDB from './config/db.js';
import errorHandler from './middleware/error.middleware.js';
import adminOrder from "./routes/admin/order.route.js"

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use("/api/auth",userRoutes)
app.use("/api/products",productRoutes)
app.use("/api/products",productAdminRoutes)
app.use("/api/order",adminOrder)

app.get('/', (req, res) => {
  res.send('Server is running 🚀');
});

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

app.use(errorHandler);