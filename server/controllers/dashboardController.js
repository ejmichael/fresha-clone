import Appointment from '../models/Appointment.js';
import Business from '../models/Business.js';
import emailQueue from '../queues/emailQueue.js';
import { Queue } from 'bullmq';
import connection from '../config/redis.js';
import { autoCreateFromAppointment } from './invoiceController.js';

export const getAppointments = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) return res.status(400).json({ message: 'startDate and endDate required' });

    const businessId = req.business.id;

    const appointments = await Appointment.find({
      business: businessId,
      startTime: { $gte: new Date(startDate), $lte: new Date(endDate) }
    })
      .populate('staff', 'name')
      .populate('service', 'name duration price')
      .sort({ startTime: 1 });

    res.json(appointments);
  } catch (error) {
    console.error('getAppointments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const businessId = req.business.id;

    const appointment = await Appointment.findOne({ _id: id, business: businessId })
      .populate('staff', 'name')
      .populate('service', 'name duration price currency');

    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    res.json(appointment);
  } catch (error) {
    console.error('getAppointmentById error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const businessId = req.business.id;

    if (!['confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updateData = { status };
    if (status === 'completed') {
      updateData.completedAt = new Date();
    } else {
      updateData.$unset = { completedAt: 1 };
    }

    const appointment = await Appointment.findOneAndUpdate(
      { _id: id, business: businessId },
      updateData,
      { returnDocument: 'after' }
    )
      .populate('staff', 'name')
      .populate('service', 'name duration price currency');

    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    if (status === 'cancelled') {
      // Cancel the pending reminder job if it exists
      if (appointment.reminderJobId && connection) {
        const queue = new Queue('emails', { connection });
        const reminderJob = await queue.getJob(appointment.reminderJobId);
        if (reminderJob) {
          await reminderJob.remove();
        }
      }

      // Queue cancellation email
      await emailQueue.add('cancellation', {
        type: 'cancellation',
        appointmentId: appointment._id.toString(),
      });
    }

    // Auto-create draft invoice when appointment is completed
    if (status === 'completed') {
      try {
        await autoCreateFromAppointment(appointment._id);
      } catch (err) {
        console.warn('[Dashboard] Auto invoice creation failed:', err.message);
      }
    }

    res.json(appointment);
  } catch (error) {
    console.error('updateAppointmentStatus error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getTodayStats = async (req, res) => {
  try {
    const businessId = req.business.id;
    const business = await Business.findById(businessId);
    if (!business) return res.status(404).json({ message: 'Business not found' });

    const tz = business.timezone || 'Africa/Johannesburg';

    // Get "Now" in the business timezone
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });

    const parts = formatter.formatToParts(now);
    const getPart = (type) => parts.find(p => p.type === type).value;

    // Construct local midnight in the target timezone
    const year = parseInt(getPart('year'));
    const month = parseInt(getPart('month')) - 1;
    const day = parseInt(getPart('day'));

    // Start of day in local business time
    const localStart = new Date(year, month, day, 0, 0, 0, 0);
    // End of day in local business time
    const localEnd = new Date(year, month, day, 23, 59, 59, 999);

    // However, JS Date(y, m, d) uses system local time. 
    // To get the UTC range that corresponds to "today" in the business timezone:
    // We can use the timezone offset.

    const getOffset = (date, timezone) => {
      const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
      const tzDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
      return (utcDate.getTime() - tzDate.getTime()) / 60000;
    };

    // More reliably:
    const startString = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T00:00:00`;
    const endString = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T23:59:59.999`;

    // For better reliability with plain JS without date-fns-tz:
    const getZonedDate = (isoString, timeZone) => {
      const date = new Date(isoString);
      const invDate = new Date(date.toLocaleString("en-US", { timeZone }));
      const diff = date.getTime() - invDate.getTime();
      return new Date(date.getTime() + diff);
    };

    const businessTodayStart = getZonedDate(startString, tz);
    const businessTodayEnd = getZonedDate(endString, tz);

    console.log(`[Stats Debug] Business: ${business.name} (${tz})`);
    console.log(`[Stats Debug] Local Now (Server): ${now.toISOString()}`);
    // Month start in local business time
    const monthStartString = `${year}-${(month + 1).toString().padStart(2, '0')}-01T00:00:00`;
    const businessMonthStart = getZonedDate(monthStartString, tz);

    console.log(`[Stats Debug] Month Range: ${businessMonthStart.toISOString()} to ${businessTodayEnd.toISOString()}`);

    // Query for "Today" stats (scheduled counts)
    const todayAppointments = await Appointment.find({
      business: businessId,
      startTime: { $gte: businessTodayStart, $lte: businessTodayEnd }
    }).populate('service', 'price');

    // Query for "Monthly" revenue (completed in month)
    const monthlyAppointments = await Appointment.find({
      business: businessId,
      status: 'completed',
      completedAt: { $gte: businessMonthStart, $lte: businessTodayEnd }
    }).populate('service', 'price');

    console.log(`[Stats Debug] Today Appointments found: ${todayAppointments.length}`);
    console.log(`[Stats Debug] Monthly Completed Appointments: ${monthlyAppointments.length}`);

    let totalToday = todayAppointments.length;
    let confirmedToday = 0;
    let completedToday = 0;
    let cancelledToday = 0;
    let revenueToday = 0;
    let revenueMonth = 0;

    todayAppointments.forEach(appt => {
      if (appt.status === 'confirmed') confirmedToday++;
      if (appt.status === 'completed') completedToday++;
      if (appt.status === 'cancelled') cancelledToday++;
    });

    monthlyAppointments.forEach(appt => {
      if (appt.service && typeof appt.service.price === 'number') {
        revenueMonth += appt.service.price;
        
        // If it was completed TODAY, also add to today's revenue (optional, but keep for debug)
        if (appt.completedAt >= businessTodayStart && appt.completedAt <= businessTodayEnd) {
          revenueToday += appt.service.price;
        }
      }
    });

    res.json({
      totalToday,
      confirmedToday,
      completedToday,
      cancelledToday,
      revenueToday,
      revenueMonth,
      debug: {
        tz,
        rangeToday: [businessTodayStart.toISOString(), businessTodayEnd.toISOString()],
        rangeMonth: [businessMonthStart.toISOString(), businessTodayEnd.toISOString()]
      }
    });
  } catch (error) {
    console.error('getTodayStats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
