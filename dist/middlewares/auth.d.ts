import { Request, Response, NextFunction } from "express";
import { IAdminUser, Permission, AdminRole } from "../models/adminUser";
import { IMobileUser } from "../types/mobileTypes";
declare global {
    namespace Express {
        interface Request {
            user?: IAdminUser | IMobileUser;
            userType?: "admin" | "mobile";
        }
    }
}
export declare const authenticateAdmin: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const authenticateMobile: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const authenticate: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export declare const requirePermission: (permission: Permission) => (req: Request, res: Response, next: NextFunction) => void;
export declare const requireAnyPermission: (permissions: Permission[]) => (req: Request, res: Response, next: NextFunction) => void;
export declare const requireAllPermissions: (permissions: Permission[]) => (req: Request, res: Response, next: NextFunction) => void;
export declare const requireRole: (roles: AdminRole[]) => (req: Request, res: Response, next: NextFunction) => void;
export declare const optionalAuth: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=auth.d.ts.map