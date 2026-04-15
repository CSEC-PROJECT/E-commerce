import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import User from "../models/user.model.js";

dotenv.config();

const run = async () => {
  try {
    await connectDB();

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASS;
    const name = process.env.ADMIN_NAME || "Administrator";

    if (!email || !password) {
      console.error("Please set ADMIN_EMAIL and ADMIN_PASS in your .env before running this script.");
      process.exit(1);
    }

    let user = await User.findOne({ email: String(email).toLowerCase().trim() });
    if (user) {
      if (user.role !== "admin") {
        user.role = "admin";
        user.isVerified = true;
        await user.save();
        console.log("Existing user promoted to admin:", user.email);
      } else {
        console.log("Admin already exists:", user.email);
      }
      process.exit(0);
    }

    user = new User({
      name,
      email: String(email).toLowerCase().trim(),
      password,
      role: "admin",
      isVerified: true,
    });

    await user.save();
    console.log("Admin user created:", user.email);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
