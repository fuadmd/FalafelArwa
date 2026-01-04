
import React, { useState, useMemo, useEffect } from 'react';
import { useAppContext } from '../AppContext';
import Slider from '../components/Slider';
import { Product, SocialLink } from '../types';

const getSocialIcon = (platform: SocialLink['platform']) => {
  switch (platform) {
    case 'facebook':
      return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
    case 'instagram':
      return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>;
    case 'twitter':
      return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>;
    case 'whatsapp':
      return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
    case 'tiktok':
      return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>;
    case 'snapchat':
      return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3c-1.1 0-2.1.3-3.1.8-1 .6-1.9 1.4-2.5 2.5-.6 1-.9 2.1-.9 3.2 0 1.1.2 2.2.7 3.2.4.9 1 1.7 1.8 2.3-.7 1.1-1.1 2.3-1.1 3.5 0 1.1.3 2.1.8 3.1.6 1 1.4 1.9 2.5 2.5 1 .6 2.1.9 3.2.9s2.2-.3 3.2-.9c1-.6 1.9-1.4 2.5-2.5.5-1 .8-2 .8-3.1 0-1.2-.4-2.4-1.1-3.5.8-.6 1.4-1.4 1.8-2.3.5-1 .7-2.1.7-3.2 0-1.1-.3-2.2-.9-3.2-.6-1.1-1.5-1.9-2.5-2.5-1-.5-2-.8-3.1-.8z"/></svg>;
    default:
      return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/></svg>;
  }
};

