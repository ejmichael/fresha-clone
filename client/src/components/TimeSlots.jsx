import React from 'react';

const TimeSlots = ({ slots, loading, selectedTime, onSelect }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 animate-pulse">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-100 rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="text-center p-6 border border-dashed border-gray-300 rounded-xl bg-gray-50 text-gray-500">
        No available slots for this date. Please choose another date or professional.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
      {slots.map(time => (
        <button
          key={time}
          onClick={() => onSelect(time)}
          className={`py-3 px-4 rounded-lg text-sm font-medium transition-all ${
            selectedTime === time
              ? 'bg-gray-900 text-white shadow-md ring-2 ring-gray-900 ring-offset-2'
              : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-900 hover:bg-gray-50'
          }`}
        >
          {time}
        </button>
      ))}
    </div>
  );
};

export default TimeSlots;
