import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Play, Users } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-white pt-16 pb-32 lg:pt-24 lg:pb-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
          <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold leading-6 text-prince ring-1 ring-inset ring-prince/20 bg-prince/5 mb-6">
              <span className="flex items-center gap-2">
                <Users size={14} /> Join 100,000+ businesses globally
              </span>
            </div>
            
            <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-7xl mb-8 leading-[1.1]">
              The world's #1 <br />
              <span className="text-prince italic font-serif">beauty and wellness</span> <br />
              platform
            </h1>
            
            <p className="mt-6 text-lg leading-8 text-gray-600 mb-10 max-w-lg">
              Everything you need to grow your salon or spa. Booking, payments, and automated marketing all in one place.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <Link 
                to="/register" 
                className="w-full sm:w-auto px-8 py-4 bg-prince text-white rounded-full text-lg font-bold hover:bg-frank transition-all shadow-xl shadow-prince/30 text-center"
              >
                Get Started for Free
              </Link>
              <button className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 border-2 border-pebble rounded-full text-lg font-bold hover:bg-pebble transition-all flex items-center justify-center gap-2">
                <Play size={20} className="fill-current" /> Watch Demo
              </button>
            </div>
            
            <div className="mt-8 flex items-center gap-6 text-sm text-gray-500 font-medium">
              <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-limelight fill-prince" /> No credit card</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-limelight fill-prince" /> Set up in minutes</span>
            </div>
          </div>
          
          <div className="mt-16 sm:mt-24 lg:mt-0 lg:col-span-6 relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700">
              <img 
                src="/fresha_hero_image_1774283261641.png" 
                alt="Modern Beauty Salon" 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-2xl shadow-2xl hidden md:block animate-bounce-slow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-limelight rounded-full flex items-center justify-center">
                  <span className="font-bold text-prince">4.9</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900">Highest Rated</p>
                  <p className="text-sm text-gray-500">On App Store & Play Store</p>
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
