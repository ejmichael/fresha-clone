import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Play, Users } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-white pt-16 pb-32 lg:pt-24 lg:pb-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
          <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold leading-6 text-lazie-primary ring-1 ring-inset ring-lazie-primary/20 bg-lazie-primary/5 mb-6">
              <span className="flex items-center gap-2">
                <Users size={14} /> Join 10,000+ businesses
              </span>
            </div>

            <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-7xl mb-8 leading-[1.1]">
              The <span className="text-lazie-primary italic font-serif">Smarter</span> <br />
              Way to Manage Appointments
            </h1>

            <p className="mt-6 text-lg leading-8 text-gray-600 mb-10 max-w-lg">
              The all-in-one booking system for barbers, spas, coaches, plumbers, and more. Manage bookings, invoicing, payments, and marketing in one place.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 bg-lazie-primary text-gray-950 rounded-full text-lg font-bold hover:brightness-90 transition-all shadow-xl shadow-lazie-primary/30 text-center"
              >
                Get Started Now
              </Link>
              <div className="flex flex-col items-center sm:items-start">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-black text-gray-900 line-through decoration-red-500 decoration-2 opacity-50">R149</span>
                  <span className="text-2xl font-black text-gray-900">R14.90</span>
                  <span className="bg-[#f0ff00] text-gray-900 text-xs font-black px-2 py-0.5 rounded-full uppercase tracking-wide">90% OFF</span>
                </div>
                <span className="text-xs text-gray-500 font-medium">First month only · R149/mo after</span>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-6 text-sm text-gray-500 font-medium">
              <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-lazie-primary fill-lazie-primary/20" /> Cancel anytime</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-lazie-primary fill-lazie-primary/20" /> Set up in minutes</span>
            </div>
          </div>

          <div className="mt-16 sm:mt-24 lg:mt-0 lg:col-span-6 relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700">
              <img
                src="/busy_owner_hero.png"
                alt="Happy Business Owner using Lazie"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-2xl shadow-2xl hidden md:block animate-bounce-slow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-lazie-primary rounded-full flex items-center justify-center">
                  <span className="font-bold text-gray-950">4.9</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900">Highest Rated</p>
                  <p className="text-sm text-gray-500">Trusted by Professionals</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
