import { Request, Response } from 'express';
import EmailJob from '../models/EmailJob';
import User from '../models/User';

// @desc    Receive Brevo Webhooks
// @route   POST /api/webhooks/brevo
// @access  Public
export const handleBrevoWebhook = async (req: Request, res: Response) => {
    try {
        // Brevo sends an array or a single object. Usually a single object.
        const events = Array.isArray(req.body) ? req.body : [req.body];

        for (const event of events) {
            const { event: eventType, email, 'message-id': messageId, 'X-Mailin-custom': customHeader } = event;

            // Attempt to find the EmailJob by custom header first, then by messageId
            let job = null;
            
            if (customHeader) {
                try {
                    // Custom headers come as a string, sometimes escaped or JSON
                    const customData = typeof customHeader === 'string' ? JSON.parse(customHeader) : customHeader;
                    if (customData.emailJobId) {
                        job = await EmailJob.findById(customData.emailJobId);
                    }
                } catch (e) {
                    // Ignore parse error
                }
            }

            if (!job && messageId) {
                job = await EmailJob.findOne({ providerMessageId: messageId });
            }

            // Fallback: finding latest sent to this email
            if (!job) {
                job = await EmailJob.findOne({ recipient: email.toLowerCase() }).sort({ createdAt: -1 });
            }

            if (job) {
                // Map Brevo event names to our Enum
                let mappedEvent = job.deliveryEvent;
                switch (eventType) {
                    case 'delivered': mappedEvent = 'Delivered'; break;
                    case 'opened': mappedEvent = 'Opened'; break;
                    case 'click': mappedEvent = 'Clicked'; break;
                    case 'hard_bounce':
                    case 'soft_bounce': mappedEvent = 'Bounced'; break;
                    case 'spam': mappedEvent = 'Spam'; break;
                    case 'unsubscribed': mappedEvent = 'Unsubscribed'; break;
                    case 'invalid_email':
                    case 'blocked':
                    case 'deferred':
                    case 'error': mappedEvent = 'Rejected'; break;
                }

                // Only update if it's a new or higher-priority event 
                // e.g. don't overwrite 'Spam' with 'Opened' if they come out of order
                job.deliveryEvent = mappedEvent;
                await job.save();
            }

            // Reputation Management
            if (['hard_bounce', 'soft_bounce', 'spam', 'unsubscribed', 'invalid_email', 'blocked'].includes(eventType)) {
                await User.findOneAndUpdate(
                    { email: email.toLowerCase() },
                    { 
                        emailSuppressed: true,
                        marketingEmailConsent: false,
                        emailUnsubscribedAt: new Date()
                    }
                );
                console.warn(`[WEBHOOK] Suppressed user ${email} due to event: ${eventType}`);
            }
        }

        res.status(200).json({ received: true });
    } catch (error) {
        console.error('[WEBHOOK ERROR]', error);
        // Always return 200 to prevent retries from provider on non-critical errors
        res.status(200).json({ received: true, error: true });
    }
};
