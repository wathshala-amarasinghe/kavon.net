import express, { NextFunction, Request, Response } from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { admin, protect } from "../middleware/authMiddleware";

const router = express.Router();

const allowedMimeTypes = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "video/mp4",
    "video/webm",
    "video/quicktime",
]);

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 4 * 1024 * 1024,
    },
    fileFilter: (_req, file, cb) => {
        if (allowedMimeTypes.has(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only JPG, PNG, WebP, GIF, MP4, WebM and MOV files are allowed"));
        }
    },
});

function uploadToCloudinary(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: "kavon/products",
                resource_type: file.mimetype.startsWith("video/")
                    ? "video"
                    : "image",
            },
            (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }

                if (!result) {
                    reject(new Error("Cloudinary returned no upload result"));
                    return;
                }

                resolve(result.secure_url);
            }
        );

        uploadStream.end(file.buffer);
    });
}

const receiveUpload = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    upload.single("image")(req, res, (error: unknown) => {
        if (!error) {
            next();
            return;
        }

        if (error instanceof multer.MulterError) {
            const message =
                error.code === "LIMIT_FILE_SIZE"
                    ? "File is too large. Maximum upload size is 4 MB"
                    : error.message;

            res.status(400).json({ message });
            return;
        }

        res.status(400).json({
            message:
                error instanceof Error ? error.message : "Invalid upload",
        });
    });
};

// POST /api/upload
router.post("/", protect, admin, receiveUpload, async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({ message: "No file uploaded" });
            return;
        }

        if (
            !process.env.CLOUDINARY_CLOUD_NAME ||
            !process.env.CLOUDINARY_API_KEY ||
            !process.env.CLOUDINARY_API_SECRET
        ) {
            res.status(500).json({
                message: "Cloudinary environment variables are missing",
            });
            return;
        }

        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
            secure: true,
        });

        const url = await uploadToCloudinary(req.file);

        res.json({
            url,
            message: "File uploaded successfully",
        });
    } catch (error: any) {
        console.error("Cloudinary upload error:", error);

        res.status(500).json({
            message: error.message || "File upload failed",
        });
    }
});

export default router;
