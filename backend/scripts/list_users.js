import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/user.js';

dotenv.config();

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/csec-project';

async function main() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to', uri);

    const users = await User.find().select('name email isVerified createdAt').lean();
    if (!users.length) {
      console.log('No users found');
    } else {
      console.table(users);
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

main();
