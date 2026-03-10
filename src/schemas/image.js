import Joi from "joi";

export const createImageSchema = Joi.object({
  url: Joi.string().trim().uri().required().messages({
    "string.empty": "Image URL is required",
    "string.uri": "Image URL must be a valid URL",
    "any.required": "Image URL is required",
  }),

  folderId: Joi.string().uuid().optional().messages({
    "string.guid": "Folder ID must be a valid UUID",
  }),

  note: Joi.string().trim().allow("").max(1000).optional().messages({
    "string.max": "Note must be at most 1000 characters long",
  }),

  tags: Joi.array()
    .items(Joi.string().trim().lowercase().max(50))
    .max(20)
    .optional()
    .default([])
    .messages({
      "array.base": "Tags must be an array",
      "array.max": "Maximum 20 tags allowed",
      "string.max": "Each tag must be at most 50 characters long",
    }),
});

export const updateImageSchema = Joi.object({
  note: Joi.string().trim().allow("").max(1000).optional().messages({
    "string.max": "Note must be at most 1000 characters long",
  }),

  tags: Joi.array()
    .items(Joi.string().trim().lowercase().max(50))
    .max(20)
    .optional()
    .messages({
      "array.base": "Tags must be an array",
      "array.max": "Maximum 20 tags allowed",
      "string.max": "Each tag must be at most 50 characters long",
    }),
})
  .min(1)
  .messages({
    "object.min": "At least one field is required for update",
  });
