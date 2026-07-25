import express from 'express';
import { 
    sendMarketingOffer, 
    sendMaintenanceNotice, 
    sendSecurityAlert, 
    sendAdminTestEmail 
} from '../controllers/communicationController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/offer', protect, admin, sendMarketingOffer);
router.post('/maintenance', protect, admin, sendMaintenanceNotice);
router.post('/security', protect, admin, sendSecurityAlert);
router.post('/test', protect, admin, sendAdminTestEmail);

export default router;
