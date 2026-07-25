import express from 'express';
import { handleBrevoWebhook } from '../controllers/emailWebhookController';

const router = express.Router();

router.post('/brevo', handleBrevoWebhook);

export default router;
