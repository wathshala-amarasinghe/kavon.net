import express from 'express';
import { 
    getCoupons, 
    createCoupon, 
    updateCoupon, 
    deleteCoupon,
    validateCoupon
} from '../controllers/couponController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', protect, admin, getCoupons);
router.post('/', protect, admin, createCoupon);
router.post('/validate', validateCoupon);
router.put('/:id', protect, admin, updateCoupon);
router.delete('/:id', protect, admin, deleteCoupon);

export default router;
