import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CheckCircle2, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const PricingPage = () => {
  const tiers = [
    {
      name: 'Starter',
      price: 'R99',
      description: 'Perfect for independent professionals just starting out.',
      features: [
        'Core scheduling & booking',
        'Up to 1 staff member',
        'Basic email reminders',
        'Standard client management',
        'Help center access'
      ],
      cta: 'Start Free Trial',
      highlighted: false
    },
    {
      name: 'Growth',
      price: 'R149',
      description: 'Ideal for expanding businesses with growing teams.',
      features: [
        'Everything in Starter, plus:',
        'Unlimited staff members',
        'Automated SMS & Email reminders',
        'Professional Invoicing',
        'Unlimited clients',
        'Priority email support'
      ],
      cta: 'Start Free Trial',
      highlighted: true
    },
    {
      name: 'Pro',
      price: 'R250',
      description: 'The ultimate suite for full business management.',
      features: [
        'Everything in Growth, plus:',
        'Advanced recurring invoicing & subscriptions',
        'Advanced financial reporting',
        'Marketing & promotion tools',
        '24/7 dedicated phone support'
      ],
      cta: 'Start Free Trial',
      highlighted: false
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
              No hidden fees. No surprise charges. Choose the plan that best fits your business needs and grow with <span className="font-serif italic text-lazie-primary font-bold">Lazie</span>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
            {tiers.map((tier, index) => (
              <div 
                key={index} 
                className={`relative rounded-3xl p-8 shadow-xl bg-white ${
                  tier.highlighted 
                    ? 'ring-4 ring-lazie-primary scale-105 z-10' 
                    : 'ring-1 ring-gray-200'
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute top-0 right-6 -translate-y-1/2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-lazie-primary px-4 py-1 text-sm font-bold text-gray-950 shadow-sm">
                      <Star size={14} className="fill-gray-950" /> Most Popular
                    </span>
                  </div>
                )}
                
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                <p className="text-gray-500 mb-6 min-h-[48px]">{tier.description}</p>
                
                <div className="mb-8 flex items-baseline gap-x-2">
                  <span className="text-5xl font-extrabold tracking-tight text-gray-900">{tier.price}</span>
                  <span className="text-sm font-semibold leading-6 text-gray-500">/month</span>
                </div>
                
                <Link
                  to="/register"
                  className={`block w-full text-center rounded-xl px-6 py-4 text-base font-bold transition-all shadow-md ${
                    tier.highlighted
                      ? 'bg-lazie-primary text-gray-950 hover:brightness-95'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  {tier.cta}
                </Link>

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
