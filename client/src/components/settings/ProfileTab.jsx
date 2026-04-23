import React, { useState } from 'react';
import { updateProfile, updatePassword, uploadLogo } from '../../api/api';

const ProfileTab = ({ profile, onProfileUpdate, showToast }) => {
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    slug: profile?.slug || '',
    category: profile?.category || 'salon',
    address: profile?.address || '',
    description: profile?.description || '',
    timezone: profile?.timezone || 'Africa/Johannesburg',
    notificationEmail: profile?.notificationEmail || '',
    invoicePrefix: profile?.invoicePrefix || 'INV',
    taxRate: profile?.taxRate || 0,
    bankDetails: {
      bankName: profile?.bankDetails?.bankName || '',
      accountName: profile?.bankDetails?.accountName || '',
      accountNumber: profile?.bankDetails?.accountNumber || '',
      branchCode: profile?.bankDetails?.branchCode || '',
    }
  });
  const [loading, setLoading] = useState(false);

  const [pwData, setPwData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwLoading, setPwLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('bankDetails.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        bankDetails: { ...formData.bankDetails, [field]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  const handlePwChange = (e) => setPwData({ ...pwData, [e.target.name]: e.target.value });

  const [logoUploading, setLogoUploading] = useState(false);

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const uploadData = new FormData();
    uploadData.append('logo', file);
    setLogoUploading(true);
    try {
      const { data } = await uploadLogo(uploadData);
      onProfileUpdate({ ...profile, logo: data.logo });
      showToast('Logo uploaded successfully', 'success');
    } catch (err) {
      showToast('Failed to upload logo', 'error');
    } finally {
      setLogoUploading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await updateProfile(formData);
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
      await updatePassword(pwData.currentPassword, pwData.newPassword);
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
          {/* Logo upload section */}
          <div className="flex items-center gap-6 pb-4 border-b border-gray-100 mb-4">
            <div className="w-20 h-20 rounded-xl border-2 border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center flex-shrink-0">
              {profile?.logo
                ? <img src={profile.logo} alt="Business logo" className="w-full h-full object-contain p-1" />
                : <span className="text-2xl text-gray-300">logo</span>
              }
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Business logo</p>
              <p className="text-xs text-gray-400 mb-3">Appears on your invoices. PNG, JPG or SVG. Max 5MB.</p>
              <label className="cursor-pointer inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                {logoUploading ? 'Uploading...' : profile?.logo ? 'Change logo' : 'Upload logo'}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoUpload}
                  disabled={logoUploading}
                />
              </label>
            </div>
          </div>

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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lazie-primary sm:text-sm"
              />
              <p className="text-xs text-gray-400 mt-1">
                Booking notifications are sent here. Leave blank to use your login email.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Business Name</label>
              <input name="name" type="text" value={formData.name} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-lazie-primary focus:border-lazie-primary sm:text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Slug</label>
              <input name="slug" type="text" value={formData.slug} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-lazie-primary focus:border-lazie-primary sm:text-sm" />
              <p className="mt-1 text-xs text-gray-500">Your booking link: https://fresha-clone-app.onrender.com/book/{formData.slug}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
              <label className="block text-sm font-medium text-gray-700">Timezone</label>
              <select name="timezone" value={formData.timezone} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-lazie-primary focus:border-lazie-primary sm:text-sm">
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
            <input name="address" type="text" value={formData.address} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-lazie-primary focus:border-lazie-primary sm:text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-lazie-primary focus:border-lazie-primary sm:text-sm"></textarea>
          </div>

          <div className="pt-6 border-t border-gray-100">
            <h3 className="text-md font-bold text-gray-900 mb-4">Invoice Settings</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Invoice Prefix</label>
                <input name="invoicePrefix" type="text" value={formData.invoicePrefix} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-lazie-primary focus:border-lazie-primary sm:text-sm" />
                <p className="mt-1 text-xs text-gray-500">Preview: {formData.invoicePrefix}-0001</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Default Tax Rate (%)</label>
                <input name="taxRate" type="number" value={formData.taxRate} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-lazie-primary focus:border-lazie-primary sm:text-sm" />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Bank Name</label>
                <input name="bankDetails.bankName" type="text" value={formData.bankDetails.bankName} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-lazie-primary focus:border-lazie-primary sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Account Name</label>
                <input name="bankDetails.accountName" type="text" value={formData.bankDetails.accountName} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-lazie-primary focus:border-lazie-primary sm:text-sm" />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Account Number</label>
                <input name="bankDetails.accountNumber" type="text" value={formData.bankDetails.accountNumber} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-lazie-primary focus:border-lazie-primary sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Branch Code</label>
                <input name="bankDetails.branchCode" type="text" value={formData.bankDetails.branchCode} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-lazie-primary focus:border-lazie-primary sm:text-sm" />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button type="submit" disabled={loading || logoUploading} className={`py-2.5 px-6 border border-transparent rounded-full shadow-sm text-sm font-bold text-gray-950 bg-lazie-primary hover:brightness-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lazie-primary ${(loading || logoUploading) ? 'opacity-70 text-gray-400' : ''} transition-all uppercase tracking-wide`}>
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
            <input name="currentPassword" type="password" value={pwData.currentPassword} onChange={handlePwChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-lazie-primary focus:border-lazie-primary sm:text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">New Password</label>
            <input name="newPassword" type="password" value={pwData.newPassword} onChange={handlePwChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-lazie-primary focus:border-lazie-primary sm:text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
            <input name="confirmPassword" type="password" value={pwData.confirmPassword} onChange={handlePwChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-lazie-primary focus:border-lazie-primary sm:text-sm" />
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
