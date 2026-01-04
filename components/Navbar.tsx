
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../AppContext';

const Navbar: React.FC = () => {
  const { config, language, setLanguage, currentUser, logout } = useAppContext();
  const location = useLocation();

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  return (
    <nav className="bg-[#0D403E] border-b border-[#FFBA22]/30 shadow-sm sticky top-0 z-50 px-4 py-3 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2">
        <img src={config.logo} alt="logo" className="w-10 h-10 rounded-full object-cover border border-[#FFBA22]" />
        <span className="font-bold text-lg text-[#FFBA22]">
          {language === 'ar' ? config.name_ar : config.name_en}
        </span>
      </Link>

      <div className="flex items-center gap-4">
        <button 
          onClick={toggleLanguage}
          className="px-3 py-1 text-sm rounded-full border border-[#FFBA22] text-[#FFBA22] font-medium hover:bg-[#FFBA22]/10 transition"
        >
          {language === 'ar' ? 'EN' : 'العربية'}
        </button>

        {location.pathname === '/' && !currentUser && (
          <Link to="/admin" className="text-[#FFBA22] hover:opacity-80">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          </Link>
        )}

        {currentUser && (
          <button onClick={logout} className="text-red-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
