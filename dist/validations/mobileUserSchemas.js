"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mobileUserIdParamSchema = exports.mobileUserQuerySchema = exports.resendVerificationSchema = exports.emailVerificationSchema = exports.mobilePasswordChangeSchema = exports.mobileUserUpdateSchema = exports.mobileUserLoginSchema = exports.mobileUserRegistrationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const mobileTypes_1 = require("../types/mobileTypes");
const emailSchema = joi_1.default.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
});
const fullNameSchema = joi_1.default.string()
    .min(2)
    .max(100)
    .trim()
    .required()
    .messages({
    'string.min': 'Full name must be at least 2 characters long',
    'string.max': 'Full name cannot exceed 100 characters',
    'any.required': 'Full name is required'
});
const passwordSchema = joi_1.default.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
    'string.min': 'Password must be at least 8 characters long',
    'string.pattern.base': 'Password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters',
    'any.required': 'Password is required'
});
const confirmPasswordSchema = joi_1.default.string()
    .valid(joi_1.default.ref('password'))
    .required()
    .messages({
    'any.only': 'Passwords do not match',
    'any.required': 'Password confirmation is required'
});
exports.mobileUserRegistrationSchema = joi_1.default.object({
    fullName: fullNameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema.required()
});
exports.mobileUserLoginSchema = joi_1.default.object({
    email: emailSchema,
    password: joi_1.default.string().required().messages({
        'any.required': 'Password is required'
    })
});
exports.mobileUserUpdateSchema = joi_1.default.object({
    fullName: joi_1.default.string()
        .min(2)
        .max(100)
        .trim()
        .optional()
        .messages({
        'string.min': 'Full name must be at least 2 characters long',
        'string.max': 'Full name cannot exceed 100 characters'
    }),
    email: joi_1.default.string()
        .email({ tlds: { allow: false } })
        .optional()
        .messages({
        'string.email': 'Please provide a valid email address'
    })
});
exports.mobilePasswordChangeSchema = joi_1.default.object({
    currentPassword: joi_1.default.string().required().messages({
        'any.required': 'Current password is required'
    }),
    newPassword: passwordSchema.messages({
        'string.min': 'New password must be at least 8 characters long',
        'string.pattern.base': 'New password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters',
        'any.required': 'New password is required'
    }),
    confirmNewPassword: joi_1.default.string()
        .valid(joi_1.default.ref('newPassword'))
        .required()
        .messages({
        'any.only': 'New passwords do not match',
        'any.required': 'New password confirmation is required'
    })
});
exports.emailVerificationSchema = joi_1.default.object({
    code: joi_1.default.string()
        .length(4)
        .pattern(/^\d{4}$/)
        .required()
        .messages({
        'string.length': 'Verification code must be exactly 4 digits',
        'string.pattern.base': 'Verification code must contain only numbers',
        'any.required': 'Verification code is required'
    })
});
exports.resendVerificationSchema = joi_1.default.object({
    email: emailSchema
});
exports.mobileUserQuerySchema = joi_1.default.object({
    page: joi_1.default.number().integer().min(1).optional().default(1),
    limit: joi_1.default.number().integer().min(1).max(100).optional().default(10),
    status: joi_1.default.string().valid(...Object.values(mobileTypes_1.MobileUserStatus)).optional(),
    isEmailVerified: joi_1.default.boolean().optional(),
    search: joi_1.default.string().trim().optional()
});
exports.mobileUserIdParamSchema = joi_1.default.object({
    id: joi_1.default.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
        'string.pattern.base': 'Invalid mobile user ID format'
    })
});
//# sourceMappingURL=mobileUserSchemas.js.map