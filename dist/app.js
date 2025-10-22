import {
  AdminRole,
  adminUser_default
} from "./chunk-34MQFFLB.js";

// src/app.ts
import express from "express";
import { config as config2 } from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import ExpressMongoSanitize from "express-mongo-sanitize";

// src/config/dbConnect.ts
import mongoose from "mongoose";
import { config } from "dotenv";
config();
var mongoUrl = process?.env?.MONGO_URI;
if (!mongoUrl) {
  throw new Error("mongoUrl is required");
}
var dbConnect = async () => {
  try {
    await mongoose.connect(mongoUrl);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Error In Connecting", error);
    process.exit(1);
  }
};
var dbConnect_default = dbConnect;

// src/routes/v1/index.ts
import { Router as Router3 } from "express";

// src/routes/v1/admin.ts
import { Router } from "express";

// src/utils/auth.ts
import jwt from "jsonwebtoken";
var JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
var JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
var generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};
var verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};
var validate = (schema, source = "body") => {
  return (req, res, next) => {
    const data = req[source];
    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true
    });
    if (error) {
      const errors = error.details.map((detail) => detail.message);
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors
      });
      return;
    }
    req[source] = value;
    next();
  };
};

// src/config/cloudinaryConfig.ts
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();
var { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  throw new Error("Cloudinary configuration variables are missing in environment variables.");
}
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET
});
var cloudinaryConfig_default = cloudinary;

// src/services/imageService.ts
var uploadImage = async (file, folder = "profile-images") => {
  try {
    const base64String = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
    const result = await cloudinaryConfig_default.uploader.upload(base64String, {
      folder,
      resource_type: "image",
      transformation: [
        { width: 500, height: 500, crop: "fill", gravity: "face" },
        { quality: "auto", fetch_format: "auto" }
      ]
    });
    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return {
      success: false,
      error: error.message || "Failed to upload image"
    };
  }
};
var deleteImage = async (publicId) => {
  try {
    await cloudinaryConfig_default.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    return false;
  }
};
var extractPublicIdFromUrl = (url) => {
  try {
    const parts = url.split("/");
    const filename = parts.length > 0 ? parts[parts.length - 1] : void 0;
    if (!filename) return null;
    const publicId = filename.split(".")[0];
    return publicId || null;
  } catch (error) {
    return null;
  }
};

// src/services/adminService.ts
var AdminUserService = class {
  async createAdminUser(data) {
    const existingAdmin = await adminUser_default.findOne({ email: data.email });
    if (existingAdmin) {
      throw new Error("Admin user with this email already exists");
    }
    const adminUser = new adminUser_default({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role || "Viewer" /* VIEWER */,
      department: data.department,
      phoneNumber: data.phoneNumber,
      badgeNumber: data.badgeNumber,
      shift: data.shift
    });
    await adminUser.save();
    const token = generateToken(adminUser._id.toString());
    return {
      user: adminUser,
      token
    };
  }
  async loginAdminUser(email, password) {
    const adminUser = await adminUser_default.findOne({ email, isActive: true }).select("+password");
    if (!adminUser) {
      throw new Error("Invalid email or password");
    }
    const isPasswordValid = await adminUser.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }
    adminUser.lastLogin = /* @__PURE__ */ new Date();
    await adminUser.save();
    const token = generateToken(adminUser._id.toString());
    return {
      user: adminUser,
      token
    };
  }
  async getAdminUserById(id) {
    const adminUser = await adminUser_default.findById(id).select("-password");
    if (!adminUser || !adminUser.isActive) {
      throw new Error("Admin user not found");
    }
    return adminUser;
  }
  async updateAdminUser(id, data, file) {
    const adminUser = await adminUser_default.findById(id).select("-password");
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
      const uploadResult = await uploadImage(file, "admin-profiles");
      if (uploadResult.success && uploadResult.url) {
        data.profileImage = uploadResult.url;
      } else {
        throw new Error(uploadResult.error || "Failed to upload profile image");
      }
    }
    const updatedAdminUser = await adminUser_default.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    }).select("-password");
    return updatedAdminUser;
  }
  async updateAdminUserPassword(id, currentPassword, newPassword) {
    const adminUser = await adminUser_default.findById(id).select("+password");
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
    const adminUser = await adminUser_default.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    ).select("-password");
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
        { badgeNumber: { $regex: query.search, $options: "i" } }
      ];
    }
    const skip = (page - 1) * limit;
    const adminUsers = await adminUser_default.find(dbQuery).select("-password").sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await adminUser_default.countDocuments(dbQuery);
    return {
      users: adminUsers,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        limit
      }
    };
  }
  async getAdminRolesAndPermissions() {
    const { AdminRole: AdminRole3, Permission: Permission3 } = await import("./adminUser-G25IUH5F.js");
    return {
      roles: Object.values(AdminRole3),
      permissions: Object.values(Permission3)
    };
  }
};
var adminService_default = new AdminUserService();

// src/models/mobileUser.ts
import mongoose2, { Schema } from "mongoose";
import * as bcrypt from "bcryptjs";

// src/types/mobileTypes.ts
var MobileUserStatus = /* @__PURE__ */ ((MobileUserStatus2) => {
  MobileUserStatus2["ACTIVE"] = "Active";
  MobileUserStatus2["INACTIVE"] = "Inactive";
  MobileUserStatus2["PENDING"] = "Pending";
  MobileUserStatus2["SUSPENDED"] = "Suspended";
  return MobileUserStatus2;
})(MobileUserStatus || {});

