import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Appointment from './models/Appointment.js';

dotenv.config();

const backfill = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const result = await Appointment.updateMany(
    { status: 'completed', completedAt: { $exists: false } },
    { $set: { completedAt: new Date() } }
  );

  console.log(`Backfilled ${result.modifiedCount} appointments with completedAt.`);
  process.exit(0);
};

backfill();
