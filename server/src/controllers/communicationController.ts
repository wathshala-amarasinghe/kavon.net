import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import User from '../models/User';
import Announcement from '../models/Announcement';
import { sendMarketingEmail, sendOperationalEmail } from '../services/emailService';

// To prevent hitting strict SMTP limits during testing, we limit mass emails
const BATCH_LIMIT = 50;

// @desc    Get all announcements
// @route   GET /api/communications
// @access  Private/Admin
export const getAnnouncements = async (req: AuthRequest, res: Response) => {
    try {
        const announcements = await Announcement.find()
            .populate('linkedProductId', 'name images price originalPrice')
            .sort({ createdAt: -1 });
        res.json(announcements);
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};

// @desc    Get active banners for public website
// @route   GET /api/communications/active-banners
// @access  Public
export const getActiveBanners = async (req: Request, res: Response) => {
    try {
        const now = new Date();
        const banners = await Announcement.find({
            status: 'active',
            channels: 'banner',
            startDate: { $lte: now },
            $or: [{ endDate: { $exists: false } }, { endDate: null }, { endDate: { $gte: now } }]
        }).sort({ createdAt: -1 });
        res.json(banners);
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};

// @desc    Create announcement
// @route   POST /api/communications
// @access  Private/Admin
export const createAnnouncement = async (req: AuthRequest, res: Response) => {
    try {
        const { title, message, type, targetAudience, channels, startDate, endDate, status, linkedProductId } = req.body;
        if (!title || !message || !type || !targetAudience || !channels || !startDate) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const announcement = new Announcement({
            title,
            message,
            type,
            targetAudience,
            channels,
            startDate,
            endDate,
            linkedProductId: linkedProductId || undefined,
            status: status || 'draft'
        });

        await announcement.save();
        res.status(201).json(announcement);
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};

// @desc    Estimate recipients
// @route   POST /api/communications/estimate-recipients
// @access  Private/Admin
export const estimateRecipients = async (req: AuthRequest, res: Response) => {
    try {
        const { type, targetAudience } = req.body;
        
        let query: any = { emailVerified: true };

        if (type === 'offer') {
            query.marketingEmailConsent = true;
            query.emailSuppressed = { $ne: true };
        }

        // Simulating 'affected' as all users for now since we don't track region/cohort.
        if (targetAudience === 'consented') {
            query.marketingEmailConsent = true;
            query.emailSuppressed = { $ne: true };
        }

        const count = await User.countDocuments(query);
        // Apply batch limit for safety
        res.json({ count: Math.min(count, BATCH_LIMIT) });
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};

// @desc    Send test email
// @route   POST /api/communications/test-email
// @access  Private/Admin
export const sendTestEmail = async (req: AuthRequest, res: Response) => {
    try {
        const { title, message, type, linkedProductId } = req.body;
        const user = req.user;

        if (!user) return res.status(401).json({ message: 'Not authorized' });

        if (type === 'offer') {
            let product = undefined;
            if (linkedProductId) {
                const mongoose = require('mongoose');
                product = await mongoose.model('Product').findById(linkedProductId).select('name images price originalPrice');
            }
            await sendMarketingEmail(
                { ...user.toObject(), marketingEmailConsent: true, emailSuppressed: false }, 
                title, 
                message, 
                message,
                product
            );
        } else {
            await sendOperationalEmail(user.email, user.name, title, message, message);
        }

        res.json({ message: 'Test email sent successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};

// @desc    Dispatch announcement emails
// @route   POST /api/communications/:id/dispatch
// @access  Private/Admin
export const dispatchAnnouncement = async (req: AuthRequest, res: Response) => {
    try {
        const announcement = await Announcement.findById(req.params.id).populate('linkedProductId', 'name images price originalPrice');
        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        if (!announcement.channels.includes('email')) {
            return res.status(400).json({ message: 'Announcement is not configured for email channel' });
        }

        res.status(202).json({ message: 'Email dispatch initiated in the background' });

        // Fire and forget
        setImmediate(async () => {
            try {
                let query: any = { emailVerified: true };

                if (announcement.type === 'offer' || announcement.targetAudience === 'consented') {
                    query.marketingEmailConsent = true;
                    query.emailSuppressed = { $ne: true };
                }

                const users = await User.find(query).select('name email marketingEmailConsent emailSuppressed').limit(BATCH_LIMIT);
                console.log(`[COMMUNICATIONS] Sending announcement ${announcement.title} to ${users.length} users.`);
                
                let sentCount = 0;
                for (const user of users) {
                    try {
                        if (announcement.type === 'offer') {
                            await sendMarketingEmail(
                                user, 
                                announcement.title, 
                                announcement.message, 
                                announcement.message,
                                announcement.linkedProductId
                            );
                        } else {
                            await sendOperationalEmail(user.email, user.name, announcement.title, announcement.message, announcement.message);
                        }
                        sentCount++;
                    } catch (e) {
                        console.error(`[EMAIL ERROR] to ${user.email}`, e);
                    }
                }

                announcement.emailSentCount += sentCount;
                if (announcement.status === 'draft' || announcement.status === 'scheduled') {
                    announcement.status = 'active';
                }
                await announcement.save();
                console.log(`[COMMUNICATIONS] Announcement dispatch complete.`);
            } catch (error) {
                console.error('[COMMUNICATIONS ERROR] Dispatch:', error);
            }
        });

    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};

// @desc    Delete announcement
// @route   DELETE /api/communications/:id
// @access  Private/Admin
export const deleteAnnouncement = async (req: AuthRequest, res: Response) => {
    try {
        const announcement = await Announcement.findById(req.params.id);
        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }
        await announcement.deleteOne();
        res.json({ message: 'Announcement removed' });
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};
