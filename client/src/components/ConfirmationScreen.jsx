import React from 'react';
import { CheckCircle, Calendar, Download } from 'lucide-react';

const ConfirmationScreen = ({ result, business }) => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const downloadIcsUrl = `${API_URL}/bookings/${result.appointment._id}/ics`;

  return (
    <div className="text-center py-8 animate-in zoom-in-95 duration-500">
      <div className="flex justify-center mb-6">
        <CheckCircle size={64} className="text-green-500 animate-bounce-slight" />
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Your appointment at {business.name} is successfully booked. We've sent a confirmation email to {result.appointment.clientEmail}.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
        <a 
          href={result.calendarUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-[#4285F4] text-white font-medium rounded-lg hover:bg-[#3367D6] transition-colors"
        >
          <Calendar size={18} className="mr-2" />
          Add to Google Calendar
        </a>
        <a 
          href={downloadIcsUrl}
          className="flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
        >
          <Download size={18} className="mr-2" />
          Download .ics file
        </a>
      </div>

      <div className="pt-8 border-t border-gray-100">
        <a
          href={`/booking/${result.appointment._id}`}
          className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
        >
          View booking confirmation
        </a>
      </div>
    </div>
  );
};

export default ConfirmationScreen;
