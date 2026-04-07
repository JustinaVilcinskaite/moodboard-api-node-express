import express from "express";
import authUser from "../middlewares/auth.js";
import { validateBody } from "../middlewares/validation.js";
import { registerSchema, loginSchema } from "../schemas/user.js";

import { SIGN_UP, LOGIN, GET_ME } from "../controllers/user.js";

const router = express.Router();

router.post("/users/register", validateBody(registerSchema), SIGN_UP);
router.post("/users/login", validateBody(loginSchema), LOGIN);

router.get("/users/me", authUser, GET_ME);

export default router;
