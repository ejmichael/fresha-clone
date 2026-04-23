import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast.jsx';
import { getProfile, getServices, getStaff } from '../api/api';
import ProfileTab from '../components/settings/ProfileTab.jsx';
import HoursTab from '../components/settings/HoursTab.jsx';
import ServicesTab from '../components/settings/ServicesTab.jsx';
import StaffTab from '../components/settings/StaffTab.jsx';

const SettingsPage = () => {
  const { token } = useAuth();
  const { showToast, ToastComponent } = useToast();

  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState(null);
  const [services, setServices] = useState([]);
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [profileRes, servicesRes, staffRes] = await Promise.all([
          getProfile(),
          getServices(),
          getStaff()
        ]);
        setProfile(profileRes.data);
        setServices(servicesRes.data);
        setStaff(staffRes.data);
      } catch (err) {
        showToast('Failed to load settings data', 'error');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchData();
  }, [token, showToast]);

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'hours', label: 'Hours' },
    { id: 'services', label: 'Services' },
    { id: 'staff', label: 'Staff' }
  ];

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto h-full flex flex-col relative">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
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
          <div className="flex items-center justify-center h-64 text-gray-500 animate-pulse">Loading settings...</div>
        ) : (
          <>
            {activeTab === 'profile' && <ProfileTab profile={profile} onProfileUpdate={setProfile} showToast={showToast} />}
            {activeTab === 'hours' && <HoursTab profile={profile} onHoursUpdate={setProfile} showToast={showToast} />}
            {activeTab === 'services' && <ServicesTab services={services} staff={staff} onServicesChange={setServices} showToast={showToast} />}
            {activeTab === 'staff' && <StaffTab staff={staff} profile={profile} onStaffChange={setStaff} showToast={showToast} />}
          </>
        )}
      </div>

      {ToastComponent}
    </div>
  );
};

export default SettingsPage;
