export declare const generateToken: (userId: string) => string;
export declare const verifyToken: (token: string) => any;
export declare const extractUserIdFromToken: (token: string) => string | null;
export declare const isTokenExpired: (token: string) => boolean;
export declare const refreshToken: (userId: string) => string;
export declare const validate: (schema: any, source?: "body" | "query" | "params") => (req: any, res: any, next: any) => void;
//# sourceMappingURL=auth.d.ts.map