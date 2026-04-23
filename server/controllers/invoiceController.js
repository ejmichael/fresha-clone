import Invoice from '../models/Invoice.js';
import Business from '../models/Business.js';
import Appointment from '../models/Appointment.js';
import { generateInvoicePDF } from '../services/pdfService.js';
import { Resend } from 'resend';
import { invoiceEmailTemplate } from '../services/emailTemplates.js';
import dotenv from 'dotenv';

dotenv.config();
const resend = new Resend(process.env.RESEND_API_KEY || 're_mock_key');

export const getInvoices = async (req, res) => {
  try {
    const { status, page = 1, limit = 20, appointmentId } = req.query;
    const filter = { business: req.business.id };
    if (status) filter.status = status;
    if (appointmentId) filter.appointment = appointmentId;

    const skip = (page - 1) * limit;
    const invoices = await Invoice.find(filter)
      .populate('appointment', 'startTime')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Invoice.countDocuments(filter);

    res.json({
      invoices,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ _id: req.params.id, business: req.business.id })
      .populate('business', 'name address logo bankDetails invoicePrefix')
      .populate('appointment');
    
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const createInvoice = async (req, res) => {
  try {
    const business = await Business.findById(req.business.id);
    const { appointmentId, clientName, clientEmail, clientPhone, lineItems: bodyLineItems, taxRate = 0, dueDate, notes, currency = 'ZAR' } = req.body;

    let lineItems = bodyLineItems || [];
    
    if (appointmentId && lineItems.length === 0) {
      const appointment = await Appointment.findById(appointmentId).populate('service');
      if (appointment) {
        lineItems = [{
          description: appointment.service.name,
          quantity: 1,
          unitPrice: appointment.service.price,
          total: appointment.service.price
        }];
      }
    }

    const subtotal = lineItems.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
    const taxAmount = (subtotal * taxRate) / 100;
    const total = subtotal + taxAmount;

    const invoiceNumber = `${business.invoicePrefix}-${String(business.invoiceNextNumber).padStart(4, '0')}`;

    const invoice = await Invoice.create({
      business: req.business.id,
      appointment: appointmentId,
      invoiceNumber,
      clientName,
      clientEmail,
      clientPhone,
      lineItems,
      subtotal,
      taxRate,
      taxAmount,
      total,
      currency,
      dueDate,
      notes
    });

    business.invoiceNextNumber += 1;
    await business.save();

    res.status(201).json(invoice);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ _id: req.params.id, business: req.business.id });
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    if (invoice.status !== 'draft') return res.status(400).json({ message: 'Only draft invoices can be updated' });

    const { clientName, clientEmail, clientPhone, lineItems, taxRate, dueDate, notes, currency } = req.body;

    if (clientName) invoice.clientName = clientName;
    if (clientEmail) invoice.clientEmail = clientEmail;
    if (clientPhone) invoice.clientPhone = clientPhone;
    if (lineItems) invoice.lineItems = lineItems;
    if (taxRate !== undefined) invoice.taxRate = taxRate;
    if (dueDate) invoice.dueDate = dueDate;
    if (notes) invoice.notes = notes;
    if (currency) invoice.currency = currency;

    invoice.subtotal = invoice.lineItems.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
    invoice.taxAmount = (invoice.subtotal * invoice.taxRate) / 100;
    invoice.total = invoice.subtotal + invoice.taxAmount;

    await invoice.save();
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const sendInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ _id: req.params.id, business: req.business.id }).populate('business');
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    if (invoice.status === 'cancelled') return res.status(400).json({ message: 'Cannot send a cancelled invoice' });

    const pdfBuffer = await generateInvoicePDF(invoice);

    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_mock_key') {
      console.log(`[Mock Email] Sending invoice ${invoice.invoiceNumber} to ${invoice.clientEmail}`);
    } else {
      await resend.emails.send({
        from: process.env.EMAIL_FROM,
        to: [invoice.clientEmail],
        reply_to: invoice.business.email,
        subject: `Invoice ${invoice.invoiceNumber} from ${invoice.business.name}`,
        html: invoiceEmailTemplate(invoice, invoice.business),
        attachments: [
          {
            filename: `${invoice.invoiceNumber}.pdf`,
            content: pdfBuffer.toString('base64'),
          }
        ]
      });
    }

    invoice.status = 'sent';
    invoice.sentAt = new Date();
    await invoice.save();

    res.json(invoice);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const downloadInvoicePDF = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ _id: req.params.id, business: req.business.id })
      .populate('business')
      .populate('appointment');
    
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

    const pdfBuffer = await generateInvoicePDF(invoice);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${invoice.invoiceNumber}.pdf"`);
    res.send(pdfBuffer);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const updateInvoiceStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['paid', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status update' });
    }

    const invoice = await Invoice.findOne({ _id: req.params.id, business: req.business.id });
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

    invoice.status = status;
    if (status === 'paid') invoice.paidAt = new Date();
    
    await invoice.save();
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ _id: req.params.id, business: req.business.id });
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    if (invoice.status !== 'draft') {
      return res.status(400).json({ message: 'Only draft invoices can be deleted. Cancel it instead.' });
    }

    await Invoice.findByIdAndDelete(req.params.id);
    res.json({ message: 'Invoice deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const autoCreateFromAppointment = async (appointmentId) => {
  const appointment = await Appointment.findById(appointmentId).populate('business service');
  if (!appointment) throw new Error('Appointment not found');

  const business = appointment.business;
  const invoiceNumber = `${business.invoicePrefix}-${String(business.invoiceNextNumber).padStart(4, '0')}`;

  const lineItems = [{
    description: appointment.service.name,
    quantity: 1,
    unitPrice: appointment.service.price,
    total: appointment.service.price
  }];

  const subtotal = appointment.service.price;
  const taxRate = 0; // default for auto-creation
  const taxAmount = 0;
  const total = subtotal;

  const invoice = await Invoice.create({
    business: business._id,
    appointment: appointmentId,
    invoiceNumber,
    clientName: appointment.clientName,
    clientEmail: appointment.clientEmail,
    clientPhone: appointment.clientPhone,
    lineItems,
    subtotal,
    taxRate,
    taxAmount,
    total,
    currency: appointment.service.currency || 'ZAR'
  });

  business.invoiceNextNumber += 1;
  await business.save();

  return invoice;
};
