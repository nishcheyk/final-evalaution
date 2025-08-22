import { Router } from "express";
import { register, login } from "./user.controller";
import { authLimiter } from "./rateLimiter";

const router = Router();

// Apply rate limiter only to these sensitive auth routes
router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);

export default router;
