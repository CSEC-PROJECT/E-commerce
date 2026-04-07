import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    email:{
        type:String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password:{
        type:String
    },
    role:{
        type: [String],
        default:["user"]
    }
    ,
    verificationToken: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false,
    }
    ,
    // hashed refresh token for refresh-token flow (single device)
    refreshTokenHash: {
        type: String,
    },
    // password reset token (hashed) and expiry
    passwordResetToken: {
        type: String,
    },
    passwordResetExpires: {
        type: Date,
    }

},
    {timestamps: true}
);

userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

export default User;



