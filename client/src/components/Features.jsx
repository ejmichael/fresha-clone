import React from 'react';
import { Calendar, CreditCard, BarChart3, Megaphone, Smartphone, ShieldCheck } from 'lucide-react';

const features = [
  {
    icon: <Calendar className="w-8 h-8 text-prince" />,
    title: "Appointment Scheduling",
    description: "Manage your calendar with ease. Seamlessly handle bookings and client visits."
  },
  {
    icon: <CreditCard className="w-8 h-8 text-elton" />,
    title: "Integrated Payments",
    description: "Accept all forms of payment securely. Fast payouts and lower transaction fees."
  },
  {
    icon: <Megaphone className="w-8 h-8 text-hucknall" />,
    title: "Marketing Tools",
    description: "Attract more clients with smart marketing campaigns and automated reminders."
  },
  {
    icon: <BarChart3 className="w-8 h-8 text-frank" />,
    title: "Advanced Reporting",
    description: "Track your performance with deep insights into sales, staff, and inventory."
  },
  {
    icon: <Smartphone className="w-8 h-8 text-ceelo" />,
    title: "Mobile App",
    description: "Run your business on the go with our top-rated app for pros and clients."
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-prince" />,
    title: "Secure & Reliable",
    description: "Your data is always safe with enterprise-grade security and 99.9% uptime."
  }
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-pebble/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
            Powerful tools for <span className="text-prince">your business</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to streamline your operations and delight your clients.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="p-8 bg-white rounded-3xl shadow-sm border border-pebble hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="mb-6 p-4 bg-gray-50 rounded-2xl inline-block">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed text-lg">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
