import cron from 'node-cron';
import Business from '../models/Business.js';
import { sendTrialExpirationEmail } from '../services/emailService.js';

// Setup background cron check that fires once a day at midnight.
// Identifies all 'trialing' users who have precisely 7 days left.
const startCronJobs = () => {
  cron.schedule('0 0 * * *', async () => {
    console.log('[CRON] Sweeping subscriptions for trial expirations...');
    try {
      // Find businesses where trial is expiring in between 7 and 8 days from now
      const in7Days = new Date();
      in7Days.setDate(in7Days.getDate() + 7);
      
      const in8Days = new Date();
      in8Days.setDate(in8Days.getDate() + 8);

      const businesses = await Business.find({
        subscriptionStatus: 'trialing',
        subscriptionExpiresAt: {
          $gte: in7Days,
          $lt: in8Days
        }
      });

      console.log(`[CRON] Found ${businesses.length} businesses with trials expiring in 7 days.`);

      for (const bs of businesses) {
        await sendTrialExpirationEmail(bs);
      }
    } catch (e) {
      console.error('[CRON] Trial sweeper failed:', e);
    }
  });
  console.log('✅ [Worker] Daily cron jobs successfully initialized.');
};

export default startCronJobs;
