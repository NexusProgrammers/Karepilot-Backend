import Joi from "joi";

export const uploadFileSchema = Joi.object({
  folder: Joi.string().optional().default("uploads"),
});

export const deleteFileSchema = Joi.object({
  publicId: Joi.string().required().messages({
    "any.required": "Public ID is required",
  }),
  resourceType: Joi.string().valid("image", "raw", "video").optional().default("image"),
});

