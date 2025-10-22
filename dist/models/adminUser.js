import mongoose, { Schema } from "mongoose";
import * as bcrypt from "bcryptjs";
export var Permission;
(function (Permission) {
    Permission["VIEW_ALL"] = "View All";
    Permission["EDIT_ALL"] = "Edit All";
    Permission["MANAGE_ALERTS"] = "Manage Alerts";
    Permission["VIEW_SECURITY"] = "View Security";
    Permission["ACCESS_LOGS"] = "Access Logs";
    Permission["VIEW_BASIC"] = "View Basic";
    Permission["EDIT_DEPARTMENT"] = "Edit Department";
    Permission["VIEW_DEPARTMENT"] = "View Department";
    Permission["EDIT_USERS"] = "Edit Users";
    Permission["MANAGE_INVENTORY"] = "Manage Inventory";
    Permission["DELETE_USERS"] = "Delete Users";
})(Permission || (Permission = {}));
export var AdminRole;
(function (AdminRole) {
    AdminRole["ADMIN"] = "Admin";
    AdminRole["MANAGER"] = "Manager";
    AdminRole["TECHNICIAN"] = "Technician";
    AdminRole["STAFF"] = "Staff";
    AdminRole["SECURITY"] = "Security";
    AdminRole["VIEWER"] = "Viewer";
})(AdminRole || (AdminRole = {}));
export const ROLE_PERMISSIONS = {
    [AdminRole.ADMIN]: [
        Permission.VIEW_ALL,
        Permission.EDIT_ALL,
        Permission.MANAGE_ALERTS,
        Permission.VIEW_SECURITY,
        Permission.ACCESS_LOGS,
        Permission.VIEW_BASIC,
        Permission.EDIT_DEPARTMENT,
        Permission.VIEW_DEPARTMENT,
        Permission.EDIT_USERS,
        Permission.MANAGE_INVENTORY,
        Permission.DELETE_USERS,
    ],
    [AdminRole.MANAGER]: [
        Permission.MANAGE_ALERTS,
        Permission.VIEW_SECURITY,
        Permission.ACCESS_LOGS,
        Permission.VIEW_BASIC,
        Permission.VIEW_DEPARTMENT,
        Permission.EDIT_USERS,
    ],
    [AdminRole.TECHNICIAN]: [
        Permission.VIEW_ALL,
        Permission.MANAGE_ALERTS,
        Permission.VIEW_SECURITY,
        Permission.ACCESS_LOGS,
        Permission.VIEW_BASIC,
        Permission.EDIT_USERS,
    ],
    [AdminRole.STAFF]: [Permission.VIEW_BASIC],
    [AdminRole.SECURITY]: [
        Permission.MANAGE_ALERTS,
        Permission.VIEW_SECURITY,
        Permission.ACCESS_LOGS,
        Permission.VIEW_BASIC,
    ],
    [AdminRole.VIEWER]: [Permission.VIEW_BASIC],
};
const adminUserSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minlength: [2, "Name must be at least 2 characters long"],
        maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please provide a valid email address"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"],
    },
    role: {
        type: String,
        enum: Object.values(AdminRole),
        default: AdminRole.VIEWER,
        required: true,
    },
    permissions: [
        {
            type: String,
            enum: Object.values(Permission),
        },
    ],
    department: {
        type: String,
        trim: true,
    },
    phoneNumber: {
        type: String,
        trim: true,
    },
    badgeNumber: {
        type: String,
        trim: true,
    },
    shift: {
        type: String,
        trim: true,
    },
    profileImage: {
        type: String,
        trim: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    lastLogin: {
        type: Date,
    },
}, {
    timestamps: true,
    toJSON: {
        transform: function (doc, ret) {
            const { password, ...userWithoutPassword } = ret;
            return userWithoutPassword;
        },
    },
});
adminUserSchema.index({ email: 1 });
adminUserSchema.index({ role: 1 });
adminUserSchema.index({ isActive: 1 });
adminUserSchema.index({ department: 1 });
adminUserSchema.pre("save", async function (next) {
    if (!this.isModified("password"))
        return next();
    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        this.permissions = ROLE_PERMISSIONS[this.role] || [];
        next();
    }
    catch (error) {
        next(error);
    }
});
adminUserSchema.pre(["updateOne", "findOneAndUpdate"], async function (next) {
    const update = this.getUpdate();
    if (update?.password) {
        try {
            const salt = await bcrypt.genSalt(12);
            update.password = await bcrypt.hash(update.password, salt);
        }
        catch (error) {
            next(error);
        }
    }
    if (update?.role) {
        update.permissions = ROLE_PERMISSIONS[update.role] || [];
    }
    next();
});
adminUserSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};
adminUserSchema.methods.hasPermission = function (permission) {
    return this.permissions.includes(permission);
};
adminUserSchema.methods.hasAnyPermission = function (permissions) {
    return permissions.some((permission) => this.permissions.includes(permission));
};
adminUserSchema.methods.hasAllPermissions = function (permissions) {
    return permissions.every((permission) => this.permissions.includes(permission));
};
adminUserSchema.statics.findByRole = function (role) {
    return this.find({ role, isActive: true });
};
adminUserSchema.statics.findByPermission = function (permission) {
    return this.find({ permissions: permission, isActive: true });
};
const AdminUser = mongoose.model("AdminUser", adminUserSchema);
export default AdminUser;
//# sourceMappingURL=adminUser.js.map