import multer from 'multer';
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    }
    else {
        cb(new Error('Only image files are allowed!'));
    }
};
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 20 * 1024 * 1024,
    },
});
export const uploadSingleImage = upload.single('profileImage');
export const uploadMultipleImages = upload.array('images', 20);
export default upload;
//# sourceMappingURL=upload.js.map