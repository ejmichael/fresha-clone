import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CalendarClock, HeartHandshake, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-white">
      <Navbar />

      <main className="flex-grow pt-32 pb-24">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-24">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl mb-6">
              Our Mission
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              We built <span className="font-serif italic text-lazie-primary font-bold">Lazie</span> to give service-based businesses their time back. Your passion is your craft, not managing endless calendars and phone calls.
            </p>
          </div>
        </div>

        {/* The Problem Section */}
        <section className="bg-pebble/30 py-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-6">
                  The endless cycle of "Are you available?"
                </h2>
                <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                  <p>
                    For years, managers and business owners have suffered from the same core problem: balancing managing a shop floor while fielding constant text messages, direct messages, phone calls, and emails just to book a simple appointment.
                  </p>
                  <p>
                    Every missed call is a missed opportunity, but every answered call interrupts the client in the chair right in front of you. 
                  </p>
                  <p className="font-semibold text-gray-900">
                    It's exhausting, it's inefficient, and it leads straight to burnout.
                  </p>
                </div>
              </div>
              <div className="bg-white p-8 rounded-[40px] shadow-sm transform rotate-2 hover:rotate-0 transition-transform duration-500 border border-pebble">
                <div className="space-y-4">
                  {/* Fake messages UI */}
                  <div className="bg-gray-100 p-4 rounded-2xl rounded-tr-sm max-w-[80%]">
                    <p className="text-sm font-medium text-gray-800">Hey! Do you have any openings this Friday around 3?</p>
                  </div>
                  <div className="bg-lazie-primary/20 p-4 rounded-2xl rounded-tl-sm ml-auto max-w-[80%] text-right">
                    <p className="text-sm font-medium text-gray-900">Let me check... how about 4:30?</p>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-2xl rounded-tr-sm max-w-[80%]">
                    <p className="text-sm font-medium text-gray-800">Ah, that's too late. What about Saturday morning?</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The Solution */}
        <section className="py-24 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-6">
              A beautifully lazy solution
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              We realized that if we could put the booking power directly into the clients' hands with a seamless online interface, businesses could essentially run themselves overnight.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:border-lazie-primary transition-colors">
              <CalendarClock className="w-10 h-10 text-lazie-primary mb-6" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">Zero Friction Scheduling</h3>
              <p className="text-gray-600">Clients book instantly online, while your calendar seamlessly updates in real-time. No more double bookings or phone tag.</p>
            </div>
            <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:border-lazie-primary transition-colors">
              <HeartHandshake className="w-10 h-10 text-lazie-primary mb-6" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">Focus on Craft</h3>
              <p className="text-gray-600">With the busywork handled by software, professionals can focus 100% of their attention on the client in front of them.</p>
            </div>
            <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:border-lazie-primary transition-colors">
              <ShieldCheck className="w-10 h-10 text-lazie-primary mb-6" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">Peace of Mind</h3>
              <p className="text-gray-600">Automated reminders and upfront payments mean you never lose sleep over a no-show again.</p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Ready to regain your freedom?</h2>
          <Link 
            to="/register" 
            className="inline-block px-10 py-4 bg-lazie-primary text-gray-950 rounded-full font-bold text-lg hover:brightness-95 transition-all shadow-xl shadow-lazie-primary/20"
          >
            Claim Discount
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
