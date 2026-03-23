import IORedis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

const isPlaceholder = !process.env.REDIS_URL || 
  process.env.REDIS_URL.includes('YOUR_PASSWORD') || 
  process.env.REDIS_URL.includes('YOUR_ENDPOINT');

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
  });
}

export default connection;
