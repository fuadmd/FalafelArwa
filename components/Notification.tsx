
import React from 'react';
import { useAppContext } from '../AppContext';

const Notification: React.FC = () => {
  const { notification } = useAppContext();

  if (!notification) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top duration-300">
      <div className="bg-green-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-white/20">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <span className="font-bold text-sm tracking-wide">{notification}</span>
      </div>
    </div>
  );
};

export default Notification;
