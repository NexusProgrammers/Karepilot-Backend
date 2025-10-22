"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MobileUserService = void 0;
const mobileUser_1 = __importDefault(require("../models/mobileUser"));
const index_1 = require("../utils/index");
const index_2 = require("./index");
const imageService_1 = require("./imageService");
const mobileTypes_1 = require("../types/mobileTypes");
class MobileUserService {
    async createMobileUser(data) {
        const existingUser = await mobileUser_1.default.findOne({ email: data.email });
        if (existingUser) {
            throw new Error('User with this email already exists');
        }
        const mobileUser = new mobileUser_1.default({
            fullName: data.fullName,
            email: data.email,
            password: data.password,
            status: mobileTypes_1.MobileUserStatus.PENDING
        });
        const verificationCode = mobileUser.generateEmailVerificationCode();
        await mobileUser.save();
        const emailSent = await index_2.emailService.sendEmailVerification({
            fullName: data.fullName,
            verificationCode: verificationCode
        }, data.email);
        if (!emailSent) {
            throw new Error('Failed to send verification email. Please try again.');
        }
        return { user: mobileUser };
    }
    async verifyEmail(data) {
        const mobileUser = await mobileUser_1.default.findOne({
            emailVerificationCode: data.code,
            emailVerificationExpires: { $gt: new Date() }
        }).select('+emailVerificationCode +emailVerificationExpires');
        if (!mobileUser) {
            throw new Error('Invalid or expired verification code');
        }
        if (mobileUser.isEmailVerified) {
            throw new Error('Email is already verified');
        }
        mobileUser.isEmailVerified = true;
        mobileUser.status = mobileTypes_1.MobileUserStatus.ACTIVE;
        mobileUser.emailVerificationCode = undefined;
        mobileUser.emailVerificationExpires = undefined;
        await mobileUser.save();
        const token = (0, index_1.generateToken)(mobileUser._id.toString());
        return {
            user: mobileUser,
            token
        };
    }
    async resendVerificationCode(email) {
        const mobileUser = await mobileUser_1.default.findOne({ email }).select('+emailVerificationCode +emailVerificationExpires');
        if (!mobileUser) {
            throw new Error('User not found');
        }
        if (mobileUser.isEmailVerified) {
            throw new Error('Email is already verified');
        }
        const verificationCode = mobileUser.generateEmailVerificationCode();
        await mobileUser.save();
        const emailSent = await index_2.emailService.sendEmailVerification({
            fullName: mobileUser.fullName,
            verificationCode: verificationCode
        }, email);
        if (!emailSent) {
            throw new Error('Failed to resend verification email. Please try again.');
        }
        return { email: mobileUser.email };
    }
    async loginMobileUser(email, password) {
        const mobileUser = await mobileUser_1.default.findOne({ email }).select('+password');
        if (!mobileUser) {
            throw new Error('Invalid email or password');
        }
        const isPasswordValid = await mobileUser.comparePassword(password);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }
        if (!mobileUser.isEmailVerified) {
            throw new Error('Please verify your email before logging in');
        }
        mobileUser.lastLogin = new Date();
        await mobileUser.save();
        const token = (0, index_1.generateToken)(mobileUser._id.toString());
        return {
            user: mobileUser,
            token
        };
    }
    async getMobileUserById(id) {
        const mobileUser = await mobileUser_1.default.findById(id).select('-password -emailVerificationCode -emailVerificationExpires');
        if (!mobileUser) {
            throw new Error('Mobile user not found');
        }
        return mobileUser;
    }
    async updateMobileUser(id, data, file) {
        const mobileUser = await mobileUser_1.default.findById(id);
        if (!mobileUser) {
            throw new Error('Mobile user not found');
        }
        if (file) {
            if (mobileUser.profileImage) {
                const oldPublicId = (0, imageService_1.extractPublicIdFromUrl)(mobileUser.profileImage);
                if (oldPublicId) {
                    await (0, imageService_1.deleteImage)(oldPublicId);
                }
            }
            const uploadResult = await (0, imageService_1.uploadImage)(file, 'mobile-profiles');
            if (uploadResult.success && uploadResult.url) {
                data.profileImage = uploadResult.url;
            }
            else {
                throw new Error(uploadResult.error || 'Failed to upload profile image');
            }
        }
        const updatedMobileUser = await mobileUser_1.default.findByIdAndUpdate(id, data, { new: true, runValidators: true });
        return updatedMobileUser;
    }
    async updateMobileUserPassword(id, currentPassword, newPassword) {
        const mobileUser = await mobileUser_1.default.findById(id).select('+password');
        if (!mobileUser) {
            throw new Error('Mobile user not found');
        }
        const isCurrentPasswordValid = await mobileUser.comparePassword(currentPassword);
        if (!isCurrentPasswordValid) {
            throw new Error('Current password is incorrect');
        }
        mobileUser.password = newPassword;
        await mobileUser.save();
    }
    async updateMobileUserStatus(id, status) {
        const mobileUser = await mobileUser_1.default.findByIdAndUpdate(id, { status }, { new: true, runValidators: true }).select('-password -emailVerificationCode -emailVerificationExpires');
        if (!mobileUser) {
            throw new Error('Mobile user not found');
        }
        return mobileUser;
    }
    async getAllMobileUsers(query) {
        const page = query.page || 1;
        const limit = query.limit || 10;
        const dbQuery = {};
        if (query.status) {
            dbQuery.status = query.status;
        }
        if (query.isEmailVerified !== undefined) {
            dbQuery.isEmailVerified = query.isEmailVerified;
        }
        if (query.search) {
            dbQuery.$or = [
                { fullName: { $regex: query.search, $options: 'i' } },
                { email: { $regex: query.search, $options: 'i' } }
            ];
        }
        const skip = (page - 1) * limit;
        const mobileUsers = await mobileUser_1.default.find(dbQuery)
            .select('-password -emailVerificationCode -emailVerificationExpires')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        const total = await mobileUser_1.default.countDocuments(dbQuery);
        return {
            users: mobileUsers,
            pagination: {
                current: page,
                pages: Math.ceil(total / limit),
                total,
                limit
            }
        };
    }
}
exports.MobileUserService = MobileUserService;
exports.default = new MobileUserService();
//# sourceMappingURL=mobileService.js.map