import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAppointmentById, updateAppointmentStatus, getInvoices, getAvailability, rescheduleAppointment } from '../api/api';
import { ArrowLeft, Clock, User, Phone, Mail, FileText, Calendar, CheckCircle, XCircle, ExternalLink, CalendarClock, ChevronRight } from 'lucide-react';
import DatePicker from '../components/DatePicker';
import TimeSlots from '../components/TimeSlots';

const AppointmentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [relatedInvoice, setRelatedInvoice] = useState(null);

  const [showReschedule, setShowReschedule] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState(null);
  const [rescheduleTime, setRescheduleTime] = useState(null);
  const [rescheduleSlots, setRescheduleSlots] = useState([]);
  const [rescheduleSlotsLoading, setRescheduleSlotsLoading] = useState(false);
  const [rescheduleError, setRescheduleError] = useState('');
  const [rescheduleLoading, setRescheduleLoading] = useState(false);

  const fetchAppointment = async () => {
    try {
      const { data } = await getAppointmentById(id);
      setAppointment(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load appointment details');
    } finally {
      setLoading(false);
    }
  };

  const fetchInvoice = async () => {
    try {
      const { data } = await getInvoices({ appointmentId: id });
      if (data.invoices && data.invoices.length > 0) {
        setRelatedInvoice(data.invoices[0]);
      }
    } catch (err) {
      console.error('Failed to fetch related invoice');
    }
  };

  useEffect(() => {
    if (id) {
      fetchAppointment();
      fetchInvoice();
    }
  }, [id]);

  useEffect(() => {
    if (!rescheduleDate || !appointment) return;
    setRescheduleTime(null);
    setRescheduleSlots([]);
    setRescheduleSlotsLoading(true);
    const load = async () => {
      try {
        const offset = rescheduleDate.getTimezoneOffset() * 60000;
        const formattedDate = new Date(rescheduleDate.getTime() - offset).toISOString().split('T')[0];
        const { data } = await getAvailability({
          businessId: appointment.business,
          staffId: appointment.staff._id,
          serviceId: appointment.service._id,
          date: formattedDate,
        });
        setRescheduleSlots(data);
      } catch {
        setRescheduleSlots([]);
      } finally {
        setRescheduleSlotsLoading(false);
      }
    };
    load();
  }, [rescheduleDate, appointment]);

  const handleReschedule = async () => {
    if (!rescheduleDate || !rescheduleTime) return;
    setRescheduleLoading(true);
    setRescheduleError('');
    try {
      const offset = rescheduleDate.getTimezoneOffset() * 60000;
      const formattedDate = new Date(rescheduleDate.getTime() - offset).toISOString().split('T')[0];
      await rescheduleAppointment(id, formattedDate, rescheduleTime);
      setShowReschedule(false);
      setRescheduleDate(null);
      setRescheduleTime(null);
      await fetchAppointment();
    } catch (err) {
      setRescheduleError(err.response?.data?.message || 'Failed to reschedule. Please try again.');
    } finally {
      setRescheduleLoading(false);
    }
  };

  const handleUpdateStatus = async (status) => {
    if (!window.confirm(`Are you sure you want to mark this appointment as ${status}?`)) return;

    setActionLoading(true);
    try {
      await updateAppointmentStatus(id, status);
      await fetchAppointment(); // refresh data
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="p-8 flex items-center justify-center animate-pulse text-gray-500">Loading appointment...</div>;
  if (error || !appointment) return <div className="p-8 text-red-500">{error || 'Appointment not found'}</div>;

  const start = new Date(appointment.startTime);
  const formattedDate = start.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const formattedTime = start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const statusConfig = {
    confirmed: { color: 'bg-teal-100 text-teal-800 border-teal-200' },
    completed: { color: 'bg-gray-100 text-gray-800 border-gray-200' },
    cancelled: { color: 'bg-red-100 text-red-800 border-red-200' }
  };

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header Area */}
        <div className="border-b border-gray-200 bg-gray-50 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Appointment Details</h1>
            <p className="text-gray-500 mt-1 flex items-center">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${statusConfig[appointment.status]?.color || 'bg-gray-100 text-gray-800'}`}>
                {appointment.status}
              </span>
              <span className="ml-3 text-sm">ID: {appointment._id.substring(0, 8)}...</span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
            {appointment.status === 'confirmed' ? (
              <>
                <button
                  onClick={() => { setShowReschedule(s => !s); setRescheduleError(''); }}
                  disabled={actionLoading}
                  className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 disabled:opacity-70"
                >
                  <CalendarClock className="w-4 h-4 mr-2" /> Reschedule
                </button>
                <button
                  onClick={() => handleUpdateStatus('completed')}
                  disabled={actionLoading}
                  className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-70"
                >
                  <CheckCircle className="w-4 h-4 mr-2" /> Mark as Complete
                </button>
                <button
                  onClick={() => handleUpdateStatus('cancelled')}
                  disabled={actionLoading}
                  className="inline-flex justify-center items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-70"
                >
                  <XCircle className="w-4 h-4 mr-2" /> Cancel Appointment
                </button>
              </>
            ) : (
              <div className="px-4 py-2 border border-gray-200 text-sm font-medium rounded-md text-gray-400 bg-gray-50 text-center cursor-not-allowed">
                No actions available
              </div>
            )}

            {relatedInvoice && (
              <button
                onClick={() => navigate('/dashboard/invoices')}
                className="inline-flex justify-center items-center px-4 py-2 border border-lazie-primary/30 text-sm font-bold rounded-full text-lazie-dark bg-lazie-primary/10 hover:bg-lazie-primary/20 transition-all uppercase"
              >
                <FileText className="w-4 h-4 mr-2" /> View Invoice {relatedInvoice.invoiceNumber}
              </button>
            )}
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Client Details */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-lazie-primary" /> Client Information
            </h2>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                <dd className="mt-1 text-base text-gray-900 font-medium">{appointment.clientName}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 flex items-center"><Mail className="w-4 h-4 mr-1" /> Email Address</dt>
                <dd className="mt-1 text-sm text-lazie-primary hover:text-lazie-dark">
                  <a href={`mailto:${appointment.clientEmail}`}>{appointment.clientEmail}</a>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 flex items-center"><Phone className="w-4 h-4 mr-1" /> Phone Number</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <a href={`tel:${appointment.clientPhone}`} className="hover:text-lazie-primary">{appointment.clientPhone}</a>
                </dd>
              </div>
              {appointment.notes && (
                <div className="bg-gray-50 p-3 rounded border border-gray-200">
                  <dt className="text-sm font-medium text-gray-500 mb-1 flex items-center"><FileText className="w-4 h-4 mr-1" /> Booking Notes</dt>
                  <dd className="text-sm text-gray-700 italic">"{appointment.notes}"</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Appointment Details */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-lazie-primary" /> Booking Details
            </h2>
            <div className="bg-lazie-primary/10 border border-lazie-primary/20 rounded-lg p-4 mb-5">
              <div className="text-lazie-dark font-semibold text-lg">{formattedDate}</div>
              <div className="text-lazie-primary flex items-center mt-1">
                <Clock className="w-4 h-4 mr-1.5" /> {formattedTime}
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-y-4 gap-x-4">
              <div className="col-span-2">
                <dt className="text-sm font-medium text-gray-500">Service</dt>
                <dd className="mt-1 text-base text-gray-900 font-medium">{appointment.service?.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Staff Member</dt>
                <dd className="mt-1 text-sm text-gray-900">{appointment.staff?.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Duration</dt>
                <dd className="mt-1 text-sm text-gray-900">{appointment.service?.duration} mins</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Price</dt>
                <dd className="mt-1 text-lg font-bold text-gray-900">
                  {appointment.service?.currency || 'R'} {appointment.service?.price}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {showReschedule && appointment.status === 'confirmed' && (
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <CalendarClock className="w-5 h-5 text-lazie-primary" /> Reschedule Appointment
            </h2>
            <button
              type="button"
              onClick={() => { setShowReschedule(false); setRescheduleDate(null); setRescheduleTime(null); setRescheduleError(''); }}
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              Cancel
            </button>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">Select a new date</p>
              <DatePicker selectedDate={rescheduleDate} onChange={d => { setRescheduleDate(d); setRescheduleTime(null); }} />
            </div>
            <div>
              {rescheduleDate && (
                <>
                  <p className="text-sm font-medium text-gray-700 mb-3">Select a new time</p>
                  <TimeSlots
                    slots={rescheduleSlots}
                    loading={rescheduleSlotsLoading}
                    selectedTime={rescheduleTime}
                    onSelect={setRescheduleTime}
                  />
                </>
              )}
            </div>
          </div>
          {rescheduleError && (
            <div className="mx-6 mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
              {rescheduleError}
            </div>
          )}
          <div className="px-6 pb-6">
            <button
              type="button"
              onClick={handleReschedule}
              disabled={!rescheduleDate || !rescheduleTime || rescheduleLoading}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
              {rescheduleLoading ? 'Rescheduling...' : 'Confirm Reschedule'}
            </button>
          </div>
        </div>
      )}

      {relatedInvoice && (
        <div className="bg-teal-50 border-t border-teal-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-teal-900 uppercase tracking-wider flex items-center">
              <FileText className="w-4 h-4 mr-2" /> Invoice Summary
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                appointment.status === 'confirmed' ? 'bg-lazie-primary/20 text-lazie-dark' : 
                appointment.status === 'completed' ? 'bg-gray-100 text-gray-800' : 
                'bg-red-100 text-red-800'
              }`}>
                {appointment.status}
              </span>
            </h2>
          </div>
          <div className="flex justify-between items-end">
            <div className="text-sm text-teal-700">
              <p>Invoice #: <span className="font-bold">{relatedInvoice.invoiceNumber}</span></p>
              <p>Amount: <span className="font-bold">{relatedInvoice.currency} {relatedInvoice.total.toFixed(2)}</span></p>
            </div>
            <button
              onClick={() => navigate('/dashboard/invoices')}
              className="text-xs font-bold text-teal-600 hover:text-teal-800 flex items-center"
            >
              Manage Invoice <ExternalLink className="w-3 h-3 ml-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentDetailPage;
