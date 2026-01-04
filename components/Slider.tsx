
import React, { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../AppContext';

const Slider: React.FC = () => {
  const { config, language } = useAppContext();
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % config.sliderImages.length);
  }, [config.sliderImages.length]);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + config.sliderImages.length) % config.sliderImages.length);
  }, [config.sliderImages.length]);

  useEffect(() => {
    if (config.sliderImages.length <= 1) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [config.sliderImages.length, nextSlide]);

  const isRtl = language === 'ar';
  
  if (config.sliderImages.length === 0) return null;

  return (
    <div className="relative w-full aspect-[1900/636] overflow-hidden bg-[#0D403E] group">
      {/* Slides Container - Individual translation of slides to maintain 1:1 viewport size without dividing track width */}
      <div className="relative w-full h-full">
        {config.sliderImages.map((img, idx) => {
          // Calculate the relative offset for each slide
          const offset = idx - activeIndex;
          const translation = isRtl ? -offset * 100 : offset * 100;
          
          return (
            <div 
              key={`${img}-${idx}`} 
              className="absolute inset-0 w-full h-full transition-transform duration-700 ease-in-out z-10"
              style={{ transform: `translateX(${translation}%)` }}
            >
              <img
                src={img}
                alt={`Slide ${idx}`}
                className="w-full h-full object-cover"
              />
              {/* Subtle overlay to enhance text/logo visibility */}
              <div className="absolute inset-0 bg-black/10 pointer-events-none" />
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows - Layered at z-30 (above images but below the floating logo at z-100) */}
      {config.sliderImages.length > 1 && (
        <div className="absolute inset-0 z-30 pointer-events-none">
          <button
            onClick={prevSlide}
            className={`absolute top-1/2 -translate-y-1/2 p-3 m-2 md:m-4 rounded-full bg-white/20 backdrop-blur-md text-[#FFBA22] border border-white/30 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:bg-[#FFBA22] hover:text-[#0D403E] hover:scale-110 shadow-lg pointer-events-auto ${
              isRtl ? 'right-4' : 'left-4'
            }`}
            aria-label="Previous Slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={isRtl ? 'rotate-180' : ''}>
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className={`absolute top-1/2 -translate-y-1/2 p-3 m-2 md:m-4 rounded-full bg-white/20 backdrop-blur-md text-[#FFBA22] border border-white/30 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:bg-[#FFBA22] hover:text-[#0D403E] hover:scale-110 shadow-lg pointer-events-auto ${
              isRtl ? 'left-4' : 'right-4'
            }`}
            aria-label="Next Slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={isRtl ? 'rotate-180' : ''}>
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>
      )}

      {/* Indicator Dots - Layered at z-30 */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-30">
        {config.sliderImages.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`h-2 rounded-full transition-all duration-300 shadow-sm ${
              idx === activeIndex 
                ? 'bg-[#FFBA22] w-6' 
                : 'bg-white/40 w-2 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;
