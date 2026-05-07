import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPublicBooking, getAvailability, reschedulePublicBooking } from '../api/api';
import DatePicker from '../components/DatePicker';
import TimeSlots from '../components/TimeSlots';
import { CalendarClock, CheckCircle, AlertCircle, Loader2, MapPin } from 'lucide-react';

const ReschedulePage = () => {
  const { id } = useParams();

  const [booking, setBooking] = useState(null);
  const [loadingBooking, setLoadingBooking] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getPublicBooking(id);
        setBooking(data);
      } catch {
        setNotFound(true);
      } finally {
        setLoadingBooking(false);
      }
    };
    fetch();
  }, [id]);

  useEffect(() => {
    if (!selectedDate || !booking) return;
    setSelectedTime(null);
    setAvailableSlots([]);
    setSlotsLoading(true);
    const load = async () => {
      try {
        const offset = selectedDate.getTimezoneOffset() * 60000;
        const formattedDate = new Date(selectedDate.getTime() - offset).toISOString().split('T')[0];
        const { data } = await getAvailability({
          businessId: booking.businessId,
          staffId: booking.staffId,
          serviceId: booking.serviceId,
          date: formattedDate,
        });
        setAvailableSlots(data);
      } catch {
        setAvailableSlots([]);
      } finally {
        setSlotsLoading(false);
      }
    };
    load();
  }, [selectedDate, booking]);

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime) return;
    setSubmitting(true);
    setError('');
    try {
      const offset = selectedDate.getTimezoneOffset() * 60000;
      const formattedDate = new Date(selectedDate.getTime() - offset).toISOString().split('T')[0];
      await reschedulePublicBooking(id, formattedDate, selectedTime);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reschedule. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingBooking) {
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
        <Link to="/" className="text-lazie-primary font-semibold hover:brightness-90 transition-colors">Back to Home</Link>
      </div>
    );
  }

  if (booking.status === 'cancelled') {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Appointment cancelled</h2>
        <p className="text-gray-500 mb-6">This appointment has been cancelled and cannot be rescheduled.</p>
        <Link to={`/book/${booking.business.slug}`} className="text-lazie-primary font-semibold hover:brightness-90 transition-colors">
          Book a new appointment →
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto w-full pt-10 pb-16 px-4 sm:px-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
          <CheckCircle size={56} className="text-green-500 mx-auto mb-5" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Appointment Rescheduled</h2>
          <p className="text-gray-500 mb-2">
            Your appointment at <strong>{booking.business.name}</strong> has been moved to:
          </p>
          <p className="text-lg font-semibold text-gray-900 mb-8">
            {selectedDate.toDateString()} at {selectedTime}
          </p>
          <p className="text-sm text-gray-400 mb-6">A confirmation email with the updated details has been sent to you.</p>
          <Link
            to={`/booking/${id}`}
            className="inline-block px-6 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors text-sm"
          >
            View booking confirmation
          </Link>
        </div>
      </div>
    );
  }

  const start = new Date(booking.startTime);

  return (
    <div className="max-w-3xl mx-auto w-full pt-8 pb-16 px-4 sm:px-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">{booking.business.name}</h1>
        {booking.business.address && (
          <div className="mt-2 flex items-center justify-center gap-1.5 text-gray-500">
            <MapPin size={16} />
            <span className="text-sm">{booking.business.address}</span>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Current booking summary */}
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-2 mb-3">
            <CalendarClock className="w-5 h-5 text-gray-400" />
            <h2 className="font-semibold text-gray-900">Current Appointment</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
            <div>
              <p className="text-gray-500">Service</p>
              <p className="font-medium text-gray-900">{booking.service.name}</p>
            </div>
            <div>
              <p className="text-gray-500">Professional</p>
              <p className="font-medium text-gray-900">{booking.staff.name}</p>
            </div>
            <div>
              <p className="text-gray-500">Currently scheduled</p>
              <p className="font-medium text-gray-900">
                {start.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at{' '}
                {start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Choose a new date &amp; time</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">Date</p>
              <DatePicker
                selectedDate={selectedDate}
                onChange={d => { setSelectedDate(d); setSelectedTime(null); }}
              />
            </div>

            <div>
              {selectedDate ? (
                <>
                  <p className="text-sm font-medium text-gray-700 mb-3">Available times</p>
                  <TimeSlots
                    slots={availableSlots}
                    loading={slotsLoading}
                    selectedTime={selectedTime}
                    onSelect={setSelectedTime}
                  />
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                  Select a date to see available times
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="mt-6 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!selectedDate || !selectedTime || submitting}
              className="flex-1 py-3 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Rescheduling...' : 'Confirm New Time'}
            </button>
            <Link
              to={`/booking/${id}`}
              className="flex-1 py-3 text-center bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Keep original time
            </Link>
          </div>

          <p className="mt-4 text-center text-xs text-gray-400">
            Rescheduling must be done at least 2 hours before your appointment.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReschedulePage;
