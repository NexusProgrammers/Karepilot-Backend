import AdminUser, { AdminRole } from "../models/adminUser";
import { generateToken } from "../utils/index";
import { uploadImage, deleteImage, extractPublicIdFromUrl } from "./imageService";
export class AdminUserService {
    async createAdminUser(data) {
        const existingAdmin = await AdminUser.findOne({ email: data.email });
        if (existingAdmin) {
            throw new Error("Admin user with this email already exists");
        }
        const adminUser = new AdminUser({
            name: data.name,
            email: data.email,
            password: data.password,
            role: data.role || AdminRole.VIEWER,
            department: data.department,
            phoneNumber: data.phoneNumber,
            badgeNumber: data.badgeNumber,
            shift: data.shift,
        });
        await adminUser.save();
        const token = generateToken(adminUser._id.toString());
        return {
            user: adminUser,
            token,
        };
    }
    async loginAdminUser(email, password) {
        const adminUser = await AdminUser.findOne({ email, isActive: true }).select("+password");
        if (!adminUser) {
            throw new Error("Invalid email or password");
        }
        const isPasswordValid = await adminUser.comparePassword(password);
        if (!isPasswordValid) {
            throw new Error("Invalid email or password");
        }
        adminUser.lastLogin = new Date();
        await adminUser.save();
        const token = generateToken(adminUser._id.toString());
        return {
            user: adminUser,
            token,
        };
    }
    async getAdminUserById(id) {
        const adminUser = await AdminUser.findById(id).select("-password");
        if (!adminUser || !adminUser.isActive) {
            throw new Error("Admin user not found");
        }
        return adminUser;
    }
    async updateAdminUser(id, data, file) {
        const adminUser = await AdminUser.findById(id).select("-password");
        if (!adminUser) {
            throw new Error("Admin user not found");
        }
        if (file) {
            if (adminUser.profileImage) {
                const oldPublicId = extractPublicIdFromUrl(adminUser.profileImage);
                if (oldPublicId) {
                    await deleteImage(oldPublicId);
                }
            }
            const uploadResult = await uploadImage(file, 'admin-profiles');
            if (uploadResult.success && uploadResult.url) {
                data.profileImage = uploadResult.url;
            }
            else {
                throw new Error(uploadResult.error || 'Failed to upload profile image');
            }
        }
        const updatedAdminUser = await AdminUser.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        }).select("-password");
        return updatedAdminUser;
    }
    async updateAdminUserPassword(id, currentPassword, newPassword) {
        const adminUser = await AdminUser.findById(id).select("+password");
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
        const adminUser = await AdminUser.findByIdAndUpdate(id, { isActive: false }, { new: true }).select("-password");
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
        const adminUsers = await AdminUser.find(dbQuery)
            .select("-password")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        const total = await AdminUser.countDocuments(dbQuery);
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
        const { AdminRole, Permission } = await import("../models/adminUser");
        return {
            roles: Object.values(AdminRole),
            permissions: Object.values(Permission),
        };
    }
}
export default new AdminUserService();
//# sourceMappingURL=adminService.js.map