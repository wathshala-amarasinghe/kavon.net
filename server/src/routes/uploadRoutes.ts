import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Create unique filename: fieldname-timestamp.ext
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp|gif|mp4|webm|mov/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Images and Videos only!'));
        }
    }
});

// @route   POST /api/upload
// @desc    Upload an image
// @access  Private/Admin
router.post('/', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
             res.status(400).json({ message: 'No file uploaded' });
             return;
        }
        
        // Return the path to the uploaded file. 
        // We will serve the 'uploads' directory statically at '/uploads'
        const imageUrl = `/uploads/${req.file.filename}`;
        res.json({ url: imageUrl, message: 'Image uploaded successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
