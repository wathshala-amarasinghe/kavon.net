import express from 'express';
import {
    getAnnouncements,
    getActiveBanners,
    createAnnouncement,
    estimateRecipients,
    sendTestEmail,
    dispatchAnnouncement,
    deleteAnnouncement
} from '../controllers/communicationController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.get('/active-banners', getActiveBanners);

// Admin routes
router.route('/')
    .get(protect, admin, getAnnouncements)
    .post(protect, admin, createAnnouncement);

router.post('/estimate-recipients', protect, admin, estimateRecipients);
router.post('/test-email', protect, admin, sendTestEmail);
router.post('/:id/dispatch', protect, admin, dispatchAnnouncement);
router.delete('/:id', protect, admin, deleteAnnouncement);

export default router;
