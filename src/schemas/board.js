import Joi from "joi";

export const createBoardSchema = Joi.object({
  title: Joi.string().trim().min(1).max(100).required().messages({
    "string.empty": "Title is required",
    "string.min": "Title must be at least 1 character long",
    "string.max": "Title must be at most 100 characters long",
    "any.required": "Title is required",
  }),

  description: Joi.string().trim().allow("").max(500).optional().messages({
    "string.max": "Description must be at most 500 characters long",
  }),

  isPublic: Joi.boolean().optional(),
});

export const updateBoardSchema = Joi.object({
  title: Joi.string().trim().min(1).max(100).optional().messages({
    "string.empty": "Title cannot be empty",
    "string.min": "Title must be at least 1 character long",
    "string.max": "Title must be at most 100 characters long",
  }),

  description: Joi.string().trim().allow("").max(500).optional().messages({
    "string.max": "Description must be at most 500 characters long",
  }),

  isPublic: Joi.boolean().optional(),
})
  .min(1)
  .messages({
    "object.min": "At least one field is required for update",
  });
