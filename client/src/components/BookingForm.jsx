import React, { useState } from 'react';

const BookingForm = ({ service, staff, date, time, business, onBack, onSubmit }) => {
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: ''
  });
  const [loading, setLoading] = useState(false);

  const isValid = formData.clientName && formData.clientEmail.includes('@') && formData.clientPhone;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;
    setLoading(true);
    await onSubmit(formData);
    setLoading(false);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Client Details</h2>
        <button 
          onClick={onBack}
          className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          &larr; Back
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input 
              required
              type="text" 
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 transition-shadow"
              value={formData.clientName}
              onChange={e => setFormData({...formData, clientName: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
            <input 
              required
              type="email" 
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 transition-shadow"
              value={formData.clientEmail}
              onChange={e => setFormData({...formData, clientEmail: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
            <input 
              required
              type="tel" 
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 transition-shadow"
              value={formData.clientPhone}
              onChange={e => setFormData({...formData, clientPhone: e.target.value})}
            />
          </div>
          
          <button 
            type="submit"
            disabled={!isValid || loading}
            className="w-full mt-6 px-6 py-3 bg-gray-900 text-white font-medium rounded-lg disabled:opacity-50 flex justify-center hover:bg-gray-800 transition-colors"
          >
            {loading ? (
               <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : 'Confirm Booking'}
          </button>
        </form>

        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 h-fit">
          <h3 className="font-semibold text-lg mb-4 text-gray-900">Booking Summary</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex justify-between border-b border-gray-200 pb-3">
              <span>Service</span>
              <span className="font-medium text-gray-900">{service.name}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-3">
              <span>Professional</span>
              <span className="font-medium text-gray-900">{staff.name}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-3">
              <span>Date</span>
              <span className="font-medium text-gray-900">{date.toDateString()}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-3">
              <span>Time</span>
              <span className="font-medium text-gray-900">{time}</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="font-semibold">Total Price</span>
              <span className="font-bold text-gray-900 text-lg">
                {service.currency === 'ZAR' ? 'R' : service.currency} {service.price}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
