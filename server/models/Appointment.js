import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  staff: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  clientName: { type: String, required: true },
  clientEmail: { type: String, required: true },
  clientPhone: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  status: { type: String, enum: ['confirmed', 'cancelled', 'completed'], default: 'confirmed' },
  calendarEventId: String,
  reminderSent: { type: Boolean, default: false },
  reminderJobId: { type: String, default: null },
  completedAt: { type: Date, default: null }
}, { timestamps: true });

export default mongoose.model('Appointment', appointmentSchema);
