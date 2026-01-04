
import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../AppContext';

const FloatingCart: React.FC = () => {
  const { cart } = useAppContext();
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  if (itemCount === 0) return null;

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-40">
      <Link
        to="/cart"
        className="block w-32 h-16 bg-[#F7F3ED] rounded-t-full flex items-center justify-center shadow-[0_-4px_25px_rgba(0,0,0,0.3)] transition-all hover:scale-110 active:scale-95 border-2 border-b-0 border-[#FFBA22]"
      >
        <div className="relative flex items-center justify-center mt-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="38"
            height="38"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#0D403E"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          <span className="absolute -top-4 -right-4 bg-[#FFBA22] text-[#0D403E] text-[11px] font-black w-7 h-7 rounded-full flex items-center justify-center border-2 border-[#F7F3ED] shadow-md">
            {itemCount}
          </span>
        </div>
      </Link>
    </div>
  );
};

export default FloatingCart;
