import express, { Request, Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import { protect } from '../middleware/authMiddleware';
import { AuthRequest } from '../middleware/authMiddleware';
import User from '../models/User';

const router = express.Router();

const configureCloudinary = () => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true,
    });
};

// @desc    Generate Cloudinary upload signature for avatar
// @route   GET /api/users/avatar/signature
// @access  Private
router.get('/signature', protect, (req: AuthRequest, res: Response) => {
    try {
        if (!process.env.CLOUDINARY_API_SECRET) {
            return res.status(500).json({ message: 'Cloudinary secret missing' });
        }

        configureCloudinary();

        const timestamp = Math.round(new Date().getTime() / 1000);
        // We enforce the folder on the server signature so clients can't upload elsewhere
        const folder = 'kavon/avatars';

        const signature = cloudinary.utils.api_sign_request(
            {
                timestamp,
                folder,
            },
            process.env.CLOUDINARY_API_SECRET
        );

        res.json({
            timestamp,
            signature,
            folder,
            cloudName: process.env.CLOUDINARY_CLOUD_NAME,
            apiKey: process.env.CLOUDINARY_API_KEY,
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Failed to generate signature' });
    }
});

// @desc    Update user avatar (after successful frontend upload)
// @route   PUT /api/users/avatar
// @access  Private
router.put('/', protect, async (req: AuthRequest, res: Response) => {
    try {
        const { avatarUrl, avatarPublicId } = req.body;

        if (!avatarUrl || !avatarPublicId) {
            return res.status(400).json({ message: 'Avatar URL and Public ID are required' });
        }

        const user = await User.findById(req.user?._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // If user already had an avatar, delete it from Cloudinary
        if (user.avatarPublicId && user.avatarPublicId !== avatarPublicId) {
            try {
                configureCloudinary();
                await cloudinary.uploader.destroy(user.avatarPublicId);
            } catch (err) {
                console.error('Failed to delete old avatar from Cloudinary:', err);
                // Continue with update even if deletion fails
            }
        }

        user.avatarUrl = avatarUrl;
        user.avatarPublicId = avatarPublicId;
        user.avatarUpdatedAt = new Date();

        await user.save();

        res.json({
            message: 'Avatar updated successfully',
            avatarUrl: user.avatarUrl,
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Server error' });
    }
});

// @desc    Remove user avatar
// @route   DELETE /api/users/avatar
// @access  Private
router.delete('/', protect, async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.user?._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.avatarPublicId) {
            try {
                configureCloudinary();
                await cloudinary.uploader.destroy(user.avatarPublicId);
            } catch (err) {
                console.error('Failed to delete avatar from Cloudinary:', err);
            }
        }

        user.avatarUrl = undefined;
        user.avatarPublicId = undefined;
        user.avatarUpdatedAt = undefined;

        await user.save();

        res.json({ message: 'Avatar removed successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Server error' });
    }
});

export default router;
