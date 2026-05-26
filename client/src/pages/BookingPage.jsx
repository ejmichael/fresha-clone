import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getBusinessInfo, getAvailability, createBooking } from '../api/api';
import ServiceCard from '../components/ServiceCard';
import StaffCard from '../components/StaffCard';
import DatePicker from '../components/DatePicker';
import TimeSlots from '../components/TimeSlots';
import BookingForm from '../components/BookingForm';
import ConfirmationScreen from '../components/ConfirmationScreen';
import { MapPin } from 'lucide-react';

const BookingPage = () => {
  const { slug } = useParams();
  const [businessData, setBusinessData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  
  const [bookingResult, setBookingResult] = useState(null);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const { data } = await getBusinessInfo(slug);
        setBusinessData(data);
      } catch (err) {
        console.error('Failed to load business info', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBusiness();
  }, [slug]);

  useEffect(() => {
    if (selectedStaff && selectedDate && selectedService) {
      const fetchSlots = async () => {
        setSlotsLoading(true);
        try {
          const timestamp = selectedDate.getTime() - (selectedDate.getTimezoneOffset() * 60000);
          const formattedDate = new Date(timestamp).toISOString().split('T')[0];
          
          const { data } = await getAvailability({
            businessId: businessData.business._id,
            staffId: selectedStaff._id,
            serviceId: selectedService._id,
            date: formattedDate
          });
          setAvailableSlots(data);
        } catch (err) {
          console.error('Error fetching slots:', err);
        } finally {
          setSlotsLoading(false);
        }
      };
      fetchSlots();
    }
  }, [selectedStaff, selectedDate, selectedService, businessData]);

  const handleBook = async (clientData) => {
    const timestamp = selectedDate.getTime() - (selectedDate.getTimezoneOffset() * 60000);
    const formattedDate = new Date(timestamp).toISOString().split('T')[0];
    const payload = {
      businessId: businessData.business._id,
      staffId: selectedStaff._id,
      serviceId: selectedService._id,
      date: formattedDate,
      time: selectedTime,
      ...clientData
    };
    
    const { data } = await createBooking(payload);
    setBookingResult(data);
    setStep(4);
  };

  if (loading) return <div className="p-10 text-center animate-pulse">Loading experience...</div>;
  if (!businessData?.business) return <div className="p-10 text-center text-red-500">Business not found.</div>;

  const { business, services, staff } = businessData;
  const getStepProgress = () => (step / 4) * 100;

  return (
    <div className="max-w-3xl mx-auto w-full pt-8 pb-16 px-4 sm:px-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{business.name}</h1>
        <div className="mt-2 flex items-center justify-center space-x-2 text-gray-500">
          <MapPin size={18} />
          <span>{business.address}</span>
        </div>
      </div>

      <div className="bg-surface rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-1.5 w-full bg-gray-100">
          <div 
            className="h-full bg-lazie-primary transition-all duration-500 ease-in-out" 
            style={{ width: `${getStepProgress()}%` }} 
          />
        </div>

        <div className="p-6 sm:p-8">
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-semibold mb-5">Select a Service</h2>

              {/* Category filter tabs */}
              {(() => {
                const cats = [...new Set(services.map(s => s.category).filter(Boolean))].sort();
                if (cats.length === 0) return null;
                return (
                  <div className="flex flex-wrap gap-2 mb-6">
                    <button
                      onClick={() => setCategoryFilter('all')}
                      className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${categoryFilter === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                      All
                    </button>
                    {cats.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setCategoryFilter(cat)}
                        className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${categoryFilter === cat ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                );
              })()}

              <div className="grid gap-4 sm:grid-cols-2">
                {services
                  .filter(svc => categoryFilter === 'all' || svc.category === categoryFilter)
                  .map(svc => (
                    <ServiceCard
                      key={svc._id}
                      service={svc}
                      onClick={() => {
                        setSelectedService(svc);
                        setStep(2);
                      }}
                    />
                  ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Date & Time</h2>
                <button 
                  onClick={() => setStep(1)}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  &larr; Back
                </button>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium mb-4 text-gray-700">1. Choose Professional</h3>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {staff.filter(s => selectedService.assignedStaff.includes(s._id)).map(s => (
                      <StaffCard 
                        key={s._id} 
                        staff={s} 
                        isSelected={selectedStaff?._id === s._id}
                        onClick={() => {
                          setSelectedStaff(s);
                          setSelectedTime(null);
                        }} 
                      />
                    ))}
                  </div>
                </div>

                {selectedStaff && (
                  <div>
                     <h3 className="text-lg font-medium mb-4 text-gray-700">2. Select Date</h3>
                     <DatePicker 
                        selectedDate={selectedDate} 
                        onChange={(d) => {
                          setSelectedDate(d);
                          setSelectedTime(null);
                        }} 
                     />
                  </div>
                )}

                {selectedStaff && selectedDate && (
                  <div>
                    <h3 className="text-lg font-medium mb-4 text-gray-700">3. Available Slots</h3>
                    <TimeSlots 
                      slots={availableSlots} 
                      loading={slotsLoading}
                      selectedTime={selectedTime}
                      onSelect={(t) => setSelectedTime(t)}
                    />
                  </div>
                )}

                <div className="pt-4 flex justify-end">
                  <button 
                    disabled={!selectedTime}
                    onClick={() => setStep(3)}
                    className="px-6 py-2.5 bg-lazie-primary text-gray-950 font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-90 transition-colors shadow-sm"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <BookingForm 
              service={selectedService}
              staff={selectedStaff}
              date={selectedDate}
              time={selectedTime}
              business={business}
              onBack={() => setStep(2)}
              onSubmit={handleBook}
            />
          )}

          {step === 4 && bookingResult && (
            <ConfirmationScreen 
              result={bookingResult} 
              business={business}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
