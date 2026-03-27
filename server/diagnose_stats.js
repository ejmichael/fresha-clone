import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Appointment from './models/Appointment.js';
import Business from './models/Business.js';
import Service from './models/Service.js';

dotenv.config();

const diagnose = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const businesses = await Business.find();
  if (businesses.length === 0) {
    console.log('No businesses found');
    process.exit(1);
  }

  for (const business of businesses) {
    const businessId = business._id;
    const tz = business.timezone || 'Africa/Johannesburg';
    console.log(`\n--- Business: ${business.name} (${businessId}), Timezone: ${tz} ---`);

    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour12: false
    });
    const parts = formatter.formatToParts(now);
    const getPart = (type) => parts.find(p => p.type === type).value;
    const year = parseInt(getPart('year'));
    const month = parseInt(getPart('month')) - 1;
    const day = parseInt(getPart('day'));

    const startString = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T00:00:00`;
    const endString = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T23:59:59.999`;

    const getZonedDate = (isoString, timeZone) => {
      const date = new Date(isoString);
      const invDate = new Date(date.toLocaleString("en-US", { timeZone }));
      const diff = date.getTime() - invDate.getTime();
      return new Date(date.getTime() + diff);
    };

    const businessTodayStart = getZonedDate(startString, tz);
    const businessTodayEnd = getZonedDate(endString, tz);
    const monthStartString = `${year}-${(month + 1).toString().padStart(2, '0')}-01T00:00:00`;
    const businessMonthStart = getZonedDate(monthStartString, tz);

    console.log(`Today Range: ${businessTodayStart.toISOString()} to ${businessTodayEnd.toISOString()}`);
    console.log(`Month Range: ${businessMonthStart.toISOString()} to ${businessTodayEnd.toISOString()}`);

    const appts = await Appointment.find({
      business: businessId
    }).populate('service');

    console.log(`Total appointments for business: ${appts.length}`);
    
    let revenueMonth = 0;

    appts.forEach(a => {
      const isToday = a.startTime >= businessTodayStart && a.startTime <= businessTodayEnd;
      const isCompletedInMonth = a.status === 'completed' && a.completedAt && a.completedAt >= businessMonthStart && a.completedAt <= businessTodayEnd;
      console.log(`ID: ${a._id}, Start: ${a.startTime.toISOString()}, Status: ${a.status}, CompletedAt: ${a.completedAt?.toISOString()}, Price: ${a.service?.price}, IsToday: ${isToday}, IsCompletedInMonth: ${isCompletedInMonth}`);
      if (isCompletedInMonth) {
        revenueMonth += a.service.price;
      }
    });

    console.log(`Calculated Revenue This Month: ${revenueMonth}`);
  }

  process.exit(0);
};

diagnose().catch(err => {
  console.error(err);
  process.exit(1);
});
