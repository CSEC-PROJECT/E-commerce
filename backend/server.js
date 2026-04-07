import express from 'express';
import dotenv from 'dotenv';
import userRoutes from "./routes/user.route.js";
import connectDB from './config/db.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/auth",userRoutes)

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