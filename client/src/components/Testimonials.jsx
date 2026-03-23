import React from 'react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "Fresha has transformed how I run my salon. The booking system is seamless and my clients love it.",
    author: "Sarah Johnson",
    role: "Owner, Glow Beauty Salon",
    rating: 5
  },
  {
    quote: "The marketing tools have helped me increase my client base by 40% in just three months.",
    author: "Michael Chen",
    role: "Director, Zen Spa & Wellness",
    rating: 5
  },
  {
    quote: "I love the integrated payments. No more chasing clients for missed appointments or late payments.",
    author: "Emma Williams",
    role: "Lead Stylist, The Cutting Edge",
    rating: 5
  }
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
            Trusted by <span className="text-prince italic font-serif">industry leaders</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of happy business owners who have elevated their business.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
          {/* Decorative element */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
            <Quote size={400} className="text-prince fill-prince" />
          </div>

          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="p-10 bg-pebble/30 rounded-[40px] border border-transparent hover:border-prince/20 transition-all duration-500 group"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={20} className="fill-limelight text-limelight" />
                ))}
              </div>
              <p className="text-xl text-gray-800 leading-relaxed mb-8 font-medium">
                "{testimonial.quote}"
              </p>
              <div>
                <p className="font-bold text-gray-900 text-lg">{testimonial.author}</p>
                <p className="text-prince font-semibold">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
