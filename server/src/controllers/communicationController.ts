import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import User from '../models/User';
import {
    sendNewOfferEmail,
    sendMaintenanceAnnouncementEmail,
    sendSecurityAlertEmail,
    sendTestEmail
} from '../services/emailService';

// To prevent hitting Gmail's strict SMTP limits during testing, we limit mass emails to 50 users for now.
const BATCH_LIMIT = 50;

// @desc    Send Marketing Offer
// @route   POST /api/communications/offer
// @access  Private/Admin
export const sendMarketingOffer = async (req: AuthRequest, res: Response) => {
    try {
        const { title, detailsHtml, linkUrl } = req.body;
        if (!title || !detailsHtml || !linkUrl) {
            return res.status(400).json({ message: 'Title, details HTML, and link URL are required.' });
        }

        // Return early so the admin UI doesn't hang
        res.status(202).json({ message: 'Marketing offer dispatch initiated in the background.' });

        // Fire and forget logic
        setImmediate(async () => {
            try {
                // Fetch verified users up to limit
                const users = await User.find({ emailVerified: true }).select('name email').limit(BATCH_LIMIT);
                console.log(`[COMMUNICATIONS] Sending Marketing Offer to ${users.length} users.`);
                for (const user of users) {
                    await sendNewOfferEmail(user.email, user.name, title, detailsHtml, linkUrl).catch(e => console.error(`[EMAIL ERROR] to ${user.email}`, e));
                }
                console.log(`[COMMUNICATIONS] Marketing Offer dispatch complete.`);
            } catch (error) {
                console.error('[COMMUNICATIONS ERROR] Marketing Offer:', error);
            }
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};

// @desc    Send Maintenance Notice
// @route   POST /api/communications/maintenance
// @access  Private/Admin
export const sendMaintenanceNotice = async (req: AuthRequest, res: Response) => {
    try {
        const { date, details } = req.body;
        if (!date || !details) {
            return res.status(400).json({ message: 'Maintenance date and details are required.' });
        }

        res.status(202).json({ message: 'Maintenance notice dispatch initiated in the background.' });

        setImmediate(async () => {
            try {
                const users = await User.find({ emailVerified: true }).select('name email').limit(BATCH_LIMIT);
                console.log(`[COMMUNICATIONS] Sending Maintenance Notice to ${users.length} users.`);
                for (const user of users) {
                    await sendMaintenanceAnnouncementEmail(user.email, user.name, date, details).catch(e => console.error(`[EMAIL ERROR] to ${user.email}`, e));
                }
                console.log(`[COMMUNICATIONS] Maintenance Notice dispatch complete.`);
            } catch (error) {
                console.error('[COMMUNICATIONS ERROR] Maintenance Notice:', error);
            }
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};

// @desc    Send Security Alert
// @route   POST /api/communications/security
// @access  Private/Admin
export const sendSecurityAlert = async (req: AuthRequest, res: Response) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ message: 'Security alert message is required.' });
        }

        res.status(202).json({ message: 'Security alert dispatch initiated in the background.' });

        setImmediate(async () => {
            try {
                const users = await User.find({ emailVerified: true }).select('name email').limit(BATCH_LIMIT);
                console.log(`[COMMUNICATIONS] Sending Security Alert to ${users.length} users.`);
                for (const user of users) {
                    await sendSecurityAlertEmail(user.email, user.name, message).catch(e => console.error(`[EMAIL ERROR] to ${user.email}`, e));
                }
                console.log(`[COMMUNICATIONS] Security Alert dispatch complete.`);
            } catch (error) {
                console.error('[COMMUNICATIONS ERROR] Security Alert:', error);
            }
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};

// @desc    Send Test Email
// @route   POST /api/communications/test
// @access  Private/Admin
export const sendAdminTestEmail = async (req: AuthRequest, res: Response) => {
    try {
        const adminUser = await User.findById(req.user?._id);
        if (!adminUser) {
            return res.status(404).json({ message: 'Admin user not found' });
        }

        await sendTestEmail(adminUser.email);
        res.json({ message: `Test email successfully sent to ${adminUser.email}` });
    } catch (error: any) {
        console.error('[COMMUNICATIONS ERROR] Admin Test Email:', error);
        res.status(500).json({ message: error.message || 'Failed to send test email' });
    }
};
