import React from 'react';
import { Clock } from 'lucide-react';

const ServiceCard = ({ service, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="border border-gray-200 rounded-xl p-5 hover:border-gray-900 hover:shadow-md transition-all cursor-pointer bg-white group"
    >
      <h3 className="text-lg font-medium text-gray-900 group-hover:text-primary-600 transition-colors">{service.name}</h3>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-500">
          <Clock size={16} className="mr-1.5" />
          <span>{service.duration} min</span>
        </div>
        <div className="font-semibold text-gray-900">
          {service.currency === 'ZAR' ? 'R' : service.currency} {service.price}
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
