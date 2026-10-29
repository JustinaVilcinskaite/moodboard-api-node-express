import express from "express";
import authUser from "../middlewares/auth.js";
import optionalAuth from "../middlewares/optionalAuth.js";
import { validateBody, validateParams } from "../middlewares/validation.js";
import {
  createFolderSchema,
  updateFolderSchema,
  reorderFoldersSchema,
} from "../schemas/folder.js";
import { boardIdParamSchema, folderIdParamSchema } from "../schemas/params.js";

import {
  GET_FOLDERS_BY_BOARD_ID,
  CREATE_FOLDER_FOR_BOARD,
  UPDATE_FOLDER_BY_ID,
  DELETE_FOLDER_BY_ID,
  REORDER_FOLDERS_BY_BOARD,
} from "../controllers/folder.js";

const router = express.Router();

// Shared route for owner and public folder access
router.get(
  "/boards/:boardId/folders",
  optionalAuth,
  validateParams(boardIdParamSchema),
  GET_FOLDERS_BY_BOARD_ID,
);

router.post(
  "/boards/:boardId/folders",
  authUser,
  validateParams(boardIdParamSchema),
  validateBody(createFolderSchema),
  CREATE_FOLDER_FOR_BOARD,
);

router.patch(
  "/folders/:folderId",
  authUser,
  validateParams(folderIdParamSchema),
  validateBody(updateFolderSchema),
  UPDATE_FOLDER_BY_ID,
);
router.delete(
  "/folders/:folderId",
  authUser,
  validateParams(folderIdParamSchema),
  DELETE_FOLDER_BY_ID,
);

router.patch(
  "/boards/:boardId/folders/reorder",
  authUser,
  validateParams(boardIdParamSchema),
  validateBody(reorderFoldersSchema),
  REORDER_FOLDERS_BY_BOARD,
);

export default router;
