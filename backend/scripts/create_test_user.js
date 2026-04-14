import dotenv from 'dotenv';
import mongoose from 'mongoose';
import crypto from 'crypto';
import User from '../models/user.model.js';

dotenv.config();

const email = process.argv[2] || `testcopilot+${Date.now()}@example.com`;
const password = process.argv[3] || 'Password123';
const name = process.argv[4] || 'Copilot Test';

const run = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/csec-project';
    await mongoose.connect(uri, { tls: true, tlsInsecure: true });
    console.log('Connected to MongoDB for creating test user');

    const normalized = String(email).toLowerCase().trim();
    const existing = await User.findOne({ email: normalized }).lean();
    if (existing) {
      console.log('User already exists:');
      console.log(JSON.stringify({ _id: existing._id, email: existing.email, verificationToken: existing.verificationToken, isVerified: existing.isVerified }, null, 2));
      process.exit(0);
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const user = new User({ name, email: normalized, password, verificationToken, isVerified: false });
    await user.save();

    console.log('Created user:');
    console.log(JSON.stringify({ _id: user._id, email: user.email, verificationToken: user.verificationToken, isVerified: user.isVerified }, null, 2));
    process.exit(0);
  } catch (err) {
    console.error('Error creating user:', err);
    process.exit(1);
  }
};

run();
