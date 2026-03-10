import Joi from "joi";

export const boardIdParamSchema = Joi.object({
  boardId: Joi.string().uuid().required().messages({
    "string.guid": "Board ID must be a valid UUID",
    "any.required": "Board ID is required",
  }),
});

export const folderIdParamSchema = Joi.object({
  folderId: Joi.string().uuid().required().messages({
    "string.guid": "Folder ID must be a valid UUID",
    "any.required": "Folder ID is required",
  }),
});

export const imageIdParamSchema = Joi.object({
  imageId: Joi.string().uuid().required().messages({
    "string.guid": "Image ID must be a valid UUID",
    "any.required": "Image ID is required",
  }),
});