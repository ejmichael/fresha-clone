import React from 'react';

const StaffCard = ({ staff, isSelected, onClick }) => {
  const initials = staff.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  
  return (
    <div 
      onClick={onClick}
      className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all cursor-pointer min-w-[120px] ${
        isSelected 
          ? 'border-gray-900 bg-gray-50 shadow-sm' 
          : 'border-transparent hover:border-gray-200 bg-white'
      }`}
    >
      <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-medium mb-3 transition-colors ${
        isSelected ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'
      }`}>
        {initials}
      </div>
      <span className={`text-sm font-medium text-center ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>
        {staff.name}
      </span>
      {staff.bio && (
        <span className="text-xs text-gray-500 mt-1 text-center line-clamp-2">
          {staff.bio}
        </span>
      )}
    </div>
  );
};

export default StaffCard;