const Home: React.FC = () => {
  const { config, language, categories, products, addToCart, cart } = useAppContext();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [phraseIndex, setPhraseIndex] = useState(0);

  const teaserPhrases = [
    'جرّب الطعم الحقيقي',
    'نكهة تكررها',
    'وجبتك الجاية تبدأ من هنا',
    'طعم يستاهل الانتظار',
    'خيارك المفضل اليوم'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % teaserPhrases.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const design = config.design;
  const isShopOpen = useMemo(() => {
    if (config.status === 'open') return true;
    if (config.status === 'closed') return false;
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const { open, close } = config.autoHours;
    if (open <= close) return currentTime >= open && currentTime <= close;
    return currentTime >= open || currentTime <= close;
  }, [config.status, config.autoHours]);

  const filteredProducts = selectedCategory 
    ? products.filter(p => p.categoryId === selectedCategory)
    : [];

  const mostRequested = products.filter(p => p.mostRequested);
  const getItemCount = (pid: string) => cart.find(i => i.id === pid)?.quantity || 0;
  const currency = language === 'ar' ? 'ر.س' : 'SAR';

  const StatusBadge = () => (
    <div className={`text-[10px] font-black px-2 py-0.5 rounded-full border shadow-sm flex items-center bg-white/10 ${isShopOpen ? 'border-green-500 text-green-500' : 'border-red-500 text-red-500'}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${isShopOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'} ${language === 'ar' ? 'ml-1.5' : 'mr-1.5'}`}></span>
      {isShopOpen ? (language === 'ar' ? 'مفتوح الآن' : 'Open Now') : (language === 'ar' ? 'مغلق حالياً' : 'Closed Now')}
    </div>
  );

  return (
    <div className="relative min-h-screen transition-all duration-500 overflow-x-hidden" style={{ backgroundColor: design.section1Bg, fontFamily: design.mainFont }}>
      
      {/* Background Pattern */}
      {design.backgroundImagePattern && (
        <div 
          className="fixed inset-0 pointer-events-none z-0" 
          style={{ 
            backgroundImage: `url(${design.backgroundImagePattern})`,
            backgroundRepeat: 'repeat',
            backgroundSize: `${design.patternScale || 150}px auto`,
            opacity: design.patternOpacity || 0.1 
          }}
        />
      )}

      {/* Hero Section */}
      <div className="w-full relative z-20" style={{ backgroundColor: design.section3Bg }}>
        <Slider />
        
        {/* GIANT Floating Logo Container */}
        <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center pointer-events-none">
           <div className="w-40 h-8 bg-black/60 rounded-[100%] animate-shadow-pulse-giant"></div>
           <div className="absolute -top-32 w-56 h-56 md:w-64 md:h-64 rounded-full border-4 md:border-[12px] border-[#FFBA22] bg-[#0D403E] p-1 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.6)] overflow-hidden animate-logo-float-giant pointer-events-auto">
              <img src={config.logo} alt="logo" className="w-full h-full object-cover rounded-full" />
           </div>
        </div>
      </div>

      {/* Visual Separator Line */}
      <div className="w-full h-1 relative z-10" style={{ backgroundColor: design.sliderLineColor }}></div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-32 relative z-10">
        
        {!selectedCategory ? (
          <div className="space-y-16">
            
            {/* Featured Marquee */}
            <section className="animate-in fade-in duration-700">
               <div className="flex items-center justify-between mb-6">
                 <h2 className="text-2xl font-black" style={{ color: design.categoryTitle.color }}>
                   {language === 'ar' ? 'وجباتنا المميزة' : 'Our Specialties'}
                 </h2>
                 <div className="w-12 h-0.5 rounded-full" style={{ backgroundColor: design.primaryTextColor }}></div>
               </div>

               <div className="relative overflow-hidden -mx-4">
                  <div className="animate-marquee-seamless py-4">
                     {[...mostRequested, ...mostRequested].map((product, idx) => (
                       <div key={`${product.id}-${idx}`} className={`w-40 flex-shrink-0 ${language === 'ar' ? 'ml-6' : 'mr-6'}`}>
                          <div 
                            className="relative aspect-square rounded-[2rem] overflow-hidden shadow-xl border-2 cursor-pointer transform transition hover:scale-105 active:scale-95"
                            style={{ borderColor: `${design.primaryTextColor}33`, backgroundColor: design.section2Bg }}
                            onClick={() => setViewProduct(product)}
                          >
                             <img src={product.image} className="w-full h-full object-cover" alt="" />
                             {getItemCount(product.id) > 0 && (
                               <div className="absolute top-3 right-3 w-7 h-7 bg-[#FFBA22] text-[#0D403E] rounded-full flex items-center justify-center font-black text-xs shadow-lg">
                                  {getItemCount(product.id)}
                               </div>
                             )}
                          </div>
                          <div className="mt-4 text-center">
                             <p className="text-xs font-black truncate px-1" style={{ color: design.productName.color }}>{language === 'ar' ? product.name_ar : product.name_en}</p>
                             <div className="flex items-center justify-center gap-2 mt-2">
                                <span className="text-[10px] font-black px-2 py-1 rounded-lg" style={{ backgroundColor: `${design.primaryTextColor}22`, color: design.primaryTextColor }}>{product.price} {currency}</span>
                                <button 
                                  disabled={!isShopOpen}
                                  onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                                  className={`w-7 h-7 rounded-lg flex items-center justify-center shadow-md active:scale-75 transition ${isShopOpen ? 'bg-[#FFBA22] text-[#0D403E]' : 'bg-gray-700 text-gray-500'}`}
                                >
                                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                </button>
                             </div>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </section>

            {/* Main Categories Grid */}
            <section className="animate-in fade-in slide-in-from-bottom-8 duration-700">
               <h2 className="text-2xl font-black mb-8" style={{ color: design.categoryTitle.color }}>
                 {language === 'ar' ? 'تصفح القائمة' : 'Browse Menu'}
               </h2>
               <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-6">
                  {categories.map(cat => (
                    <div 
                      key={cat.id} 
                      className="group cursor-pointer flex flex-col items-center" 
                      onClick={() => setSelectedCategory(cat.id)}
                    >
                       <div className="relative w-full aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl border-2 transition-transform duration-500 group-hover:-translate-y-2 group-active:scale-95" style={{ borderColor: `${design.primaryTextColor}33` }}>
                          <img src={cat.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                          <div className="absolute bottom-4 left-0 right-0 text-center">
                             <p className="text-white font-black text-sm drop-shadow-md">{language === 'ar' ? cat.name_ar : cat.name_en}</p>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </section>

            {/* Teaser Animated Section */}
            <section className="pt-8">
               <div className="bg-white/5 rounded-[3rem] p-10 border border-[#FFBA22]/20 backdrop-blur-md flex flex-col items-center justify-center text-center shadow-2xl overflow-hidden relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFBA22]/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  
                  <div className="space-y-4">
                     <h3 className="text-3xl font-black tracking-wide" style={{ color: design.primaryTextColor }}>
                        {language === 'ar' ? config.name_ar : config.name_en}
                     </h3>
                     <div className="h-12 flex items-center justify-center">
                        <p 
                          key={phraseIndex}
                          className="text-xl md:text-2xl font-black animate-in fade-in zoom-in-90 slide-in-from-bottom-2 duration-700 italic" 
                          style={{ color: design.primaryTextColor }}
                        >
                           {teaserPhrases[phraseIndex]}
                        </p>
                     </div>
                  </div>
               </div>
            </section>

          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-left-8 duration-500">
            <header className="flex items-center justify-between mb-10">
               <button 
                 onClick={() => setSelectedCategory(null)} 
                 className="flex items-center gap-2 font-black text-sm px-4 py-2 rounded-2xl bg-white/5 border border-[#FFBA22]/20 shadow-lg active:scale-90 transition" 
                 style={{ color: design.primaryTextColor }}
               >
                 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={language === 'ar' ? '' : 'rotate-180'}><path d="m9 18 6-6-6-6"/></svg>
                 {language === 'ar' ? 'رجوع' : 'Back'}
               </button>
               <h2 className="text-2xl font-black text-center" style={{ color: design.categoryTitle.color }}>
                 {language === 'ar' ? categories.find(c => c.id === selectedCategory)?.name_ar : categories.find(c => c.id === selectedCategory)?.name_en}
               </h2>
               <div className="w-12"></div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
               {filteredProducts.map(product => (
                 <div 
                   key={product.id} 
                   className="group bg-white/5 rounded-[2.5rem] overflow-hidden border border-[#FFBA22]/10 shadow-xl flex flex-col transform transition hover:translate-y-[-4px]"
                   style={{ backgroundColor: design.section2Bg }}
                 >
                    <div className="relative aspect-[4/3] cursor-pointer overflow-hidden" onClick={() => setViewProduct(product)}>
                       <img src={product.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                       {product.mostRequested && (
                         <div className="absolute bottom-4 right-4 bg-[#FFBA22] text-[#0D403E] px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg">
                           {language === 'ar' ? 'الأكثر طلباً' : 'BEST SELLER'}
                         </div>
                       )}
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between">
                       <div>
                         <div className="flex items-center justify-between gap-2 mb-2">
                           <h3 className="text-xl font-black truncate" style={{ color: design.primaryTextColor }}>{language === 'ar' ? product.name_ar : product.name_en}</h3>
                           <div className="flex-shrink-0">
                             <StatusBadge />
                           </div>
                         </div>
                         <p className="text-xs font-bold opacity-60 leading-relaxed mb-6" style={{ color: design.primaryTextColor }}>
                           {language === 'ar' ? product.description_ar : product.description_en}
                         </p>
                       </div>
                       <div className="flex items-center justify-between">
                          <span className="text-2xl font-black" style={{ color: design.primaryTextColor }}>{product.price} {currency}</span>
                          <div className="flex items-center gap-3">
                             {getItemCount(product.id) > 0 && (
                               <span className="text-xs font-black px-3 py-1 rounded-full bg-[#FFBA22]/10" style={{ color: design.primaryTextColor }}>x{getItemCount(product.id)}</span>
                             )}
                             <button 
                               disabled={!isShopOpen}
                               onClick={() => addToCart(product)}
                               className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl active:scale-90 transition ${isShopOpen ? 'bg-[#FFBA22] text-[#0D403E]' : 'bg-gray-700 text-gray-500'}`}
                             >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                             </button>
                          </div>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {viewProduct && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="bg-[#0D403E] border-2 border-[#FFBA22] rounded-[3.5rem] w-full max-w-lg overflow-hidden relative shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] animate-in zoom-in-95 duration-300">
              <button 
                onClick={() => setViewProduct(null)} 
                className="absolute top-6 right-6 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center transition active:scale-90 shadow-xl"
              >
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
              
              <div className="relative aspect-[4/3] group">
                 <img src={viewProduct.image} className="w-full h-full object-cover" alt="" />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#0D403E] via-transparent to-transparent"></div>
              </div>
              
              <div className="p-8 space-y-6">
                 <div className="flex items-center justify-between gap-4">
                    <h2 className="text-3xl font-black" style={{ color: design.primaryTextColor }}>{language === 'ar' ? viewProduct.name_ar : viewProduct.name_en}</h2>
                    <div className="flex-shrink-0">
                      <StatusBadge />
                    </div>
                 </div>
                 <p className="text-sm font-bold opacity-80 leading-relaxed min-h-[60px]" style={{ color: design.primaryTextColor }}>
                    {language === 'ar' ? viewProduct.description_ar : viewProduct.description_en}
                 </p>
                 <div className="flex items-center justify-between pt-4">
                    <span className="text-3xl font-black" style={{ color: design.primaryTextColor }}>{viewProduct.price} {currency}</span>
                    <button 
                      disabled={!isShopOpen}
                      onClick={() => { addToCart(viewProduct); setViewProduct(null); }}
                      className={`px-8 py-4 rounded-[1.5rem] font-black shadow-2xl transition active:scale-95 ${isShopOpen ? 'bg-[#FFBA22] text-[#0D403E]' : 'bg-gray-700 text-gray-500'}`}
                    >
                       {isShopOpen ? (language === 'ar' ? 'أضف للطلب' : 'Order Now') : (language === 'ar' ? 'مغلق' : 'Closed')}
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Footer Branding - Adjusted with contact info and visibility toggles */}
      <footer className="mt-20 py-20 px-6 relative z-10 border-t border-white/5" style={{ backgroundColor: design.section3Bg }}>
         <div className="max-w-2xl mx-auto flex flex-col items-center text-center space-y-6 bg-black/5 py-10 px-12 rounded-[3.5rem] border border-black/5 shadow-inner">
            <div className="w-40 h-40 rounded-full border-4 border-[#FFBA22] p-1 shadow-2xl">
               <img src={config.logo} className="w-full h-full object-cover rounded-full" alt="logo" />
            </div>
            <div className="space-y-4">
               <div>
                  <h4 className="text-2xl font-black" style={{ color: design.section1Bg }}>{language === 'ar' ? config.name_ar : config.name_en}</h4>
                  <p className="text-sm font-bold opacity-60 max-w-xs mx-auto" style={{ color: design.section1Bg }}>
                    {language === 'ar' ? config.location_ar : config.location_en}
                  </p>
               </div>

               {/* Contact Info in Footer */}
               <div className="flex flex-col items-center gap-2 pt-2">
                 {config.showFooterPhone && config.phone && (
                   <a 
                     href={`tel:${config.phone}`} 
                     className="flex items-center gap-2 text-sm font-black hover:opacity-70 transition"
                     style={{ color: design.section1Bg }}
                   >
                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                     <span dir="ltr">{config.phone}</span>
                   </a>
                 )}
                 {config.showFooterWhatsapp && config.whatsapp && (
                   <a 
                     href={`https://wa.me/${config.whatsapp}`} 
                     target="_blank" rel="noopener noreferrer"
                     className="flex items-center gap-2 text-sm font-black hover:opacity-70 transition"
                     style={{ color: design.section1Bg }}
                   >
                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                     <span dir="ltr">WhatsApp</span>
                   </a>
                 )}
               </div>
            </div>

            <div className="flex gap-4">
               {config.socialLinks.filter(l => l.isActive).map(link => (
                 <a 
                   key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" 
                   className="w-12 h-12 flex items-center justify-center rounded-2xl transition shadow-xl hover:scale-110"
                   style={{ backgroundColor: design.section1Bg, color: design.section3Bg }}
                 >
                   {getSocialIcon(link.platform)}
                 </a>
               ))}
            </div>
            <div className="pt-6 w-full max-w-xs border-t border-black/5">
               <p className="text-[10px] font-black opacity-30 uppercase tracking-[0.2em]" style={{ color: design.section1Bg }}>
                 &copy; {new Date().getFullYear()} {config.name_en} • QR Digital Menu
               </p>
            </div>
         </div>
      </footer>
    </div>
  );
};

export default Home;
