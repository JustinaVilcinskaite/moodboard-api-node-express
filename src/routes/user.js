import express from "express";

import { SIGN_UP, LOGIN, VALIDATE_LOGIN } from "../controllers/user.js";

const router = express.Router();

router.post("/register", SIGN_UP);
router.post("/login", LOGIN);
router.get("/login/validate", VALIDATE_LOGIN);

export default router;
