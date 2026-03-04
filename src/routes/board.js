import express from "express";
import authUser from "../middlewares/auth.js";

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


// TODO: data validation
// TOD0: Later refactor public and auth enpoints into one


router.get("/boards", authUser, GET_MY_BOARDS);
router.post("/boards", authUser, CREATE_BOARD);
router.get("/boards/:boardId", authUser, GET_BOARD_BY_ID);
// maybe change to pacth
router.put("/boards/:boardId", authUser, UPDATE_BOARD_BY_ID);
router.delete("/boards/:boardId", authUser, DELETE_BOARD_BY_ID);

// public routes
router.get("/public/boards", GET_ALL_PUBLIC_BOARDS);
router.get("/public/boards/:boardId", GET_PUBLIC_BOARD_BY_ID);

export default router;
