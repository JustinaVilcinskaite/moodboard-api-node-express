import express from "express";
import authUser from "../middlewares/auth.js";

import {
  GET_FOLDERS_BY_BOARD_ID,
  CREATE_FOLDER_FOR_BOARD,
  UPDATE_FOLDER_BY_ID,
  DELETE_FOLDER_BY_ID,
  GET_PUBLIC_FOLDERS_BY_BOARD_ID,
} from "../controllers/folder.js";

const router = express.Router();

// TODO: data validation

router.get("/boards/:boardId/folders", authUser, GET_FOLDERS_BY_BOARD_ID);
router.post("/boards/:boardId/folders", authUser, CREATE_FOLDER_FOR_BOARD);
// maybe change to pacth
router.put("/folders/:folderId", authUser, UPDATE_FOLDER_BY_ID);
router.delete("/folders/:folderId", authUser, DELETE_FOLDER_BY_ID);

// public route
router.get("/public/boards/:boardId/folders", GET_PUBLIC_FOLDERS_BY_BOARD_ID);

export default router;
