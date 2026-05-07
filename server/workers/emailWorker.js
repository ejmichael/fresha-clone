import { Worker } from 'bullmq';
import connection from '../config/redis.js';
import { sendConfirmationEmail, sendRescheduleEmail, sendReminderEmail, sendCancellationEmail, sendOwnerNotificationEmail, sendWelcomeEmail } from '../services/emailService.js';

if (connection) {
  const worker = new Worker('emails', async (job) => {
    const { type, appointmentId } = job.data;
    console.log(`Processing ${type} email for appointment ${appointmentId}`);

    if (type === 'confirmation') {
      await sendConfirmationEmail(appointmentId);
    }

    if (type === 'reminder') {
      await sendReminderEmail(appointmentId);
    }

    if (type === 'reschedule') {
      await sendRescheduleEmail(appointmentId);
    }

    if (type === 'cancellation') {
      await sendCancellationEmail(appointmentId);
    }

    if (type === 'owner_notification') {
      await sendOwnerNotificationEmail(appointmentId);
    }

    if (type === 'welcome') {
      const { businessId } = job.data;
      await sendWelcomeEmail(businessId);
    }

  }, { connection });

  worker.on('completed', (job) => {
    console.log(`Email job ${job.id} (${job.data.type}) completed`);
  });

  worker.on('failed', (job, err) => {
    console.error(`Email job ${job.id} (${job.data.type}) failed:`, err.message);
  });

  worker.on('error', (err) => {
    // Suppress console spam if it's the specific max requests error
    if (err.message.includes('max requests limit exceeded')) {
      console.log('⚠️ [Worker] Upstash Free Limit Exceeded. Pausing worker...');
      worker.pause().catch(() => {});
    } else {
      console.error(`[Worker] Error:`, err.message);
    }
  });

  console.log('✅ [Worker] Email worker started and connected to Redis.');
} else {
  console.log('⚠️ [Worker] Email worker skipped (No Redis connection).');
}

export default {}; // Export empty if not connected
