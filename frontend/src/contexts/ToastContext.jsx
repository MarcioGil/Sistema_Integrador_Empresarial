import React, { createContext, useContext, useState, useEffect } from 'react';
import Toast from '../components/Toast';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success', duration = 3000) => {
    setToast({ message, type, duration });
  };

  const closeToast = () => {
    setToast(null);
  };

  useEffect(() => {
    // Listen for custom 'toast' events from non-React files (e.g. api.js)
    const handleToastEvent = (event) => {
      const { message, type, duration } = event.detail;
      showToast(message, type, duration);
    };

    window.addEventListener('toast', handleToastEvent);
    return () => window.removeEventListener('toast', handleToastEvent);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, closeToast }}>
      {children}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={closeToast}
        />
      )}
    </ToastContext.Provider>
  );
};
