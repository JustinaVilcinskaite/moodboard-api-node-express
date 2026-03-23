import express from "express";
import authUser from "../middlewares/auth.js";
import { validateBody } from "../middlewares/validation.js";
import { registerSchema, loginSchema } from "../schemas/user.js";

import { SIGN_UP, LOGIN, GET_ME } from "../controllers/user.js";

const router = express.Router();

router.post("/register", validateBody(registerSchema), SIGN_UP);
router.post("/login", validateBody(loginSchema), LOGIN);

router.get("/me", authUser, GET_ME);

export default router;
