"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMobileUserStatus = exports.getMobileUserById = exports.getAllMobileUsers = exports.changeMobilePassword = exports.updateMobileProfile = exports.getMobileProfile = exports.loginMobileUser = exports.resendVerificationCode = exports.verifyEmail = exports.registerMobileUser = void 0;
const index_1 = require("../services/index");
const registerMobileUser = async (req, res) => {
    try {
        const result = await index_1.mobileUserService.createMobileUser(req.body);
        res.status(201).json({
            success: true,
            message: "Mobile user registered successfully. Please verify your email.",
            data: {
                user: {
                    id: result.user._id,
                    fullName: result.user.fullName,
                    email: result.user.email,
                    isEmailVerified: result.user.isEmailVerified,
                    status: result.user.status,
                    createdAt: result.user.createdAt,
                },
            },
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || "Error registering mobile user",
        });
    }
};
exports.registerMobileUser = registerMobileUser;
const verifyEmail = async (req, res) => {
    try {
        const { code } = req.body;
        const result = await index_1.mobileUserService.verifyEmail({ code });
        res.status(200).json({
            success: true,
            message: "Email verified successfully",
            data: {
                user: {
                    id: result.user._id,
                    fullName: result.user.fullName,
                    email: result.user.email,
                    isEmailVerified: result.user.isEmailVerified,
                    status: result.user.status,
                    createdAt: result.user.createdAt,
                    updatedAt: result.user.updatedAt,
                },
                token: result.token,
            },
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || "Error verifying email",
        });
    }
};
exports.verifyEmail = verifyEmail;
const resendVerificationCode = async (req, res) => {
    try {
        const { email } = req.body;
        const result = await index_1.mobileUserService.resendVerificationCode(email);
        res.status(200).json({
            success: true,
            message: "Verification code resent successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || "Error resending verification code",
        });
    }
};
exports.resendVerificationCode = resendVerificationCode;
const loginMobileUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await index_1.mobileUserService.loginMobileUser(email, password);
        res.status(200).json({
            success: true,
            message: "Mobile user logged in successfully",
            data: {
                user: {
                    id: result.user._id,
                    fullName: result.user.fullName,
                    email: result.user.email,
                    isEmailVerified: result.user.isEmailVerified,
                    status: result.user.status,
                    lastLogin: result.user.lastLogin,
                    createdAt: result.user.createdAt,
                    updatedAt: result.user.updatedAt,
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
exports.loginMobileUser = loginMobileUser;
const getMobileProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const mobileUser = await index_1.mobileUserService.getMobileUserById(userId);
        res.status(200).json({
            success: true,
            message: "Mobile user profile retrieved successfully",
            data: {
                user: {
                    id: mobileUser._id,
                    fullName: mobileUser.fullName,
                    email: mobileUser.email,
                    isEmailVerified: mobileUser.isEmailVerified,
                    profileImage: mobileUser.profileImage,
                    lastLogin: mobileUser.lastLogin,
                    createdAt: mobileUser.createdAt,
                    updatedAt: mobileUser.updatedAt,
                },
            },
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error.message || "Mobile user not found",
        });
    }
};
exports.getMobileProfile = getMobileProfile;
const updateMobileProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const updateData = req.body;
        const file = req.file;
        const mobileUser = await index_1.mobileUserService.updateMobileUser(userId, updateData, file);
        res.status(200).json({
            success: true,
            message: "Mobile user profile updated successfully",
            data: {
                user: {
                    id: mobileUser._id,
                    fullName: mobileUser.fullName,
                    email: mobileUser.email,
                    isEmailVerified: mobileUser.isEmailVerified,
                    profileImage: mobileUser.profileImage,
                    status: mobileUser.status,
                    lastLogin: mobileUser.lastLogin,
                    createdAt: mobileUser.createdAt,
                    updatedAt: mobileUser.updatedAt,
                },
            },
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || "Error updating mobile user profile",
        });
    }
};
exports.updateMobileProfile = updateMobileProfile;
const changeMobilePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;
        await index_1.mobileUserService.updateMobileUserPassword(userId, currentPassword, newPassword);
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
exports.changeMobilePassword = changeMobilePassword;
const getAllMobileUsers = async (req, res) => {
    try {
        const query = {
            page: req.query.page ? parseInt(req.query.page) : undefined,
            limit: req.query.limit ? parseInt(req.query.limit) : undefined,
            status: req.query.status,
            isEmailVerified: req.query.isEmailVerified ? req.query.isEmailVerified === "true" : undefined,
            search: req.query.search,
        };
        const result = await index_1.mobileUserService.getAllMobileUsers(query);
        res.status(200).json({
            success: true,
            message: "Mobile users retrieved successfully",
            data: {
                users: result.users.map((user) => ({
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    isEmailVerified: user.isEmailVerified,
                    status: user.status,
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
            message: error.message || "Error retrieving mobile users",
        });
    }
};
exports.getAllMobileUsers = getAllMobileUsers;
const getMobileUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const mobileUser = await index_1.mobileUserService.getMobileUserById(id);
        res.status(200).json({
            success: true,
            message: "Mobile user retrieved successfully",
            data: {
                user: {
                    id: mobileUser._id,
                    fullName: mobileUser.fullName,
                    email: mobileUser.email,
                    isEmailVerified: mobileUser.isEmailVerified,
                    profileImage: mobileUser.profileImage,
                    lastLogin: mobileUser.lastLogin,
                    createdAt: mobileUser.createdAt,
                    updatedAt: mobileUser.updatedAt,
                },
            },
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error.message || "Mobile user not found",
        });
    }
};
exports.getMobileUserById = getMobileUserById;
const updateMobileUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const mobileUser = await index_1.mobileUserService.updateMobileUserStatus(id, status);
        res.status(200).json({
            success: true,
            message: "Mobile user status updated successfully",
            data: {
                user: {
                    id: mobileUser._id,
                    fullName: mobileUser.fullName,
                    email: mobileUser.email,
                    isEmailVerified: mobileUser.isEmailVerified,
                    profileImage: mobileUser.profileImage,
                    lastLogin: mobileUser.lastLogin,
                    createdAt: mobileUser.createdAt,
                    updatedAt: mobileUser.updatedAt,
                },
            },
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || "Error updating mobile user status",
        });
    }
};
exports.updateMobileUserStatus = updateMobileUserStatus;
//# sourceMappingURL=mobileController.js.map