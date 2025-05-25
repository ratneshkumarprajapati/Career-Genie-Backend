import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../model/UserModel";
import { createToken } from "../utils/jwtHelper";



// Signup Controller
export const signup = async (req: Request, res: Response) => {
    try {
        const { userName, email, password } = req.body;
        if (!userName || !email || !password) {
            res.status(400).json({ success: false, message: "All fields are required." });
        }

        // Check for existing user
        const existingUser = await User.findOne({ $or: [{ email }, { userName }] });
        if (existingUser) {
            res.status(409).json({ success: false, message: "User already exists with this email or username." });
        }

        const user = await User.create({ userName, email, password });
        const token = createToken(user._id.toString());

        // Set cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(201).json({
            success: true,
            message: "Signup successful",
            user: {
                id: user._id,
                userName: user.userName,
                email: user.email,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Signup failed", error });
    }
};

// Login Controller
export const login = async (req: Request, res: Response): Promise<any> => {
    try {
        const { emailOrUserName, password } = req.body;
        if (!emailOrUserName || !password) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        // Find user by email or username
        const user = await User.findOne({
            $or: [{ email: emailOrUserName }, { userName: emailOrUserName }],
        });
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid credentials." });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials." });
        }

        const token = createToken(user._id.toString());
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                userName: user.userName,
                email: user.email,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Login failed", error });
    }
};

// Logout Controller
export const logout = (req: Request, res: Response) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });
    res.status(200).json({ success: true, message: "Logged out successfully" });
};

// is authenticated
export const isAuthenticated = async (req: Request, res: Response): Promise<any> => {
    try {
        // Try to get token from cookie or Authorization header
        let token = req.cookies?.token;

         // If token starts with "Bearer ", strip it
        if (token && token.startsWith("Bearer ")) {
            token = token.slice(7);
        }
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(401).json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true,
            message: "User is authenticated",
            user: {
                id: user._id,
                userName: user.userName,
                email: user.email,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};