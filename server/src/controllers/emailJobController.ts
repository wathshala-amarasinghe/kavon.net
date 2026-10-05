import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import EmailJob from '../models/EmailJob';
import nodemailer from 'nodemailer';

// Need the same config mechanism as emailService
// Since we don't export getEmailConfig from there easily, we can import dispatchEmail or do it directly.
// But wait, the email is already configured in the job. It's better to just re-dispatch via a minimal local transporter 
// or ideally export a retry function from emailService. Let's do it right here with a local transporter for simplicity,
// or actually, it's much better to just export a retry function from emailService.

import { retryEmailJob } from '../services/emailService';

// @desc    Get all email jobs
// @route   GET /api/email-jobs
// @access  Private/Admin
export const getEmailJobs = async (req: AuthRequest, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 50;
        const status = req.query.status as string;

        let query: any = {};
        if (status && status !== 'all') {
            query.status = status;
        }

        const jobs = await EmailJob.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await EmailJob.countDocuments(query);

        res.json({
            jobs,
            page,
            pages: Math.ceil(total / limit),
            total
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};

// @desc    Retry failed email job
// @route   POST /api/email-jobs/:id/retry
// @access  Private/Admin
export const retryJob = async (req: AuthRequest, res: Response) => {
    try {
        const job = await EmailJob.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ message: 'Email Job not found' });
        }

        if (job.status === 'Sent') {
            return res.status(400).json({ message: 'This email was already sent successfully' });
        }

        await retryEmailJob(job);
        
        res.json({ message: 'Email retried successfully', job });
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};
