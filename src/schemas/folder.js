import Joi from "joi";

export const createFolderSchema = Joi.object({
  title: Joi.string().trim().min(1).max(100).required().messages({
    "string.empty": "Title is required",
    "string.min": "Title must be at least 1 character long",
    "string.max": "Title must be at most 100 characters long",
    "any.required": "Title is required",
  }),
});

export const updateFolderSchema = Joi.object({
  title: Joi.string().trim().min(1).max(100).optional().messages({
    "string.empty": "Title cannot be empty",
    "string.min": "Title must be at least 1 character long",
    "string.max": "Title must be at most 100 characters long",
  }),
})
  .min(1)
  .messages({
    "object.min": "At least one field is required for update",
  });


export const reorderFoldersSchema = Joi.object({
  folderIds: Joi.array().items(Joi.string().required()).min(1).unique().required().messages({
    "array.base": "folderIds must be an array",
    "array.min": "At least one folder id is required",
    "any.required": "folderIds is required",
  }),
});