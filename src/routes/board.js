import express from "express";
import authUser from "../middlewares/auth.js";
import optionalAuth from "../middlewares/optionalAuth.js";
import { validateBody, validateParams } from "../middlewares/validation.js";
import { createBoardSchema, updateBoardSchema } from "../schemas/board.js";
import { boardIdParamSchema } from "../schemas/params.js";

import {
  GET_MY_BOARDS,
  CREATE_BOARD,
  GET_BOARD_BY_ID,
  UPDATE_BOARD_BY_ID,
  DELETE_BOARD_BY_ID,
  GET_ALL_PUBLIC_BOARDS,
} from "../controllers/board.js";

const router = express.Router();

router.get("/boards", authUser, GET_MY_BOARDS);
router.post("/boards", authUser, validateBody(createBoardSchema), CREATE_BOARD);

// Shared route for owner and public board access
router.get(
  "/boards/:boardId",
  optionalAuth,
  validateParams(boardIdParamSchema),
  GET_BOARD_BY_ID,
);

router.patch(
  "/boards/:boardId",
  authUser,
  validateParams(boardIdParamSchema),
  validateBody(updateBoardSchema),
  UPDATE_BOARD_BY_ID,
);
router.delete(
  "/boards/:boardId",
  authUser,
  validateParams(boardIdParamSchema),
  DELETE_BOARD_BY_ID,
);

// Public route
router.get("/public/boards", GET_ALL_PUBLIC_BOARDS);

export default router;
