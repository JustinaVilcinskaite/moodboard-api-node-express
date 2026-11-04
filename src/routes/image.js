import express from "express";
import authUser from "../middlewares/auth.js";
import optionalAuth from "../middlewares/optionalAuth.js";
import { validateBody, validateParams } from "../middlewares/validation.js";
import { createImageSchema, updateImageSchema } from "../schemas/image.js";
import { boardIdParamSchema, imageIdParamSchema } from "../schemas/params.js";

import {
  GET_IMAGES_BY_BOARD,
  CREATE_IMAGE_BY_URL,
  GET_IMAGE_BY_ID,
  UPDATE_IMAGE_BY_ID,
  DELETE_IMAGE_BY_ID,
} from "../controllers/image.js";

const router = express.Router();

// Shared routes for owner and public folder access
router.get(
  "/boards/:boardId/images",
  optionalAuth,
  validateParams(boardIdParamSchema),
  GET_IMAGES_BY_BOARD,
);


// Currently unused in the frontend; image details use already fetched board images.
// TODO: Revisit whether this endpoint is needed later.
router.get(
  "/images/:imageId",
  optionalAuth,
  validateParams(imageIdParamSchema),
  GET_IMAGE_BY_ID,
);

// 

// Phase 1: images are created via URL only (no file upload yet)
router.post(
  "/boards/:boardId/images",
  authUser,
  validateParams(boardIdParamSchema),
  validateBody(createImageSchema),
  CREATE_IMAGE_BY_URL,
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

// FUTURE FEATURES
// Upload images (instead of URL-based)
// router.post("/boards/:boardId/images/upload", authUser, UPLOAD_IMAGES);

// Reordering images (drag & drop support)
// router.post("/boards/:boardId/images/reorder", authUser, REORDER_IMAGES);

export default router;
