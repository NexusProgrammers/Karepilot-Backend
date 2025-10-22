import { Document } from "mongoose";
export declare enum MobileUserStatus {
    ACTIVE = "Active",
    INACTIVE = "Inactive",
    PENDING = "Pending",
    SUSPENDED = "Suspended"
}
export interface IMobileUser extends Document {
    fullName: string;
    email: string;
    password: string;
    isEmailVerified: boolean;
    emailVerificationCode?: string | undefined;
    emailVerificationExpires?: Date | undefined;
    status: MobileUserStatus;
    profileImage?: string;
    lastLogin?: Date | undefined;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
    generateEmailVerificationCode(): string;
    isEmailVerificationCodeValid(code: string): boolean;
}
export interface CreateMobileUserData {
    fullName: string;
    email: string;
    password: string;
}
export interface UpdateMobileUserData {
    profileImage: string;
    fullName?: string;
    email?: string;
}
export interface MobileUserQuery {
    page?: number | undefined;
    limit?: number | undefined;
    status?: MobileUserStatus | undefined;
    isEmailVerified?: boolean | undefined;
    search?: string | undefined;
}
export interface MobileUserResult {
    user: IMobileUser;
    token?: string;
}
export interface MobileUsersListResult {
    users: IMobileUser[];
    pagination: {
        current: number;
        pages: number;
        total: number;
        limit: number;
    };
}
export interface EmailVerificationData {
    code: string;
}
export interface MobileUserResponse {
    id: string;
    fullName: string;
    email: string;
    isEmailVerified: boolean;
    status: MobileUserStatus;
    lastLogin?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export interface VerificationResponse {
    email: string;
}
export interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    text?: string;
}
export interface EmailVerificationTemplate {
    fullName: string;
    verificationCode: string;
}
export interface EmailPasswordResetTemplate {
    fullName: string;
    resetCode: string;
}
//# sourceMappingURL=mobileTypes.d.ts.map