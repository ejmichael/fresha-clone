import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calendar, FileText, Users, Settings, LogOut, Menu, X, AlertTriangle, CreditCard, Store, UserCog, Loader2, Info } from 'lucide-react';
import api from '../api/api';

const DashboardLayout = () => {
  const { business, logout, refreshProfile } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activating, setActivating] = useState(false);

  // Auto-refresh when coming back from PayFast
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('payment') === 'success') {
      refreshProfile();
    }
  }, [location.search]);

  if (!business) return null;

  // Calculate trial expiry from cached profile
  const isPendingSetup = business.subscriptionStatus === 'pending_setup';
  const isTrialing = business.subscriptionStatus === 'trialing';
  const isActive = business.subscriptionStatus === 'active';
  const isCanceled = business.subscriptionStatus === 'canceled';
  
  const expiresAt = business.subscriptionExpiresAt ? new Date(business.subscriptionExpiresAt) : null;
  const now = new Date();
  const timeDiff = expiresAt ? expiresAt.getTime() - now.getTime() : null;
  const daysLeft = expiresAt ? Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) : null;
  
  const isExpired = expiresAt !== null && timeDiff <= 0;
  const setupRequired = isPendingSetup;
  
  // The app gets locked/blurred only if setup is entirely lacking or their paid time has totally elapsed
  const shouldLock = setupRequired || isExpired;
  
  const trialWarningSoon = isTrialing && !isExpired && daysLeft !== null && daysLeft <= 7;
  const canceledGraceWarning = isCanceled && !isExpired && daysLeft !== null;

  const handleActivateTrial = async () => {
    setActivating(true);
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
      alert('Could not initialize secure checkout. Please try again.');
      setActivating(false);
    }
  };

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

          <NavLink to="/dashboard/business" className={({ isActive }) => `flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive ? 'bg-lazie-primary/10 text-lazie-dark' : 'text-gray-700 hover:bg-gray-50'}`}>
            <Store className="mr-3 flex-shrink-0 h-5 w-5" />
            Business Setup
          </NavLink>

          <div className="pt-4 pb-2">
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Account</p>
          </div>
          
          <NavLink to="/dashboard/settings" className={({ isActive }) => `w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive ? 'bg-lazie-primary/10 text-lazie-dark' : 'text-gray-700 hover:bg-gray-50'}`}>
            <UserCog className="mr-3 flex-shrink-0 h-5 w-5" />
            Account Settings
          </NavLink>

          <div className="pt-4 pb-2">
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Coming Soon</p>
          </div>
          <button disabled className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-400 cursor-not-allowed">
            <Users className="mr-3 flex-shrink-0 h-5 w-5" />
            Clients
          </button>
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
        {/* Registration Onboarding Payment Modal */}
        {setupRequired && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col relative z-50">
              <div className="bg-[#f0ff00] px-6 py-8 text-center border-b border-[#f0ff00]/20">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome to <span className="font-logo text-gray-900 lowercase tracking-tighter">lazie</span>!</h2>
                <p className="text-gray-800 font-medium tracking-tight">Your account has been successfully created.</p>
              </div>
              <div className="p-8 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-[#f0ff00]/20 rounded-full flex items-center justify-center mb-6">
                  <CreditCard className="w-8 h-8 text-gray-900" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">Claim Your Discount</h3>
                <p className="text-gray-600 mb-8 text-base">
                  Get your first month for only <strong className="text-gray-900 font-bold bg-[#f0ff00]/30 px-1.5 py-0.5 rounded">R14.90</strong>. After that, it's just R149/month. Cancel absolutely anytime securely.
                </p>
                <button 
                  onClick={handleActivateTrial}
                  disabled={activating}
                  className="w-full flex justify-center items-center gap-2 py-4 px-6 rounded-xl font-bold text-lg text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all disabled:opacity-70 shadow-lg"
                >
                  {activating ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Preparing Secure Checkout...</>
                  ) : (
                    <>Pay R14.90 Now →</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
        
        {isExpired && (
          <div className="bg-red-600 text-white px-4 py-3 flex items-center justify-between gap-4 flex-shrink-0 relative z-50 shadow-md">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span className="text-sm font-medium">Your subscription has expired. Subscribe to re-activate your account and continue managing your business.</span>
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
              <span className="text-sm text-amber-800">Your first month promo expires in <strong>{daysLeft} day{daysLeft !== 1 ? 's' : ''}</strong>.</span>
            </div>
            <Link to="/dashboard/settings" className="text-xs font-semibold text-amber-700 hover:text-amber-900 shrink-0 underline">
              Go to Billing
            </Link>
          </div>
        )}

        {canceledGraceWarning && (
          <div className="bg-blue-50 border-b border-blue-200 px-4 py-2.5 flex items-center justify-between gap-4 flex-shrink-0">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="text-sm text-blue-800">Your subscription is canceled, but you retain full access for <strong>{daysLeft} day{daysLeft !== 1 ? 's' : ''}</strong> until it fully expires.</span>
            </div>
            <Link to="/dashboard/settings" className="text-xs font-semibold text-blue-700 hover:text-blue-900 shrink-0 underline">
              Re-subscribe
            </Link>
          </div>
        )}

        {/* Global Blur overlay over everything else */}
        {shouldLock && (
          <div className="fixed inset-0 bg-white/60 backdrop-blur-[8px] z-[45]" />
        )}

        <div className={`flex-1 relative ${shouldLock ? 'pointer-events-none' : ''}`}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
