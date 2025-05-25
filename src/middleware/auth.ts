import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";


// Middleware to verify JWT from cookie
export const auth = (req: Request, res: Response, next: NextFunction) => {
    let token = req.cookies?.token;

    // If token starts with "Bearer ", strip it
    if (token && token.startsWith("Bearer ")) {
        token = token.slice(7);
    }
    if (!token) {
        res.status(401).json({ success: false, message: "Not authenticated" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
        (req as any).userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};

