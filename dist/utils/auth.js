"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.refreshToken = exports.isTokenExpired = exports.extractUserIdFromToken = exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const generateToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, JWT_SECRET);
};
exports.verifyToken = verifyToken;
const extractUserIdFromToken = (token) => {
    try {
        const decoded = (0, exports.verifyToken)(token);
        return decoded.userId;
    }
    catch (error) {
        return null;
    }
};
exports.extractUserIdFromToken = extractUserIdFromToken;
const isTokenExpired = (token) => {
    try {
        jsonwebtoken_1.default.verify(token, JWT_SECRET);
        return false;
    }
    catch (error) {
        return error.name === 'TokenExpiredError';
    }
};
exports.isTokenExpired = isTokenExpired;
const refreshToken = (userId) => {
    return (0, exports.generateToken)(userId);
};
exports.refreshToken = refreshToken;
const validate = (schema, source = 'body') => {
    return (req, res, next) => {
        const data = req[source];
        const { error, value } = schema.validate(data, {
            abortEarly: false,
            stripUnknown: true
        });
        if (error) {
            const errors = error.details.map((detail) => detail.message);
            res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors
            });
            return;
        }
        req[source] = value;
        next();
    };
};
exports.validate = validate;
//# sourceMappingURL=auth.js.map