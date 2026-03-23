import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Business from './models/Business.js';
import Staff from './models/Staff.js';
import Service from './models/Service.js';
import Appointment from './models/Appointment.js';

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fresha-clone');
    console.log('Connected to DB');

    await Business.deleteMany();
    await Staff.deleteMany();
    await Service.deleteMany();
    await Appointment.deleteMany();

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
      address: '123 Wellness Ave, Developer City, DC 10001',
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
      {
        business: business._id,
        name: 'Classic Men\'s Haircut',
        duration: 45,
        price: 350,
        assignedStaff: [staff2._id]
      },
      {
        business: business._id,
        name: 'Signature Blowout & Style',
        duration: 60,
        price: 450,
        assignedStaff: [staff1._id]
      },
      {
        business: business._id,
        name: 'Balayage & Color Correction',
        duration: 180,
        price: 1200,
        assignedStaff: [staff1._id]
      }
    ]);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDB();
