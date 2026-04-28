import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast.jsx';
import { getProfile } from '../api/api';
import ProfileTab from '../components/settings/ProfileTab.jsx';
import BillingTab from '../components/settings/BillingTab.jsx';

const SettingsPage = () => {
  const { token } = useAuth();
  const { showToast, ToastComponent } = useToast();

  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const profileRes = await getProfile();
        setProfile(profileRes.data);
      } catch (err) {
        showToast('Failed to load profile data', 'error');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchData();
  }, [token, showToast]);

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'billing', label: 'Billing & Subscription' }
  ];

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto h-full flex flex-col relative">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-gray-500 text-sm">Manage your personal profile and subscription plan.</p>
      </div>

      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-4 py-3 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${activeTab === tab.id ? 'border-lazie-primary text-lazie-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-y-auto flex-1 p-6 relative">
        {loading ? (
          <div className="flex items-center justify-center h-64 text-gray-500 animate-pulse">Loading profile...</div>
        ) : (
          <>
            {activeTab === 'profile' && <ProfileTab profile={profile} onProfileUpdate={setProfile} showToast={showToast} />}
            {activeTab === 'billing' && <BillingTab profile={profile} showToast={showToast} />}
          </>
        )}
      </div>

      {ToastComponent}
    </div>
  );
};

export default SettingsPage;
