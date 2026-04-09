import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/user.js";

dotenv.config();

const run = async () => {
  try {
    await connectDB();
    const users = await User.find({});
    let changed = 0;
    for (const u of users) {
      if (Array.isArray(u.role)) {
        u.role = u.role[0] || "user";
        await u.save();
        changed += 1;
        console.log(`Fixed role for ${u.email} -> ${u.role}`);
      }
    }
    console.log(`Done. Fixed ${changed} user(s).`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
