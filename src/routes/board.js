import express from "express";
import authUser from "../middlewares/auth.js";
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
  GET_PUBLIC_BOARD_BY_ID,
} from "../controllers/board.js";

const router = express.Router();

// TODO: Later maybe refactor public and auth endpoints into one
router.get("/boards", authUser, GET_MY_BOARDS);
router.post("/boards", authUser, validateBody(createBoardSchema), CREATE_BOARD);
router.get(
  "/boards/:boardId",
  authUser,
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

// Public routes
router.get("/public/boards", GET_ALL_PUBLIC_BOARDS);
router.get(
  "/public/boards/:boardId",
  validateParams(boardIdParamSchema),
  GET_PUBLIC_BOARD_BY_ID,
);

export default router;
