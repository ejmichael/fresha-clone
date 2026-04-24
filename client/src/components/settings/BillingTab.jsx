import React, { useState } from 'react';
import { CreditCard, Loader2, Info } from 'lucide-react';
import api from '../../api/api';

const BillingTab = ({ profile, showToast }) => {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/payments/checkout');
      
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = data.payfastUrl;
      
      for (const key in data.paymentData) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = data.paymentData[key];
        form.appendChild(input);
      }
      
      document.body.appendChild(form);
      form.submit();
    } catch (e) {
      console.error(e);
      showToast('Could not initialize secure checkout.', 'error');
      setLoading(false);
    }
  };

  const getDaysLeft = () => {
    if (!profile?.subscriptionExpiresAt) return 0;
    const diffTime = new Date(profile.subscriptionExpiresAt).getTime() - new Date().getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const renderStatusBadge = () => {
    switch (profile?.subscriptionStatus) {
      case 'active':
        return <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded">Active</span>;
      case 'trialing':
        return <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-1 rounded">On Trial</span>;
      case 'past_due':
        return <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-1 rounded">Past Due</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-1 rounded">Inactive</span>;
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Billing & Subscription</h2>
      
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8 relative">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              Lazie Growth Plan {renderStatusBadge()}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Provides unlimited staff, automated SMS/Email reminders, and professional invoicing.
            </p>
          </div>
          <CreditCard className="w-8 h-8 text-gray-400" />
        </div>

        {profile?.subscriptionStatus === 'trialing' && (
          <div className="mt-4 p-4 bg-lazie-primary/10 border border-lazie-primary rounded-lg flex items-start gap-3">
            <Info className="w-5 h-5 text-lazie-dark shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-lazie-dark">Your trial expires in {getDaysLeft()} days.</p>
              <p className="text-sm text-gray-700 mt-1">Upgrade now to ensure your clients never experience a break in service and you keep your scheduling fully automated.</p>
            </div>
          </div>
        )}

        {profile?.subscriptionStatus === 'active' && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="font-semibold text-green-900">Your subscription is actively renewing.</p>
            {profile?.subscriptionExpiresAt && (
              <p className="text-sm text-green-700 mt-1">Next billing cycle completes around {new Date(profile.subscriptionExpiresAt).toLocaleDateString()}.</p>
            )}
          </div>
        )}

        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          {profile?.subscriptionStatus !== 'active' ? (
            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="px-6 py-3 bg-gray-900 text-white rounded-lg font-bold text-sm hover:bg-gray-800 transition-all flex justify-center items-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Subscribe for R149/mo'}
            </button>
          ) : (
            <div className="flex items-center gap-4 w-full">
              <button
                disabled
                className="px-6 py-3 bg-gray-200 text-gray-500 rounded-lg font-bold text-sm cursor-not-allowed"
              >
                Plan Active
              </button>
              <button 
                 onClick={() => showToast('Cancellation coming soon. Contact support.', 'info')}
                 className="text-sm font-semibold text-red-600 hover:text-red-500 transition-colors"
               >
                 Cancel Subscription
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BillingTab;
