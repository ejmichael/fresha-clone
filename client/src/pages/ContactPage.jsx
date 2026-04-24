import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Mail, MapPin, MessageSquare } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const ContactPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const categoryParam = searchParams.get('category');
  const defaultCategory = categoryParam === 'Integration' ? 'Integration Support' : 'General Inquiry';
  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50">
      <Navbar />

      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-600">
              Have questions about pricing, features, or need technical support? We'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-16 max-w-5xl mx-auto">
            {/* Contact Form */}
            <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="first-name" className="block text-sm font-semibold leading-6 text-gray-900">First name</label>
                    <div className="mt-2">
                      <input type="text" name="first-name" id="first-name" className="block w-full rounded-md border-0 py-2.5 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-lazie-primary sm:text-sm sm:leading-6" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="last-name" className="block text-sm font-semibold leading-6 text-gray-900">Last name</label>
                    <div className="mt-2">
                      <input type="text" name="last-name" id="last-name" className="block w-full rounded-md border-0 py-2.5 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-lazie-primary sm:text-sm sm:leading-6" />
                    </div>
                  </div>
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-semibold leading-6 text-gray-900">How can we help you?</label>
                  <div className="mt-2">
                    <select id="category" name="category" defaultValue={defaultCategory} className="block w-full rounded-md border-0 py-3 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-lazie-primary sm:text-sm sm:leading-6 bg-white">
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Integration Support">Integration Support</option>
                      <option value="Billing & Subscriptions">Billing & Subscriptions</option>
                      <option value="Technical Support">Technical Support</option>
                      <option value="Sales">Sales</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold leading-6 text-gray-900">Email</label>
                  <div className="mt-2">
                    <input type="email" name="email" id="email" className="block w-full rounded-md border-0 py-2.5 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-lazie-primary sm:text-sm sm:leading-6" />
                  </div>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold leading-6 text-gray-900">Message</label>
                  <div className="mt-2">
                    <textarea name="message" id="message" rows={4} className="block w-full rounded-md border-0 py-2.5 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-lazie-primary sm:text-sm sm:leading-6" defaultValue={''} />
                  </div>
                </div>
                <button type="button" className="w-full rounded-full bg-lazie-primary px-3.5 py-4 text-center font-bold text-gray-950 shadow-sm hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lazie-primary transition-all">
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Info */}
            {/* <div className="flex flex-col justify-center space-y-10">
              <div className="flex gap-x-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-lazie-primary/10">
                  <Mail className="h-6 w-6 text-lazie-dark" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-lg font-bold leading-7 text-gray-900">Email Support</h3>
                  <p className="mt-2 leading-7 text-gray-600">Our team aims to respond to all inquiries within 24 hours.</p>
                  <p className="mt-2 font-semibold text-lazie-dark">support@lazie.com</p>
                </div>
              </div>
              <div className="flex gap-x-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-lazie-primary/10">
                  <MapPin className="h-6 w-6 text-lazie-dark" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-lg font-bold leading-7 text-gray-900">Office</h3>
                  <p className="mt-2 leading-7 text-gray-600">123 Innovation Drive, Suite 400<br />Tech City, TC 90210</p>
                </div>
              </div>
              <div className="flex gap-x-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-lazie-primary/10">
                  <MessageSquare className="h-6 w-6 text-lazie-dark" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-lg font-bold leading-7 text-gray-900">Sales Inquiries</h3>
                  <p className="mt-2 leading-7 text-gray-600">Looking for an enterprise plan? Talk to our sales team.</p>
                  <p className="mt-2 font-semibold text-lazie-dark">sales@lazie.com</p>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
