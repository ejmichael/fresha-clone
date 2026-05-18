import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  name: { type: String, required: true },
  duration: { type: Number, required: true },
  price: { type: Number, required: true },
  currency: { type: String, default: 'ZAR' },
  assignedStaff: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Staff' }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Service', serviceSchema);
