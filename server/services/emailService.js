import { Resend } from 'resend';
import dotenv from 'dotenv';
import Appointment from '../models/Appointment.js';
import { generateICS, generateGoogleCalendarLink } from './calendarService.js';
import { confirmationTemplate, reminderTemplate, cancellationTemplate, ownerNotificationTemplate, trialExpirationTemplate } from './emailTemplates.js';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY || 're_mock_key');
const EMAIL_FROM = process.env.EMAIL_FROM;

const fetchPopulatedAppointment = async (appointmentId) => {
  return await Appointment.findById(appointmentId)
    .populate('business')
    .populate('staff')
    .populate('service');
};

export const sendConfirmationEmail = async (appointmentId) => {
  try {
    const appointment = await fetchPopulatedAppointment(appointmentId);
    if (!appointment) throw new Error('Appointment not found');

    const icsString = generateICS(appointment, appointment.business, appointment.service, appointment.staff);
    const googleCalUrl = generateGoogleCalendarLink(appointment, appointment.business, appointment.service);

    const html = confirmationTemplate(appointment, googleCalUrl);

    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_mock_key') {
      console.log(`[Mock Email] Confirmation sent to ${appointment.clientEmail}`);
      return;
    }

    await resend.emails.send({
      from: EMAIL_FROM,
      to: [appointment.clientEmail],
      reply_to: appointment.business.email,
      subject: `Booking confirmed — ${appointment.service.name} at ${appointment.business.name}`,
      html,
      attachments: [
        {
          filename: 'appointment.ics',
          content: Buffer.from(icsString).toString('base64'),
        }
      ]
    });
  } catch (error) {
    console.error('sendConfirmationEmail error:', error);
    throw error;
  }
};

export const sendReminderEmail = async (appointmentId) => {
  try {
    const appointment = await fetchPopulatedAppointment(appointmentId);
    if (!appointment) throw new Error('Appointment not found');

    if (appointment.reminderSent) {
      console.log(`Reminder already sent for ${appointmentId}, skipping.`);
      return;
    }

    if (appointment.status === 'cancelled') {
      console.log(`Appointment ${appointmentId} is cancelled, skipping reminder.`);
      return;
    }

    const html = reminderTemplate(appointment);

    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_mock_key') {
      console.log(`[Mock Email] Reminder sent to ${appointment.clientEmail}`);
    } else {
      await resend.emails.send({
        from: EMAIL_FROM,
        to: [appointment.clientEmail],
        reply_to: appointment.business.email,
        subject: `Reminder — your ${appointment.service.name} is tomorrow`,
        html
      });
    }

    appointment.reminderSent = true;
    await appointment.save();
  } catch (error) {
    console.error('sendReminderEmail error:', error);
    throw error;
  }
};

export const sendCancellationEmail = async (appointmentId) => {
  try {
    const appointment = await fetchPopulatedAppointment(appointmentId);
    if (!appointment) throw new Error('Appointment not found');

    const html = cancellationTemplate(appointment);

    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_mock_key') {
      console.log(`[Mock Email] Cancellation sent to ${appointment.clientEmail}`);
      return;
    }

    await resend.emails.send({
      from: EMAIL_FROM,
      to: [appointment.clientEmail],
      reply_to: appointment.business.email,
      subject: `Your booking has been cancelled — ${appointment.service.name} at ${appointment.business.name}`,
      html
    });
  } catch (error) {
    console.error('sendCancellationEmail error:', error);
    throw error;
  }
};

export const sendOwnerNotificationEmail = async (appointmentId) => {
  try {
    const appointment = await Appointment.findById(appointmentId)
      .populate('business', 'name email notificationEmail address slug timezone')
      .populate('staff', 'name')
      .populate('service', 'name duration price currency');

    if (!appointment) {
      console.warn(`[emailService] Owner notification skipped — appointment ${appointmentId} not found`);
      return;
    }

    const notifyAddress = appointment.business.notificationEmail || appointment.business.email;
    const html = ownerNotificationTemplate(appointment);

    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_mock_key') {
      console.log(`[Mock Email] Owner Notification sent to ${notifyAddress}`);
      return;
    }

    await resend.emails.send({
      from: EMAIL_FROM,
      to: [notifyAddress],
      reply_to: appointment.clientEmail,
      subject: `New booking — ${appointment.clientName} for ${appointment.service.name}`,
      html
    });
  } catch (error) {
    console.error('sendOwnerNotificationEmail error:', error);
    throw error;
  }
};

export const sendTrialExpirationEmail = async (business) => {
  try {
    const daysLeft = 7;
    const html = trialExpirationTemplate(business, daysLeft);

    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_mock_key') {
      console.log(`[Mock Email] Trial expiration warning sent to ${business.email}`);
      return;
    }

    await resend.emails.send({
      from: EMAIL_FROM,
      to: [business.email],
      reply_to: EMAIL_FROM,
      subject: `Action Required: Your Lazie trial expires in ${daysLeft} days`,
      html
    });
    console.log(`[Trials] Warning email strictly sent to ${business.email}`);
  } catch (error) {
    console.error('sendTrialExpirationEmail error:', error);
    // Don't throw so failure on one cron doesn't crash batch
  }
};
