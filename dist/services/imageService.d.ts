export interface UploadResult {
    success: boolean;
    url?: string;
    publicId?: string;
    error?: string;
}
export declare const uploadImage: (file: Express.Multer.File, folder?: string) => Promise<UploadResult>;
export declare const deleteImage: (publicId: string) => Promise<boolean>;
export declare const extractPublicIdFromUrl: (url: string) => string | null;
//# sourceMappingURL=imageService.d.ts.map