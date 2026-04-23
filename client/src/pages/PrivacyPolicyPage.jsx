import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 bg-white p-10 lg:p-16 rounded-3xl shadow-sm border border-gray-100">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Privacy Policy</h1>
          <p className="text-gray-500 mb-8 italic">Last Updated: April 2026</p>
          
          <div className="prose prose-lg text-gray-600 max-w-none space-y-6">
            <p>
              At <strong>Lazie</strong>, we are committed to protecting your personal information and your right to privacy. 
              If you have any questions or concerns about this privacy notice, or our practices with regards to your personal 
              information, please contact us.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">1. What information do we collect?</h2>
            <p>
              We collect personal information that you voluntarily provide to us when you register on the Services, 
              express an interest in obtaining information about us or our products and Services, when you participate in 
              activities on the Services, or otherwise when you contact us.
            </p>
            <p>
              The personal information that we collect depends on the context of your interactions with us and the Services.
              The personal information we collect may include names, phone numbers, email addresses, mailing addresses, 
              billing addresses, and passwords.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">2. How do we use your information?</h2>
            <p>
              We use personal information collected via our Services for a variety of business purposes described below. 
              We process your personal information for these purposes in reliance on our legitimate business interests, 
              in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To facilitate account creation and logon process.</li>
              <li>To send administrative information to you.</li>
              <li>To fulfill and manage your orders, invoices, and bookings.</li>
              <li>To send you marketing and promotional communications.</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">3. Will your information be shared with anyone?</h2>
            <p>
              We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, 
              or to fulfill business obligations. We may process or share your data that we hold based on the following legal basis:
              Consent, Legitimate Interests, Performance of a Contract, and Legal Obligations.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">4. Do we use cookies and other tracking technologies?</h2>
            <p>
              We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. 
              Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Notice.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">5. How long do we keep your information?</h2>
            <p>
              We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy notice, 
              unless a longer retention period is required or permitted by law (such as tax, accounting or other legal requirements).
            </p>
            
            <hr className="my-10 border-gray-100" />
            
            <p className="text-sm">
              If you have questions or comments about this notice, you may email us at privacy@lazie.com.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;
