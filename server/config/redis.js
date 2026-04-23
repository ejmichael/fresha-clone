import IORedis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

const redUrl = process.env.REDIS_URL || '';
const isPlaceholder = !redUrl || 
  redUrl.includes('YOUR_PASSWORD') || 
  redUrl.includes('YOUR_ENDPOINT') ||
  // Force disable Upstash locally to prevent the loop, as dotenv might not overwrite cached shell variables
  (redUrl.includes('upstash') && process.env.NODE_ENV !== 'production');

if (isPlaceholder) {
  console.log('⚠️ [Redis] Placeholder credentials detected. Job queue will not be active.');
  console.log('⚠️ [Redis] Please update REDIS_URL in .env to enable Transactional Emails.');
}

const connection = isPlaceholder ? null : new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

if (connection) {
  connection.on('connect', () => console.log('Redis connected'));
  connection.on('error', (err) => {
    // Only log if it's not a DNS failure on a clear placeholder (though we handled that above)
    console.error('Redis error:', err.message);
    if (err.message.includes('max requests limit exceeded')) {
      console.log('⚠️ [Redis] Upstash Free Limit Exceeded. Automatically disconnecting to prevent endless loops.');
      // Disconnect immediately to stop BullMQ from spamming and crashing the terminal
      connection.disconnect();
    }
  });
}

export default connection;
