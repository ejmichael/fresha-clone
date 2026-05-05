import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import FeaturesPage from './pages/FeaturesPage';
import BookingPage from './pages/BookingPage';
import CancelPage from './pages/CancelPage';
import BookingDetailPage from './pages/BookingDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PricingPage from './pages/PricingPage';
import FaqPage from './pages/FaqPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import LegalInfoPage from './pages/LegalInfoPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';

import DashboardLayout from './components/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import InvoicesPage from './pages/InvoicesPage';
import AppointmentDetailPage from './pages/AppointmentDetailPage';
import NewAppointmentPage from './pages/NewAppointmentPage';
import SettingsPage from './pages/SettingsPage';
import BusinessSettingsPage from './pages/BusinessSettingsPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <AuthProvider>
      <ScrollToTop />
      <div className="min-h-screen bg-background flex flex-col font-sans text-gray-900">
        <main className="flex-grow flex flex-col">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/invoicing" element={<Navigate to="/features" replace />} />
            <Route path="/book/:slug" element={<BookingPage />} />
            <Route path="/cancel/:id" element={<CancelPage />} />
            <Route path="/booking/:id" element={<BookingDetailPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-of-service" element={<TermsOfServicePage />} />
            <Route path="/legal" element={<LegalInfoPage />} />
            
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            <Route path="/dashboard" element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="appointments/new" element={<NewAppointmentPage />} />
                <Route path="appointments/:id" element={<AppointmentDetailPage />} />
                <Route path="invoices" element={<InvoicesPage />} />
                <Route path="business" element={<BusinessSettingsPage />} />
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
