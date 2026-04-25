import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import crypto from "crypto";
import User from "../models/user.model.js"
import dotenv from 'dotenv';

dotenv.config();


const generateAccessToken = (user) => {
    return jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRES || "15m" }
    );
};

const generateRefreshTokenString = () => {
    return crypto.randomBytes(64).toString("hex");
};


const sendVerificationEmail = async (email, token) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS 
        }
    });

    const serverUrl = process.env.SERVER_URL || `https://e-commerce-he4h.onrender.com`;
    const verificationLink = `${serverUrl}/api/auth/verify?token=${token}`;

    const mailOptions = {
        from: `"CSEC_E_COMMERCE" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Verify your email address",
        html: `
            <div style="font-family: sans-serif; padding: 20px;">
                <h1>Welcome!</h1>
                <p>Thank you for signing up. Please verify your email to activate your account:</p>
                <a href="${verificationLink}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
                <p style="margin-top: 20px;">If the button doesn't work, copy and paste this link:</p>
                <p>${verificationLink}</p>
            </div>
        `,
    };

    await transporter.sendMail(mailOptions);
};

const sendPasswordResetEmail = async (email, token) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS 
        }
    });

    const frontendUrl = process.env.FRONTEND_URL || `http://localhost:${process.env.FRONTEND_PORT || 5173}`;
    const resetLink = `${frontendUrl}/reset-password?token=${token}`;

    const mailOptions = {
        from: `"CSEC_E-COMMERCE" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Password reset",
        html: `
            <div style="font-family: sans-serif; padding: 20px;">
                <h1>Password reset request</h1>
                <p>Click to reset your password:</p>
                <a href="${resetLink}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset password</a>
                <p>If the button doesn't work, paste this link:</p>
                <p>${resetLink}</p>
            </div>
        `,
    };

    await transporter.sendMail(mailOptions);
};


export const register = async (req, res) => {
    const { name, email, password } = req.body;
    const normalizedEmail = email && String(email).toLowerCase().trim();

    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const verificationToken = crypto.randomBytes(32).toString("hex");
        const newUser = new User({
            name,
            email: normalizedEmail,
            password,
            isVerified: false,
            verificationToken,
            profilePic: req.file?.path || req.file?.secure_url || undefined,
            cloudinaryId: req.file?.filename || req.file?.public_id || undefined,
        });

        await newUser.save();

        await sendVerificationEmail(normalizedEmail, verificationToken);

        const { password: _, ...userData } = newUser._doc;

        return res.status(201).json({
            message: "User registered successfully. Please check your email to verify.",
            data: userData,
        });

    } catch (error) {
        console.error("Register Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const verifyEmail = async (req, res) => {
    const { token } = req.query;
    const frontendUrl = process.env.FRONTEND_URL || `http://localhost:5173`;

    try {
        if (!token) return res.status(400).json({ message: "Token missing" });

        const user = await User.findOne({ verificationToken: token });

        if (!user) {
            console.log(`Verification failed for token: ${token}`);
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        user.isVerified = true;
        user.verificationToken = undefined; 
        
        await user.save(); 

        console.log(`User ${user.email} verified successfully.`);
        return res.redirect(`${frontendUrl}/login?verified=true`);
    } catch (error) {
        console.error("Verify Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const normalizedEmail = String(email).toLowerCase().trim();
        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        if (!user.isVerified) {
            return res.status(401).json({ message: "Please verify your email before logging in" });
        }

        if (user.isBanned) {
            return res.status(403).json({ message: "Your account has been banned due to multiple reports." });
        }


        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshTokenString();

        const refreshHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
        user.refreshTokenHash = refreshHash;
        await user.save();

        const { password: _, ...userData } = user._doc;

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 
        };
        try { res.cookie('refreshToken', refreshToken, cookieOptions); } catch (e) {}

        res.status(200).json({
            message: "Login successful",
            data: userData,
            accessToken,
            refreshToken
        });
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const refreshToken = async (req, res) => {
    try {
        const provided = req.body.refreshToken || req.cookies?.refreshToken;
        if (!provided) return res.status(400).json({ message: 'Refresh token required' });

        const providedHash = crypto.createHash('sha256').update(provided).digest('hex');
        const user = await User.findOne({ refreshTokenHash: providedHash });
        if (!user) return res.status(401).json({ message: 'Invalid refresh token' });

        const accessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshTokenString();
        user.refreshTokenHash = crypto.createHash('sha256').update(newRefreshToken).digest('hex');
        await user.save();

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        };
        try { res.cookie('refreshToken', newRefreshToken, cookieOptions); } catch (e) {}

        res.json({ accessToken, refreshToken: newRefreshToken });
    } catch (err) {
        console.error('Refresh Error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const logout = async (req, res) => {
    try {
        const provided = req.body.refreshToken || req.cookies?.refreshToken;
        if (provided) {
            const providedHash = crypto.createHash('sha256').update(provided).digest('hex');
            const user = await User.findOne({ refreshTokenHash: providedHash });
            if (user) {
                user.refreshTokenHash = undefined;
                await user.save();
            }
        }
        try { res.clearCookie('refreshToken'); } catch (e) {}
        res.json({ message: 'Logged out' });
    } catch (err) {
        console.error('Logout Error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const requestPasswordReset = async (req, res) => {
    const { email } = req.body;
    try {
        if (!email) return res.status(400).json({ message: 'Email required' });
        const user = await User.findOne({ email: String(email).toLowerCase().trim() });
        if (!user) return res.status(200).json({ message: 'If that email is registered, a reset link was sent' });

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetHash = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.passwordResetToken = resetHash;
        user.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1 hour
        await user.save();

        await sendPasswordResetEmail(user.email, resetToken);
        res.json({ message: 'If that email is registered, a reset link was sent' });
    } catch (err) {
        console.error('RequestReset Error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const confirmPasswordReset = async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        if (!token || !newPassword) return res.status(400).json({ message: 'Token and new password required' });
        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
        const user = await User.findOne({ passwordResetToken: tokenHash, passwordResetExpires: { $gt: Date.now() } });
        if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

        user.password = newPassword; 
        user.passwordResetExpires = undefined;
        user.refreshTokenHash = undefined; 
        await user.save();

        res.json({ message: 'Password reset successful' });
    } catch (err) {
        console.error('ConfirmReset Error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const changePassword = async (req, res) => {
    const userId = req.user._id; 
    console.log("Change Password Request Body:", req.body);
    const { oldPassword, newPassword } = req.body;

    try {
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: "Old and new passwords are required" });
        }

        const user = await User.findById(userId).select("+password"); 
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect old password" });
        }

        user.password = newPassword;

        await user.save();

        res.json({ message: "Password changed successfully" });
    } catch (error) {
        console.error("Change Password Error:", error);
        res.status(500).json({ 
            message: "Internal server error", 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }

};

