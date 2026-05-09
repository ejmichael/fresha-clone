import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CheckCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import api from '../api/api';

const inputClass = 'block w-full rounded-md border-0 py-2.5 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-lazie-primary sm:text-sm sm:leading-6';

const ContactPage = () => {
  const location = useLocation();
  const categoryParam = new URLSearchParams(location.search).get('category');
  const defaultCategory = categoryParam === 'Integration' ? 'Integration Support' : 'General Inquiry';

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', category: defaultCategory, message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await api.post('/contact', form);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

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

          <div className="max-w-2xl mx-auto">
            <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-gray-100">
              {success ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Message sent!</h2>
                  <p className="text-gray-500">Thanks for reaching out. We'll get back to you within 1–2 business days. Check your inbox for a confirmation.</p>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold leading-6 text-gray-900">First name *</label>
                        <div className="mt-2">
                          <input required name="firstName" type="text" value={form.firstName} onChange={handleChange} className={inputClass} />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold leading-6 text-gray-900">Last name</label>
                        <div className="mt-2">
                          <input name="lastName" type="text" value={form.lastName} onChange={handleChange} className={inputClass} />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold leading-6 text-gray-900">How can we help you?</label>
                      <div className="mt-2">
                        <select name="category" value={form.category} onChange={handleChange} className={`${inputClass} bg-white py-3`}>
                          <option value="General Inquiry">General Inquiry</option>
                          <option value="Integration Support">Integration Support</option>
                          <option value="Website Build">Website Build</option>
                          <option value="Billing & Subscriptions">Billing &amp; Subscriptions</option>
                          <option value="Technical Support">Technical Support</option>
                          <option value="Sales">Sales</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold leading-6 text-gray-900">Email *</label>
                      <div className="mt-2">
                        <input required name="email" type="email" value={form.email} onChange={handleChange} className={inputClass} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold leading-6 text-gray-900">Message *</label>
                      <div className="mt-2">
                        <textarea required name="message" rows={4} value={form.message} onChange={handleChange} className={inputClass} />
                      </div>
                    </div>

                    {error && (
                      <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</p>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full rounded-full bg-lazie-primary px-3.5 py-4 text-center font-bold text-gray-950 shadow-sm hover:brightness-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {submitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
