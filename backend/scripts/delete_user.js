import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/user.js';

dotenv.config();

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/csec-project';
const emailArg = process.argv[2];

if (!emailArg) {
  console.error('Usage: node delete_user.js user@example.com');
  process.exit(1);
}

const normalizedEmail = String(emailArg).toLowerCase().trim();

async function main() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to', uri);

    const deleted = await User.findOneAndDelete({ email: normalizedEmail });
    if (!deleted) {
      console.log('No user found with email:', normalizedEmail);
    } else {
      console.log('Deleted user:', { name: deleted.name, email: deleted.email });
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

main();
