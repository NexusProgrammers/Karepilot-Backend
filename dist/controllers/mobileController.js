import { mobileUserService } from "../services/index";
export const registerMobileUser = async (req, res) => {
    try {
        const result = await mobileUserService.createMobileUser(req.body);
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
export const verifyEmail = async (req, res) => {
    try {
        const { code } = req.body;
        const result = await mobileUserService.verifyEmail({ code });
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
export const resendVerificationCode = async (req, res) => {
    try {
        const { email } = req.body;
        const result = await mobileUserService.resendVerificationCode(email);
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
export const loginMobileUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await mobileUserService.loginMobileUser(email, password);
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
export const getMobileProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const mobileUser = await mobileUserService.getMobileUserById(userId);
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
export const updateMobileProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const updateData = req.body;
        const file = req.file;
        const mobileUser = await mobileUserService.updateMobileUser(userId, updateData, file);
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
export const changeMobilePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;
        await mobileUserService.updateMobileUserPassword(userId, currentPassword, newPassword);
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
export const getAllMobileUsers = async (req, res) => {
    try {
        const query = {
            page: req.query.page ? parseInt(req.query.page) : undefined,
            limit: req.query.limit ? parseInt(req.query.limit) : undefined,
            status: req.query.status,
            isEmailVerified: req.query.isEmailVerified ? req.query.isEmailVerified === "true" : undefined,
            search: req.query.search,
        };
        const result = await mobileUserService.getAllMobileUsers(query);
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
export const getMobileUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const mobileUser = await mobileUserService.getMobileUserById(id);
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
export const updateMobileUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const mobileUser = await mobileUserService.updateMobileUserStatus(id, status);
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
//# sourceMappingURL=mobileController.js.map