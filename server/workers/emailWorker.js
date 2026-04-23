import { Worker } from 'bullmq';
import connection from '../config/redis.js';
import { sendConfirmationEmail, sendReminderEmail, sendCancellationEmail, sendOwnerNotificationEmail } from '../services/emailService.js';

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

    if (type === 'cancellation') {
      await sendCancellationEmail(appointmentId);
    }

    if (type === 'owner_notification') {
      await sendOwnerNotificationEmail(appointmentId);
    }

  }, { connection });

  worker.on('completed', (job) => {
    console.log(`Email job ${job.id} (${job.data.type}) completed`);
  });

  worker.on('failed', (job, err) => {
    console.error(`Email job ${job.id} (${job.data.type}) failed:`, err.message);
  });

  worker.on('error', (err) => {
    console.error(`[Worker] Error:`, err.message);
    if (err.message.includes('max requests limit exceeded')) {
      console.log('⚠️ [Worker] Upstash Free Limit Exceeded. Shutting down worker to prevent infinite loops.');
      worker.close();
    }
  });

  console.log('✅ [Worker] Email worker started and connected to Redis.');
} else {
  console.log('⚠️ [Worker] Email worker skipped (No Redis connection).');
}

export default {}; // Export empty if not connected
