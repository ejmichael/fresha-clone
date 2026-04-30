import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

const PricingPage = () => {
  const { business } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!business) {
      navigate('/register');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.get('/payments/checkout');

      // Dynamically auto-submit to PayFast
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
      setLoading(false);
    }
  };
  const tiers = [
    {
      name: '',
      price: 'R149',
      description: 'Everything you need to manage your business from end to end. First month discounted to R14.90.',
      features: [
        'First month only R14.90',
        'Core scheduling & booking',
        'Unlimited staff members',
        'Automated SMS & Email reminders',
        'Professional Invoicing',
        'Unlimited clients',
        'Priority email support'
      ],
      cta: 'Claim Discount',
      highlighted: true
    }
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50">
      <Navbar />

      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl mb-6">
              Simple, transparent pricing
            </h1>
            <p className="text-xl text-gray-600">
              No hidden fees. No surprise charges. The plan that best fits your business needs and grow with <span className="font-serif italic text-lazie-primary font-bold">Lazie</span>.
            </p>
          </div>

          <div className="max-w-md mx-auto items-center">
            {tiers.map((tier, index) => (
              <div
                key={index}
                className={`relative rounded-3xl p-8 shadow-xl bg-white ${tier.highlighted
                  ? 'ring-4 ring-lazie-primary scale-105 z-10'
                  : 'ring-1 ring-gray-200'
                  }`}
              >
                {/* {tier.highlighted && (
                  <div className="absolute top-0 right-6 -translate-y-1/2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-lazie-primary px-4 py-1 text-sm font-bold text-gray-950 shadow-sm">
                      <Star size={14} className="fill-gray-950" /> Most Popular
                    </span>
                  </div>
                )} */}

                {tier.name && <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>}
                <p className="text-gray-500 mb-6 min-h-[48px]">{tier.description}</p>

                <div className="mb-8 flex items-baseline gap-x-2">
                  <span className="text-5xl font-extrabold tracking-tight text-gray-900">{tier.price}</span>
                  <span className="text-sm font-semibold leading-6 text-gray-500">/month</span>
                </div>

                <button
                  onClick={handleSubscribe}
                  disabled={loading}
                  className={`block w-full text-center rounded-xl px-6 py-4 text-base font-bold transition-all shadow-md flex justify-center items-center gap-2 ${tier.highlighted
                    ? 'bg-lazie-primary text-gray-950 hover:brightness-95 disabled:opacity-50'
                    : 'bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50'
                    }`}
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : tier.cta}
                </button>

                <ul className="mt-8 space-y-4 text-sm leading-6 text-gray-600">
                  {tier.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex gap-x-3">
                      <CheckCircle2 className={`h-6 w-5 flex-none ${tier.highlighted ? 'text-lazie-primary' : 'text-gray-400'}`} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PricingPage;
