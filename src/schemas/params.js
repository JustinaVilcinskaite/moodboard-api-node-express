import Joi from "joi";

export const boardIdParamSchema = Joi.object({
  boardId: Joi.string().uuid().required().messages({
    "string.guid": "Board ID must be a valid UUID",
  
  }),
});

export const folderIdParamSchema = Joi.object({
  folderId: Joi.string().uuid().required().messages({
    "string.guid": "Folder ID must be a valid UUID",
  
  }),
});

export const imageIdParamSchema = Joi.object({
  imageId: Joi.string().uuid().required().messages({
    "string.guid": "Image ID must be a valid UUID",
  }),
});
