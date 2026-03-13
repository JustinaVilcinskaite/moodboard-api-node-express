import express from "express";
import authUser from "../middlewares/auth.js";
import { validateBody } from "../middlewares/validation.js";
import registerSchema from "../schemas/register.js";
import loginSchema from "../schemas/login.js";

import { SIGN_UP, LOGIN, VALIDATE_LOGIN } from "../controllers/user.js";

const router = express.Router();

router.post("/auth/register", validateBody(registerSchema), SIGN_UP);
router.post("/auth/login", validateBody(loginSchema), LOGIN);

router.get("/auth/me", authUser, VALIDATE_LOGIN);

export default router;

