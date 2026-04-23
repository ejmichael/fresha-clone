import { Link } from 'react-router-dom';
import { Calendar, CreditCard, BarChart3, Megaphone, Smartphone, ShieldCheck, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: <Calendar className="w-8 h-8 text-lazie-primary" />,
    title: "Seamless Scheduling",
    description: "Manage your calendar with ease. Seamlessly handle bookings and client visits for any service."
  },
  {
    icon: <CreditCard className="w-8 h-8 text-lazie-primary" />,
    title: "Hassle-Free Payments",
    description: "Accept all forms of payment securely. Fast payouts and lower transaction fees for your convenience."
  },
  {
    icon: <Megaphone className="w-8 h-8 text-lazie-primary" />,
    title: "Smart Marketing",
    description: "Attract more clients with automated campaigns and smart reminders tailored to your business."
  },
  {
    icon: <BarChart3 className="w-8 h-8 text-lazie-primary" />,
    title: "Deep Insights",
    description: "Track your performance with reports into sales, staff, and customer trends."
  },
  {
    icon: <Smartphone className="w-8 h-8 text-lazie-primary" />,
    title: "Mobile Business",
    description: "Run your entire operation on the go with our top-rated app for pros and clients."
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-lazie-primary" />,
    title: "Secure & Scaling",
    description: "Your data is always safe with enterprise-grade security as your business grows."
  }
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-pebble/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
            Powerful tools for <span className="text-lazie-primary italic font-serif drop-shadow-sm">every service</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to streamline your operations and delight your clients, no matter what you do.
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

        <div className="mt-16 text-center">
          <Link 
            to="/features" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-pebble rounded-full font-bold text-gray-900 hover:bg-gray-50 transition-all shadow-sm group"
          >
            Explore all features <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Features;
