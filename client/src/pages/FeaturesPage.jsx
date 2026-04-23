import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Calendar, 
  CreditCard, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  Smartphone, 
  BarChart3, 
  ShieldCheck,
} from 'lucide-react';

const FeaturesPage = () => {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      
      {/* Light Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-pebble/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-extrabold text-gray-900 sm:text-7xl mb-8 leading-tight tracking-tight">
              One platform. <br />
              <span className="text-lazie-primary italic font-serif">Infinite growth.</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              lazie brings everything you need to run your business under one roof. From the first booking to final payment, we've got you covered.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="px-10 py-5 bg-lazie-primary text-gray-950 rounded-full font-bold text-lg hover:brightness-95 transition-all shadow-xl shadow-lazie-primary/20">
                Get Started Now
              </Link>
              <button 
                onClick={() => document.getElementById('integrations').scrollIntoView({ behavior: 'smooth' })} 
                className="px-10 py-5 bg-white border-2 border-pebble rounded-full font-bold text-lg hover:bg-gray-50 transition-all text-gray-900"
              >
                Explore Integrations
              </button>
            </div>
          </div>
        </div>
        
        {/* Abstract background elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-lazie-primary/10 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[600px] h-[600px] bg-prince/5 rounded-full blur-3xl opacity-50" />
      </section>

      {/* Feature Dives with Screenshots */}
      <div className="py-24 space-y-32">
        {/* Scheduling Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-lazie-primary/10 rounded-full text-lazie-dark font-bold mb-6">
                <Calendar className="w-5 h-5" /> Scheduling
              </div>
              <h2 className="text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">World-class scheduling at your fingertips</h2>
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                Manage your time effortlessly with our intuitive calendar. Whether it's a haircut, a coaching session, or a service call, lazie makes it simple for you and your clients.
              </p>
              <ul className="space-y-4">
                {[
                  "Drag-and-drop calendar management",
                  "Industry-specific booking rules",
                  "Direct booking links for social media",
                  "Mobile-first design for on-the-go pros"
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 items-center text-gray-700 text-lg font-medium">
                    <CheckCircle2 className="text-lazie-primary w-6 h-6 flex-shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="order-1 lg:order-2">
              <div className="p-4 bg-pebble/50 rounded-[40px] shadow-sm transform hover:scale-[1.02] transition-transform duration-500">
                <img 
                  src="/features/scheduling.png" 
                  alt="Scheduling Dashboard" 
                  className="rounded-[32px] shadow-2xl w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* No-Shows Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="lg:order-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 rounded-full text-red-600 font-bold mb-6">
                <ShieldCheck className="w-5 h-5" /> Reliability
              </div>
              <h2 className="text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">Stop no-shows before they happen</h2>
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                Reduce cancellations by up to 40% with automated reminders. Stay connected with your clients via SMS and email without lifting a finger.
              </p>
              <ul className="space-y-4">
                {[
                  "Personalized SMS & Email reminders",
                  "Secure booking deposits",
                  "Automatic waitlist management",
                  "Client history and flags"
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 items-center text-gray-700 text-lg font-medium">
                    <CheckCircle2 className="text-red-500 w-6 h-6 flex-shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:order-1">
              <div className="p-4 bg-red-50/50 rounded-[40px] shadow-sm transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                <img 
                  src="/features/reminders.png" 
                  alt="Reminders UI" 
                  className="rounded-[32px] shadow-2xl w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Invoicing Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="lg:order-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-lazie-primary/10 rounded-full text-lazie-dark font-bold mb-6">
                <CreditCard className="w-5 h-5" /> Invoicing & Payments
              </div>
              <h2 className="text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">Get paid faster with professional invoices</h2>
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                Generate and send beautiful, itemized invoices in seconds. Let clients pay securely online and track your cash flow automatically.
              </p>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="p-6 bg-gray-50 rounded-2xl">
                  <BarChart3 className="text-lazie-primary w-8 h-8 mb-4" />
                  <p className="font-bold text-gray-900">Real-time reports</p>
                </div>
                <div className="p-6 bg-gray-50 rounded-2xl">
                  <CreditCard className="text-lazie-primary w-8 h-8 mb-4" />
                  <p className="font-bold text-gray-900">Seamless payouts</p>
                </div>
              </div>
              <Link to="/register" className="inline-flex items-center gap-2 text-lazie-dark font-bold text-lg hover:gap-4 transition-all">
                Start taking payments <ArrowRight />
              </Link>
            </div>
            <div className="lg:order-2">
              <div className="p-4 bg-pebble/50 rounded-[40px] shadow-sm transform rotate-1 hover:rotate-0 transition-transform duration-500">
                <img 
                  src="/features/invoice.png" 
                  alt="Invoicing Interface" 
                  className="rounded-[32px] shadow-2xl w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="lg:order-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-prince/10 rounded-full text-gray-900 font-bold mb-6">
                <Users className="w-5 h-5" /> Management
              </div>
              <h2 className="text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">Run your team like a pro</h2>
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                Scale your business by managing staff schedules, permissions, and performance in one central dashboard.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Staff-specific calendars and logins",
                  "Automated commission calculations",
                  "Performance tracking and insights",
                  "Custom permissions for every role"
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 items-center text-gray-700 text-lg font-medium">
                    <CheckCircle2 className="text-lazie-primary w-6 h-6 flex-shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:order-1">
              <div className="p-4 bg-prince/10 rounded-[40px] shadow-sm transform hover:scale-[1.02] transition-transform duration-500">
                <img 
                  src="/features/team.png" 
                  alt="Team Management Dashboard" 
                  className="rounded-[32px] shadow-2xl w-full"
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Integrations Section */}
      <section id="integrations" className="py-24 bg-gray-50 border-y border-pebble">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">Connect lazie everywhere</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get booked from where your clients are. Whether it's Google Search, Instagram, or your own website.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Google Integration */}
            <div className="p-10 bg-white rounded-[40px] shadow-sm border border-pebble hover:border-lazie-primary transition-all group">
              <div className="w-16 h-16 bg-white shadow-md rounded-2xl flex items-center justify-center mb-8 border border-gray-100 p-4">
                <svg viewBox="0 0 24 24" className="w-8 h-8">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">Reserve with Google</h3>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                Let clients book directly from Google Search and Maps. Increase visibility and get discovered by thousands of local clients searching for your services.
              </p>
              <div className="flex items-center gap-2 text-lazie-dark font-bold hover:gap-4 transition-all cursor-pointer">
                Learn more <ArrowRight />
              </div>
            </div>

            {/* Website Integration */}
            <div className="p-10 bg-white rounded-[40px] shadow-sm border border-pebble hover:border-lazie-primary transition-all group">
              <div className="w-16 h-16 bg-lazie-primary/10 rounded-2xl flex items-center justify-center mb-8 border border-lazie-primary/20">
                <Smartphone className="w-8 h-8 text-lazie-dark" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">Website Booking Widget</h3>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                Turn your personal website into a 24/7 booking engine. Simply embed our sleek widget and start capturing appointments instantly.
              </p>
              <div className="flex items-center gap-2 text-lazie-dark font-bold hover:gap-4 transition-all cursor-pointer">
                Get the code <ArrowRight />
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <p className="text-gray-500 mb-6 font-medium">Need help setting up your integrations?</p>
            <button className="px-8 py-4 bg-gray-900 text-white rounded-full font-bold text-lg hover:bg-gray-800 transition-all shadow-lg flex items-center gap-2 mx-auto">
              <Users className="w-5 h-5" /> Get Integration Support
            </button>
          </div>
        </div>
      </section>
      
      {/* Final CTA */}
      <section className="py-32 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="p-16 bg-lazie-primary/5 rounded-[60px] border border-lazie-primary/20">
            <h2 className="text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">Ready to scale your business?</h2>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">Join thousands of professionals already using lazie to manage their passion and grow their revenue.</p>
            <Link 
              to="/register" 
              className="inline-block px-12 py-5 bg-lazie-primary text-gray-950 rounded-full font-bold text-xl hover:brightness-95 transition-all shadow-2xl shadow-lazie-primary/30"
            >
              Start Your Free Trial
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FeaturesPage;