// src/models/mobileUser.ts
var mobileUserSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [2, "Full name must be at least 2 characters long"],
      maxlength: [100, "Full name cannot exceed 100 characters"]
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please provide a valid email address"]
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"]
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    emailVerificationCode: {
      type: String,
      select: false
    },
    emailVerificationExpires: {
      type: Date,
      select: false
    },
    status: {
      type: String,
      enum: Object.values(MobileUserStatus),
      default: "Pending" /* PENDING */
    },
    profileImage: {
      type: String,
      trim: true
    },
    lastLogin: {
      type: Date
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: function(doc, ret) {
        const {
          password,
          emailVerificationCode,
          emailVerificationExpires,
          ...userWithoutSensitive
        } = ret;
        return userWithoutSensitive;
      }
    }
  }
);
mobileUserSchema.index({ email: 1 });
mobileUserSchema.index({ status: 1 });
mobileUserSchema.index({ isEmailVerified: 1 });
mobileUserSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});
mobileUserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};
mobileUserSchema.methods.generateEmailVerificationCode = function() {
  const code = Math.floor(1e3 + Math.random() * 9e3).toString();
  this.emailVerificationCode = code;
  this.emailVerificationExpires = new Date(Date.now() + 10 * 60 * 1e3);
  return code;
};
mobileUserSchema.methods.isEmailVerificationCodeValid = function(code) {
  return this.emailVerificationCode === code && this.emailVerificationExpires && this.emailVerificationExpires > /* @__PURE__ */ new Date();
};
var MobileUser = mongoose2.model("MobileUser", mobileUserSchema);
var mobileUser_default = MobileUser;

// src/services/mobileService.ts
var MobileUserService = class {
  async createMobileUser(data) {
    const existingUser = await mobileUser_default.findOne({ email: data.email });
    if (existingUser) {
      throw new Error("User with this email already exists");
    }
    const mobileUser = new mobileUser_default({
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      status: "Pending" /* PENDING */
    });
    const verificationCode = mobileUser.generateEmailVerificationCode();
    await mobileUser.save();
    const emailSent = await emailService_default.sendEmailVerification(
      {
        fullName: data.fullName,
        verificationCode
      },
      data.email
    );
    if (!emailSent) {
      throw new Error("Failed to send verification email. Please try again.");
    }
    return { user: mobileUser };
  }
  async verifyEmail(data) {
    const mobileUser = await mobileUser_default.findOne({
      emailVerificationCode: data.code,
      emailVerificationExpires: { $gt: /* @__PURE__ */ new Date() }
    }).select("+emailVerificationCode +emailVerificationExpires");
    if (!mobileUser) {
      throw new Error("Invalid or expired verification code");
    }
    if (mobileUser.isEmailVerified) {
      throw new Error("Email is already verified");
    }
    mobileUser.isEmailVerified = true;
    mobileUser.status = "Active" /* ACTIVE */;
    mobileUser.emailVerificationCode = void 0;
    mobileUser.emailVerificationExpires = void 0;
    await mobileUser.save();
    const token = generateToken(mobileUser._id.toString());
    return {
      user: mobileUser,
      token
    };
  }
  async resendVerificationCode(email) {
    const mobileUser = await mobileUser_default.findOne({ email }).select("+emailVerificationCode +emailVerificationExpires");
    if (!mobileUser) {
      throw new Error("User not found");
    }
    if (mobileUser.isEmailVerified) {
      throw new Error("Email is already verified");
    }
    const verificationCode = mobileUser.generateEmailVerificationCode();
    await mobileUser.save();
    const emailSent = await emailService_default.sendEmailVerification(
      {
        fullName: mobileUser.fullName,
        verificationCode
      },
      email
    );
    if (!emailSent) {
      throw new Error("Failed to resend verification email. Please try again.");
    }
    return { email: mobileUser.email };
  }
  async loginMobileUser(email, password) {
    const mobileUser = await mobileUser_default.findOne({ email }).select("+password");
    if (!mobileUser) {
      throw new Error("Invalid email or password");
    }
    const isPasswordValid = await mobileUser.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }
    if (!mobileUser.isEmailVerified) {
      throw new Error("Please verify your email before logging in");
    }
    mobileUser.lastLogin = /* @__PURE__ */ new Date();
    await mobileUser.save();
    const token = generateToken(mobileUser._id.toString());
    return {
      user: mobileUser,
      token
    };
  }
  async getMobileUserById(id) {
    const mobileUser = await mobileUser_default.findById(id).select("-password -emailVerificationCode -emailVerificationExpires");
    if (!mobileUser) {
      throw new Error("Mobile user not found");
    }
    return mobileUser;
  }
  async updateMobileUser(id, data, file) {
    const mobileUser = await mobileUser_default.findById(id);
    if (!mobileUser) {
      throw new Error("Mobile user not found");
    }
    if (file) {
      if (mobileUser.profileImage) {
        const oldPublicId = extractPublicIdFromUrl(mobileUser.profileImage);
        if (oldPublicId) {
          await deleteImage(oldPublicId);
        }
      }
      const uploadResult = await uploadImage(file, "mobile-profiles");
      if (uploadResult.success && uploadResult.url) {
        data.profileImage = uploadResult.url;
      } else {
        throw new Error(uploadResult.error || "Failed to upload profile image");
      }
    }
    const updatedMobileUser = await mobileUser_default.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    );
    return updatedMobileUser;
  }
  async updateMobileUserPassword(id, currentPassword, newPassword) {
    const mobileUser = await mobileUser_default.findById(id).select("+password");
    if (!mobileUser) {
      throw new Error("Mobile user not found");
    }
    const isCurrentPasswordValid = await mobileUser.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      throw new Error("Current password is incorrect");
    }
    mobileUser.password = newPassword;
    await mobileUser.save();
  }
  async updateMobileUserStatus(id, status) {
    const mobileUser = await mobileUser_default.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).select("-password -emailVerificationCode -emailVerificationExpires");
    if (!mobileUser) {
      throw new Error("Mobile user not found");
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
    if (query.isEmailVerified !== void 0) {
      dbQuery.isEmailVerified = query.isEmailVerified;
    }
    if (query.search) {
      dbQuery.$or = [
        { fullName: { $regex: query.search, $options: "i" } },
        { email: { $regex: query.search, $options: "i" } }
      ];
    }
    const skip = (page - 1) * limit;
    const mobileUsers = await mobileUser_default.find(dbQuery).select("-password -emailVerificationCode -emailVerificationExpires").sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await mobileUser_default.countDocuments(dbQuery);
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
};
var mobileService_default = new MobileUserService();

