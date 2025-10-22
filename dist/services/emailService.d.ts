import { EmailPasswordResetTemplate, EmailVerificationTemplate } from "../types";
export declare class EmailService {
    private transporter;
    constructor();
    private generateEmailVerificationHTML;
    private generateEmailVerificationText;
    sendEmailVerification(data: EmailVerificationTemplate, email: string): Promise<boolean>;
    sendPasswordReset(data: EmailPasswordResetTemplate, email: string): Promise<boolean>;
    private generatePasswordResetHTML;
    private generatePasswordResetText;
    verifyConnection(): Promise<boolean>;
}
declare const _default: EmailService;
export default _default;
//# sourceMappingURL=emailService.d.ts.map