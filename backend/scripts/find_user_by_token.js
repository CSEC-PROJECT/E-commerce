import dotenv from 'dotenv';
import mongoose from 'mongoose';
import crypto from 'crypto';
import User from '../models/user.model.js';

dotenv.config();

const token = process.argv[2];
if (!token) {
  console.error('Usage: node scripts/find_user_by_token.js <token>');
  process.exit(1);
}

const run = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/csec-project';
    await mongoose.connect(uri, { tls: true, tlsInsecure: true });
    console.log('Connected to MongoDB for token lookup');

    const plain = await User.findOne({ verificationToken: token }).lean();
    if (plain) {
      console.log('Found user by plain verificationToken:');
      console.log(JSON.stringify({ _id: plain._id, email: plain.email, verificationToken: plain.verificationToken, isVerified: plain.isVerified }, null, 2));
      process.exit(0);
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const hashed = await User.findOne({ verificationToken: tokenHash }).lean();
    if (hashed) {
      console.log('Found user by hashed verificationToken:');
      console.log(JSON.stringify({ _id: hashed._id, email: hashed.email, verificationToken: hashed.verificationToken, isVerified: hashed.isVerified }, null, 2));
      process.exit(0);
    }

    console.log('No user found for given token (plain or sha256-hash).');

    // List any users that still have a verificationToken set
    const usersWithToken = await User.find({ verificationToken: { $exists: true, $ne: null } }).select('email verificationToken isVerified').lean();
    console.log(`Users with non-null verificationToken (${usersWithToken.length}):`);
    console.log(JSON.stringify(usersWithToken, null, 2));

    process.exit(0);
  } catch (err) {
    console.error('Error inspecting token:', err);
    process.exit(1);
  }
};

run();