// src/services/emailService.ts
import nodemailer from "nodemailer";

// src/config/emailConfig.ts
var emailConfig = {
  gmail: {
    user: process.env.GMAIL_USER,
    appPassword: process.env.GMAIL_APP_PASSWORD
  },
  verification: {
    codeExpiryMinutes: 10,
    resendCooldownMinutes: 1
  },
  templates: {
    verification: {
      subject: "Karepilot - Email Verification Code",
      from: process.env.GMAIL_USER || "noreply@karepilot.com"
    },
    passwordReset: {
      subject: "Karepilot - Password Reset Code",
      from: process.env.GMAIL_USER || "noreply@karepilot.com"
    }
  }
};
var validateEmailConfig = () => {
  if (!emailConfig.gmail.user || !emailConfig.gmail.appPassword) {
    console.error("Email configuration is missing. Please set GMAIL_USER and GMAIL_APP_PASSWORD environment variables.");
    return false;
  }
  return true;
};

// src/services/emailService.ts
var EmailService = class {
  transporter;
  constructor() {
    if (!validateEmailConfig()) {
      throw new Error("Email configuration is invalid. Please check your environment variables.");
    }
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailConfig.gmail.user,
        pass: emailConfig.gmail.appPassword
      }
    });
  }
  generateEmailVerificationHTML(data) {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification - Karepilot</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #1a202c;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
          }
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 20px;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 30px;
            text-align: center;
            position: relative;
          }
          .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
            opacity: 0.3;
          }
          .logo {
            font-size: 36px;
            font-weight: 800;
            color: #ffffff;
            margin-bottom: 8px;
            position: relative;
            z-index: 1;
            letter-spacing: -1px;
          }
          .tagline {
            font-size: 16px;
            color: rgba(255, 255, 255, 0.9);
            font-weight: 400;
            position: relative;
            z-index: 1;
          }
          .content {
            padding: 50px 40px;
          }
          .welcome-section {
            text-align: center;
            margin-bottom: 40px;
          }
          .welcome-icon {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 50%;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            color: white;
          }
          .welcome-title {
            font-size: 28px;
            font-weight: 700;
            color: #1a202c;
            margin-bottom: 12px;
            line-height: 1.2;
          }
          .welcome-subtitle {
            font-size: 18px;
            color: #718096;
            font-weight: 400;
          }
          .greeting {
            font-size: 18px;
            color: #2d3748;
            margin-bottom: 30px;
            text-align: center;
          }
          .greeting strong {
            color: #667eea;
            font-weight: 600;
          }
          .code-section {
            background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
            border: 2px solid #e2e8f0;
            border-radius: 16px;
            padding: 30px;
            margin: 30px 0;
            text-align: center;
            position: relative;
            overflow: hidden;
          }
          .code-section::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(45deg, transparent, rgba(102, 126, 234, 0.1), transparent);
            animation: shimmer 3s infinite;
          }
          @keyframes shimmer {
            0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
            100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
          }
          .code-label {
            font-size: 14px;
            color: #718096;
            font-weight: 500;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .verification-code {
            font-size: 42px;
            font-weight: 800;
            color: #667eea;
            letter-spacing: 12px;
            font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
            margin: 10px 0;
            position: relative;
            z-index: 1;
            text-shadow: 0 2px 4px rgba(102, 126, 234, 0.1);
          }
          .instructions {
            font-size: 16px;
            color: #4a5568;
            margin: 30px 0;
            text-align: center;
            line-height: 1.6;
          }
          .warning-section {
            background: linear-gradient(135deg, #fed7d7 0%, #feb2b2 100%);
            border: 1px solid #fc8181;
            border-radius: 12px;
            padding: 20px;
            margin: 30px 0;
            position: relative;
          }
          .warning-icon {
            display: inline-block;
            width: 24px;
            height: 24px;
            background: #e53e3e;
            border-radius: 50%;
            margin-right: 10px;
            vertical-align: middle;
            position: relative;
          }
          .warning-icon::after {
            content: '!';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-weight: bold;
            font-size: 14px;
          }
          .warning-text {
            font-size: 14px;
            color: #742a2a;
            font-weight: 500;
            display: inline-block;
            vertical-align: middle;
          }
          .footer {
            background: #f7fafc;
            padding: 30px 40px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
          }
          .footer-brand {
            font-size: 20px;
            font-weight: 700;
            color: #667eea;
            margin-bottom: 10px;
          }
          .footer-text {
            font-size: 14px;
            color: #718096;
            margin-bottom: 5px;
          }
          .footer-link {
            color: #667eea;
            text-decoration: none;
            font-weight: 500;
          }
          .footer-link:hover {
            text-decoration: underline;
          }
          .social-links {
            margin-top: 20px;
          }
          .social-link {
            display: inline-block;
            width: 40px;
            height: 40px;
            background: #667eea;
            border-radius: 50%;
            margin: 0 8px;
            text-decoration: none;
            color: white;
            line-height: 40px;
            font-size: 16px;
            transition: all 0.3s ease;
          }
          .social-link:hover {
            background: #5a67d8;
            transform: translateY(-2px);
          }
          @media (max-width: 600px) {
            body { padding: 10px; }
            .content { padding: 30px 20px; }
            .footer { padding: 20px; }
            .verification-code { font-size: 32px; letter-spacing: 8px; }
            .welcome-title { font-size: 24px; }
            .header { padding: 30px 20px; }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <div class="logo">Karepilot</div>
            <div class="tagline">Your Healthcare Companion</div>
          </div>
          
          <div class="content">
            <div class="welcome-section">
              <div class="welcome-icon">\u2713</div>
              <h1 class="welcome-title">Welcome to Karepilot!</h1>
              <p class="welcome-subtitle">Let's verify your email address</p>
            </div>
            
            <div class="greeting">
              Hello <strong>${data.fullName}</strong> \u{1F44B}
            </div>
            
            <div class="code-section">
              <div class="code-label">Your Verification Code</div>
              <div class="verification-code">${data.verificationCode}</div>
            </div>
            
            <div class="instructions">
              Enter this 4-digit code in the Karepilot app to complete your registration and start your healthcare journey with us.
            </div>
            
            <div class="warning-section">
              <span class="warning-icon"></span>
              <span class="warning-text">
                <strong>Security Notice:</strong> This code expires in 10 minutes. If you didn't request this verification, please ignore this email.
              </span>
            </div>
          </div>
          
          <div class="footer">
            <div class="footer-brand">Karepilot</div>
            <p class="footer-text">This email was sent by Karepilot</p>
            <p class="footer-text">
              Need help? Contact our <a href="mailto:support@karepilot.com" class="footer-link">support team</a>
            </p>
            <div class="social-links">
              <a href="#" class="social-link">\u{1F4F1}</a>
              <a href="#" class="social-link">\u{1F310}</a>
              <a href="#" class="social-link">\u{1F4E7}</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }
  generateEmailVerificationText(data) {
    return `
      Email Verification - Karepilot
      
      Hello ${data.fullName},
      
      Thank you for registering with Karepilot! To complete your registration and verify your email address, please use the verification code below:
      
      Verification Code: ${data.verificationCode}
      
      Enter this code in the app to verify your email address and activate your account.
      
      Important: This verification code will expire in 10 minutes for security reasons. If you didn't request this verification, please ignore this email.
      
      This email was sent by Karepilot
      If you have any questions, please contact our support team.
    `;
  }
  async sendEmailVerification(data, email) {
    try {
      const mailOptions = {
        to: email,
        subject: emailConfig.templates.verification.subject,
        html: this.generateEmailVerificationHTML(data),
        text: this.generateEmailVerificationText(data)
      };
      const result = await this.transporter.sendMail(mailOptions);
      console.log(`Email verification sent to ${email}:`, result.messageId);
      return true;
    } catch (error) {
      console.error("Error sending email verification:", error);
      return false;
    }
  }
  async sendPasswordReset(data, email) {
    try {
      const mailOptions = {
        to: email,
        subject: emailConfig.templates.passwordReset.subject,
        html: this.generatePasswordResetHTML(data),
        text: this.generatePasswordResetText(data)
      };
      const result = await this.transporter.sendMail(mailOptions);
      console.log(`Password reset email sent to ${email}:`, result.messageId);
      return true;
    } catch (error) {
      console.error("Error sending password reset email:", error);
      return false;
    }
  }
  generatePasswordResetHTML(data) {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset - Karepilot</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #1a202c;
            background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%);
            min-height: 100vh;
            padding: 20px;
          }
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 20px;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%);
            padding: 40px 30px;
            text-align: center;
            position: relative;
          }
          .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
            opacity: 0.3;
          }
          .logo {
            font-size: 36px;
            font-weight: 800;
            color: #ffffff;
            margin-bottom: 8px;
            position: relative;
            z-index: 1;
            letter-spacing: -1px;
          }
          .tagline {
            font-size: 16px;
            color: rgba(255, 255, 255, 0.9);
            font-weight: 400;
            position: relative;
            z-index: 1;
          }
          .content {
            padding: 50px 40px;
          }
          .security-section {
            text-align: center;
            margin-bottom: 40px;
          }
          .security-icon {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%);
            border-radius: 50%;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            color: white;
          }
          .security-title {
            font-size: 28px;
            font-weight: 700;
            color: #1a202c;
            margin-bottom: 12px;
            line-height: 1.2;
          }
          .security-subtitle {
            font-size: 18px;
            color: #718096;
            font-weight: 400;
          }
          .greeting {
            font-size: 18px;
            color: #2d3748;
            margin-bottom: 30px;
            text-align: center;
          }
          .greeting strong {
            color: #e53e3e;
            font-weight: 600;
          }
          .code-section {
            background: linear-gradient(135deg, #fed7d7 0%, #feb2b2 100%);
            border: 2px solid #fc8181;
            border-radius: 16px;
            padding: 30px;
            margin: 30px 0;
            text-align: center;
            position: relative;
            overflow: hidden;
          }
          .code-section::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(45deg, transparent, rgba(229, 62, 62, 0.1), transparent);
            animation: shimmer 3s infinite;
          }
          @keyframes shimmer {
            0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
            100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
          }
          .code-label {
            font-size: 14px;
            color: #742a2a;
            font-weight: 500;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .reset-code {
            font-size: 42px;
            font-weight: 800;
            color: #e53e3e;
            letter-spacing: 12px;
            font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
            margin: 10px 0;
            position: relative;
            z-index: 1;
            text-shadow: 0 2px 4px rgba(229, 62, 62, 0.1);
          }
          .instructions {
            font-size: 16px;
            color: #4a5568;
            margin: 30px 0;
            text-align: center;
            line-height: 1.6;
          }
          .warning-section {
            background: linear-gradient(135deg, #fed7d7 0%, #feb2b2 100%);
            border: 1px solid #fc8181;
            border-radius: 12px;
            padding: 20px;
            margin: 30px 0;
            position: relative;
          }
          .warning-icon {
            display: inline-block;
            width: 24px;
            height: 24px;
            background: #e53e3e;
            border-radius: 50%;
            margin-right: 10px;
            vertical-align: middle;
            position: relative;
          }
          .warning-icon::after {
            content: '!';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-weight: bold;
            font-size: 14px;
          }
          .warning-text {
            font-size: 14px;
            color: #742a2a;
            font-weight: 500;
            display: inline-block;
            vertical-align: middle;
          }
          .footer {
            background: #f7fafc;
            padding: 30px 40px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
          }
          .footer-brand {
            font-size: 20px;
            font-weight: 700;
            color: #e53e3e;
            margin-bottom: 10px;
          }
          .footer-text {
            font-size: 14px;
            color: #718096;
            margin-bottom: 5px;
          }
          .footer-link {
            color: #e53e3e;
            text-decoration: none;
            font-weight: 500;
          }
          .footer-link:hover {
            text-decoration: underline;
          }
          .social-links {
            margin-top: 20px;
          }
          .social-link {
            display: inline-block;
            width: 40px;
            height: 40px;
            background: #e53e3e;
            border-radius: 50%;
            margin: 0 8px;
            text-decoration: none;
            color: white;
            line-height: 40px;
            font-size: 16px;
            transition: all 0.3s ease;
          }
          .social-link:hover {
            background: #c53030;
            transform: translateY(-2px);
          }
          @media (max-width: 600px) {
            body { padding: 10px; }
            .content { padding: 30px 20px; }
            .footer { padding: 20px; }
            .reset-code { font-size: 32px; letter-spacing: 8px; }
            .security-title { font-size: 24px; }
            .header { padding: 30px 20px; }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <div class="logo">Karepilot</div>
            <div class="tagline">Secure Password Reset</div>
          </div>
          
          <div class="content">
            <div class="security-section">
              <div class="security-icon">\u{1F512}</div>
              <h1 class="security-title">Password Reset Request</h1>
              <p class="security-subtitle">Secure your account with a new password</p>
            </div>
            
            <div class="greeting">
              Hello <strong>${data.fullName}</strong> \u{1F44B}
            </div>
            
            <div class="code-section">
              <div class="code-label">Your Reset Code</div>
              <div class="reset-code">${data.resetCode}</div>
            </div>
            
            <div class="instructions">
              Enter this 4-digit code in the Karepilot app to reset your password and secure your account.
            </div>
            
            <div class="warning-section">
              <span class="warning-icon"></span>
              <span class="warning-text">
                <strong>Security Alert:</strong> This code expires in 10 minutes. If you didn't request this password reset, please ignore this email and consider changing your password.
              </span>
            </div>
          </div>
          
          <div class="footer">
            <div class="footer-brand">Karepilot</div>
            <p class="footer-text">This email was sent by Karepilot</p>
            <p class="footer-text">
              Need help? Contact our <a href="mailto:support@karepilot.com" class="footer-link">support team</a>
            </p>
            <div class="social-links">
              <a href="#" class="social-link">\u{1F4F1}</a>
              <a href="#" class="social-link">\u{1F310}</a>
              <a href="#" class="social-link">\u{1F4E7}</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }
  generatePasswordResetText(data) {
    return `
      Password Reset - Karepilot
      
      Hello ${data.fullName},
      
      We received a request to reset your password. Use the code below to reset your password:
      
      Reset Code: ${data.resetCode}
      
      Enter this code in the app to reset your password.
      
      Important: This reset code will expire in 10 minutes for security reasons. If you didn't request this password reset, please ignore this email.
      
      This email was sent by Karepilot
      If you have any questions, please contact our support team.
    `;
  }
  async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log("Email service connection verified successfully");
      return true;
    } catch (error) {
      console.error("Email service connection failed:", error);
      return false;
    }
  }
};
var emailService_default = new EmailService();

