import { Resend } from 'resend';
import { contactAdminTemplate, contactConfirmationTemplate } from '../services/emailTemplates.js';
import dotenv from 'dotenv';
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY || 're_mock_key');
const EMAIL_FROM = process.env.EMAIL_FROM;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.EMAIL_FROM;

export const sendContactMessage = async (req, res) => {
  try {
    const { firstName, lastName, email, category, message } = req.body;

    if (!firstName || !email || !message) {
      return res.status(400).json({ message: 'firstName, email, and message are required' });
    }

    const isMock = !process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_mock_key';

    if (isMock) {
      console.log(`[Mock Email] Contact form from ${firstName} ${lastName} <${email}> [${category}]: ${message}`);
    } else {
      // Email to admin
      await resend.emails.send({
        from: EMAIL_FROM,
        to: [ADMIN_EMAIL],
        reply_to: email,
        subject: `[Lazie Contact] ${category} — ${firstName} ${lastName}`,
        html: contactAdminTemplate({ firstName, lastName, email, category, message }),
      });

      // Confirmation to sender
      await resend.emails.send({
        from: EMAIL_FROM,
        to: [email],
        subject: `We received your message — Lazie`,
        html: contactConfirmationTemplate({ firstName }),
      });
    }

    res.json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ message: 'Failed to send message. Please try again.' });
  }
};
