import express from 'express';
import { getEmailJobs, retryJob } from '../controllers/emailJobController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
    .get(protect, admin, getEmailJobs);

router.post('/:id/retry', protect, admin, retryJob);

export default router;
