import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TermsOfServicePage = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 bg-white p-10 lg:p-16 rounded-3xl shadow-sm border border-gray-100">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Terms of Service</h1>
          <p className="text-gray-500 mb-8 italic">Effective Date: April 2026</p>
          
          <div className="prose prose-lg text-gray-600 max-w-none space-y-6">
            <p>
              These Terms of Service ("Terms") govern your access to and use of the <strong>Lazie</strong> website, 
              services, and applications (collectively, the "Service"). Please read these Terms carefully. 
              By using the Service, you agree to be bound by these Terms and our Privacy Policy.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">1. Account Registration</h2>
            <p>
              To access certain features of the Service, you must register for an account. You agree to provide 
              accurate, current, and complete information during the registration process and keep your account 
              information updated. You are responsible for safeguarding your password and for all activities that 
              occur under your account.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">2. Subscription and Billing</h2>
            <p>
              Some parts of the Service are billed on a subscription basis ("Subscriptions"). You will be billed 
              in advance on a recurring and periodic basis (such as monthly or annually), depending on the type 
              of subscription plan you select when purchasing a Subscription.
            </p>
            <p>
              At the end of each period, your Subscription will automatically renew under the exact same conditions 
              unless you cancel it or Lazie cancels it.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">3. Prohibited Uses</h2>
            <p>
              You may use the Service only for lawful purposes. You agree not to use the Service:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>In any way that violates any applicable national or international law or regulation.</li>
              <li>To transmit, or procure the sending of, any advertising or promotional material without our prior written consent.</li>
              <li>To impersonate or attempt to impersonate Lazie, a Lazie employee, another user, or any other person or entity.</li>
              <li>To engage in any conduct that restricts or inhibits anyone's use or enjoyment of the Service.</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">4. Intellectual Property</h2>
            <p>
              The Service and its original content, features, and functionality are and will remain the exclusive 
              property of Lazie and its licensors. The Service is protected by copyright, trademark, and other laws. 
              Our trademarks and trade dress may not be used in connection with any product or service without the 
              prior written consent of Lazie.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">5. Limitation of Liability</h2>
            <p>
              In no event shall Lazie, nor its directors, employees, partners, agents, suppliers, or affiliates, 
              be liable for any indirect, incidental, special, consequential or punitive damages, including without 
              limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access 
              to or use of or inability to access or use the Service.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">6. Changes to Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision 
              is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
            </p>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsOfServicePage;
