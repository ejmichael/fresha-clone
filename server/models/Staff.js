import mongoose from 'mongoose';

const staffSchema = new mongoose.Schema({
  business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  name: { type: String, required: true },
  bio: String,
  workingHours: [{
    day: { type: Number, min: 0, max: 6 },
    start: String,
    end: String,
    isOff: { type: Boolean, default: false }
  }]
}, { timestamps: true });

export default mongoose.model('Staff', staffSchema);
