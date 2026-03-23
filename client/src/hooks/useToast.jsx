import React, { useState, useCallback } from 'react';
import Toast from '../components/ui/Toast.jsx';

export const useToast = () => {
  const [toast, setToast] = useState({ message: '', type: '' });

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast({ message: '', type: '' });
  }, []);

  const ToastComponent = toast.message ? (
    <Toast message={toast.message} type={toast.type} onClose={hideToast} />
  ) : null;

  return { showToast, ToastComponent };
};
