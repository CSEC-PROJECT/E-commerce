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
        enum: ["user", "admin"],
        default: ["user"]
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
    refreshTokenHash: {
        type: String,
    },
    passwordResetToken: {
        type: String,
    },
    passwordResetExpires: {
        type: Date,
    },
    profilePic: String,
    cloudinaryId: String

},
    {timestamps: true}
);


userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return; 
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
        throw error; 
    }
});

const User = mongoose.model("User", userSchema);

export default User;



