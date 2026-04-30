import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registerBusiness } from '../api/api';
import { Eye, EyeOff } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'salon',
    address: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { setAuthData } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    
    setLoading(true);
    
    try {
      // Setup some default operating hours for a new business registration
      const defaultHours = [
        { day: 0, open: '09:00', close: '17:00', isClosed: true },
        { day: 1, open: '09:00', close: '18:00', isClosed: false },
        { day: 2, open: '09:00', close: '18:00', isClosed: false },
        { day: 3, open: '09:00', close: '18:00', isClosed: false },
        { day: 4, open: '09:00', close: '20:00', isClosed: false },
        { day: 5, open: '09:00', close: '19:00', isClosed: false },
        { day: 6, open: '10:00', close: '16:00', isClosed: false }
      ];

      // Auto-generate a slug from the name
      const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

      const payload = {
        name: formData.name,
        slug,
        category: formData.category,
        address: formData.address,
        email: formData.email,
        password: formData.password,
        timezone: 'Africa/Johannesburg',
        operatingHours: defaultHours
      };

      const { data } = await registerBusiness(payload);
      setAuthData(data.token, data.business);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-4xl text-lazie-primary tracking-tighter font-logo">
            lazie
          </h2>
          <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
            Register Business
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join our platform to manage your appointments
          </p>
        </div>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-sm">
              <p>{error}</p>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Business Name</label>
            <input name="name" type="text" required onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-lazie-primary focus:border-lazie-primary sm:text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select name="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-lazie-primary focus:border-lazie-primary sm:text-sm">
              <option value="salon">Salon</option>
              <option value="barbershop">Barbershop</option>
              <option value="spa">Spa</option>
              <option value="nail_studio">Nail Studio</option>
              <option value="massage">Massage</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input name="address" type="text" required onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-lazie-primary focus:border-lazie-primary sm:text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input name="email" type="email" required onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-lazie-primary focus:border-lazie-primary sm:text-sm" />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              name="password" 
              type={showPassword ? 'text' : 'password'} 
              required 
              onChange={handleChange} 
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-lazie-primary focus:border-lazie-primary sm:text-sm pr-10" 
            />
            <button
              type="button"
              className="absolute right-3 top-[32px] text-gray-400 hover:text-gray-600 focus:outline-none"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input 
              name="confirmPassword" 
              type={showConfirmPassword ? 'text' : 'password'} 
              required 
              onChange={handleChange} 
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-lazie-primary focus:border-lazie-primary sm:text-sm pr-10" 
            />
            <button
              type="button"
              className="absolute right-3 top-[32px] text-gray-400 hover:text-gray-600 focus:outline-none"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-bold text-gray-900 bg-lazie-primary hover:brightness-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lazie-primary disabled:opacity-50 transition-all uppercase tracking-wide"
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>
        
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link to="/login" className="font-medium text-lazie-dark hover:text-lazie-primary">
            sign in to your existing account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
