"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminUserIdParamSchema = exports.adminUserQuerySchema = exports.adminPasswordChangeSchema = exports.adminUserUpdateSchema = exports.adminUserLoginSchema = exports.adminUserRegistrationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const adminUser_1 = require("../models/adminUser");
const emailSchema = joi_1.default.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
});
const passwordSchema = joi_1.default.string()
    .min(6)
    .required()
    .messages({
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is required'
});
const nameSchema = joi_1.default.string()
    .min(2)
    .max(50)
    .trim()
    .required()
    .messages({
    'string.min': 'Name must be at least 2 characters long',
    'string.max': 'Name cannot exceed 50 characters',
    'any.required': 'Name is required'
});
const roleSchema = joi_1.default.string()
    .valid(...Object.values(adminUser_1.AdminRole))
    .optional()
    .messages({
    'any.only': 'Invalid role specified. Must be one of: Admin, Manager, Technician, Staff, Security, Viewer'
});
exports.adminUserRegistrationSchema = joi_1.default.object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    role: roleSchema.default(adminUser_1.AdminRole.VIEWER),
    department: joi_1.default.string().trim().optional(),
    phoneNumber: joi_1.default.string().trim().optional(),
    badgeNumber: joi_1.default.string().trim().optional(),
    shift: joi_1.default.string().trim().optional()
});
exports.adminUserLoginSchema = joi_1.default.object({
    email: emailSchema,
    password: joi_1.default.string().required().messages({
        'any.required': 'Password is required'
    })
});
exports.adminUserUpdateSchema = joi_1.default.object({
    name: joi_1.default.string()
        .min(2)
        .max(50)
        .trim()
        .optional()
        .messages({
        'string.min': 'Name must be at least 2 characters long',
        'string.max': 'Name cannot exceed 50 characters'
    }),
    email: joi_1.default.string()
        .email({ tlds: { allow: false } })
        .optional()
        .messages({
        'string.email': 'Please provide a valid email address'
    }),
    role: roleSchema,
    department: joi_1.default.string().trim().optional(),
    phoneNumber: joi_1.default.string().trim().optional(),
    badgeNumber: joi_1.default.string().trim().optional(),
    shift: joi_1.default.string().trim().optional(),
    isActive: joi_1.default.boolean().optional()
});
exports.adminPasswordChangeSchema = joi_1.default.object({
    currentPassword: joi_1.default.string().required().messages({
        'any.required': 'Current password is required'
    }),
    newPassword: passwordSchema.messages({
        'string.min': 'New password must be at least 6 characters long',
        'any.required': 'New password is required'
    })
});
exports.adminUserQuerySchema = joi_1.default.object({
    page: joi_1.default.number().integer().min(1).optional().default(1),
    limit: joi_1.default.number().integer().min(1).max(100).optional().default(10),
    role: roleSchema,
    department: joi_1.default.string().trim().optional(),
    search: joi_1.default.string().trim().optional(),
    isActive: joi_1.default.boolean().optional()
});
exports.adminUserIdParamSchema = joi_1.default.object({
    id: joi_1.default.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
        'string.pattern.base': 'Invalid admin user ID format'
    })
});
//# sourceMappingURL=adminUserSchemas.js.map