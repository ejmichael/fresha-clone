import React, { useState } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calendar, FileText, Users, Settings, LogOut, Menu, X, AlertTriangle, CreditCard } from 'lucide-react';

const DashboardLayout = () => {
  const { business, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!business) return null;

  // Calculate trial expiry from cached profile
  const isTrialing = business.subscriptionStatus === 'trialing';
  const isActive = business.subscriptionStatus === 'active';
  const expiresAt = business.subscriptionExpiresAt ? new Date(business.subscriptionExpiresAt) : null;
  const now = new Date();
  const daysLeft = expiresAt ? Math.ceil((expiresAt - now) / (1000 * 60 * 60 * 24)) : null;
  const trialExpired = isTrialing && daysLeft !== null && daysLeft <= 0;
  const trialWarningSoon = isTrialing && daysLeft !== null && daysLeft > 0 && daysLeft <= 7;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Top bar */}
      <div className="lg:hidden fixed top-0 w-full z-20 bg-white shadow-sm h-16 flex items-center justify-between px-4">
        <div className="font-semibold text-lg">{business.name}</div>
        <button onClick={() => setSidebarOpen(true)} className="p-2 -mr-2 text-gray-600">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-black/50" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="h-16 flex items-center justify-between px-4 lg:px-6 border-b border-gray-200">
          <div>
            <div className="font-bold text-lg text-gray-900 truncate" title={business.name}>{business.name}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wider">{business.category}</div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 text-gray-500 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <NavLink to="/dashboard" end className={({ isActive }) => `flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive ? 'bg-lazie-primary/10 text-lazie-dark' : 'text-gray-700 hover:bg-gray-50'}`}>
            <Calendar className="mr-3 flex-shrink-0 h-5 w-5" />
            Calendar & Today
          </NavLink>
          
          <NavLink to="/dashboard/invoices" className={({ isActive }) => `flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive ? 'bg-lazie-primary/10 text-lazie-dark' : 'text-gray-700 hover:bg-gray-50'}`}>
            <FileText className="mr-3 flex-shrink-0 h-5 w-5" />
            Invoices
          </NavLink>

          <div className="pt-4 pb-2">
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Coming Soon</p>
          </div>
          <button disabled className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-400 cursor-not-allowed">
            <Users className="mr-3 flex-shrink-0 h-5 w-5" />
            Clients
          </button>
          <NavLink to="/dashboard/settings" className={({ isActive }) => `w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive ? 'bg-lazie-primary/10 text-lazie-dark' : 'text-gray-700 hover:bg-gray-50'}`}>
            <Settings className="mr-3 flex-shrink-0 h-5 w-5" />
            Settings
          </NavLink>
        </div>

        <div className="p-4 border-t border-gray-200">
          <button onClick={logout} className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 transition-colors">
            <LogOut className="mr-3 flex-shrink-0 h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pt-16 lg:pt-0 flex flex-col">
        {/* Trial banners */}
        {trialExpired && (
          <div className="bg-red-600 text-white px-4 py-3 flex items-center justify-between gap-4 flex-shrink-0">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span className="text-sm font-medium">Your free trial has expired. Subscribe to re-activate your account.</span>
            </div>
            <Link to="/dashboard/settings" className="flex items-center gap-1.5 bg-white text-red-600 font-bold text-xs px-3 py-1.5 rounded-full hover:bg-red-50 transition-colors shrink-0">
              <CreditCard className="w-3.5 h-3.5" /> Subscribe Now
            </Link>
          </div>
        )}
        {trialWarningSoon && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 flex items-center justify-between gap-4 flex-shrink-0">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="text-sm text-amber-800">Your free trial expires in <strong>{daysLeft} day{daysLeft !== 1 ? 's' : ''}</strong>.</span>
            </div>
            <Link to="/dashboard/settings" className="text-xs font-semibold text-amber-700 hover:text-amber-900 shrink-0 underline">
              Go to Billing
            </Link>
          </div>
        )}
        {/* Blur overlay when trial is hard-expired */}
        <div className={`flex-1 relative ${trialExpired ? 'pointer-events-none' : ''}`}>
          {trialExpired && <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10" />}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
