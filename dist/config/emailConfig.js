export const emailConfig = {
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
export const validateEmailConfig = () => {
    if (!emailConfig.gmail.user || !emailConfig.gmail.appPassword) {
        console.error('Email configuration is missing. Please set GMAIL_USER and GMAIL_APP_PASSWORD environment variables.');
        return false;
    }
    return true;
};
//# sourceMappingURL=emailConfig.js.map