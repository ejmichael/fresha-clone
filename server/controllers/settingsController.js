import Business from '../models/Business.js';
import Service from '../models/Service.js';
import Staff from '../models/Staff.js';
import Appointment from '../models/Appointment.js';
import bcrypt from 'bcryptjs';

export const getProfile = async (req, res) => {
  try {
    const business = await Business.findById(req.business.id).select('-password');
    if (!business) return res.status(404).json({ message: 'Business not found' });
    res.json(business);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, slug, category, address, description, timezone, notificationEmail } = req.body;

    if (slug) {
      const existing = await Business.findOne({ slug, _id: { $ne: req.business.id } });
      if (existing) {
        return res.status(400).json({ message: 'Slug is already taken by another business' });
      }
    }

    const business = await Business.findOneAndUpdate(
      { _id: req.business.id },
      {
        name,
        slug,
        category,
        address,
        description,
        timezone,
        notificationEmail: notificationEmail || null,
      },
      { returnDocument: 'after' }
    ).select('-password');

    res.json(business);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateHours = async (req, res) => {
  try {
    const { operatingHours } = req.body;
    if (!Array.isArray(operatingHours) || operatingHours.length !== 7) {
      return res.status(400).json({ message: 'Operating hours must be an array of 7 days' });
    }

    const business = await Business.findByIdAndUpdate(
      req.business.id,
      { operatingHours },
      { returnDocument: 'after' }
    );
    res.json(business.operatingHours);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const business = await Business.findById(req.business.id);

    const isMatch = await bcrypt.compare(currentPassword, business.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    business.password = await bcrypt.hash(newPassword, salt);
    await business.save();

    res.json({ message: 'Password updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getServices = async (req, res) => {
  try {
    const services = await Service.find({ business: req.business.id }).sort({ name: 1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createService = async (req, res) => {
  try {
    const { name, duration, price, currency = 'ZAR', category = '', assignedStaff } = req.body;
    if (!name || !duration || !price) {
      return res.status(400).json({ message: 'Name, duration, and price are required' });
    }
    if (duration % 15 !== 0 || duration <= 0) {
      return res.status(400).json({ message: 'Duration must be a positive multiple of 15' });
    }
    if (price <= 0) {
      return res.status(400).json({ message: 'Price must be a positive number' });
    }

    const service = await Service.create({
      business: req.business.id,
      name,
      duration,
      price,
      currency,
      category,
      assignedStaff: assignedStaff || []
    });
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, duration, price, currency, category, assignedStaff } = req.body;

    const service = await Service.findOneAndUpdate(
      { _id: id, business: req.business.id },
      { name, duration, price, currency, category, assignedStaff },
      { returnDocument: 'after' }
    );
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const toggleServiceActive = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findOne({ _id: id, business: req.business.id });
    if (!service) return res.status(404).json({ message: 'Service not found' });

    service.isActive = !service.isActive;
    await service.save();
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const upcoming = await Appointment.findOne({
      service: id,
      business: req.business.id,
      status: 'confirmed',
      startTime: { $gt: new Date() }
    });

    if (upcoming) {
      return res.status(400).json({ message: 'Cannot delete a service with upcoming bookings. Deactivate it instead.' });
    }

    const service = await Service.findOneAndDelete({ _id: id, business: req.business.id });
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json({ message: 'Service deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getStaff = async (req, res) => {
  try {
    const staff = await Staff.find({ business: req.business.id });
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createStaff = async (req, res) => {
  try {
    const { name, bio, workingHours } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });

    let finalHours = workingHours;
    if (!finalHours || !Array.isArray(finalHours) || finalHours.length !== 7) {
      const business = await Business.findById(req.business.id);
      finalHours = business.operatingHours.map(d => ({
        day: d.day,
        start: d.open || '09:00',
        end: d.close || '17:00',
        isOff: d.isClosed
      }));
    }

    const staff = await Staff.create({
      business: req.business.id,
      name,
      bio,
      workingHours: finalHours
    });
    res.status(201).json(staff);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, bio, workingHours } = req.body;

    const staff = await Staff.findOneAndUpdate(
      { _id: id, business: req.business.id },
      { name, bio, workingHours },
      { returnDocument: 'after' }
    );
    if (!staff) return res.status(404).json({ message: 'Staff member not found' });
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const upcoming = await Appointment.findOne({
      staff: id,
      business: req.business.id,
      status: 'confirmed',
      startTime: { $gt: new Date() }
    });

    if (upcoming) {
      return res.status(400).json({ message: 'Cannot delete a staff member with upcoming bookings.' });
    }

    const staff = await Staff.findOneAndDelete({ _id: id, business: req.business.id });
    if (!staff) return res.status(404).json({ message: 'Staff not found' });

    await Service.updateMany(
      { business: req.business.id },
      { $pull: { assignedStaff: id } }
    );

    res.json({ message: 'Staff deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
