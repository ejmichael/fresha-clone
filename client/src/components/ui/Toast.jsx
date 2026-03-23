import React, { useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 flex items-center px-4 py-3 rounded-lg shadow-lg text-white font-medium animate-fade-in-up transition-all" style={{ backgroundColor: type === 'error' ? '#EF4444' : '#10B981' }}>
      {type === 'error' ? <XCircle className="w-5 h-5 mr-3" /> : <CheckCircle className="w-5 h-5 mr-3" />}
      {message}
    </div>
  );
};

export default Toast;