// src/controllers/adminController.ts
var registerAdminUser = async (req, res) => {
  try {
    const result = await adminService_default.createAdminUser(req.body);
    res.status(201).json({
      success: true,
      message: "Admin user created successfully",
      data: {
        user: {
          id: result.user._id,
          name: result.user.name,
          email: result.user.email,
          role: result.user.role,
          permissions: result.user.permissions,
          department: result.user.department,
          phoneNumber: result.user.phoneNumber,
          badgeNumber: result.user.badgeNumber,
          shift: result.user.shift,
          isActive: result.user.isActive
        },
        token: result.token
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Error creating admin user"
    });
  }
};
var loginAdminUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await adminService_default.loginAdminUser(email, password);
    res.status(200).json({
      success: true,
      message: "Admin user logged in successfully",
      data: {
        user: {
          id: result.user._id,
          name: result.user.name,
          email: result.user.email,
          role: result.user.role,
          permissions: result.user.permissions,
          department: result.user.department,
          phoneNumber: result.user.phoneNumber,
          badgeNumber: result.user.badgeNumber,
          shift: result.user.shift,
          isActive: result.user.isActive,
          lastLogin: result.user.lastLogin
        },
        token: result.token
      }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message || "Invalid credentials"
    });
  }
};
var getAdminProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const adminUser = await adminService_default.getAdminUserById(userId);
    res.status(200).json({
      success: true,
      message: "Admin user profile retrieved successfully",
      data: {
        user: {
          id: adminUser._id,
          name: adminUser.name,
          email: adminUser.email,
          role: adminUser.role,
          permissions: adminUser.permissions,
          department: adminUser.department,
          phoneNumber: adminUser.phoneNumber,
          badgeNumber: adminUser.badgeNumber,
          profileImage: adminUser.profileImage,
          isActive: adminUser.isActive,
          lastLogin: adminUser.lastLogin,
          createdAt: adminUser.createdAt,
          updatedAt: adminUser.updatedAt
        }
      }
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message || "Admin user not found"
    });
  }
};
var updateAdminProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = req.body;
    const file = req.file;
    const adminUser = await adminService_default.updateAdminUser(userId, updateData, file);
    res.status(200).json({
      success: true,
      message: "Admin user profile updated successfully",
      data: {
        user: {
          id: adminUser._id,
          name: adminUser.name,
          email: adminUser.email,
          role: adminUser.role,
          permissions: adminUser.permissions,
          department: adminUser.department,
          phoneNumber: adminUser.phoneNumber,
          badgeNumber: adminUser.badgeNumber,
          profileImage: adminUser.profileImage,
          isActive: adminUser.isActive,
          lastLogin: adminUser.lastLogin,
          createdAt: adminUser.createdAt,
          updatedAt: adminUser.updatedAt
        }
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Error updating admin user profile"
    });
  }
};
var changeAdminPassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    await adminService_default.updateAdminUserPassword(userId, currentPassword, newPassword);
    res.status(200).json({
      success: true,
      message: "Password changed successfully"
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Error changing password"
    });
  }
};
var getAllAdminUsers = async (req, res) => {
  try {
    const query = {
      page: req.query.page ? parseInt(req.query.page) : void 0,
      limit: req.query.limit ? parseInt(req.query.limit) : void 0,
      role: req.query.role,
      department: req.query.department,
      search: req.query.search
    };
    const result = await adminService_default.getAllAdminUsers(query);
    res.status(200).json({
      success: true,
      message: "Admin users retrieved successfully",
      data: {
        users: result.users.map((user) => ({
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          permissions: user.permissions,
          department: user.department,
          phoneNumber: user.phoneNumber,
          badgeNumber: user.badgeNumber,
          shift: user.shift,
          isActive: user.isActive,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        })),
        pagination: result.pagination
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error retrieving admin users"
    });
  }
};
var getAdminUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const adminUser = await adminService_default.getAdminUserById(id);
    res.status(200).json({
      success: true,
      message: "Admin user retrieved successfully",
      data: {
        user: {
          id: adminUser._id,
          name: adminUser.name,
          email: adminUser.email,
          role: adminUser.role,
          permissions: adminUser.permissions,
          department: adminUser.department,
          phoneNumber: adminUser.phoneNumber,
          badgeNumber: adminUser.badgeNumber,
          profileImage: adminUser.profileImage,
          isActive: adminUser.isActive,
          lastLogin: adminUser.lastLogin,
          createdAt: adminUser.createdAt,
          updatedAt: adminUser.updatedAt
        }
      }
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message || "Admin user not found"
    });
  }
};
var updateAdminUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const adminUser = await adminService_default.updateAdminUser(id, updateData);
    res.status(200).json({
      success: true,
      message: "Admin user updated successfully",
      data: {
        user: {
          id: adminUser._id,
          name: adminUser.name,
          email: adminUser.email,
          role: adminUser.role,
          permissions: adminUser.permissions,
          department: adminUser.department,
          phoneNumber: adminUser.phoneNumber,
          badgeNumber: adminUser.badgeNumber,
          profileImage: adminUser.profileImage,
          isActive: adminUser.isActive,
          lastLogin: adminUser.lastLogin,
          createdAt: adminUser.createdAt,
          updatedAt: adminUser.updatedAt
        }
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Error updating admin user"
    });
  }
};
var deleteAdminUser = async (req, res) => {
  try {
    const { id } = req.params;
    const adminUser = await adminService_default.deleteAdminUser(id);
    res.status(200).json({
      success: true,
      message: "Admin user deactivated successfully",
      data: {
        user: {
          id: adminUser._id,
          name: adminUser.name,
          email: adminUser.email,
          role: adminUser.role,
          isActive: adminUser.isActive
        }
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Error deactivating admin user"
    });
  }
};
var getAdminRolesAndPermissions = async (req, res) => {
  try {
    const result = await adminService_default.getAdminRolesAndPermissions();
    res.status(200).json({
      success: true,
      message: "Admin roles and permissions retrieved successfully",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error retrieving admin roles and permissions"
    });
  }
};

// src/middlewares/auth.ts
var authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      res.status(401).json({
        success: false,
        message: "Access denied. No token provided."
      });
      return;
    }
    const decoded = verifyToken(token);
    const user = await adminUser_default.findById(decoded.userId).select("-password");
    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        message: "Invalid token or admin user not found."
      });
      return;
    }
    req.user = user;
    req.userType = "admin";
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid token."
    });
  }
};
var authenticateMobile = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      res.status(401).json({
        success: false,
        message: "Access denied. No token provided."
      });
      return;
    }
    const decoded = verifyToken(token);
    const user = await mobileUser_default.findById(decoded.userId).select("-password");
    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid token or mobile user not found."
      });
      return;
    }
    req.user = user;
    req.userType = "mobile";
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid token."
    });
  }
};
var requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user || req.userType !== "admin") {
      res.status(401).json({
        success: false,
        message: "Admin authentication required."
      });
      return;
    }
    const adminUser = req.user;
    if (!adminUser.hasPermission(permission)) {
      res.status(403).json({
        success: false,
        message: `Access denied. Required permission: ${permission}`
      });
      return;
    }
    next();
  };
};
var requireAnyPermission = (permissions) => {
  return (req, res, next) => {
    if (!req.user || req.userType !== "admin") {
      res.status(401).json({
        success: false,
        message: "Admin authentication required."
      });
      return;
    }
    const adminUser = req.user;
    if (!adminUser.hasAnyPermission(permissions)) {
      res.status(403).json({
        success: false,
        message: `Access denied. Required any of these permissions: ${permissions.join(", ")}`
      });
      return;
    }
    next();
  };
};
var requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || req.userType !== "admin") {
      res.status(401).json({
        success: false,
        message: "Admin authentication required."
      });
      return;
    }
    const adminUser = req.user;
    if (!roles.includes(adminUser.role)) {
      res.status(403).json({
        success: false,
        message: `Access denied. Required roles: ${roles.join(", ")}`
      });
      return;
    }
    next();
  };
};

