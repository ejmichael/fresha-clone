import React, { useState } from 'react';
import { updateProfile } from '../../api/api';

const BankingTab = ({ profile, onProfileUpdate, showToast }) => {
  const [formData, setFormData] = useState({
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await updateProfile(formData);
      onProfileUpdate(data);
      showToast('Banking details updated successfully', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update details', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Invoice & Banking</h2>
        <p className="text-sm text-gray-500">Configure how your invoices look and where you get paid.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-4">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Invoice Configuration</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Prefix</label>
              <input 
                name="invoicePrefix" 
                type="text" 
                value={formData.invoicePrefix} 
                onChange={handleChange} 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lazie-primary outline-none" 
              />
              <p className="mt-1 text-xs text-gray-500">Preview: {formData.invoicePrefix}-0001</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Default Tax Rate (%)</label>
              <input 
                name="taxRate" 
                type="number" 
                value={formData.taxRate} 
                onChange={handleChange} 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lazie-primary outline-none" 
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Bank Details</h3>
          <p className="text-xs text-gray-500 mt-1">These details will be displayed at the bottom of your invoices for EFT payments.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
              <input 
                name="bankDetails.bankName" 
                type="text" 
                value={formData.bankDetails.bankName} 
                onChange={handleChange} 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lazie-primary outline-none" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name</label>
              <input 
                name="bankDetails.accountName" 
                type="text" 
                value={formData.bankDetails.accountName} 
                onChange={handleChange} 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lazie-primary outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
              <input 
                name="bankDetails.accountNumber" 
                type="text" 
                value={formData.bankDetails.accountNumber} 
                onChange={handleChange} 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lazie-primary outline-none" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Branch Code</label>
              <input 
                name="bankDetails.branchCode" 
                type="text" 
                value={formData.bankDetails.branchCode} 
                onChange={handleChange} 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lazie-primary outline-none" 
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button 
            type="submit" 
            disabled={loading}
            className={`py-3 px-8 bg-lazie-primary text-gray-950 font-bold rounded-full hover:brightness-90 transition-all uppercase tracking-wide text-sm ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Saving...' : 'Save Banking Details'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BankingTab;
