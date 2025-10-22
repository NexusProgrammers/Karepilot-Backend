"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const bcrypt = __importStar(require("bcryptjs"));
const mobileTypes_1 = require("../types/mobileTypes");
const mobileUserSchema = new mongoose_1.Schema({
    fullName: {
        type: String,
        required: [true, "Full name is required"],
        trim: true,
        minlength: [2, "Full name must be at least 2 characters long"],
        maxlength: [100, "Full name cannot exceed 100 characters"],
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
        minlength: [8, "Password must be at least 8 characters long"],
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    emailVerificationCode: {
        type: String,
        select: false,
    },
    emailVerificationExpires: {
        type: Date,
        select: false,
    },
    status: {
        type: String,
        enum: Object.values(mobileTypes_1.MobileUserStatus),
        default: mobileTypes_1.MobileUserStatus.PENDING,
    },
    profileImage: {
        type: String,
        trim: true,
    },
    lastLogin: {
        type: Date,
    },
}, {
    timestamps: true,
    toJSON: {
        transform: function (doc, ret) {
            const { password, emailVerificationCode, emailVerificationExpires, ...userWithoutSensitive } = ret;
            return userWithoutSensitive;
        },
    },
});
mobileUserSchema.index({ email: 1 });
mobileUserSchema.index({ status: 1 });
mobileUserSchema.index({ isEmailVerified: 1 });
mobileUserSchema.pre("save", async function (next) {
    if (!this.isModified("password"))
        return next();
    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    }
    catch (error) {
        next(error);
    }
});
mobileUserSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};
mobileUserSchema.methods.generateEmailVerificationCode = function () {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    this.emailVerificationCode = code;
    this.emailVerificationExpires = new Date(Date.now() + 10 * 60 * 1000);
    return code;
};
mobileUserSchema.methods.isEmailVerificationCodeValid = function (code) {
    return (this.emailVerificationCode === code &&
        this.emailVerificationExpires &&
        this.emailVerificationExpires > new Date());
};
const MobileUser = mongoose_1.default.model("MobileUser", mobileUserSchema);
exports.default = MobileUser;
//# sourceMappingURL=mobileUser.js.map