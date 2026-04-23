import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Mail, MapPin } from 'lucide-react';

const LegalInfoPage = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 bg-white p-10 lg:p-16 rounded-3xl shadow-sm border border-gray-100">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Legal Information</h1>
          
          <div className="prose prose-lg text-gray-600 max-w-none space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Corporate Entity</h2>
            <p>
              Lazie Scheduling Inc. is a registered corporation. 
              The Lazie website and all associated services are operated and provided by Lazie Scheduling Inc.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Contact Information</h2>
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 not-prose">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-lazie-primary/20 rounded-full flex items-center justify-center text-lazie-dark">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Email Address</p>
                  <p className="text-gray-600">legal@lazie.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-lazie-primary/20 rounded-full flex items-center justify-center text-lazie-dark">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Mailing Address</p>
                  <p className="text-gray-600">123 Innovation Drive, Suite 400<br />Tech City, TC 90210</p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Intellectual Property & Trademarks</h2>
            <p>
              "Lazie" and the Lazie logo are registered trademarks of Lazie Scheduling Inc. 
              All content on this website, including but not limited to text, graphics, logos, images, 
              and software, is the property of Lazie Scheduling Inc. or its content suppliers and is 
              protected by international copyright laws.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Disclaimers</h2>
            <p>
              The materials on Lazie's website are provided on an 'as is' basis. Lazie makes no warranties, 
              expressed or implied, and hereby disclaims and negates all other warranties including, without 
              limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, 
              or non-infringement of intellectual property or other violation of rights.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LegalInfoPage;
