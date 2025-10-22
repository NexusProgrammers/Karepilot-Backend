"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEmailConfig = exports.emailConfig = void 0;
exports.emailConfig = {
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
            subject: 'Karepilot - Email Verification Code',
            from: process.env.GMAIL_USER || 'noreply@karepilot.com'
        },
        passwordReset: {
            subject: 'Karepilot - Password Reset Code',
            from: process.env.GMAIL_USER || 'noreply@karepilot.com'
        }
    }
};
const validateEmailConfig = () => {
    if (!exports.emailConfig.gmail.user || !exports.emailConfig.gmail.appPassword) {
        console.error('Email configuration is missing. Please set GMAIL_USER and GMAIL_APP_PASSWORD environment variables.');
        return false;
    }
    return true;
};
exports.validateEmailConfig = validateEmailConfig;
//# sourceMappingURL=emailConfig.js.map