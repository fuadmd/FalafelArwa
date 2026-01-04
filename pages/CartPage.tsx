
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../AppContext';

const CartPage: React.FC = () => {
  const { cart, language, updateCartQuantity, clearCart, config } = useAppContext();
  const [address, setAddress] = useState('');
  const navigate = useNavigate();

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const currency = language === 'ar' ? 'ر.س' : 'SAR';

  const sendWhatsApp = () => {
    if (!address.trim()) {
      alert(language === 'ar' ? 'يرجى إدخال العنوان' : 'Please enter address');
      return;
    }

    let message = `*طلب جديد من ${language === 'ar' ? config.name_ar : config.name_en}*\n\n`;
    cart.forEach(item => {
      message += `• ${language === 'ar' ? item.name_ar : item.name_en} x${item.quantity} = ${item.price * item.quantity} ${currency}\n`;
    });
    message += `\n*الإجمالي: ${total} ${currency}*\n`;
    message += `\n*العنوان:*\n${address}`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${config.whatsapp}?text=${encoded}`, '_blank');
  };

  if (cart.length === 0) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] bg-[#0D403E]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-24 h-24 text-[#FFBA22]/30 mb-4 mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2 text-[#FFBA22]">{language === 'ar' ? 'السلة فارغة' : 'Cart is Empty'}</h2>
          <Link to="/" className="text-[#FFBA22] font-medium underline underline-offset-4">
            {language === 'ar' ? 'العودة للقائمة' : 'Back to Menu'}
          </Link>
        </div>
      </div>
    );
  }

  const isAddressEmpty = !address.trim();

  return (
    <div className="p-4 animate-in slide-in-from-bottom-4 duration-300 bg-[#0D403E]">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#FFBA22]">{language === 'ar' ? 'سلة الطلبات' : 'My Orders'}</h1>
          <button onClick={clearCart} className="text-sm text-red-400 font-medium">{language === 'ar' ? 'تفريغ' : 'Clear'}</button>
        </div>

        <div className="space-y-4 mb-8">
          {cart.map(item => (
            <div key={item.id} className="bg-[#0D403E] rounded-2xl p-3 flex gap-4 shadow-sm border border-[#FFBA22]/30">
              <img src={item.image} className="w-20 h-20 rounded-xl object-cover border border-[#FFBA22]/20" alt="" />
              <div className="flex-1">
                <h3 className="font-bold text-[#FFBA22]">{language === 'ar' ? item.name_ar : item.name_en}</h3>
                <p className="text-sm text-[#FFBA22]/80 font-bold">{item.price} {currency}</p>
                <div className="flex items-center gap-3 mt-2">
                  <button 
                    onClick={() => updateCartQuantity(item.id, -1)}
                    className="w-8 h-8 rounded-lg bg-[#FFBA22]/10 border border-[#FFBA22]/50 text-[#FFBA22] flex items-center justify-center font-bold"
                  >-</button>
                  <span className="font-bold text-[#FFBA22]">{item.quantity}</span>
                  <button 
                    onClick={() => updateCartQuantity(item.id, 1)}
                    className="w-8 h-8 rounded-lg bg-[#FFBA22]/10 border border-[#FFBA22]/50 text-[#FFBA22] flex items-center justify-center font-bold"
                  >+</button>
                </div>
              </div>
              <div className="flex flex-col justify-between items-end">
                 <button onClick={() => updateCartQuantity(item.id, -item.quantity)} className="text-[#FFBA22]/30 hover:text-[#FFBA22]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                 </button>
                 <p className="font-bold text-[#FFBA22]">{item.price * item.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#0D403E] rounded-2xl p-6 shadow-lg border border-[#FFBA22]/50">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#FFBA22]/20">
            <span className="text-[#FFBA22]/60 font-medium">{language === 'ar' ? 'الإجمالي' : 'Total'}</span>
            <span className="text-2xl font-bold text-[#FFBA22]">{total} {currency}</span>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold mb-2 text-[#FFBA22]">
              {language === 'ar' ? 'عنوان التوصيل بالتفصيل' : 'Detailed Delivery Address'}
            </label>
            <textarea 
              rows={3}
              className="w-full bg-[#0D403E] border border-[#FFBA22] rounded-xl p-3 text-[#FFBA22] focus:ring-2 focus:ring-[#FFBA22] outline-none placeholder:text-[#FFBA22]/30"
              placeholder={language === 'ar' ? 'اكتب عنوانك هنا...' : 'Type your address here...'}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <button 
            disabled={isAddressEmpty}
            onClick={sendWhatsApp}
            className={`w-full font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition active:scale-95 ${
              isAddressEmpty 
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50' 
                : 'bg-[#25D366] text-white hover:opacity-90 shadow-[0_4px_14px_0_rgba(37,211,102,0.39)]'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.483 8.413-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.308 1.655zm6.59-4.819c1.414.843 2.809 1.353 4.54 1.354 5.4 0 9.794-4.394 9.796-9.794.001-2.618-1.02-5.078-2.871-6.931-1.85-1.851-4.311-2.871-6.93-2.872-5.4 0-9.795 4.394-9.798 9.795-.001 1.884.53 3.398 1.488 4.966l-.999 3.648 3.774-.966zm10.307-7.73c-.333-.167-1.97-.974-2.274-1.085-.303-.11-.524-.167-.746.167-.221.333-.859 1.085-1.053 1.306-.194.221-.389.25-.722.083-1.813-.907-2.616-1.326-3.71-3.203-.288-.495.289-.459.827-1.53.083-.167.042-.314-.021-.444-.063-.13-.524-1.264-.718-1.731-.189-.454-.381-.393-.524-.4h-.448c-.155 0-.408.058-.621.289-.213.23-.812.793-.812 1.933 0 1.141.829 2.244.945 2.401.115.157 1.632 2.492 3.953 3.496.552.239 1.053.38 1.413.494.554.175 1.058.15 1.457.09.444-.067 1.365-.558 1.559-1.097.194-.539.194-1.001.137-1.097-.057-.097-.208-.155-.542-.322z"/>
            </svg>
            {language === 'ar' ? 'إرسال الطلب عبر واتساب' : 'Send via WhatsApp'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
