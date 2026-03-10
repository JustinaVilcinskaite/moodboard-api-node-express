import express from "express";
import authUser from "../middlewares/auth.js";
import { validateBody, validateParams } from "../middlewares/validation.js";
import { createImageSchema, updateImageSchema } from "../schemas/image.js";
import { boardIdParamSchema, imageIdParamSchema } from "../schemas/params.js";

import {
  GET_IMAGES_BY_BOARD,
  CREATE_IMAGE_BY_URL,
  GET_IMAGE_BY_ID,
  UPDATE_IMAGE_BY_ID,
  DELETE_IMAGE_BY_ID,
  GET_PUBLIC_IMAGES_BY_BOARD,
  GET_PUBLIC_IMAGE_BY_ID,
} from "../controllers/image.js";

const router = express.Router();

// TOD0: Later refactor public and auth enpoints into one

router.get(
  "/boards/:boardId/images",
  authUser,
  validateParams(boardIdParamSchema),
  GET_IMAGES_BY_BOARD,
);
// Phase 1 - later do image upload
router.post(
  "/boards/:boardId/images",
  authUser,
  validateParams(boardIdParamSchema),
  validateBody(createImageSchema),
  CREATE_IMAGE_BY_URL,
);
router.get(
  "/images/:imageId",
  authUser,
  validateParams(imageIdParamSchema),
  GET_IMAGE_BY_ID,
);
router.patch(
  "/images/:imageId",
  authUser,
  validateParams(imageIdParamSchema),
  validateBody(updateImageSchema),
  UPDATE_IMAGE_BY_ID,
);
router.delete(
  "/images/:imageId",
  authUser,
  validateParams(imageIdParamSchema),
  DELETE_IMAGE_BY_ID,
);

// public routes
router.get(
  "/public/boards/:boardId/images",
  validateParams(boardIdParamSchema),
  GET_PUBLIC_IMAGES_BY_BOARD,
);
router.get(
  "/public/images/:imageId",
  validateParams(imageIdParamSchema),
  GET_PUBLIC_IMAGE_BY_ID,
);

// Upload and reorder routes
// router.post("/boards/:boardId/images/upload", authUser, UPLOAD_IMAGES);
// router.post("/boards/:boardId/images/reorder", authUser, REORDER_IMAGES);

export default router;
