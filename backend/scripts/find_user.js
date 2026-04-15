import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/user.model.js';

dotenv.config();

const email = process.argv[2];
if (!email) {
  console.error('Usage: node scripts/find_user.js user@example.com');
  process.exit(1);
}

const run = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/csec-project';
    await mongoose.connect(uri, { tls: true, tlsInsecure: true });
    console.log('Connected to MongoDB for inspection');

    const user = await User.findOne({ email: String(email).toLowerCase().trim() }).lean();
    if (!user) {
      console.log('No user found with email', email);
      process.exit(0);
    }

    // Print a compact view of relevant fields only
    const out = {
      _id: user._id,
      email: user.email,
      isVerified: user.isVerified,
      verificationToken: user.verificationToken,
      refreshTokenHash: !!user.refreshTokenHash,
      passwordResetToken: !!user.passwordResetToken,
      createdAt: user.createdAt,
    };

    console.log('User document:', JSON.stringify(out, null, 2));
    process.exit(0);
  } catch (err) {
    console.error('Error inspecting user:', err);
    process.exit(1);
  }
};

run();
