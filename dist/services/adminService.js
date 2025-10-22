"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminUserService = void 0;
const adminUser_1 = __importStar(require("../models/adminUser"));
const index_1 = require("../utils/index");
const imageService_1 = require("./imageService");
class AdminUserService {
    async createAdminUser(data) {
        const existingAdmin = await adminUser_1.default.findOne({ email: data.email });
        if (existingAdmin) {
            throw new Error("Admin user with this email already exists");
        }
        const adminUser = new adminUser_1.default({
            name: data.name,
            email: data.email,
            password: data.password,
            role: data.role || adminUser_1.AdminRole.VIEWER,
            department: data.department,
            phoneNumber: data.phoneNumber,
            badgeNumber: data.badgeNumber,
            shift: data.shift,
        });
        await adminUser.save();
        const token = (0, index_1.generateToken)(adminUser._id.toString());
        return {
            user: adminUser,
            token,
        };
    }
    async loginAdminUser(email, password) {
        const adminUser = await adminUser_1.default.findOne({ email, isActive: true }).select("+password");
        if (!adminUser) {
            throw new Error("Invalid email or password");
        }
        const isPasswordValid = await adminUser.comparePassword(password);
        if (!isPasswordValid) {
            throw new Error("Invalid email or password");
        }
        adminUser.lastLogin = new Date();
        await adminUser.save();
        const token = (0, index_1.generateToken)(adminUser._id.toString());
        return {
            user: adminUser,
            token,
        };
    }
    async getAdminUserById(id) {
        const adminUser = await adminUser_1.default.findById(id).select("-password");
        if (!adminUser || !adminUser.isActive) {
            throw new Error("Admin user not found");
        }
        return adminUser;
    }
    async updateAdminUser(id, data, file) {
        const adminUser = await adminUser_1.default.findById(id).select("-password");
        if (!adminUser) {
            throw new Error("Admin user not found");
        }
        if (file) {
            if (adminUser.profileImage) {
                const oldPublicId = (0, imageService_1.extractPublicIdFromUrl)(adminUser.profileImage);
                if (oldPublicId) {
                    await (0, imageService_1.deleteImage)(oldPublicId);
                }
            }
            const uploadResult = await (0, imageService_1.uploadImage)(file, 'admin-profiles');
            if (uploadResult.success && uploadResult.url) {
                data.profileImage = uploadResult.url;
            }
            else {
                throw new Error(uploadResult.error || 'Failed to upload profile image');
            }
        }
        const updatedAdminUser = await adminUser_1.default.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        }).select("-password");
        return updatedAdminUser;
    }
    async updateAdminUserPassword(id, currentPassword, newPassword) {
        const adminUser = await adminUser_1.default.findById(id).select("+password");
        if (!adminUser) {
            throw new Error("Admin user not found");
        }
        const isCurrentPasswordValid = await adminUser.comparePassword(currentPassword);
        if (!isCurrentPasswordValid) {
            throw new Error("Current password is incorrect");
        }
        adminUser.password = newPassword;
        await adminUser.save();
    }
    async deleteAdminUser(id) {
        const adminUser = await adminUser_1.default.findByIdAndUpdate(id, { isActive: false }, { new: true }).select("-password");
        if (!adminUser) {
            throw new Error("Admin user not found");
        }
        return adminUser;
    }
    async getAllAdminUsers(query) {
        const page = query.page || 1;
        const limit = query.limit || 10;
        const dbQuery = { isActive: true };
        if (query.role) {
            dbQuery.role = query.role;
        }
        if (query.department) {
            dbQuery.department = query.department;
        }
        if (query.search) {
            dbQuery.$or = [
                { name: { $regex: query.search, $options: "i" } },
                { email: { $regex: query.search, $options: "i" } },
                { badgeNumber: { $regex: query.search, $options: "i" } },
            ];
        }
        const skip = (page - 1) * limit;
        const adminUsers = await adminUser_1.default.find(dbQuery)
            .select("-password")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        const total = await adminUser_1.default.countDocuments(dbQuery);
        return {
            users: adminUsers,
            pagination: {
                current: page,
                pages: Math.ceil(total / limit),
                total,
                limit,
            },
        };
    }
    async getAdminRolesAndPermissions() {
        const { AdminRole, Permission } = await Promise.resolve().then(() => __importStar(require("../models/adminUser")));
        return {
            roles: Object.values(AdminRole),
            permissions: Object.values(Permission),
        };
    }
}
exports.AdminUserService = AdminUserService;
exports.default = new AdminUserService();
//# sourceMappingURL=adminService.js.map