import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import crypto from "crypto";
import User from "../models/user.js"


const generateToken = (user) => {
    return jwt.sign(
        { userId: user._id }, 
        process.env.JWT_SECRET, 
        { expiresIn: "1h" }
    );
};


const sendVerificationEmail = async (email, token) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS 
        }
    });

    const serverUrl = process.env.SERVER_URL || `http://localhost:${process.env.PORT || 3000}`;
    const verificationLink = `${serverUrl}/api/auth/verify?token=${token}`;

    const mailOptions = {
        from: `"Your App Name" <${process.env.EMAIL_USER}>`,
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
            verificationToken,
            isVerified: false 
        });

        await newUser.save();
        
        await sendVerificationEmail(email, verificationToken);

        const { password: _, ...userData } = newUser._doc;

        return res.status(201).json({
            message: "User registered successfully. Please check your email to verify.",
            data: userData,
            token: generateToken(newUser)
        });

    } catch (error) {
        console.error("Register Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const verifyEmail = async (req, res) => {
    const { token } = req.query;

    try {
        if (!token) {
            return res.status(400).json({ message: "Verification token is missing" });
        }

        const user = await User.findOne({ verificationToken: token });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        user.isVerified = true;
        user.verificationToken = undefined; 
        await user.save();

        const frontendUrl = process.env.FRONTEND_URL || process.env.CLIENT_URL || `http://localhost:${process.env.FRONTEND_PORT || 5173}`;
        // Redirect user to frontend login page with a query flag that can show a success message
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

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        if (!user.isVerified) {
            return res.status(401).json({ message: "Please verify your email before logging in" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const { password: _, ...userData } = user._doc;

        res.status(200).json({
            message: "Login successful",
            data: userData,
            token: generateToken(user)
        });
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};