// src/middlewares/upload.ts
import multer from "multer";
var storage = multer.memoryStorage();
var fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"));
  }
};
var upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024
  }
});
var uploadSingleImage = upload.single("profileImage");
var uploadMultipleImages = upload.array("images", 20);

// src/validations/adminUserSchemas.ts
import Joi from "joi";
var emailSchema = Joi.string().email({ tlds: { allow: false } }).required().messages({
  "string.email": "Please provide a valid email address",
  "any.required": "Email is required"
});
var passwordSchema = Joi.string().min(6).required().messages({
  "string.min": "Password must be at least 6 characters long",
  "any.required": "Password is required"
});
var nameSchema = Joi.string().min(2).max(50).trim().required().messages({
  "string.min": "Name must be at least 2 characters long",
  "string.max": "Name cannot exceed 50 characters",
  "any.required": "Name is required"
});
var roleSchema = Joi.string().valid(...Object.values(AdminRole)).optional().messages({
  "any.only": "Invalid role specified. Must be one of: Admin, Manager, Technician, Staff, Security, Viewer"
});
var adminUserRegistrationSchema = Joi.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  role: roleSchema.default("Viewer" /* VIEWER */),
  department: Joi.string().trim().optional(),
  phoneNumber: Joi.string().trim().optional(),
  badgeNumber: Joi.string().trim().optional(),
  shift: Joi.string().trim().optional()
});
var adminUserLoginSchema = Joi.object({
  email: emailSchema,
  password: Joi.string().required().messages({
    "any.required": "Password is required"
  })
});
var adminUserUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(50).trim().optional().messages({
    "string.min": "Name must be at least 2 characters long",
    "string.max": "Name cannot exceed 50 characters"
  }),
  email: Joi.string().email({ tlds: { allow: false } }).optional().messages({
    "string.email": "Please provide a valid email address"
  }),
  role: roleSchema,
  department: Joi.string().trim().optional(),
  phoneNumber: Joi.string().trim().optional(),
  badgeNumber: Joi.string().trim().optional(),
  shift: Joi.string().trim().optional(),
  isActive: Joi.boolean().optional()
});
var adminPasswordChangeSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    "any.required": "Current password is required"
  }),
  newPassword: passwordSchema.messages({
    "string.min": "New password must be at least 6 characters long",
    "any.required": "New password is required"
  })
});
var adminUserQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).optional().default(1),
  limit: Joi.number().integer().min(1).max(100).optional().default(10),
  role: roleSchema,
  department: Joi.string().trim().optional(),
  search: Joi.string().trim().optional(),
  isActive: Joi.boolean().optional()
});
var adminUserIdParamSchema = Joi.object({
  id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
    "string.pattern.base": "Invalid admin user ID format"
  })
});

