import AdminUser from "../models/adminUser";
import MobileUser from "../models/mobileUser";
import { verifyToken } from "../utils/auth";
export const authenticateAdmin = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            res.status(401).json({
                success: false,
                message: "Access denied. No token provided.",
            });
            return;
        }
        const decoded = verifyToken(token);
        const user = await AdminUser.findById(decoded.userId).select("-password");
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
export const authenticateMobile = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            res.status(401).json({
                success: false,
                message: "Access denied. No token provided.",
            });
            return;
        }
        const decoded = verifyToken(token);
        const user = await MobileUser.findById(decoded.userId).select("-password");
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
export const authenticate = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided.",
            });
        }
        const decoded = verifyToken(token);
        let user = await AdminUser.findById(decoded.userId).select("-password");
        if (user && user.isActive) {
            req.user = user;
            req.userType = "admin";
            return next();
        }
        user = await MobileUser.findById(decoded.userId).select("-password");
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
export const requirePermission = (permission) => {
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
export const requireAnyPermission = (permissions) => {
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
export const requireAllPermissions = (permissions) => {
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
export const requireRole = (roles) => {
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
export const optionalAuth = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (token) {
            const decoded = verifyToken(token);
            let user = await AdminUser.findById(decoded.userId).select("-password");
            if (user && user.isActive) {
                req.user = user;
                req.userType = "admin";
                return next();
            }
            user = await MobileUser.findById(decoded.userId).select("-password");
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
//# sourceMappingURL=auth.js.map