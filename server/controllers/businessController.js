import Business from '../models/Business.js';
import Service from '../models/Service.js';
import Staff from '../models/Staff.js';

export const getBusinessBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const business = await Business.findOne({ slug });
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    const services = await Service.find({ business: business._id, isActive: true });
    const staff = await Staff.find({ business: business._id });

    res.json({
      business,
      services,
      staff
    });
  } catch (error) {
    console.error('Error fetching business:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
