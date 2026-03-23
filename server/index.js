import express from 'express';
import mongoose from 'mongoose';
import './workers/emailWorker.js';
import cors from 'cors';
import dotenv from 'dotenv';
import businessRoutes from './routes/business.js';
import availabilityRoutes from './routes/availability.js';
import bookingRoutes from './routes/bookings.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
  origin: "http://localhost:5173"
}));
app.use(express.json());

import authRoutes from './routes/auth.js';
import dashboardRoutes from './routes/dashboard.js';
import settingsRoutes from './routes/settings.js';

app.use('/api/business', businessRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/settings', settingsRoutes);

import { MongoMemoryServer } from 'mongodb-memory-server';
import Business from './models/Business.js';
import Staff from './models/Staff.js';
import Service from './models/Service.js';

const seedIfEmpty = async () => {
  const count = await Business.countDocuments();
  if (count > 0) return;

  console.log('Seeding initial data into DB...');
  const bcrypt = await import('bcryptjs');
  const salt = await bcrypt.default.genSalt(10);
  const hashedPassword = await bcrypt.default.hash('password123', salt);

  const business = await Business.create({
    name: 'Gloss & Glow Studio',
    slug: 'gloss-and-glow',
    email: 'admin@example.com',
    password: hashedPassword,
    isVerified: true,
    category: 'salon',
    description: 'A premium beauty & wellness studio offering top-tier services in a relaxing environment.',
    address: '123 Wellness Ave, Developer City',
    operatingHours: [
      { day: 0, open: '09:00', close: '17:00', isClosed: true },
      { day: 1, open: '09:00', close: '18:00', isClosed: false },
      { day: 2, open: '09:00', close: '18:00', isClosed: false },
      { day: 3, open: '09:00', close: '18:00', isClosed: false },
      { day: 4, open: '09:00', close: '20:00', isClosed: false },
      { day: 5, open: '09:00', close: '19:00', isClosed: false },
      { day: 6, open: '10:00', close: '16:00', isClosed: false }
    ]
  });

  const staff1 = await Staff.create({
    business: business._id,
    name: 'Elena Rose',
    bio: 'Senior Stylist with 10 years of experience in color and styling.',
    workingHours: [
      { day: 0, start: '09:00', end: '17:00', isOff: true },
      { day: 1, start: '09:00', end: '18:00', isOff: false },
      { day: 2, start: '09:00', end: '18:00', isOff: false },
      { day: 3, start: '09:00', end: '18:00', isOff: false },
      { day: 4, start: '09:00', end: '20:00', isOff: false },
      { day: 5, start: '09:00', end: '19:00', isOff: true },
      { day: 6, start: '10:00', end: '16:00', isOff: false }
    ]
  });

  const staff2 = await Staff.create({
    business: business._id,
    name: 'Marcus Silva',
    bio: 'Master Barber and Grooming Specialist.',
    workingHours: [
      { day: 0, start: '09:00', end: '17:00', isOff: true },
      { day: 1, start: '10:00', end: '18:00', isOff: true },
      { day: 2, start: '10:00', end: '18:00', isOff: false },
      { day: 3, start: '10:00', end: '18:00', isOff: false },
      { day: 4, start: '10:00', end: '20:00', isOff: false },
      { day: 5, start: '10:00', end: '19:00', isOff: false },
      { day: 6, start: '10:00', end: '16:00', isOff: false }
    ]
  });

  await Service.create([
    { business: business._id, name: 'Classic Men\'s Haircut', duration: 45, price: 350, assignedStaff: [staff2._id] },
    { business: business._id, name: 'Signature Blowout & Style', duration: 60, price: 450, assignedStaff: [staff1._id] },
    { business: business._id, name: 'Balayage & Color Correction', duration: 180, price: 1200, assignedStaff: [staff1._id] }
  ]);
  console.log('Seeding complete.');
};

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGO_URI;
    try {
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
      console.log('Connected to local MongoDB');
    } catch (err) {
      console.log('Local MongoDB failed, starting Memory Server...');
      const mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
      console.log('Connected to In-Memory MongoDB');
    }

    await seedIfEmpty();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};

connectDB();
