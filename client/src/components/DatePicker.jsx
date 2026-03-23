import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DatePicker = ({ selectedDate, onChange }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  
  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
  }

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 max-w-sm shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={handlePrevMonth}
          disabled={currentMonth <= today && currentMonth.getMonth() === today.getMonth()}
          className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <span className="font-medium text-gray-900">
          {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </span>
        <button 
          onClick={handleNextMonth}
          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
          <div key={d} className="text-xs font-medium text-gray-500 py-1">{d}</div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center">
        {days.map((date, i) => {
          if (!date) return <div key={`empty-${i}`} className="p-2"></div>;
          
          const isPast = date < today;
          const isSelected = selectedDate?.toDateString() === date.toDateString();
          const isToday = today.toDateString() === date.toDateString();
          
          return (
            <button
              key={date.toISOString()}
              disabled={isPast}
              onClick={() => onChange(date)}
              className={`p-2 rounded-lg text-sm transition-all flex items-center justify-center w-full aspect-square ${
                isSelected 
                  ? 'bg-gray-900 text-white font-medium shadow-sm' 
                  : isPast 
                    ? 'text-gray-300 cursor-not-allowed' 
                    : isToday
                      ? 'bg-gray-100 text-gray-900 font-medium hover:bg-gray-200'
                      : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DatePicker;
