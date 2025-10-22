export declare const emailConfig: {
    gmail: {
        user: string | undefined;
        appPassword: string | undefined;
    };
    verification: {
        codeExpiryMinutes: number;
        resendCooldownMinutes: number;
    };
    templates: {
        verification: {
            subject: string;
            from: string;
        };
        passwordReset: {
            subject: string;
            from: string;
        };
    };
};
export declare const validateEmailConfig: () => boolean;
//# sourceMappingURL=emailConfig.d.ts.map