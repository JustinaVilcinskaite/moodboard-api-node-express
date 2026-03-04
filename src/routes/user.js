import express from "express";
import authUser from "../middlewares/auth.js";

import { SIGN_UP, LOGIN, VALIDATE_LOGIN } from "../controllers/user.js";

// TODO: data validation

const router = express.Router();

router.post("/auth/register", SIGN_UP);
router.post("/auth/login", LOGIN);

router.get("/auth/me", authUser, VALIDATE_LOGIN);

export default router;
