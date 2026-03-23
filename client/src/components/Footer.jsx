import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center space-x-2 mb-8">
              <span className="text-3xl font-extrabold tracking-tight text-white uppercase">Fresha</span>
              <span className="text-3xl font-light text-gray-500">Clone</span>
            </Link>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed max-w-sm">
              The leading appointment scheduling software for beauty and wellness professionals.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center hover:bg-prince transition-colors group">
                <Facebook size={20} className="text-gray-400 group-hover:text-white" />
              </a>
              <a href="#" className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center hover:bg-prince transition-colors group">
                <Instagram size={20} className="text-gray-400 group-hover:text-white" />
              </a>
              <a href="#" className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center hover:bg-prince transition-colors group">
                <Twitter size={20} className="text-gray-400 group-hover:text-white" />
              </a>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <h4 className="font-bold text-xl mb-6">Product</h4>
            <ul className="space-y-4 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Booking</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Payments</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Marketing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Reporting</a></li>
            </ul>
          </div>
          
          <div className="lg:col-span-2">
            <h4 className="font-bold text-xl mb-6">Company</h4>
            <ul className="space-y-4 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>
          
          <div className="lg:col-span-4">
            <h4 className="font-bold text-xl mb-6">Join our newsletter</h4>
            <p className="text-gray-400 mb-6">Get the latest business tips and platform updates.</p>
            <form className="relative">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-gray-900 border border-gray-800 rounded-full py-4 px-6 pr-12 focus:outline-none focus:ring-2 focus:ring-prince focus:border-transparent transition-all"
              />
              <button 
                type="submit" 
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-prince rounded-full flex items-center justify-center hover:bg-frank transition-colors"
              >
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>
        
        <div className="pt-12 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500 text-sm">
            © 2026 Fresha Clone. All rights reserved.
          </p>
          <div className="flex gap-8 text-sm text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Legal Info</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
