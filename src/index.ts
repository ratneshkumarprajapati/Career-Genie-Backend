import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import carrerRoute from "./routes/Career";
import userRoutes from "./routes/User";
import { dbConnectFxn } from "./config/dbConnect";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Define allowed origins
const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:3000",
  "http://localhost:5173", 
  "https://your-production-domain.com"
];

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Health check route
app.get("/", (req, res) => {
  res.send("Hello from CareerFinder backend!");
});

// API routes
app.use("/api/v1/career", carrerRoute);
app.use("/api/v1/auth", userRoutes);

// Database connection and server start
dbConnectFxn();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});