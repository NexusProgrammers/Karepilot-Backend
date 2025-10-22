import { Request, Response } from "express";
export declare const registerAdminUser: (req: Request, res: Response) => Promise<void>;
export declare const loginAdminUser: (req: Request, res: Response) => Promise<void>;
export declare const getAdminProfile: (req: Request, res: Response) => Promise<void>;
export declare const updateAdminProfile: (req: Request, res: Response) => Promise<void>;
export declare const changeAdminPassword: (req: Request, res: Response) => Promise<void>;
export declare const getAllAdminUsers: (req: Request, res: Response) => Promise<void>;
export declare const getAdminUserById: (req: Request, res: Response) => Promise<void>;
export declare const updateAdminUserById: (req: Request, res: Response) => Promise<void>;
export declare const deleteAdminUser: (req: Request, res: Response) => Promise<void>;
export declare const getAdminRolesAndPermissions: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=adminController.d.ts.map