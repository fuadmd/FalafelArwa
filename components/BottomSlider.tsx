
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../AppContext';

const BottomSlider: React.FC = () => {
  const { config } = useAppContext();
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = config.bottomSliderImages || [];

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  if (images.length === 0) return null;

  return (
    <div className="w-[120px] h-[120px] sm:w-[200px] sm:h-[200px] rounded-2xl overflow-hidden shadow-xl relative bg-black/5 group">
      {images.map((img, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={img}
            alt={`Bottom Slide ${idx}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
      
      {/* Navigation Indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, idx) => (
            <div
              key={idx}
              className={`h-1 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'w-4 bg-[#FFBA22]' : 'w-1 bg-white/40'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BottomSlider;