// src/routes/v1/admin.ts
var adminRouter = Router();
adminRouter.post("/register", validate(adminUserRegistrationSchema), registerAdminUser);
adminRouter.post("/login", validate(adminUserLoginSchema), loginAdminUser);
adminRouter.get("/roles-permissions", getAdminRolesAndPermissions);
adminRouter.use(authenticateAdmin);
adminRouter.get("/profile", getAdminProfile);
adminRouter.put("/profile", uploadSingleImage, validate(adminUserUpdateSchema), updateAdminProfile);
adminRouter.put("/change-password", validate(adminPasswordChangeSchema), changeAdminPassword);
adminRouter.get(
  "/users",
  validate(adminUserQuerySchema, "query"),
  requireAnyPermission(["Edit Users" /* EDIT_USERS */, "Delete Users" /* DELETE_USERS */]),
  getAllAdminUsers
);
adminRouter.get(
  "/users/:id",
  validate(adminUserIdParamSchema, "params"),
  requireAnyPermission(["Edit Users" /* EDIT_USERS */, "Delete Users" /* DELETE_USERS */]),
  getAdminUserById
);
adminRouter.put(
  "/users/:id",
  validate(adminUserIdParamSchema, "params"),
  requirePermission("Edit Users" /* EDIT_USERS */),
  validate(adminUserUpdateSchema),
  updateAdminUserById
);
adminRouter.delete(
  "/users/:id",
  validate(adminUserIdParamSchema, "params"),
  requirePermission("Delete Users" /* DELETE_USERS */),
  deleteAdminUser
);
var admin_default = adminRouter;

