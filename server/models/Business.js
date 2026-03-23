import mongoose from 'mongoose';

const businessSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  category: {
    type: String,
    enum: ['salon', 'barbershop', 'spa', 'nail_studio', 'massage', 'other'],
    required: true
  },
  description: String,
  address: String,
  timezone: { type: String, default: 'Africa/Johannesburg' },
  notificationEmail: {
    type: String,
    default: null,
  },
  operatingHours: [{
    day: { type: Number, min: 0, max: 6 }, // 0=Sun, 6=Sat
    open: String,
    close: String,
    isClosed: { type: Boolean, default: false }
  }]
});

export default mongoose.model('Business', businessSchema);
