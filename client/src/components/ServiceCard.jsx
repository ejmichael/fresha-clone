import React from 'react';
import { Clock } from 'lucide-react';

const ServiceCard = ({ service, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="border border-gray-200 rounded-xl p-5 hover:border-gray-900 hover:shadow-md transition-all cursor-pointer bg-white group flex flex-col"
    >
      {service.category && (
        <span className="self-start mb-2 px-2.5 py-0.5 bg-lazie-primary/10 text-lazie-dark text-[11px] font-bold uppercase tracking-wider rounded-full">
          {service.category}
        </span>
      )}
      <h3 className="text-base font-semibold text-gray-900 leading-snug">{service.name}</h3>
      <div className="mt-auto pt-4 flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-500">
          <Clock size={14} className="mr-1.5" />
          <span>{service.duration} min</span>
        </div>
        <div className="font-bold text-gray-900">
          {service.currency === 'ZAR' ? 'R' : service.currency} {service.price}
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
