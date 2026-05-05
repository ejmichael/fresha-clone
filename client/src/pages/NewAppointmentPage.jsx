import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getServices, getStaff, getAvailability, createBooking } from '../api/api';
import { useAuth } from '../context/AuthContext';
import DatePicker from '../components/DatePicker';
import TimeSlots from '../components/TimeSlots';
import { ArrowLeft, CheckCircle } from 'lucide-react';

const inputClass = 'w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm transition-shadow';
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5';

const NewAppointmentPage = () => {
  const navigate = useNavigate();
  const { business } = useAuth();

  const [services, setServices] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const [selectedService, setSelectedService] = useState('');
  const [selectedStaff, setSelectedStaff] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [svcRes, staffRes] = await Promise.all([getServices(), getStaff()]);
        setServices(svcRes.data.filter(s => s.isActive));
        setStaff(staffRes.data);
      } catch (err) {
        console.error('Failed to load services/staff', err);
      } finally {
        setLoadingData(false);
      }
    };
    load();
  }, []);

  const service = services.find(s => s._id === selectedService) || null;
  const assignedStaff = service
    ? staff.filter(s => service.assignedStaff.includes(s._id))
    : [];

  useEffect(() => {
    if (!service || !selectedStaff || !selectedDate || !business) return;
    const fetch = async () => {
      setSlotsLoading(true);
      setSelectedTime(null);
      try {
        const offset = selectedDate.getTimezoneOffset() * 60000;
        const formattedDate = new Date(selectedDate.getTime() - offset).toISOString().split('T')[0];
        const { data } = await getAvailability({
          businessId: business._id,
          staffId: selectedStaff,
          serviceId: service._id,
          date: formattedDate,
        });
        setAvailableSlots(data);
      } catch {
        setAvailableSlots([]);
      } finally {
        setSlotsLoading(false);
      }
    };
    fetch();
  }, [selectedService, selectedStaff, selectedDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const offset = selectedDate.getTimezoneOffset() * 60000;
      const formattedDate = new Date(selectedDate.getTime() - offset).toISOString().split('T')[0];
      await createBooking({
        businessId: business._id,
        staffId: selectedStaff,
        serviceId: selectedService,
        date: formattedDate,
        time: selectedTime,
        clientName,
        clientEmail,
        clientPhone,
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create appointment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSuccess(false);
    setSelectedService('');
    setSelectedStaff('');
    setSelectedDate(null);
    setSelectedTime(null);
    setAvailableSlots([]);
    setClientName('');
    setClientEmail('');
    setClientPhone('');
    setError('');
  };

  if (loadingData) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Loading...</div>;
  }

  if (success) {
    return (
      <div className="p-4 lg:p-8 max-w-lg mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Appointment Created</h2>
          <p className="text-gray-500 mb-8">
            The appointment has been booked and a confirmation email has been sent to the client.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Back to Dashboard
            </button>
            <button
              onClick={resetForm}
              className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Book Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  const canSubmit =
    selectedService && selectedStaff && selectedDate && selectedTime &&
    clientName && clientEmail && clientPhone;

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-8">New Appointment</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Left — Scheduling */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-5">
              <h2 className="font-semibold text-gray-900">Appointment Details</h2>

              <div>
                <label className={labelClass}>Service *</label>
                <select
                  value={selectedService}
                  onChange={e => {
                    setSelectedService(e.target.value);
                    setSelectedStaff('');
                    setSelectedDate(null);
                    setSelectedTime(null);
                    setAvailableSlots([]);
                  }}
                  className={inputClass}
                  required
                >
                  <option value="">Select a service</option>
                  {services.map(s => (
                    <option key={s._id} value={s._id}>
                      {s.name} — {s.duration} mins
                    </option>
                  ))}
                </select>
              </div>

              {selectedService && (
                <div>
                  <label className={labelClass}>Staff Member *</label>
                  <select
                    value={selectedStaff}
                    onChange={e => {
                      setSelectedStaff(e.target.value);
                      setSelectedDate(null);
                      setSelectedTime(null);
                      setAvailableSlots([]);
                    }}
                    className={inputClass}
                    required
                  >
                    <option value="">Select staff</option>
                    {assignedStaff.map(s => (
                      <option key={s._id} value={s._id}>{s.name}</option>
                    ))}
                  </select>
                  {assignedStaff.length === 0 && (
                    <p className="mt-2 text-xs text-amber-600">No staff assigned to this service. Go to Settings to assign staff.</p>
                  )}
                </div>
              )}

              {selectedStaff && (
                <div>
                  <label className={labelClass}>Date *</label>
                  <DatePicker
                    selectedDate={selectedDate}
                    onChange={d => { setSelectedDate(d); setSelectedTime(null); }}
                  />
                </div>
              )}

              {selectedDate && (
                <div>
                  <label className={labelClass}>Time *</label>
                  <TimeSlots
                    slots={availableSlots}
                    loading={slotsLoading}
                    selectedTime={selectedTime}
                    onSelect={setSelectedTime}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right — Client details + summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
              <h2 className="font-semibold text-gray-900">Client Details</h2>
              <div>
                <label className={labelClass}>Full Name *</label>
                <input
                  type="text" required value={clientName}
                  onChange={e => setClientName(e.target.value)}
                  className={inputClass} placeholder="Jane Smith"
                />
              </div>
              <div>
                <label className={labelClass}>Email Address *</label>
                <input
                  type="email" required value={clientEmail}
                  onChange={e => setClientEmail(e.target.value)}
                  className={inputClass} placeholder="jane@example.com"
                />
              </div>
              <div>
                <label className={labelClass}>Phone Number *</label>
                <input
                  type="tel" required value={clientPhone}
                  onChange={e => setClientPhone(e.target.value)}
                  className={inputClass} placeholder="+27 71 234 5678"
                />
              </div>
            </div>

            {service && (
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 space-y-3 text-sm">
                <h2 className="font-semibold text-gray-900">Summary</h2>
                <div className="flex justify-between">
                  <span className="text-gray-500">Service</span>
                  <span className="font-medium text-gray-900">{service.name}</span>
                </div>
                {selectedStaff && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Staff</span>
                    <span className="font-medium text-gray-900">{staff.find(s => s._id === selectedStaff)?.name}</span>
                  </div>
                )}
                {selectedDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date</span>
                    <span className="font-medium text-gray-900">{selectedDate.toDateString()}</span>
                  </div>
                )}
                {selectedTime && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Time</span>
                    <span className="font-medium text-gray-900">{selectedTime}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-gray-200 pt-3 mt-1">
                  <span className="font-semibold text-gray-900">Price</span>
                  <span className="font-bold text-gray-900">
                    {service.currency === 'ZAR' ? 'R' : service.currency} {service.price}
                  </span>
                </div>
              </div>
            )}

            {error && (
              <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</p>
            )}

            <button
              type="submit"
              disabled={!canSubmit || submitting}
              className="w-full py-3 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Creating Appointment...' : 'Create Appointment'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewAppointmentPage;
