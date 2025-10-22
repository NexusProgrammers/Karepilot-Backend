import mongoose, { Document } from "mongoose";
export declare enum Permission {
    VIEW_ALL = "View All",
    EDIT_ALL = "Edit All",
    MANAGE_ALERTS = "Manage Alerts",
    VIEW_SECURITY = "View Security",
    ACCESS_LOGS = "Access Logs",
    VIEW_BASIC = "View Basic",
    EDIT_DEPARTMENT = "Edit Department",
    VIEW_DEPARTMENT = "View Department",
    EDIT_USERS = "Edit Users",
    MANAGE_INVENTORY = "Manage Inventory",
    DELETE_USERS = "Delete Users"
}
export declare enum AdminRole {
    ADMIN = "Admin",
    MANAGER = "Manager",
    TECHNICIAN = "Technician",
    STAFF = "Staff",
    SECURITY = "Security",
    VIEWER = "Viewer"
}
export declare const ROLE_PERMISSIONS: Record<AdminRole, Permission[]>;
export interface IAdminUser extends Document {
    name: string;
    email: string;
    password: string;
    role: AdminRole;
    permissions: Permission[];
    department?: string;
    phoneNumber?: string;
    badgeNumber?: string;
    shift?: string;
    profileImage?: string;
    isActive: boolean;
    lastLogin?: Date;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
    hasPermission(permission: Permission): boolean;
    hasAnyPermission(permissions: Permission[]): boolean;
    hasAllPermissions(permissions: Permission[]): boolean;
}
declare const AdminUser: mongoose.Model<IAdminUser, {}, {}, {}, mongoose.Document<unknown, {}, IAdminUser, {}, {}> & IAdminUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default AdminUser;
//# sourceMappingURL=adminUser.d.ts.map