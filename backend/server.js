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
import cartUserRoutes from "./routes/user/cart.route.js"

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));

app.get('/', (req, res) => {
  res.send('Server is running 🚀');
});

app.use("/api/auth", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin/products", productAdminRoutes);
app.use("/api/admin/users", userAdminRoutes);
app.use("/api/admin/orders", orderAdminRoutes);
app.use("/api/user", orderUserRoutes);
app.use("/api/user/cart", cartUserRoutes);

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