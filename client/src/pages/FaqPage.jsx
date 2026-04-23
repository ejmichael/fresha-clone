import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const FaqPage = () => {
  const faqs = [
    {
      question: "What is Lazie?",
      answer: "Lazie is an all-in-one booking and business management platform designed for service-based businesses like salons, spas, barbershops, and consultants. We help you manage appointments, process payments, and connect with your clients."
    },
    {
      question: "Do I need a credit card to sign up for the free trial?",
      answer: "No, you do not need a credit card to start your 14-day free trial. You can explore all the features risk-free and decide to upgrade when you are ready."
    },
    {
      question: "Can I upgrade or downgrade my plan at any time?",
      answer: "Absolutely. You can change your plan directly from your dashboard billing settings. Changes take effect immediately, and we'll prorate your next invoice accordingly."
    },
    {
      question: "Will Lazie send automated reminders to my clients?",
      answer: "Yes! Lazie can send automated email and SMS reminders to your clients to drastically reduce no-shows. This feature is included in Growth and Pro plans."
    },
    {
      question: "How long does it take to get set up?",
      answer: "You can be up and running in less than 5 minutes. The onboarding process is designed to be frictionless—just add your services, setup your working hours, and you're ready to accept bookings."
    },
    {
      question: "Is my data secure?",
      answer: "We take security extremely seriously. All data is encrypted in transit and at rest using industry-standard protocols. We never sell your data to third parties."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-gray-600">
              Can't find the answer you're looking for? Reach out to our <a href="#" className="text-lazie-primary font-bold hover:underline">support team</a>.
            </p>
          </div>

          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600 leading-relaxed text-lg">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FaqPage;
