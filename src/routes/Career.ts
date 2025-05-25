import express from "express";
import { findCareer, simulateCareerTimeTravel } from "../controller/CareerFinder";
import { auth } from "../middleware/auth";

const router = express.Router()

router.post("/findcareer", findCareer)

router.post("/career-time-travel",auth, simulateCareerTimeTravel)


export default router