import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { cancelBooking } from '../api/api';
import { AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';

const CancelPage = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleCancel = async () => {
    setLoading(true);
    try {
      const res = await cancelBooking(id);
      setResult({ success: true, message: res.data.message });
    } catch (err) {
      setResult({ 
        success: false, 
        message: err.response?.data?.message || 'Failed to cancel the booking. It might be too late.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        
        {!result && (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
              <AlertCircle size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Cancel Appointment?</h2>
            <p className="text-gray-600 mb-8">
              Are you sure you want to cancel your booking? This action cannot be undone. Cancellations must be made at least 2 hours in advance.
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={handleCancel}
                disabled={loading}
                className="w-full py-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {loading ? 'Cancelling...' : 'Yes, Cancel Booking'}
              </button>
              <Link 
                to="/"
                className="w-full py-3 bg-white border border-gray-200 font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                No, Keep Booking
              </Link>
            </div>
          </div>
        )}

        {result && result.success && (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
              <CheckCircle size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Cancelled Successfully</h2>
            <p className="text-gray-600 mb-8">{result.message}</p>
            <Link 
              to="/"
              className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700 transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              Return to Booking Page
            </Link>
          </div>
        )}

        {result && !result.success && (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
              <AlertCircle size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Cancellation Failed</h2>
            <p className="text-gray-600 mb-8">{result.message}</p>
            <Link 
              to="/"
              className="inline-flex items-center text-gray-600 font-medium hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              Return to Booking Page
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};

export default CancelPage;
