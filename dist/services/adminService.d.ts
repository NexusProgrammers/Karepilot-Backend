import { IAdminUser } from "../models/adminUser";
import { CreateAdminUserData, UpdateAdminUserData, AdminUserQuery, AdminUserResult, AdminUsersListResult, AdminRolesAndPermissions } from "../types/index";
export declare class AdminUserService {
    createAdminUser(data: CreateAdminUserData): Promise<AdminUserResult>;
    loginAdminUser(email: string, password: string): Promise<AdminUserResult>;
    getAdminUserById(id: string): Promise<IAdminUser>;
    updateAdminUser(id: string, data: UpdateAdminUserData, file?: Express.Multer.File): Promise<IAdminUser>;
    updateAdminUserPassword(id: string, currentPassword: string, newPassword: string): Promise<void>;
    deleteAdminUser(id: string): Promise<IAdminUser>;
    getAllAdminUsers(query: AdminUserQuery): Promise<AdminUsersListResult>;
    getAdminRolesAndPermissions(): Promise<AdminRolesAndPermissions>;
}
declare const _default: AdminUserService;
export default _default;
//# sourceMappingURL=adminService.d.ts.map