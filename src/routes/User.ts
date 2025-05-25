import express from "express"
import { signup, login, logout, isAuthenticated } from "../controller/Auth";
import { auth } from "../middleware/auth";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", auth, logout);

// Auth check route
router.get("/is-authenticated", isAuthenticated);

export default router