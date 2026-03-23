import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import BookingPage from './pages/BookingPage';
import CancelPage from './pages/CancelPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardLayout from './components/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import AppointmentDetailPage from './pages/AppointmentDetailPage';
import SettingsPage from './pages/SettingsPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background flex flex-col font-sans text-gray-900">
        <main className="flex-grow flex flex-col">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/book/:slug" element={<BookingPage />} />
            <Route path="/cancel/:id" element={<CancelPage />} />
            
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            <Route path="/dashboard" element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="appointments/:id" element={<AppointmentDetailPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
            </Route>
          </Routes>
        </main>
        {/* We can dynamically hide footer if we wanted, but sticking to existing class wrapper */}
      </div>
    </AuthProvider>
  );
}

export default App;
