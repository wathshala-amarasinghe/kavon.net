import express from 'express';
import { 
    getCampaigns, 
    createCampaign, 
    updateCampaign, 
    deleteCampaign 
} from '../controllers/campaignController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', getCampaigns);
router.post('/', protect, admin, createCampaign);
router.put('/:id', protect, admin, updateCampaign);
router.delete('/:id', protect, admin, deleteCampaign);

export default router;
