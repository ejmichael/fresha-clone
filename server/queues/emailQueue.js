import { Queue } from 'bullmq';
import connection from '../config/redis.js';

let emailQueue;

if (connection) {
  emailQueue = new Queue('emails', { connection });
} else {
  // Mock queue for development without Redis
  emailQueue = {
    add: async (name, data) => {
      console.log(`[Mock Queue] Job '${name}' added with data:`, data);
      return { id: 'mock-id' };
    },
    getJob: async () => null
  };
}

export default emailQueue;
