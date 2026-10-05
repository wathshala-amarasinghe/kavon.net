import express from 'express';
import { getFeaturedReviews, getProductReviews, createReview, deleteReview } from '../controllers/reviewController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/featured', getFeaturedReviews);
router.get('/:productId', getProductReviews);
router.post('/', protect, createReview);
router.delete('/:id', protect, admin, deleteReview);

export default router;
