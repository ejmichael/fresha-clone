import Business from '../models/Business.js';

export const uploadBusinessLogo = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const logoUrl = req.file.path; // Cloudinary URL
    await Business.findByIdAndUpdate(req.business.id, { logo: logoUrl });
    res.json({ logo: logoUrl });
  } catch (err) {
    res.status(500).json({ message: 'Logo upload failed', error: err.message });
  }
};
