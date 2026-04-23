import React from 'react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "This platform has completely streamlined my shop's calendar. My clients love the ease of booking their own cuts.",
    author: "James Miller",
    role: "Owner, Classic Cuts Barbershop",
    rating: 5
  },
  {
    quote: "The automated reminders have virtually eliminated my no-shows. It's an essential tool for any coaching business.",
    author: "Elena Rodriguez",
    role: "Performance Coach, Peak Potential",
    rating: 5
  },
  {
    quote: "I can manage my service calls and take payments right from the job site. It saves me hours of admin work every week.",
    author: "David Thompson",
    role: "Owner, Thompson's Professional Plumbing",
    rating: 5
  }
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
            Built for <span className="text-lazie-primary italic font-serif">professionals like you</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of business owners across all industries who have simplified their workflow.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
          {/* Decorative element */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
            <Quote size={400} className="text-lazie-primary fill-lazie-primary" />
          </div>

          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="p-10 bg-pebble/30 rounded-[40px] border border-transparent hover:border-prince/20 transition-all duration-500 group"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={20} className="fill-lazie-primary text-lazie-primary" />
                ))}
              </div>
              <p className="text-xl text-gray-800 leading-relaxed mb-8 font-medium">
                "{testimonial.quote}"
              </p>
              <div>
                <p className="font-bold text-gray-900 text-lg">{testimonial.author}</p>
                <p className="text-lazie-dark font-semibold">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
