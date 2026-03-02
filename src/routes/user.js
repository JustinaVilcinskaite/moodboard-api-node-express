import express from "express";
// import authUser from "../middlewares/auth.js";

import { SIGN_UP, LOGIN, VALIDATE_LOGIN } from "../controllers/user.js";

// TODO: data validation

const router = express.Router();

router.post("/register", SIGN_UP);
router.post("/login", LOGIN);

// TODO: add auth
router.get("/login/validate", VALIDATE_LOGIN);

export default router;
