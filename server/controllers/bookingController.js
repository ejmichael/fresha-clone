import Appointment from '../models/Appointment.js';
import Business from '../models/Business.js';
import Service from '../models/Service.js';
import Staff from '../models/Staff.js';
import { generateICS, generateGoogleCalendarLink } from '../services/calendarService.js';
import emailQueue from '../queues/emailQueue.js';
import connection from '../config/redis.js';
import { Queue } from 'bullmq';
import { addMinutes, differenceInHours } from 'date-fns';

export const getBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id).populate('business service staff');
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    const calendarUrl = generateGoogleCalendarLink(appointment, appointment.business, appointment.service);

    res.json({
      id: appointment._id,
      status: appointment.status,
      startTime: appointment.startTime,
      // IDs exposed so public pages (reschedule, booking detail) can fetch availability
      businessId: appointment.business._id,
      staffId: appointment.staff._id,
      serviceId: appointment.service._id,
      business: {
        name: appointment.business.name,
        slug: appointment.business.slug,
        address: appointment.business.address
      },
      service: {
        name: appointment.service.name,
        duration: appointment.service.duration,
        price: appointment.service.price,
        currency: appointment.service.currency
      },
      staff: {
        name: appointment.staff.name
      },
      calendarUrl,
      icsDownloadUrl: `/api/bookings/${appointment._id}/ics`
    });
  } catch (error) {
    console.error('Get Booking Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createBooking = async (req, res) => {
  try {
    const { businessId, staffId, serviceId, date, time, clientName, clientEmail, clientPhone } = req.body;

    const business = await Business.findById(businessId);
    if (!business) return res.status(404).json({ message: 'Business not found' });

    const tz = business.timezone || 'Africa/Johannesburg';
    const [hours, minutes] = time.split(':').map(Number);

    // Construct the start time in the business timezone
    // 'date' is YYYY-MM-DD
    const isoString = `${date}T${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;

    const getZonedDate = (isoString, timeZone) => {
      const date = new Date(isoString);
      const invDate = new Date(date.toLocaleString("en-US", { timeZone }));
      const diff = date.getTime() - invDate.getTime();
      return new Date(date.getTime() + diff);
    };

    const startTime = getZonedDate(isoString, tz);

    const service = await Service.findById(serviceId);
    if (!service) return res.status(404).json({ message: 'Service not found' });

    const endTime = addMinutes(startTime, service.duration);

    const hasOverlap = await Appointment.findOne({
      staff: staffId,
      status: 'confirmed',
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
      ]
    });

    if (hasOverlap) {
      return res.status(400).json({ message: 'Time slot is no longer available' });
    }

    const staff = await Staff.findById(staffId);

    const appointment = new Appointment({
      business: businessId,
      staff: staffId,
      service: serviceId,
      clientName,
      clientEmail,
      clientPhone,
      startTime,
      endTime
    });

    await appointment.save();

    // 1. Queue confirmation email immediately 
    await emailQueue.add('confirmation', {
      type: 'confirmation',
      appointmentId: appointment._id.toString(),
    });

    await emailQueue.add('owner_notification', {
      type: 'owner_notification',
      appointmentId: appointment._id.toString(),
    });

    // 2. Schedule 24hr reminder
    const reminderDelay = new Date(appointment.startTime).getTime() - Date.now() - (12 * 60 * 60 * 1000);

    if (reminderDelay > 0) {
      const reminderJob = await emailQueue.add(
        'reminder',
        {
          type: 'reminder',
          appointmentId: appointment._id.toString(),
        },
        { delay: reminderDelay }
      );
      // Store the job ID so we can cancel it if needed
      appointment.reminderJobId = reminderJob.id;
      await appointment.save();
    }

    const calendarUrl = generateGoogleCalendarLink(appointment, business, service);


    res.status(201).json({
      appointment,
      calendarUrl,
      icsDownloadUrl: `/api/bookings/${appointment._id}/ics`
    });

  } catch (error) {
    console.error('Booking Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getICS = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id).populate('business service staff');
    if (!appointment) return res.status(404).json({ message: 'Appointment found' });

    const icsString = generateICS(appointment, appointment.business, appointment.service, appointment.staff);
    if (!icsString) return res.status(500).json({ message: 'Error generating ICS' });

    res.setHeader('Content-Type', 'text/calendar');
    res.setHeader('Content-Disposition', `attachment; filename="appointment-${id}.ics"`);
    res.send(icsString);

  } catch (error) {
    console.error('ICS Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id).populate('business service staff');

    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    if (appointment.status === 'cancelled') return res.status(400).json({ message: 'Already cancelled' });

    const hoursDifference = differenceInHours(new Date(appointment.startTime), new Date());
    if (hoursDifference < 2) {
      return res.status(400).json({ message: 'Too late to cancel. Cancellations must be made at least 2 hours in advance.' });
    }

    appointment.status = 'cancelled';

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

    await appointment.save();

    res.json({ message: 'Booking cancelled successfully', appointment });
  } catch (error) {
    console.error('Cancel Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const reschedulePublicBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, time } = req.body;

    if (!date || !time) return res.status(400).json({ message: 'date and time are required' });

    const appointment = await Appointment.findById(id).populate('service').populate('business');
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    if (appointment.status === 'cancelled') return res.status(400).json({ message: 'This appointment has already been cancelled.' });
    if (appointment.status === 'completed') return res.status(400).json({ message: 'This appointment has already been completed.' });

    const hoursUntil = differenceInHours(new Date(appointment.startTime), new Date());
    if (hoursUntil < 2) {
      return res.status(400).json({ message: 'Too late to reschedule. Changes must be made at least 2 hours before the appointment.' });
    }

    const tz = appointment.business.timezone || 'Africa/Johannesburg';
    const [hours, minutes] = time.split(':').map(Number);
    const isoString = `${date}T${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;

    const getZonedDate = (iso, timeZone) => {
      const d = new Date(iso);
      const invDate = new Date(d.toLocaleString('en-US', { timeZone }));
      return new Date(d.getTime() + (d.getTime() - invDate.getTime()));
    };

    const newStartTime = getZonedDate(isoString, tz);
    const newEndTime = addMinutes(newStartTime, appointment.service.duration);

    const conflict = await Appointment.findOne({
      _id: { $ne: id },
      staff: appointment.staff,
      status: 'confirmed',
      startTime: { $lt: newEndTime },
      endTime: { $gt: newStartTime }
    });
    if (conflict) return res.status(400).json({ message: 'That time slot is no longer available. Please choose another time.' });

    // Cancel the old reminder job
    if (appointment.reminderJobId && connection) {
      const queue = new Queue('emails', { connection });
      const oldJob = await queue.getJob(appointment.reminderJobId);
      if (oldJob) await oldJob.remove();
    }

    appointment.startTime = newStartTime;
    appointment.endTime = newEndTime;
    appointment.reminderSent = false;

    const reminderDelay = newStartTime.getTime() - Date.now() - (12 * 60 * 60 * 1000);
    if (reminderDelay > 0) {
      const newReminder = await emailQueue.add(
        'reminder',
        { type: 'reminder', appointmentId: appointment._id.toString() },
        { delay: reminderDelay }
      );
      appointment.reminderJobId = newReminder.id;
    } else {
      appointment.reminderJobId = null;
    }

    await appointment.save();

    await emailQueue.add('reschedule', {
      type: 'reschedule',
      appointmentId: appointment._id.toString(),
    });

    res.json({ message: 'Appointment rescheduled successfully' });
  } catch (error) {
    console.error('Public reschedule error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