// src/routes/v1/mobile.ts
import { Router as Router2 } from "express";

// src/controllers/mobileController.ts
var registerMobileUser = async (req, res) => {
  try {
    const result = await mobileService_default.createMobileUser(req.body);
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
          createdAt: result.user.createdAt
        }
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Error registering mobile user"
    });
  }
};
var verifyEmail = async (req, res) => {
  try {
    const { code } = req.body;
    const result = await mobileService_default.verifyEmail({ code });
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
          updatedAt: result.user.updatedAt
        },
        token: result.token
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Error verifying email"
    });
  }
};
var resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await mobileService_default.resendVerificationCode(email);
    res.status(200).json({
      success: true,
      message: "Verification code resent successfully",
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Error resending verification code"
    });
  }
};
var loginMobileUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await mobileService_default.loginMobileUser(email, password);
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
          updatedAt: result.user.updatedAt
        },
        token: result.token
      }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message || "Invalid credentials"
    });
  }
};
var getMobileProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const mobileUser = await mobileService_default.getMobileUserById(userId);
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
          updatedAt: mobileUser.updatedAt
        }
      }
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message || "Mobile user not found"
    });
  }
};
var updateMobileProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = req.body;
    const file = req.file;
    const mobileUser = await mobileService_default.updateMobileUser(userId, updateData, file);
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
          updatedAt: mobileUser.updatedAt
        }
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Error updating mobile user profile"
    });
  }
};
var changeMobilePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    await mobileService_default.updateMobileUserPassword(userId, currentPassword, newPassword);
    res.status(200).json({
      success: true,
      message: "Password changed successfully"
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Error changing password"
    });
  }
};
var getAllMobileUsers = async (req, res) => {
  try {
    const query = {
      page: req.query.page ? parseInt(req.query.page) : void 0,
      limit: req.query.limit ? parseInt(req.query.limit) : void 0,
      status: req.query.status,
      isEmailVerified: req.query.isEmailVerified ? req.query.isEmailVerified === "true" : void 0,
      search: req.query.search
    };
    const result = await mobileService_default.getAllMobileUsers(query);
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
          updatedAt: user.updatedAt
        })),
        pagination: result.pagination
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error retrieving mobile users"
    });
  }
};
var getMobileUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const mobileUser = await mobileService_default.getMobileUserById(id);
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
          updatedAt: mobileUser.updatedAt
        }
      }
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message || "Mobile user not found"
    });
  }
};
var updateMobileUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const mobileUser = await mobileService_default.updateMobileUserStatus(
      id,
      status
    );
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
          updatedAt: mobileUser.updatedAt
        }
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Error updating mobile user status"
    });
  }
};

