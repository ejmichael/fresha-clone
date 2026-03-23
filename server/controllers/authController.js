import Business from '../models/Business.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateToken = (id, email) => {
  return jwt.sign({ id, email }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '7d',
  });
};

export const register = async (req, res) => {
  try {
    const { email, password, name, slug, category, address, timezone, operatingHours } = req.body;

    if (!email || !password || !name || !slug || !category) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const businessExists = await Business.findOne({ $or: [{ email }, { slug }] });
    if (businessExists) {
      return res.status(400).json({ message: 'Business with that email or slug already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const business = await Business.create({
      name,
      slug,
      email,
      password: hashedPassword,
      category,
      address,
      timezone,
      operatingHours,
      isVerified: false
    });

    if (business) {
      const token = generateToken(business._id, business.email);
      const businessData = business.toObject();
      delete businessData.password;
      
      res.status(201).json({
        token,
        business: businessData
      });
    } else {
      res.status(400).json({ message: 'Invalid business data' });
    }
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const business = await Business.findOne({ email });

    if (business && (await bcrypt.compare(password, business.password))) {
      const token = generateToken(business._id, business.email);
      const businessData = business.toObject();
      delete businessData.password;

      res.json({
        token,
        business: businessData
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

export const getMe = async (req, res) => {
  try {
    const business = await Business.findById(req.business.id).select('-password');
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    // Populate staff and services as requested
    const { default: Staff } = await import('../models/Staff.js');
    const { default: Service } = await import('../models/Service.js');
    
    const staff = await Staff.find({ business: business._id });
    const services = await Service.find({ business: business._id });

    // Assuming we want to return business with its staff and services attached or top level
    const businessData = business.toObject();
    businessData.staff = staff;
    businessData.services = services;

    res.json({ business: businessData });
  } catch (error) {
    console.error('getMe error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
