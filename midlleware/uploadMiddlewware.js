import multer from 'multer';
import path from 'path';

// 📌 Storage Configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// 📌 Multer Middleware (for two fields: profileImage, coverImage)
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
}).fields([
    { name: 'Company_Logo', maxCount: 1 },
    { name: 'Company_Gov_Docs', maxCount: 1 }
]);

export default upload;