// src/validations/mobileUserSchemas.ts
import Joi2 from "joi";
var emailSchema2 = Joi2.string().email({ tlds: { allow: false } }).required().messages({
  "string.email": "Please provide a valid email address",
  "any.required": "Email is required"
});
var fullNameSchema = Joi2.string().min(2).max(100).trim().required().messages({
  "string.min": "Full name must be at least 2 characters long",
  "string.max": "Full name cannot exceed 100 characters",
  "any.required": "Full name is required"
});
var passwordSchema2 = Joi2.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/).required().messages({
  "string.min": "Password must be at least 8 characters long",
  "string.pattern.base": "Password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters",
  "any.required": "Password is required"
});
var confirmPasswordSchema = Joi2.string().valid(Joi2.ref("password")).required().messages({
  "any.only": "Passwords do not match",
  "any.required": "Password confirmation is required"
});
var mobileUserRegistrationSchema = Joi2.object({
  fullName: fullNameSchema,
  email: emailSchema2,
  password: passwordSchema2,
  confirmPassword: confirmPasswordSchema.required()
});
var mobileUserLoginSchema = Joi2.object({
  email: emailSchema2,
  password: Joi2.string().required().messages({
    "any.required": "Password is required"
  })
});
var mobileUserUpdateSchema = Joi2.object({
  fullName: Joi2.string().min(2).max(100).trim().optional().messages({
    "string.min": "Full name must be at least 2 characters long",
    "string.max": "Full name cannot exceed 100 characters"
  }),
  email: Joi2.string().email({ tlds: { allow: false } }).optional().messages({
    "string.email": "Please provide a valid email address"
  })
});
var mobilePasswordChangeSchema = Joi2.object({
  currentPassword: Joi2.string().required().messages({
    "any.required": "Current password is required"
  }),
  newPassword: passwordSchema2.messages({
    "string.min": "New password must be at least 8 characters long",
    "string.pattern.base": "New password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters",
    "any.required": "New password is required"
  }),
  confirmNewPassword: Joi2.string().valid(Joi2.ref("newPassword")).required().messages({
    "any.only": "New passwords do not match",
    "any.required": "New password confirmation is required"
  })
});
var emailVerificationSchema = Joi2.object({
  code: Joi2.string().length(4).pattern(/^\d{4}$/).required().messages({
    "string.length": "Verification code must be exactly 4 digits",
    "string.pattern.base": "Verification code must contain only numbers",
    "any.required": "Verification code is required"
  })
});
var resendVerificationSchema = Joi2.object({
  email: emailSchema2
});
var mobileUserQuerySchema = Joi2.object({
  page: Joi2.number().integer().min(1).optional().default(1),
  limit: Joi2.number().integer().min(1).max(100).optional().default(10),
  status: Joi2.string().valid(...Object.values(MobileUserStatus)).optional(),
  isEmailVerified: Joi2.boolean().optional(),
  search: Joi2.string().trim().optional()
});
var mobileUserIdParamSchema = Joi2.object({
  id: Joi2.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
    "string.pattern.base": "Invalid mobile user ID format"
  })
});

// src/routes/v1/mobile.ts
var mobileRouter = Router2();
mobileRouter.post("/register", validate(mobileUserRegistrationSchema), registerMobileUser);
mobileRouter.post("/verify-email", validate(emailVerificationSchema), verifyEmail);
mobileRouter.post(
  "/resend-verification",
  validate(resendVerificationSchema),
  resendVerificationCode
);
mobileRouter.post("/login", validate(mobileUserLoginSchema), loginMobileUser);
mobileRouter.use(authenticateMobile);
mobileRouter.get("/profile", getMobileProfile);
mobileRouter.patch("/profile", uploadSingleImage, validate(mobileUserUpdateSchema), updateMobileProfile);
mobileRouter.put("/change-password", validate(mobilePasswordChangeSchema), changeMobilePassword);
mobileRouter.get(
  "/admin/users",
  authenticateAdmin,
  validate(mobileUserQuerySchema, "query"),
  requireRole(["Admin" /* ADMIN */, "Manager" /* MANAGER */]),
  getAllMobileUsers
);
mobileRouter.get(
  "/admin/users/:id",
  authenticateAdmin,
  validate(mobileUserIdParamSchema, "params"),
  requireRole(["Admin" /* ADMIN */, "Manager" /* MANAGER */]),
  getMobileUserById
);
mobileRouter.put(
  "/admin/users/:id/status",
  authenticateAdmin,
  validate(mobileUserIdParamSchema, "params"),
  requireRole(["Admin" /* ADMIN */]),
  updateMobileUserStatus
);
var mobile_default = mobileRouter;

// src/routes/v1/index.ts
var mainRouter = Router3();
var defaultRoutes = [
  {
    path: "/users/admin",
    route: admin_default
  },
  {
    path: "/users/mobile",
    route: mobile_default
  }
];
defaultRoutes.forEach((route) => {
  mainRouter.use(route.path, route.route);
});
var v1_default = mainRouter;

// src/app.ts
config2();
var app = express();
app.use(morgan("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(ExpressMongoSanitize());
app.options("*", cors());
var port = Number(process.env.PORT) || 8e3;
app.get("/", (req, res) => {
  res.send("Api Running");
});
dbConnect_default();
app.use("/api/v1", v1_default);
app.use((req, res, next) => {
  const error = new Error("Not Found");
  next(error);
});
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
