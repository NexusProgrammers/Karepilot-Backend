import { CreateMobileUserData, UpdateMobileUserData, MobileUserQuery, MobileUserResult, MobileUsersListResult, EmailVerificationData, VerificationResponse, IMobileUser } from '../types/mobileTypes';
export declare class MobileUserService {
    createMobileUser(data: CreateMobileUserData): Promise<MobileUserResult>;
    verifyEmail(data: EmailVerificationData): Promise<MobileUserResult>;
    resendVerificationCode(email: string): Promise<VerificationResponse>;
    loginMobileUser(email: string, password: string): Promise<MobileUserResult>;
    getMobileUserById(id: string): Promise<IMobileUser>;
    updateMobileUser(id: string, data: UpdateMobileUserData, file?: Express.Multer.File): Promise<IMobileUser>;
    updateMobileUserPassword(id: string, currentPassword: string, newPassword: string): Promise<void>;
    updateMobileUserStatus(id: string, status: string): Promise<IMobileUser>;
    getAllMobileUsers(query: MobileUserQuery): Promise<MobileUsersListResult>;
}
declare const _default: MobileUserService;
export default _default;
//# sourceMappingURL=mobileService.d.ts.map