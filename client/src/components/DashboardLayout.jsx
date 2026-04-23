import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calendar, ListTodo, Users, Settings, LogOut, Menu, X, FileText } from 'lucide-react';

const DashboardLayout = () => {
  const { business, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!business) return null;

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
      <main className="flex-1 overflow-y-auto pt-16 lg:pt-0">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
