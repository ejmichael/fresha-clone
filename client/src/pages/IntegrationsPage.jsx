import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  Globe,
  MapPin,
  Copy,
  CheckCheck,
  Code2,
  MousePointerClick,
  Search,
  Smartphone,
  ArrowRight,
  ExternalLink,
  Hammer,
  Rocket,
  Star,
} from 'lucide-react';

const Step = ({ number, title, description, children }) => (
  <div className="flex gap-5">
    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-900 text-white font-black flex items-center justify-center text-sm">
      {number}
    </div>
    <div className="pt-1.5 flex-1">
      <h4 className="font-bold text-gray-900 mb-1">{title}</h4>
      <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
      {children && <div className="mt-3">{children}</div>}
    </div>
  </div>
);

const CodeBlock = ({ code }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative bg-gray-950 rounded-xl overflow-hidden">
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-lg transition-colors"
      >
        {copied ? <><CheckCheck className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
      </button>
      <pre className="p-5 pr-20 text-sm text-green-300 font-mono overflow-x-auto leading-relaxed whitespace-pre-wrap">
        {code}
      </pre>
    </div>
  );
};

const IntegrationsPage = () => {
  const exampleSlug = 'your-business-name';
  const exampleUrl = `https://lazie.co.za/book/${exampleSlug}`;

  const buttonSnippet = `<a
  href="${exampleUrl}"
  target="_blank"
  style="
    display: inline-block;
    padding: 14px 28px;
    background-color: #f0ff00;
    color: #111111;
    font-weight: 700;
    font-size: 16px;
    border-radius: 50px;
    text-decoration: none;
    font-family: sans-serif;
  "
>
  Book an Appointment
</a>`;

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-pebble/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-lazie-primary/20 rounded-full text-lazie-dark font-bold mb-6 text-sm uppercase tracking-wide">
              <Globe className="w-4 h-4" /> Get More Bookings
            </div>
            <h1 className="text-5xl font-extrabold text-gray-900 sm:text-6xl mb-6 leading-tight tracking-tight">
              Put your booking link<br />
              <span className="text-lazie-primary italic font-serif">everywhere clients look.</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              Your lazie booking page is ready to go. Add it to your website and Google Business Profile in minutes — no coding experience needed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#website" className="px-8 py-4 bg-lazie-primary text-gray-950 rounded-full font-bold text-base hover:brightness-95 transition-all shadow-xl shadow-lazie-primary/20 flex items-center justify-center gap-2">
                Website Integration <ArrowRight size={18} />
              </a>
              <a href="#google" className="px-8 py-4 bg-white border-2 border-gray-200 rounded-full font-bold text-base hover:bg-gray-50 transition-all text-gray-900 flex items-center justify-center gap-2">
                Google Business <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-lazie-primary/10 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[500px] h-[500px] bg-prince/5 rounded-full blur-3xl opacity-40" />
      </section>

      {/* Quick stat bar */}
      <div className="bg-gray-950 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-white">
            {[
              { icon: <MousePointerClick className="w-5 h-5 text-lazie-primary" />, stat: '2 minutes', label: 'to add to your website' },
              { icon: <Search className="w-5 h-5 text-lazie-primary" />, stat: '1 billion+', label: 'monthly Google searches for local services' },
              { icon: <Smartphone className="w-5 h-5 text-lazie-primary" />, stat: '76%', label: 'of people book on their phone' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-center gap-3">
                {item.icon}
                <div className="text-left">
                  <span className="font-black text-lazie-primary text-lg">{item.stat}</span>
                  <span className="text-gray-400 text-sm ml-2">{item.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 1 — Website Integration */}
      <section id="website" className="py-24 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-lazie-primary/10 rounded-full text-lazie-dark font-bold mb-6 text-sm">
                <Globe className="w-4 h-4" /> Your Website
              </div>
              <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                Add a booking button to your website
              </h2>
              <p className="text-gray-500 text-lg mb-10 leading-relaxed">
                Paste one snippet of code anywhere on your site — your homepage, contact page, or floating in the corner — and visitors can book directly without leaving.
              </p>

              <div className="space-y-8">
                <Step
                  number="1"
                  title="Copy your booking link"
                  description="From your lazie dashboard, go to Business Setup and copy your unique booking page URL. It looks like:"
                >
                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm font-mono text-gray-700 mt-2">
                    <Globe className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    lazie.co.za/book/<span className="text-lazie-dark font-bold">your-business-name</span>
                  </div>
                </Step>

                <Step
                  number="2"
                  title="Option A — Just add a link"
                  description="The simplest approach. In your website editor (Wix, Squarespace, Showit, WordPress, etc.), add a button or text link and paste your booking URL as the destination. That's it."
                />

                <Step
                  number="3"
                  title="Option B — Use our ready-made button"
                  description="Copy this HTML snippet and paste it into any HTML block on your site. Replace the URL with your own booking link."
                />
              </div>
            </div>

            <div className="space-y-6 lg:pt-20">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Ready-to-paste button code</p>
                <CodeBlock code={buttonSnippet} />
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Preview</p>
                <div className="flex items-center justify-center py-6">
                  <a
                    href="#"
                    onClick={e => e.preventDefault()}
                    style={{
                      display: 'inline-block',
                      padding: '14px 28px',
                      backgroundColor: '#f0ff00',
                      color: '#111111',
                      fontWeight: 700,
                      fontSize: 16,
                      borderRadius: 50,
                      textDecoration: 'none',
                    }}
                  >
                    Book an Appointment
                  </a>
                </div>
                <p className="text-center text-xs text-gray-400">This is exactly what visitors will see on your site</p>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                <div className="flex gap-3">
                  <Code2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-blue-900 text-sm mb-1">Works with any platform</p>
                    <p className="text-blue-700 text-sm">Wix, Squarespace, Showit, WordPress, Webflow, Framer, plain HTML — if you can add a link or a button, you can add lazie.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-t border-gray-100" />
      </div>

      {/* SECTION 2 — Google Business Profile */}
      <section id="google" className="py-24 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">

            {/* Visual left side */}
            <div className="order-2 lg:order-1 space-y-4">
              {/* Mock Google card */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gray-50 px-5 py-4 border-b border-gray-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-lazie-primary/20 flex items-center justify-center font-black text-lazie-dark text-sm">B</div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Your Business Name</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3" /> Barbershop · Cape Town</p>
                  </div>
                </div>
                <div className="px-5 py-4 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="text-yellow-400 flex">{'★★★★★'}</div>
                    <span className="font-medium">4.9</span>
                    <span className="text-gray-400">(127 reviews)</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {['Directions', 'Call', 'Website'].map(a => (
                      <div key={a} className="bg-gray-100 rounded-lg py-2 text-center text-xs font-semibold text-gray-700">{a}</div>
                    ))}
                  </div>
                  <div className="bg-lazie-primary rounded-xl py-3 text-center">
                    <p className="text-gray-900 font-bold text-sm flex items-center justify-center gap-2">
                      <MousePointerClick className="w-4 h-4" /> Book an Appointment
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 text-center">↑ This button appears directly in Google Search & Maps</p>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
                <div className="flex gap-3">
                  <Star className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-amber-900 text-sm mb-1">Why this matters</p>
                    <p className="text-amber-800 text-sm">When someone searches for your business type in your area, they'll see a "Book" button directly in the search results — before they even visit your website.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Steps right side */}
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full text-blue-700 font-bold mb-6 text-sm">
                <Search className="w-4 h-4" /> Google Business Profile
              </div>
              <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                Show a "Book Now" button in Google Search
              </h2>
              <p className="text-gray-500 text-lg mb-10 leading-relaxed">
                Google lets you add a direct booking link to your Business Profile. When people find you on Google Maps or Search, they'll see a button that takes them straight to your lazie booking page.
              </p>

              <div className="space-y-8">
                <Step
                  number="1"
                  title='Go to your Google Business Profile'
                  description='Visit business.google.com and sign in with the Google account linked to your business.'
                >
                  <a
                    href="https://business.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-blue-600 font-semibold hover:underline mt-1"
                  >
                    Open Google Business <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </Step>

                <Step
                  number="2"
                  title='Click "Edit profile"'
                  description='On your business dashboard, click the "Edit profile" button at the top of the page.'
                />

                <Step
                  number="3"
                  title='Go to the "Contact" tab'
                  description='Inside the editor, select the "Contact" tab where your phone number, website, and links are managed.'
                />

                <Step
                  number="4"
                  title='Find "Appointment links" and paste your URL'
                  description='Scroll down to the "Appointment links" or "Booking" field. Paste your lazie booking link — lazie.co.za/book/your-business-name — and click Save.'
                />

                <Step
                  number="5"
                  title="You're live on Google"
                  description='Within a few hours, a "Book an Appointment" button will appear on your Google Business listing in both Search and Maps. Clients can book directly without calling.'
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — No website? We'll build one */}
      <section className="py-24 bg-gray-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-lazie-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-lazie-primary/20 rounded-full text-lazie-primary font-bold mb-6 text-sm uppercase tracking-wide">
                <Hammer className="w-4 h-4" /> Don't have a website?
              </div>
              <h2 className="text-4xl font-extrabold text-white mb-6 tracking-tight">
                We'll build your website.<br />
                <span className="text-lazie-primary italic font-serif">Fast. Affordable. Done.</span>
              </h2>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                You don't need a website to use lazie — your booking link works on its own. But if you want a professional online presence to match, we've got you covered.
              </p>
              <p className="text-gray-400 text-lg mb-10 leading-relaxed">
                We build clean, fast, mobile-ready websites for salons, barbershops, spas, and service businesses — with your lazie booking link built right in. Most sites are ready in under a week.
              </p>

              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-lazie-primary text-gray-950 rounded-full font-bold text-base hover:brightness-95 transition-all shadow-xl shadow-lazie-primary/20"
              >
                Get in touch <ArrowRight size={18} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  icon: <Rocket className="w-6 h-6 text-lazie-primary" />,
                  title: 'Ready in days',
                  desc: 'Not weeks or months. We move fast so you can start taking bookings sooner.',
                },
                {
                  icon: <Smartphone className="w-6 h-6 text-lazie-primary" />,
                  title: 'Mobile-first',
                  desc: 'Over 70% of your clients will visit on their phone. We design for that.',
                },
                {
                  icon: <MousePointerClick className="w-6 h-6 text-lazie-primary" />,
                  title: 'Booking built in',
                  desc: 'Your lazie booking link is woven into the site from day one. No extra steps.',
                },
                {
                  icon: <Star className="w-6 h-6 text-lazie-primary" />,
                  title: 'Looks the part',
                  desc: 'Clean, professional design that matches your brand and builds trust with clients.',
                },
              ].map((card, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <div className="mb-4">{card.icon}</div>
                  <h3 className="font-bold text-white mb-2">{card.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-pebble/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Ready to take more bookings?
          </h2>
          <p className="text-gray-500 text-lg mb-10">
            Sign up for lazie, set up your profile, and share your link. It takes less than 10 minutes to go live.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-10 py-5 bg-lazie-primary text-gray-950 rounded-full font-bold text-lg hover:brightness-95 transition-all shadow-xl shadow-lazie-primary/20 flex items-center justify-center gap-2"
            >
              Start for R 14.90<ArrowRight size={20} />
            </Link>
            <Link
              to="/contact"
              className="px-10 py-5 bg-white border-2 border-gray-200 rounded-full font-bold text-lg hover:bg-gray-50 transition-all text-gray-900 flex items-center justify-center gap-2"
            >
              Talk to us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default IntegrationsPage;
