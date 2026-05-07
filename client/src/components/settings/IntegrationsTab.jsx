import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Copy, CheckCheck, Globe, Search, ExternalLink, ArrowRight, MapPin } from 'lucide-react';

const BASE_URL = 'https://lazie.co.za';

const CopyField = ({ value, label }) => {
  const [copied, setCopied] = useState(false);
  const handle = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div>
      {label && <p className="text-xs font-medium text-gray-500 mb-1.5">{label}</p>}
      <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
        <Globe className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <span className="text-sm font-mono text-gray-800 flex-1 truncate">{value}</span>
        <button
          type="button"
          onClick={handle}
          className="flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md bg-white border border-gray-200 hover:bg-gray-100 transition-colors"
        >
          {copied ? <><CheckCheck className="w-3.5 h-3.5 text-green-500" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
        </button>
      </div>
    </div>
  );
};

const CodeBlock = ({ code }) => {
  const [copied, setCopied] = useState(false);
  const handle = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative bg-gray-950 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={handle}
        className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-lg transition-colors"
      >
        {copied ? <><CheckCheck className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
      </button>
      <pre className="p-5 pr-24 text-sm text-green-300 font-mono overflow-x-auto leading-relaxed whitespace-pre-wrap">
        {code}
      </pre>
    </div>
  );
};

const Step = ({ number, title, description, children }) => (
  <div className="flex gap-4">
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-900 text-white font-black flex items-center justify-center text-xs">
      {number}
    </div>
    <div className="pt-1 flex-1">
      <p className="text-sm font-semibold text-gray-900 mb-0.5">{title}</p>
      <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
      {children && <div className="mt-2">{children}</div>}
    </div>
  </div>
);

const IntegrationsTab = ({ profile }) => {
  const slug = profile?.slug || '';
  const bookingUrl = `${BASE_URL}/book/${slug}`;

  const buttonSnippet = `<a
  href="${bookingUrl}"
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
    <div className="max-w-3xl space-y-10">

      {/* Your booking link */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Your booking link</h2>
        <p className="text-sm text-gray-500 mb-4">This is your unique public booking page. Share it anywhere — social media, WhatsApp, email, your website.</p>
        <CopyField value={bookingUrl} />
        <a
          href={bookingUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 mt-3 text-sm font-medium text-lazie-dark hover:underline"
        >
          Preview your booking page <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </section>

      <hr className="border-gray-100" />

      {/* Website section */}
      <section>
        <div className="flex items-center gap-2 mb-1">
          <Globe className="w-5 h-5 text-gray-400" />
          <h2 className="text-lg font-bold text-gray-900">Add to your website</h2>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          Add a booking button to your website so visitors can book directly. Works with Wix, Squarespace, Showit, WordPress, Webflow, and any other platform.
        </p>

        <div className="space-y-6">
          <Step
            number="1"
            title="The simple way — add a link or button"
            description="In your website editor, add a button or text link and paste your booking URL as the destination. No code needed."
          >
            <CopyField value={bookingUrl} />
          </Step>

          <Step
            number="2"
            title="The branded way — use our ready-made button"
            description="Copy this HTML snippet and paste it into any HTML block or custom code section on your site. Your actual booking URL is already embedded."
          >
            <div className="mt-3">
              <CodeBlock code={buttonSnippet} />
            </div>
          </Step>
        </div>
      </section>

      <hr className="border-gray-100" />

      {/* Google Business section */}
      <section>
        <div className="flex items-center gap-2 mb-1">
          <Search className="w-5 h-5 text-gray-400" />
          <h2 className="text-lg font-bold text-gray-900">Add to Google Business Profile</h2>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          Show a "Book an Appointment" button directly in Google Search and Maps results. When someone finds you on Google, they can book without visiting your website first.
        </p>

        <div className="space-y-6">
          <Step
            number="1"
            title="Open Google Business Profile"
            description="Go to business.google.com and sign in with the Google account linked to your business."
          >
            <a
              href="https://business.google.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 mt-2 text-sm font-semibold text-blue-600 hover:underline"
            >
              Open Google Business <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </Step>

          <Step
            number="2"
            title='Click "Edit profile"'
            description='On your business dashboard, find the "Edit profile" button near the top of the page.'
          />

          <Step
            number="3"
            title='Go to the "Contact" tab'
            description='Inside the editor, select the "Contact" tab where your phone, website, and links are managed.'
          />

          <Step
            number="4"
            title='Paste your booking link under "Appointment links"'
            description='Scroll down to the "Appointment links" or "Booking" field and paste your lazie booking URL. Click Save.'
          >
            <CopyField value={bookingUrl} label="Paste this URL into the field" />
          </Step>

          <Step
            number="5"
            title="Done — you're live on Google"
            description='Within a few hours, a "Book an Appointment" button will appear on your listing in both Google Search and Google Maps.'
          />
        </div>

        <div className="mt-6 bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3">
          <MapPin className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            <span className="font-semibold">Tip:</span> This works best if your Google Business listing is verified and fully set up with your category, address, and hours.
          </p>
        </div>
      </section>

      <hr className="border-gray-100" />

      {/* No website CTA */}
      <section className="bg-gray-900 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="font-bold text-white mb-1">Don't have a website yet?</p>
          <p className="text-sm text-gray-400">We build clean, fast, mobile-ready websites for service businesses — with your booking link built right in. Most sites are ready in under a week.</p>
        </div>
        <Link
          to="/contact"
          className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-lazie-primary text-gray-950 rounded-full font-bold text-sm hover:brightness-95 transition-all whitespace-nowrap"
        >
          Get in touch <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      <div className="text-center pb-2">
        <Link
          to="/integrations"
          target="_blank"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"
        >
          View full integration guide <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
};

export default IntegrationsTab;
