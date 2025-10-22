import { Request, Response } from "express";
export declare const registerMobileUser: (req: Request, res: Response) => Promise<void>;
export declare const verifyEmail: (req: Request, res: Response) => Promise<void>;
export declare const resendVerificationCode: (req: Request, res: Response) => Promise<void>;
export declare const loginMobileUser: (req: Request, res: Response) => Promise<void>;
export declare const getMobileProfile: (req: Request, res: Response) => Promise<void>;
export declare const updateMobileProfile: (req: Request, res: Response) => Promise<void>;
export declare const changeMobilePassword: (req: Request, res: Response) => Promise<void>;
export declare const getAllMobileUsers: (req: Request, res: Response) => Promise<void>;
export declare const getMobileUserById: (req: Request, res: Response) => Promise<void>;
export declare const updateMobileUserStatus: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=mobileController.d.ts.map