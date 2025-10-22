"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractPublicIdFromUrl = exports.deleteImage = exports.uploadImage = void 0;
const cloudinaryConfig_1 = __importDefault(require("../config/cloudinaryConfig"));
const uploadImage = async (file, folder = 'profile-images') => {
    try {
        const base64String = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        const result = await cloudinaryConfig_1.default.uploader.upload(base64String, {
            folder: folder,
            resource_type: 'image',
            transformation: [
                { width: 500, height: 500, crop: 'fill', gravity: 'face' },
                { quality: 'auto', fetch_format: 'auto' }
            ]
        });
        return {
            success: true,
            url: result.secure_url,
            publicId: result.public_id
        };
    }
    catch (error) {
        console.error('Cloudinary upload error:', error);
        return {
            success: false,
            error: error.message || 'Failed to upload image'
        };
    }
};
exports.uploadImage = uploadImage;
const deleteImage = async (publicId) => {
    try {
        await cloudinaryConfig_1.default.uploader.destroy(publicId);
        return true;
    }
    catch (error) {
        console.error('Cloudinary delete error:', error);
        return false;
    }
};
exports.deleteImage = deleteImage;
const extractPublicIdFromUrl = (url) => {
    try {
        const parts = url.split('/');
        const filename = parts.length > 0 ? parts[parts.length - 1] : undefined;
        if (!filename)
            return null;
        const publicId = filename.split('.')[0];
        return publicId || null;
    }
    catch (error) {
        return null;
    }
};
exports.extractPublicIdFromUrl = extractPublicIdFromUrl;
//# sourceMappingURL=imageService.js.map