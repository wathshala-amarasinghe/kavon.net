import Announcement from '../models/Announcement';
import User from '../models/User';
import { sendMarketingEmail, sendOperationalEmail } from '../services/emailService';

// To prevent hitting strict SMTP limits during testing, we limit mass emails
const BATCH_LIMIT = 50;

export const startAnnouncementScheduler = () => {
    // Check every 5 minutes
    setInterval(async () => {
        try {
            const now = new Date();
            // Find scheduled announcements whose startDate is now or in the past
            const announcements = await Announcement.find({
                status: 'scheduled',
                startDate: { $lte: now }
            });

            for (const announcement of announcements) {
                console.log(`[SCHEDULER] Auto-dispatching announcement: ${announcement.title}`);
                
                // If it has email, dispatch emails
                if (announcement.channels.includes('email')) {
                    let query: any = { emailVerified: true };

                    if (announcement.type === 'offer' || announcement.targetAudience === 'consented') {
                        query.marketingEmailConsent = true;
                        query.emailSuppressed = { $ne: true };
                    }

                    const users = await User.find(query).select('name email marketingEmailConsent emailSuppressed').limit(BATCH_LIMIT);
                    
                    let sentCount = 0;
                    for (const user of users) {
                        try {
                            if (announcement.type === 'offer') {
                                await sendMarketingEmail(user, announcement.title, announcement.message, announcement.message);
                            } else {
                                await sendOperationalEmail(user.email, user.name, announcement.title, announcement.message, announcement.message);
                            }
                            sentCount++;
                        } catch (e) {
                            console.error(`[SCHEDULER EMAIL ERROR] to ${user.email}`, e);
                        }
                    }
                    announcement.emailSentCount += sentCount;
                }

                // Activate it
                announcement.status = 'active';
                await announcement.save();
            }
            
            // Also complete active ones that have passed their endDate
            const expiredAnnouncements = await Announcement.find({
                status: 'active',
                endDate: { $lt: now }
            });

            for (const expired of expiredAnnouncements) {
                expired.status = 'completed';
                await expired.save();
                console.log(`[SCHEDULER] Auto-completed announcement: ${expired.title}`);
            }

        } catch (error) {
            console.error('[SCHEDULER ERROR]', error);
        }
    }, 5 * 60 * 1000); // 5 minutes
};
