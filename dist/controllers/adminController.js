"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminRolesAndPermissions = exports.deleteAdminUser = exports.updateAdminUserById = exports.getAdminUserById = exports.getAllAdminUsers = exports.changeAdminPassword = exports.updateAdminProfile = exports.getAdminProfile = exports.loginAdminUser = exports.registerAdminUser = void 0;
const index_1 = require("../services/index");
const registerAdminUser = async (req, res) => {
    try {
        const result = await index_1.adminUserService.createAdminUser(req.body);
        res.status(201).json({
            success: true,
            message: "Admin user created successfully",
            data: {
                user: {
                    id: result.user._id,
                    name: result.user.name,
                    email: result.user.email,
                    role: result.user.role,
                    permissions: result.user.permissions,
                    department: result.user.department,
                    phoneNumber: result.user.phoneNumber,
                    badgeNumber: result.user.badgeNumber,
                    shift: result.user.shift,
                    isActive: result.user.isActive,
                },
                token: result.token,
            },
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || "Error creating admin user",
        });
    }
};
exports.registerAdminUser = registerAdminUser;
const loginAdminUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await index_1.adminUserService.loginAdminUser(email, password);
        res.status(200).json({
            success: true,
            message: "Admin user logged in successfully",
            data: {
                user: {
                    id: result.user._id,
                    name: result.user.name,
                    email: result.user.email,
                    role: result.user.role,
                    permissions: result.user.permissions,
                    department: result.user.department,
                    phoneNumber: result.user.phoneNumber,
                    badgeNumber: result.user.badgeNumber,
                    shift: result.user.shift,
                    isActive: result.user.isActive,
                    lastLogin: result.user.lastLogin,
                },
                token: result.token,
            },
        });
    }
    catch (error) {
        res.status(401).json({
            success: false,
            message: error.message || "Invalid credentials",
        });
    }
};
exports.loginAdminUser = loginAdminUser;
const getAdminProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const adminUser = await index_1.adminUserService.getAdminUserById(userId);
        res.status(200).json({
            success: true,
            message: "Admin user profile retrieved successfully",
            data: {
                user: {
                    id: adminUser._id,
                    name: adminUser.name,
                    email: adminUser.email,
                    role: adminUser.role,
                    permissions: adminUser.permissions,
                    department: adminUser.department,
                    phoneNumber: adminUser.phoneNumber,
                    badgeNumber: adminUser.badgeNumber,
                    profileImage: adminUser.profileImage,
                    isActive: adminUser.isActive,
                    lastLogin: adminUser.lastLogin,
                    createdAt: adminUser.createdAt,
                    updatedAt: adminUser.updatedAt,
                },
            },
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error.message || "Admin user not found",
        });
    }
};
exports.getAdminProfile = getAdminProfile;
const updateAdminProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const updateData = req.body;
        const file = req.file;
        const adminUser = await index_1.adminUserService.updateAdminUser(userId, updateData, file);
        res.status(200).json({
            success: true,
            message: "Admin user profile updated successfully",
            data: {
                user: {
                    id: adminUser._id,
                    name: adminUser.name,
                    email: adminUser.email,
                    role: adminUser.role,
                    permissions: adminUser.permissions,
                    department: adminUser.department,
                    phoneNumber: adminUser.phoneNumber,
                    badgeNumber: adminUser.badgeNumber,
                    profileImage: adminUser.profileImage,
                    isActive: adminUser.isActive,
                    lastLogin: adminUser.lastLogin,
                    createdAt: adminUser.createdAt,
                    updatedAt: adminUser.updatedAt,
                },
            },
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || "Error updating admin user profile",
        });
    }
};
exports.updateAdminProfile = updateAdminProfile;
const changeAdminPassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;
        await index_1.adminUserService.updateAdminUserPassword(userId, currentPassword, newPassword);
        res.status(200).json({
            success: true,
            message: "Password changed successfully",
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || "Error changing password",
        });
    }
};
exports.changeAdminPassword = changeAdminPassword;
const getAllAdminUsers = async (req, res) => {
    try {
        const query = {
            page: req.query.page ? parseInt(req.query.page) : undefined,
            limit: req.query.limit ? parseInt(req.query.limit) : undefined,
            role: req.query.role,
            department: req.query.department,
            search: req.query.search,
        };
        const result = await index_1.adminUserService.getAllAdminUsers(query);
        res.status(200).json({
            success: true,
            message: "Admin users retrieved successfully",
            data: {
                users: result.users.map((user) => ({
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    permissions: user.permissions,
                    department: user.department,
                    phoneNumber: user.phoneNumber,
                    badgeNumber: user.badgeNumber,
                    shift: user.shift,
                    isActive: user.isActive,
                    lastLogin: user.lastLogin,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                })),
                pagination: result.pagination,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Error retrieving admin users",
        });
    }
};
exports.getAllAdminUsers = getAllAdminUsers;
const getAdminUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const adminUser = await index_1.adminUserService.getAdminUserById(id);
        res.status(200).json({
            success: true,
            message: "Admin user retrieved successfully",
            data: {
                user: {
                    id: adminUser._id,
                    name: adminUser.name,
                    email: adminUser.email,
                    role: adminUser.role,
                    permissions: adminUser.permissions,
                    department: adminUser.department,
                    phoneNumber: adminUser.phoneNumber,
                    badgeNumber: adminUser.badgeNumber,
                    profileImage: adminUser.profileImage,
                    isActive: adminUser.isActive,
                    lastLogin: adminUser.lastLogin,
                    createdAt: adminUser.createdAt,
                    updatedAt: adminUser.updatedAt,
                },
            },
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error.message || "Admin user not found",
        });
    }
};
exports.getAdminUserById = getAdminUserById;
const updateAdminUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const adminUser = await index_1.adminUserService.updateAdminUser(id, updateData);
        res.status(200).json({
            success: true,
            message: "Admin user updated successfully",
            data: {
                user: {
                    id: adminUser._id,
                    name: adminUser.name,
                    email: adminUser.email,
                    role: adminUser.role,
                    permissions: adminUser.permissions,
                    department: adminUser.department,
                    phoneNumber: adminUser.phoneNumber,
                    badgeNumber: adminUser.badgeNumber,
                    profileImage: adminUser.profileImage,
                    isActive: adminUser.isActive,
                    lastLogin: adminUser.lastLogin,
                    createdAt: adminUser.createdAt,
                    updatedAt: adminUser.updatedAt,
                },
            },
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || "Error updating admin user",
        });
    }
};
exports.updateAdminUserById = updateAdminUserById;
const deleteAdminUser = async (req, res) => {
    try {
        const { id } = req.params;
        const adminUser = await index_1.adminUserService.deleteAdminUser(id);
        res.status(200).json({
            success: true,
            message: "Admin user deactivated successfully",
            data: {
                user: {
                    id: adminUser._id,
                    name: adminUser.name,
                    email: adminUser.email,
                    role: adminUser.role,
                    isActive: adminUser.isActive,
                },
            },
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || "Error deactivating admin user",
        });
    }
};
exports.deleteAdminUser = deleteAdminUser;
const getAdminRolesAndPermissions = async (req, res) => {
    try {
        const result = await index_1.adminUserService.getAdminRolesAndPermissions();
        res.status(200).json({
            success: true,
            message: "Admin roles and permissions retrieved successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Error retrieving admin roles and permissions",
        });
    }
};
exports.getAdminRolesAndPermissions = getAdminRolesAndPermissions;
//# sourceMappingURL=adminController.js.map