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
  logo: {
    type: String,
    default: null,   // stores Cloudinary URL
  },
  invoicePrefix: {
    type: String,
    default: 'INV',  // e.g. INV-0001
  },
  invoiceNextNumber: {
    type: Number,
    default: 1,      // auto-increments with each invoice
  },
  bankDetails: {
    bankName: { type: String, default: '' },
    accountName: { type: String, default: '' },
    accountNumber: { type: String, default: '' },
    branchCode: { type: String, default: '' },
  },
  operatingHours: [{
    day: { type: Number, min: 0, max: 6 }, // 0=Sun, 6=Sat
    open: String,
    close: String,
    isClosed: { type: Boolean, default: false }
  }],
  subscriptionStatus: {
    type: String,
    enum: ['trialing', 'active', 'past_due', 'canceled'],
    default: 'trialing'
  },
  payfastToken: {
    type: String,
    default: null
  },
  subscriptionExpiresAt: {
    type: Date,
    default: null
  }
});

export default mongoose.model('Business', businessSchema);
