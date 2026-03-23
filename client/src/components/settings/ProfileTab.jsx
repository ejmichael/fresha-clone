import React, { useState } from 'react';
import { updateProfile, updatePassword } from '../../api/api';

const ProfileTab = ({ profile, onProfileUpdate, showToast, token }) => {
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    slug: profile?.slug || '',
    category: profile?.category || 'salon',
    address: profile?.address || '',
    description: profile?.description || '',
    timezone: profile?.timezone || 'Africa/Johannesburg',
    notificationEmail: profile?.notificationEmail || ''
  });
  const [loading, setLoading] = useState(false);

  const [pwData, setPwData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwLoading, setPwLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handlePwChange = (e) => setPwData({ ...pwData, [e.target.name]: e.target.value });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await updateProfile(token, formData);
      onProfileUpdate(data);
      showToast('Profile updated successfully', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (pwData.newPassword !== pwData.confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }
    setPwLoading(true);
    try {
      await updatePassword(token, pwData.currentPassword, pwData.newPassword);
      showToast('Password updated', 'success');
      setPwData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update password', 'error');
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-8">
      {/* Profile Section */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Business Details</h2>
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Login email
              </label>
              <input
                type="email"
                value={profile?.email}
                disabled
                className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed sm:text-sm"
              />
              <p className="text-xs text-gray-400 mt-1">
                This is your login email and cannot be changed here.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notification email
              </label>
              <input
                name="notificationEmail"
                type="email"
                value={formData.notificationEmail}
                onChange={handleChange}
                placeholder={profile?.email}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 sm:text-sm"
              />
              <p className="text-xs text-gray-400 mt-1">
                Booking notifications are sent here. Leave blank to use your login email.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Business Name</label>
              <input name="name" type="text" value={formData.name} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Slug</label>
              <input name="slug" type="text" value={formData.slug} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              <p className="mt-1 text-xs text-gray-500">Your booking link: http://localhost:5173/book/{formData.slug}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                <option value="salon">Salon</option>
                <option value="barbershop">Barbershop</option>
                <option value="spa">Spa</option>
                <option value="nail_studio">Nail Studio</option>
                <option value="massage">Massage</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Timezone</label>
              <select name="timezone" value={formData.timezone} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                <option value="Africa/Johannesburg">Africa/Johannesburg</option>
                <option value="UTC">UTC</option>
                <option value="Europe/London">Europe/London</option>
                <option value="America/New_York">America/New_York</option>
                <option value="America/Los_Angeles">America/Los_Angeles</option>
                <option value="Australia/Sydney">Australia/Sydney</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input name="address" type="text" value={formData.address} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
          </div>

          <div className="flex justify-end pt-2">
            <button type="submit" disabled={loading} className={`py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-70' : ''}`}>
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </section>

      <hr className="border-gray-200" />

      {/* Password Section */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Change Password</h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-sm">
          <div>
            <label className="block text-sm font-medium text-gray-700">Current Password</label>
            <input name="currentPassword" type="password" value={pwData.currentPassword} onChange={handlePwChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">New Password</label>
            <input name="newPassword" type="password" value={pwData.newPassword} onChange={handlePwChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
            <input name="confirmPassword" type="password" value={pwData.confirmPassword} onChange={handlePwChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div className="pt-2">
            <button type="submit" disabled={pwLoading} className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 ${pwLoading ? 'opacity-70' : ''}`}>
              {pwLoading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default ProfileTab;
