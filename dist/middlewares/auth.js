"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.requireRole = exports.requireAllPermissions = exports.requireAnyPermission = exports.requirePermission = exports.authenticate = exports.authenticateMobile = exports.authenticateAdmin = void 0;
const adminUser_1 = __importDefault(require("../models/adminUser"));
const mobileUser_1 = __importDefault(require("../models/mobileUser"));
const auth_1 = require("../utils/auth");
const authenticateAdmin = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            res.status(401).json({
                success: false,
                message: "Access denied. No token provided.",
            });
            return;
        }
        const decoded = (0, auth_1.verifyToken)(token);
        const user = await adminUser_1.default.findById(decoded.userId).select("-password");
        if (!user || !user.isActive) {
            res.status(401).json({
                success: false,
                message: "Invalid token or admin user not found.",
            });
            return;
        }
        req.user = user;
        req.userType = "admin";
        next();
    }
    catch (error) {
        res.status(401).json({
            success: false,
            message: "Invalid token.",
        });
    }
};
exports.authenticateAdmin = authenticateAdmin;
const authenticateMobile = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            res.status(401).json({
                success: false,
                message: "Access denied. No token provided.",
            });
            return;
        }
        const decoded = (0, auth_1.verifyToken)(token);
        const user = await mobileUser_1.default.findById(decoded.userId).select("-password");
        if (!user) {
            res.status(401).json({
                success: false,
                message: "Invalid token or mobile user not found.",
            });
            return;
        }
        req.user = user;
        req.userType = "mobile";
        next();
    }
    catch (error) {
        res.status(401).json({
            success: false,
            message: "Invalid token.",
        });
    }
};
exports.authenticateMobile = authenticateMobile;
const authenticate = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided.",
            });
        }
        const decoded = (0, auth_1.verifyToken)(token);
        let user = await adminUser_1.default.findById(decoded.userId).select("-password");
        if (user && user.isActive) {
            req.user = user;
            req.userType = "admin";
            return next();
        }
        user = await mobileUser_1.default.findById(decoded.userId).select("-password");
        if (user) {
            req.user = user;
            req.userType = "mobile";
            return next();
        }
        return res.status(401).json({
            success: false,
            message: "Invalid token or user not found.",
        });
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid token.",
        });
    }
};
exports.authenticate = authenticate;
const requirePermission = (permission) => {
    return (req, res, next) => {
        if (!req.user || req.userType !== "admin") {
            res.status(401).json({
                success: false,
                message: "Admin authentication required.",
            });
            return;
        }
        const adminUser = req.user;
        if (!adminUser.hasPermission(permission)) {
            res.status(403).json({
                success: false,
                message: `Access denied. Required permission: ${permission}`,
            });
            return;
        }
        next();
    };
};
exports.requirePermission = requirePermission;
const requireAnyPermission = (permissions) => {
    return (req, res, next) => {
        if (!req.user || req.userType !== "admin") {
            res.status(401).json({
                success: false,
                message: "Admin authentication required.",
            });
            return;
        }
        const adminUser = req.user;
        if (!adminUser.hasAnyPermission(permissions)) {
            res.status(403).json({
                success: false,
                message: `Access denied. Required any of these permissions: ${permissions.join(", ")}`,
            });
            return;
        }
        next();
    };
};
exports.requireAnyPermission = requireAnyPermission;
const requireAllPermissions = (permissions) => {
    return (req, res, next) => {
        if (!req.user || req.userType !== "admin") {
            res.status(401).json({
                success: false,
                message: "Admin authentication required.",
            });
            return;
        }
        const adminUser = req.user;
        if (!adminUser.hasAllPermissions(permissions)) {
            res.status(403).json({
                success: false,
                message: `Access denied. Required all of these permissions: ${permissions.join(", ")}`,
            });
            return;
        }
        next();
    };
};
exports.requireAllPermissions = requireAllPermissions;
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user || req.userType !== "admin") {
            res.status(401).json({
                success: false,
                message: "Admin authentication required.",
            });
            return;
        }
        const adminUser = req.user;
        if (!roles.includes(adminUser.role)) {
            res.status(403).json({
                success: false,
                message: `Access denied. Required roles: ${roles.join(", ")}`,
            });
            return;
        }
        next();
    };
};
exports.requireRole = requireRole;
const optionalAuth = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (token) {
            const decoded = (0, auth_1.verifyToken)(token);
            let user = await adminUser_1.default.findById(decoded.userId).select("-password");
            if (user && user.isActive) {
                req.user = user;
                req.userType = "admin";
                return next();
            }
            user = await mobileUser_1.default.findById(decoded.userId).select("-password");
            if (user) {
                req.user = user;
                req.userType = "mobile";
                return next();
            }
        }
        next();
    }
    catch (error) {
        next();
    }
};
exports.optionalAuth = optionalAuth;
//# sourceMappingURL=auth.js.map