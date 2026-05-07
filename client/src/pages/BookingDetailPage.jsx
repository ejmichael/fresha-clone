import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPublicBooking } from '../api/api';
import { CheckCircle, Calendar, Download, MapPin, Clock, User, Loader2, AlertCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const BookingDetailPage = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getPublicBooking(id);
        setBooking(data);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-lazie-primary animate-spin mb-4" />
        <p className="text-gray-500">Loading booking...</p>
      </div>
    );
  }

  if (notFound || !booking) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Booking not found</h2>
        <p className="text-gray-500 mb-6">This booking may have been removed or the link is invalid.</p>
        <Link to="/" className="text-lazie-primary font-semibold hover:brightness-90 transition-colors">
          Back to Home
        </Link>
      </div>
    );
  }

  const start = new Date(booking.startTime);
  const isCancelled = booking.status === 'cancelled';
  const currency = booking.service.currency === 'ZAR' ? 'R' : booking.service.currency;

  return (
    <div className="max-w-lg mx-auto w-full pt-10 pb-16 px-4 sm:px-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        <div className={`px-8 pt-10 pb-8 text-center border-b border-gray-100 ${isCancelled ? 'bg-red-50' : ''}`}>
          <div className="flex justify-center mb-5">
            {isCancelled ? (
              <AlertCircle size={56} className="text-red-400" />
            ) : (
              <CheckCircle size={56} className="text-green-500" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {isCancelled ? 'Booking Cancelled' : 'Booking Confirmed'}
          </h1>
          <p className="text-gray-500 text-sm">
            {isCancelled
              ? 'This appointment has been cancelled.'
              : `Your appointment at ${booking.business.name} is confirmed.`}
          </p>
        </div>

        <div className="px-8 py-6 space-y-4 text-sm">
          <div className="flex items-start gap-3">
            <Calendar className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-900">
                {start.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              <p className="text-gray-500 flex items-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5" />
                {start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                {' '}· {booking.service.duration} mins
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <User className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-900">{booking.service.name}</p>
              <p className="text-gray-500">with {booking.staff.name}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-900">{booking.business.name}</p>
              {booking.business.address && (
                <p className="text-gray-500">{booking.business.address}</p>
              )}
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
            <span className="text-gray-500">Total</span>
            <span className="text-lg font-bold text-gray-900">{currency} {booking.service.price}</span>
          </div>
        </div>

        {!isCancelled && booking.calendarUrl && (
          <div className="px-8 pb-6 flex flex-col sm:flex-row gap-3">
            <a
              href={booking.calendarUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#4285F4] text-white font-medium rounded-lg hover:bg-[#3367D6] transition-colors text-sm"
            >
              <Calendar size={16} />
              Add to Google Calendar
            </a>
            <a
              href={`${API_URL}${booking.icsDownloadUrl.replace('/api', '')}`}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm shadow-sm"
            >
              <Download size={16} />
              Download .ics
            </a>
          </div>
        )}

        <div className="px-8 pb-8 pt-2 border-t border-gray-100 text-center space-y-2">
          {!isCancelled && (
            <div>
              <Link
                to={`/reschedule/${booking.id}`}
                className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
              >
                Need to reschedule?
              </Link>
            </div>
          )}
          {!isCancelled && (
            <div>
              <Link
                to={`/cancel/${booking.id}`}
                className="text-sm text-gray-400 hover:text-red-500 transition-colors"
              >
                Need to cancel this booking?
              </Link>
            </div>
          )}
          {isCancelled && (
            <Link
              to={`/book/${booking.business.slug}`}
              className="text-sm font-semibold text-lazie-primary hover:brightness-90 transition-colors"
            >
              Book a new appointment →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetailPage;
