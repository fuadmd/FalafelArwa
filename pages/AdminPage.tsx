import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import { Category, Product, User, SocialLink, DesignConfig } from '../types';

const AdminPage: React.FC = () => {
  const { 
    currentUser, 
    login, 
    language, 
    products, setProducts,
    categories, setCategories,
    config, updateConfig,
    users, setUsers,
    logout
  } = useAppContext();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'status' | 'menu' | 'users' | 'settings' | 'design'>('status');
  
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [editingUser, setEditingUser] = useState<Partial<User> | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);

  const currency = language === 'ar' ? 'ر.س' : 'SAR';

  // Font Definitions
  const arabicFonts = [
    { name: 'Cairo (Default)', family: "'Cairo', sans-serif" },
    { name: 'Tajawal', family: "'Tajawal', sans-serif" },
    { name: 'Almarai', family: "'Almarai', sans-serif" },
    { name: 'Amiri (Serif)', family: "'Amiri', serif" },
    { name: 'Alexandria', family: "'Alexandria', sans-serif" },
    { name: 'El Messiri', family: "'El Messiri', sans-serif" },
  ];

  const englishFonts = [
    { name: 'Inter (Default)', family: "'Inter', sans-serif" },
    { name: 'Roboto', family: "'Roboto', sans-serif" },
    { name: 'Montserrat', family: "'Montserrat', sans-serif" },
    { name: 'Poppins', family: "'Poppins', sans-serif" },
    { name: 'Playfair Display (Serif)', family: "'Playfair Display', serif" },
    { name: 'Ubuntu', family: "'Ubuntu', sans-serif" },
  ];

  const handleLogin = () => {
    if (login(username, password)) {
      setError('');
    } else {
      setError(language === 'ar' ? 'بيانات الدخول غير صحيحة' : 'Invalid credentials');
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'product' | 'category' | 'slider' | 'logo' | 'floating' | 'bottomSlider' | 'pattern', sliderIndex?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await fileToBase64(file);
      if (type === 'product' && editingProduct) {
        setEditingProduct({ ...editingProduct, image: base64 });
      } else if (type === 'category' && editingCategory) {
        setEditingCategory({ ...editingCategory, image: base64 });
      } else if (type === 'slider') {
        const newSliderImages = [...config.sliderImages];
        if (sliderIndex !== undefined) newSliderImages[sliderIndex] = base64;
        else newSliderImages.push(base64);
        updateConfig({ ...config, sliderImages: newSliderImages });
      } else if (type === 'bottomSlider') {
        const newBottomSlider = [...(config.bottomSliderImages || [])];
        if (sliderIndex !== undefined) newBottomSlider[sliderIndex] = base64;
        else newBottomSlider.push(base64);
        updateConfig({ ...config, bottomSliderImages: newBottomSlider });
      } else if (type === 'logo') {
        updateConfig({ ...config, logo: base64 });
      } else if (type === 'floating') {
        updateConfig({ ...config, bottomFloatingImage: base64 });
      } else if (type === 'pattern') {
        updateConfig({
          ...config,
          design: { ...config.design, backgroundImagePattern: base64 }
        });
      }
      e.target.value = '';
    } catch (err) { console.error(err); }
  };

  const removeSliderImage = (index: number) => {
    const newSliderImages = config.sliderImages.filter((_, i) => i !== index);
    updateConfig({ ...config, sliderImages: newSliderImages });
  };

  const updateDesign = (key: keyof DesignConfig, value: any) => {
    updateConfig({
      ...config,
      design: { ...config.design, [key]: value }
    });
  };

  const updateDesignSub = (key: 'productName' | 'categoryTitle', subKey: string, value: string) => {
    updateConfig({
      ...config,
      design: {
        ...config.design,
        [key]: { ...(config.design as any)[key], [subKey]: value }
      }
    });
  };

  const addSocialLink = () => {
    const newLink: SocialLink = { id: Date.now().toString(), platform: 'facebook', url: '', isActive: true };
    updateConfig({ ...config, socialLinks: [...config.socialLinks, newLink] });
  };

  const updateSocialLink = (id: string, updates: Partial<SocialLink>) => {
    const newLinks = config.socialLinks.map(link => link.id === id ? { ...link, ...updates } : link);
    updateConfig({ ...config, socialLinks: newLinks });
  };

  const removeSocialLink = (id: string) => {
    updateConfig({ ...config, socialLinks: config.socialLinks.filter(l => l.id !== id) });
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-[90vh] p-4 bg-[#0D403E]">
        <div className="w-full max-w-md bg-[#0D403E] p-8 rounded-[2rem] border border-[#FFBA22] shadow-2xl animate-in zoom-in-95">
          <div className="flex justify-center mb-6">
             <div className="w-20 h-20 rounded-full border-2 border-[#FFBA22] flex items-center justify-center bg-[#FFBA22]/5">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FFBA22" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
             </div>
          </div>
          <h1 className="text-2xl font-black mb-6 text-center text-[#FFBA22]">
            {language === 'ar' ? 'دخول لوحة التحكم' : 'Admin Portal Access'}
          </h1>
          {error && <p className="text-red-400 text-sm mb-4 text-center font-bold bg-red-400/10 p-2 rounded-lg">{error}</p>}
          <div className="space-y-4">
            <input 
              type="text" placeholder={language === 'ar' ? 'اسم المستخدم' : 'Username'}
              className="w-full border border-[#FFBA22]/50 bg-transparent rounded-xl p-4 outline-none focus:ring-2 focus:ring-[#FFBA22] text-[#FFBA22] placeholder:text-[#FFBA22]/30"
              value={username} onChange={(e) => setUsername(e.target.value)}
            />
            <input 
              type="password" placeholder={language === 'ar' ? 'كلمة المرور' : 'Password'}
              className="w-full border border-[#FFBA22]/50 bg-transparent rounded-xl p-4 outline-none focus:ring-2 focus:ring-[#FFBA22] text-[#FFBA22] placeholder:text-[#FFBA22]/30"
              value={password} onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
            <button onClick={handleLogin} className="w-full bg-[#FFBA22] text-[#0D403E] py-4 rounded-xl font-black text-lg transition active:scale-95 shadow-lg">
              {language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
            </button>
          </div>
          <p className="mt-8 text-center text-[10px] text-[#FFBA22]/40 uppercase tracking-widest font-bold">Arwa Restaurant CMS v2.0</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'status', label: language === 'ar' ? 'الحالة' : 'Status' },
    { id: 'menu', label: language === 'ar' ? 'إدارة القائمة' : 'Menu' },
    { id: 'design', label: language === 'ar' ? 'التصميم' : 'Design' },
    { id: 'users', label: language === 'ar' ? 'المستخدمين' : 'Users' },
    { id: 'settings', label: language === 'ar' ? 'الإعدادات' : 'Settings' },
  ];

  return (
    <div className="p-4 bg-[#0D403E] min-h-screen">
      <div className="max-w-5xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-[#FFBA22]">{language === 'ar' ? 'لوحة التحكم' : 'Control Center'}</h1>
            <p className="text-[#FFBA22]/50 text-sm">{language === 'ar' ? 'أهلاً بك، ' : 'Welcome back, '} {currentUser.username}</p>
          </div>
          <div className="flex items-center gap-3">
             <span className="px-3 py-1 rounded-full bg-[#FFBA22]/10 border border-[#FFBA22]/30 text-[#FFBA22] text-xs font-bold uppercase tracking-wider">{currentUser.role}</span>
             <button onClick={logout} className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500 hover:text-white transition">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
             </button>
          </div>
        </header>

        <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-8 pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 rounded-2xl text-sm font-black whitespace-nowrap transition-all border ${
                activeTab === tab.id 
                ? 'bg-[#FFBA22] text-[#0D403E] border-[#FFBA22] shadow-[0_4px_14px_0_rgba(255,186,34,0.39)]' 
                : 'bg-black/20 text-[#FFBA22]/40 border-[#FFBA22]/10 hover:border-[#FFBA22]/30'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-black/10 rounded-[2.5rem] p-8 border border-[#FFBA22]/20 shadow-xl min-h-[400px]">
          {activeTab === 'status' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-top-4">
              <h2 className="text-2xl font-black text-[#FFBA22]">{language === 'ar' ? 'حالة المطعم الحالية' : 'Current Shop Status'}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { id: 'open', label: language === 'ar' ? 'مفتوح' : 'Open', color: 'bg-green-500', border: 'border-green-500' },
                  { id: 'closed', label: language === 'ar' ? 'مغلق' : 'Closed', color: 'bg-red-500', border: 'border-red-500' },
                  { id: 'auto', label: language === 'ar' ? 'تلقائي' : 'Auto', color: 'bg-blue-500', border: 'border-blue-500' }
                ].map((s) => (
                  <button 
                    key={s.id}
                    onClick={() => updateConfig({...config, status: s.id as any})} 
                    className={`p-6 rounded-3xl border-2 transition-all group relative overflow-hidden ${
                      config.status === s.id ? `${s.border} ${s.color}/10` : 'border-[#FFBA22]/10 hover:border-[#FFBA22]/30'
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full mb-3 ${s.color} ${config.status === s.id ? 'animate-pulse' : 'opacity-40'}`}></div>
                    <div className={`font-black text-lg ${config.status === s.id ? 'text-[#FFBA22]' : 'text-[#FFBA22]/40'}`}>{s.label}</div>
                  </button>
                ))}
              </div>

              {config.status === 'auto' && (
                <div className="p-6 bg-[#FFBA22]/5 rounded-3xl border border-[#FFBA22]/20 space-y-4">
                  <h3 className="text-sm font-black text-[#FFBA22] uppercase tracking-widest">{language === 'ar' ? 'ساعات العمل' : 'Operation Hours'}</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-[#FFBA22]/40 uppercase">{language === 'ar' ? 'فتح' : 'Open'}</label>
                      <input 
                        type="time" 
                        className="w-full bg-black/20 border border-[#FFBA22]/20 rounded-2xl p-4 text-[#FFBA22] outline-none focus:border-[#FFBA22]" 
                        value={config.autoHours.open} 
                        onChange={(e) => updateConfig({...config, autoHours: {...config.autoHours, open: e.target.value}})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-[#FFBA22]/40 uppercase">{language === 'ar' ? 'إغلاق' : 'Close'}</label>
                      <input 
                        type="time" 
                        className="w-full bg-black/20 border border-[#FFBA22]/20 rounded-2xl p-4 text-[#FFBA22] outline-none focus:border-[#FFBA22]" 
                        value={config.autoHours.close} 
                        onChange={(e) => updateConfig({...config, autoHours: {...config.autoHours, close: e.target.value}})}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'menu' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-top-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                 <h2 className="text-2xl font-black text-[#FFBA22]">{language === 'ar' ? 'إدارة الأصناف' : 'Menu Management'}</h2>
                 <div className="flex gap-2">
                   <button onClick={() => { setShowCategoryModal(true); setEditingCategory({}); }} className="bg-[#FFBA22]/10 text-[#FFBA22] border border-[#FFBA22]/50 px-5 py-3 rounded-2xl text-sm font-black transition hover:bg-[#FFBA22]/20">
                     {language === 'ar' ? '+ قسم جديد' : '+ New Category'}
                   </button>
                   <button onClick={() => { setShowProductModal(true); setEditingProduct({ categoryId: categories[0]?.id || '', mostRequested: false }); }} className="bg-[#FFBA22] text-[#0D403E] px-5 py-3 rounded-2xl text-sm font-black flex items-center gap-2 shadow-lg active:scale-95 transition">
                     <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                     {language === 'ar' ? 'وجبة جديدة' : 'New Dish'}
                   </button>
                 </div>
              </div>

              {/* Categories Table/List */}
              <div className="grid grid-cols-1 gap-4">
                {categories.map(cat => (
                  <div key={cat.id} className="bg-black/20 rounded-3xl p-6 border border-[#FFBA22]/10">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <img src={cat.image} className="w-12 h-12 rounded-2xl object-cover border border-[#FFBA22]/30" alt="" />
                        <div>
                          <h3 className="text-lg font-black text-[#FFBA22]">{language === 'ar' ? cat.name_ar : cat.name_en}</h3>
                          <p className="text-[10px] text-[#FFBA22]/40 font-bold uppercase">{products.filter(p => p.categoryId === cat.id).length} {language === 'ar' ? 'وجبة' : 'items'}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { setEditingCategory(cat); setShowCategoryModal(true); }} className="p-3 bg-[#FFBA22]/5 rounded-xl text-blue-400 hover:bg-blue-400/20 transition">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                        </button>
                        <button onClick={() => setCategories(prev => prev.filter(c => c.id !== cat.id))} className="p-3 bg-red-400/5 rounded-xl text-red-400 hover:bg-red-400/20 transition">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {products.filter(p => p.categoryId === cat.id).map(prod => (
                        <div key={prod.id} className="flex items-center justify-between p-4 bg-[#0D403E]/50 rounded-2xl border border-[#FFBA22]/5 group hover:border-[#FFBA22]/30 transition">
                          <div className="flex items-center gap-3">
                            <img src={prod.image} className="w-10 h-10 rounded-xl object-cover border border-[#FFBA22]/10" alt="" />
                            <div>
                               <p className="text-sm font-bold text-[#FFBA22]">{language === 'ar' ? prod.name_ar : prod.name_en}</p>
                               <p className="text-[10px] text-[#FFBA22]/40 font-black">{prod.price} {currency} {prod.mostRequested ? '• ⭐' : ''}</p>
                            </div>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => { setEditingProduct(prod); setShowProductModal(true); }} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg></button>
                            <button onClick={() => setProducts(prev => prev.filter(p => p.id !== prod.id))} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'design' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-top-4">
              <h2 className="text-2xl font-black text-[#FFBA22]">{language === 'ar' ? 'تخصيص الهوية البصرية' : 'Brand Identity Customization'}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {/* Left Column: Fonts & Patterns */}
                 <div className="space-y-6">
                    {/* FONT CUSTOMIZATION SECTION */}
                    <section className="bg-black/20 p-6 rounded-3xl border border-[#FFBA22]/10">
                       <h3 className="text-sm font-black text-[#FFBA22] uppercase tracking-widest mb-4">{language === 'ar' ? 'تخصيص الخطوط' : 'Font Customization'}</h3>
                       <div className="space-y-6">
                          {/* Arabic Fonts Dropdown */}
                          <div>
                            <label className="text-[10px] font-black text-[#FFBA22]/40 uppercase mb-2 block">{language === 'ar' ? 'الخط العربي' : 'Arabic Font'}</label>
                            <select 
                              className="w-full bg-[#0D403E]/50 border border-[#FFBA22]/20 rounded-xl p-4 text-[#FFBA22] outline-none appearance-none cursor-pointer focus:border-[#FFBA22] hover:bg-[#0D403E]/70 transition-all"
                              value={config.design.mainFont}
                              onChange={(e) => updateDesign('mainFont', e.target.value)}
                            >
                              <optgroup label={language === 'ar' ? 'اختر الخط العربي' : 'Select Arabic Font'}>
                                {arabicFonts.map(f => (
                                  <option key={f.name} value={f.family} style={{ fontFamily: f.family }}>{f.name}</option>
                                ))}
                              </optgroup>
                            </select>
                          </div>
                          
                          {/* English Fonts Dropdown */}
                          <div>
                            <label className="text-[10px] font-black text-[#FFBA22]/40 uppercase mb-2 block">{language === 'ar' ? 'الخط الإنجليزي' : 'English Font'}</label>
                            <select 
                              className="w-full bg-[#0D403E]/50 border border-[#FFBA22]/20 rounded-xl p-4 text-[#FFBA22] outline-none appearance-none cursor-pointer focus:border-[#FFBA22] hover:bg-[#0D403E]/70 transition-all"
                              value={config.design.mainFont}
                              onChange={(e) => updateDesign('mainFont', e.target.value)}
                            >
                              <optgroup label={language === 'ar' ? 'اختر الخط الإنجليزي' : 'Select English Font'}>
                                {englishFonts.map(f => (
                                  <option key={f.name} value={f.family} style={{ fontFamily: f.family }}>{f.name}</option>
                                ))}
                              </optgroup>
                            </select>
                          </div>

                          <div className="p-4 bg-[#FFBA22]/5 rounded-xl border border-[#FFBA22]/10 text-center">
                             <p className="text-[10px] font-black text-[#FFBA22]/40 uppercase mb-2">{language === 'ar' ? 'معاينة الخط' : 'Font Preview'}</p>
                             <p className="text-xl" style={{ fontFamily: config.design.mainFont }}>
                               {language === 'ar' ? 'هذا النص هو معاينة للخط المختار.' : 'This text is a preview of the selected font.'}
                             </p>
                          </div>
                       </div>
                    </section>

                    <section className="bg-black/20 p-6 rounded-3xl border border-[#FFBA22]/10">
                       <h3 className="text-sm font-black text-[#FFBA22] uppercase tracking-widest mb-4">{language === 'ar' ? 'شعار المطعم' : 'Main Logo'}</h3>
                       <div className="flex items-center gap-6">
                         <img src={config.logo} className="w-24 h-24 rounded-full border-2 border-[#FFBA22] object-cover bg-black/40" alt="logo" />
                         <label className="flex-1 flex flex-col gap-2">
                           <span className="text-[10px] font-black text-[#FFBA22]/40 uppercase">{language === 'ar' ? 'تحديث الشعار' : 'Update Logo'}</span>
                           <input type="file" className="hidden" accept="image/*" id="logo-up" onChange={(e) => handleFileChange(e, 'logo')} />
                           <label htmlFor="logo-up" className="cursor-pointer bg-[#FFBA22]/10 text-[#FFBA22] border border-[#FFBA22]/30 p-3 rounded-xl text-xs font-black text-center hover:bg-[#FFBA22]/20 transition">
                             {language === 'ar' ? 'اختيار ملف' : 'Choose File'}
                           </label>
                         </label>
                       </div>
                    </section>

                    <section className="bg-black/20 p-6 rounded-3xl border border-[#FFBA22]/10">
                       <h3 className="text-sm font-black text-[#FFBA22] uppercase tracking-widest mb-4">{language === 'ar' ? 'نقوش الخلفية' : 'Background Pattern'}</h3>
                       <div className="space-y-4">
                          <label className="block bg-[#FFBA22]/10 text-[#FFBA22] border-2 border-dashed border-[#FFBA22]/30 p-8 rounded-2xl text-center cursor-pointer hover:bg-[#FFBA22]/20 transition">
                             <span className="text-xs font-black uppercase">{language === 'ar' ? 'رفع صورة النقوش' : 'Upload Pattern'}</span>
                             <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'pattern')} />
                          </label>
                          <div className="flex gap-4">
                            <div className="flex-1">
                              <label className="text-[10px] font-black text-[#FFBA22]/40 block mb-1">Scale: {config.design.patternScale}px</label>
                              <input type="range" min="50" max="1000" className="w-full accent-[#FFBA22]" value={config.design.patternScale} onChange={(e) => updateDesign('patternScale', parseInt(e.target.value))} />
                            </div>
                            <div className="flex-1">
                              <label className="text-[10px] font-black text-[#FFBA22]/40 block mb-1">Opacity: {Math.round((config.design.patternOpacity || 0) * 100)}%</label>
                              <input type="range" min="0" max="0.5" step="0.01" className="w-full accent-[#FFBA22]" value={config.design.patternOpacity} onChange={(e) => updateDesign('patternOpacity', parseFloat(e.target.value))} />
                            </div>
                          </div>
                       </div>
                    </section>
                 </div>

                 {/* Right Column: Colors & Sliders */}
                 <div className="space-y-6">
                    <section className="bg-black/20 p-6 rounded-3xl border border-[#FFBA22]/10">
                       <h3 className="text-sm font-black text-[#FFBA22] uppercase tracking-widest mb-4">{language === 'ar' ? 'الألوان الرئيسية' : 'Brand Colors'}</h3>
                       <div className="grid grid-cols-2 gap-4">
                          {[
                            { id: 'section1Bg', label: 'Primary BG' },
                            { id: 'primaryTextColor', label: 'Primary UI' },
                            { id: 'section2Bg', label: 'Card BG' },
                            { id: 'section3Bg', label: 'Footer BG' }
                          ].map((c) => (
                            <div key={c.id}>
                              <label className="text-[10px] font-black text-[#FFBA22]/40 uppercase block mb-1">{c.label}</label>
                              <div className="flex gap-2">
                                <input type="color" className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-none" value={(config.design as any)[c.id]} onChange={(e) => updateDesign(c.id as any, e.target.value)} />
                                <input type="text" className="flex-1 bg-black/20 border border-[#FFBA22]/20 rounded-lg text-[10px] text-[#FFBA22] px-2 outline-none" value={(config.design as any)[c.id]} onChange={(e) => updateDesign(c.id as any, e.target.value)} />
                              </div>
                            </div>
                          ))}
                       </div>
                    </section>

                    {/* Main Slider Management */}
                    <section className="bg-black/20 p-6 rounded-3xl border border-[#FFBA22]/10">
                       <div className="flex justify-between items-center mb-4">
                          <h3 className="text-sm font-black text-[#FFBA22] uppercase tracking-widest">{language === 'ar' ? 'إدارة السلايدر الرئيسي' : 'Main Slider Images'}</h3>
                          <label className="cursor-pointer bg-[#FFBA22] text-[#0D403E] px-3 py-1.5 rounded-xl text-[10px] font-black uppercase hover:opacity-90 transition">
                             {language === 'ar' ? '+ إضافة صورة' : '+ Add Slide'}
                             <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'slider')} />
                          </label>
                       </div>
                       <div className="grid grid-cols-3 gap-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                          {config.sliderImages.map((img, idx) => (
                             <div key={idx} className="relative aspect-[1900/636] rounded-lg overflow-hidden border border-[#FFBA22]/20 group">
                                <img src={img} className="w-full h-full object-cover" alt="" />
                                <button 
                                  onClick={() => removeSliderImage(idx)}
                                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                   <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                </button>
                             </div>
                          ))}
                       </div>
                    </section>
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-top-4">
               <h2 className="text-2xl font-black text-[#FFBA22]">{language === 'ar' ? 'إعدادات المتجر العامة' : 'Store Settings'}</h2>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Restaurant Info */}
                 <div className="space-y-4 bg-black/20 p-6 rounded-3xl border border-[#FFBA22]/10">
                    <h3 className="text-sm font-black text-[#FFBA22] uppercase tracking-widest">{language === 'ar' ? 'معلومات المتجر' : 'Store Information'}</h3>
                    <div className="space-y-3">
                       <div>
                          <label className="text-[10px] font-black text-[#FFBA22]/40 uppercase">{language === 'ar' ? 'اسم المطعم (عربي)' : 'Restaurant Name (AR)'}</label>
                          <input className="w-full bg-[#0D403E]/50 border border-[#FFBA22]/20 rounded-xl p-3 text-[#FFBA22] outline-none" value={config.name_ar} onChange={e => updateConfig({...config, name_ar: e.target.value})} />
                       </div>
                       <div>
                          <label className="text-[10px] font-black text-[#FFBA22]/40 uppercase">{language === 'ar' ? 'اسم المطعم (إنجليزي)' : 'Restaurant Name (EN)'}</label>
                          <input className="w-full bg-[#0D403E]/50 border border-[#FFBA22]/20 rounded-xl p-3 text-[#FFBA22] outline-none" value={config.name_en} onChange={e => updateConfig({...config, name_en: e.target.value})} />
                       </div>
                       <div>
                          <label className="text-[10px] font-black text-[#FFBA22]/40 uppercase">{language === 'ar' ? 'العنوان (عربي)' : 'Address (AR)'}</label>
                          <input className="w-full bg-[#0D403E]/50 border border-[#FFBA22]/20 rounded-xl p-3 text-[#FFBA22] outline-none" value={config.location_ar} onChange={e => updateConfig({...config, location_ar: e.target.value})} />
                       </div>
                       <div>
                          <label className="text-[10px] font-black text-[#FFBA22]/40 uppercase">{language === 'ar' ? 'العنوان (إنجليزي)' : 'Address (EN)'}</label>
                          <input className="w-full bg-[#0D403E]/50 border border-[#FFBA22]/20 rounded-xl p-3 text-[#FFBA22] outline-none" value={config.location_en} onChange={e => updateConfig({...config, location_en: e.target.value})} />
                       </div>
                    </div>
                 </div>

                 <div className="space-y-4 bg-black/20 p-6 rounded-3xl border border-[#FFBA22]/10">
                    <h3 className="text-sm font-black text-[#FFBA22] uppercase tracking-widest">{language === 'ar' ? 'معلومات الاتصال والظهور' : 'Contact & Visibility'}</h3>
                    <div className="space-y-4">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-[#FFBA22]/40 uppercase">{language === 'ar' ? 'رقم الواتساب' : 'WhatsApp'}</label>
                          <input className="w-full bg-[#0D403E]/50 border border-[#FFBA22]/20 rounded-xl p-3 text-[#FFBA22] outline-none mb-2" value={config.whatsapp} onChange={e => updateConfig({...config, whatsapp: e.target.value})} />
                          <label className="flex items-center gap-3 cursor-pointer group">
                             <div 
                               onClick={() => updateConfig({...config, showFooterWhatsapp: !config.showFooterWhatsapp})}
                               className={`w-10 h-5 rounded-full relative transition ${config.showFooterWhatsapp ? 'bg-[#FFBA22]' : 'bg-gray-700'}`}
                             >
                                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.showFooterWhatsapp ? 'left-6' : 'left-1'}`}></div>
                             </div>
                             <span className="text-xs font-black text-[#FFBA22]/80 group-hover:text-[#FFBA22] transition">
                               {language === 'ar' ? 'إظهار الواتساب في الفوتر' : 'Show WhatsApp in Footer'}
                             </span>
                          </label>
                       </div>
                       <div className="space-y-2 pt-2 border-t border-[#FFBA22]/10">
                          <label className="text-[10px] font-black text-[#FFBA22]/40 uppercase">{language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}</label>
                          <input className="w-full bg-[#0D403E]/50 border border-[#FFBA22]/20 rounded-xl p-3 text-[#FFBA22] outline-none mb-2" value={config.phone} onChange={e => updateConfig({...config, phone: e.target.value})} />
                          <label className="flex items-center gap-3 cursor-pointer group">
                             <div 
                               onClick={() => updateConfig({...config, showFooterPhone: !config.showFooterPhone})}
                               className={`w-10 h-5 rounded-full relative transition ${config.showFooterPhone ? 'bg-[#FFBA22]' : 'bg-gray-700'}`}
                             >
                                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.showFooterPhone ? 'left-6' : 'left-1'}`}></div>
                             </div>
                             <span className="text-xs font-black text-[#FFBA22]/80 group-hover:text-[#FFBA22] transition">
                               {language === 'ar' ? 'إظهار الهاتف في الفوتر' : 'Show Phone in Footer'}
                             </span>
                          </label>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-4 bg-black/20 p-6 rounded-3xl border border-[#FFBA22]/10">
                    <h3 className="text-sm font-black text-[#FFBA22] uppercase tracking-widest">{language === 'ar' ? 'روابط التواصل' : 'Social Channels'}</h3>
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                       {config.socialLinks.map(link => (
                         <div key={link.id} className="flex gap-2 items-center">
                            <span className="w-20 text-[10px] font-black text-[#FFBA22]/60 uppercase truncate">{link.platform}</span>
                            <input className="flex-1 bg-[#0D403E]/50 border border-[#FFBA22]/20 rounded-lg p-2 text-[10px] text-[#FFBA22]" value={link.url} onChange={e => updateSocialLink(link.id, {url: e.target.value})} />
                            <button onClick={() => updateSocialLink(link.id, {isActive: !link.isActive})} className={`p-2 rounded-lg ${link.isActive ? 'text-green-500' : 'text-gray-600'}`}>
                               <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            </button>
                         </div>
                       ))}
                    </div>
                    <button onClick={addSocialLink} className="w-full bg-[#FFBA22]/10 text-[#FFBA22] text-[10px] font-black py-2 rounded-xl border border-[#FFBA22]/30 uppercase hover:bg-[#FFBA22]/20 transition">{language === 'ar' ? '+ إضافة منصة' : '+ Add Platform'}</button>
                 </div>
               </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-top-4">
               <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-black text-[#FFBA22]">{language === 'ar' ? 'فريق العمل' : 'Team Management'}</h2>
                  <button onClick={() => { setEditingUser({ role: 'staff', permissions: ['edit'] }); setShowUserModal(true); }} className="bg-[#FFBA22] text-[#0D403E] px-5 py-3 rounded-2xl text-sm font-black shadow-lg">
                    {language === 'ar' ? 'إضافة مستخدم' : 'Add Member'}
                  </button>
               </div>
               <div className="bg-black/20 rounded-3xl overflow-hidden border border-[#FFBA22]/10">
                  <table className="w-full text-left">
                    <thead>
                       <tr className="border-b border-[#FFBA22]/10 text-[#FFBA22]/40 text-[10px] font-black uppercase tracking-widest">
                          <th className="p-6">{language === 'ar' ? 'الاسم' : 'Username'}</th>
                          <th className="p-6">{language === 'ar' ? 'الدور' : 'Role'}</th>
                          <th className="p-6 text-right">{language === 'ar' ? 'إجراء' : 'Actions'}</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-[#FFBA22]/5">
                       {users.map(u => (
                         <tr key={u.id} className="hover:bg-white/5 transition">
                            <td className="p-6 text-[#FFBA22] font-black">{u.username}</td>
                            <td className="p-6">
                               <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-wider ${u.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>{u.role}</span>
                            </td>
                            <td className="p-6 text-right">
                               <button onClick={() => { setEditingUser(u); setShowUserModal(true); }} className="p-2 text-[#FFBA22]/60 hover:text-[#FFBA22] transition"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg></button>
                               <button onClick={() => setUsers(prev => prev.filter(item => item.id !== u.id))} disabled={u.id === currentUser.id} className="p-2 text-red-500/40 hover:text-red-500 transition disabled:opacity-0"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg></button>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                  </table>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals for Product, Category, User */}
      {showProductModal && editingProduct && (
        <div className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in zoom-in-95">
           <div className="bg-[#0D403E] border-2 border-[#FFBA22] rounded-[3rem] w-full max-w-2xl p-8 my-auto shadow-2xl relative">
              <button onClick={() => setShowProductModal(false)} className="absolute top-8 right-8 text-[#FFBA22]/40 hover:text-[#FFBA22]"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
              <h2 className="text-3xl font-black text-[#FFBA22] mb-8">{editingProduct.id ? (language === 'ar' ? 'تعديل بيانات الوجبة' : 'Update Dish Info') : (language === 'ar' ? 'وجبة جديدة' : 'Add New Dish')}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-4">
                    <div className="relative aspect-square rounded-[2rem] overflow-hidden border-2 border-[#FFBA22]/30 bg-black/20 group">
                       <img src={editingProduct.image || 'https://via.placeholder.com/300'} className="w-full h-full object-cover" alt="" />
                       <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer">
                          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                          <span className="text-xs text-white font-black mt-2">UPLOAD</span>
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'product')} />
                       </label>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-black/20 rounded-2xl border border-[#FFBA22]/10 cursor-pointer" onClick={() => setEditingProduct({...editingProduct, mostRequested: !editingProduct.mostRequested})}>
                       <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition ${editingProduct.mostRequested ? 'bg-[#FFBA22] border-[#FFBA22]' : 'border-[#FFBA22]/30'}`}>
                          {editingProduct.mostRequested && <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0D403E" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                       </div>
                       <span className="text-xs font-black text-[#FFBA22]">{language === 'ar' ? 'عرض في الأكثر طلباً' : 'Show in Most Requested'}</span>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                       <div>
                          <label className="text-[10px] font-black text-[#FFBA22]/40 uppercase mb-1 block">Name AR</label>
                          <input className="w-full bg-black/20 border border-[#FFBA22]/20 rounded-xl p-3 text-sm text-[#FFBA22] outline-none" value={editingProduct.name_ar || ''} onChange={e => setEditingProduct({...editingProduct, name_ar: e.target.value})} />
                       </div>
                       <div>
                          <label className="text-[10px] font-black text-[#FFBA22]/40 uppercase mb-1 block">Name EN</label>
                          <input className="w-full bg-black/20 border border-[#FFBA22]/20 rounded-xl p-3 text-sm text-[#FFBA22] outline-none" value={editingProduct.name_en || ''} onChange={e => setEditingProduct({...editingProduct, name_en: e.target.value})} />
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                       <div>
                          <label className="text-[10px] font-black text-[#FFBA22]/40 uppercase mb-1 block">Price</label>
                          <input type="number" className="w-full bg-black/20 border border-[#FFBA22]/20 rounded-xl p-3 text-sm text-[#FFBA22] outline-none" value={editingProduct.price || ''} onChange={e => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})} />
                       </div>
                       <div>
                          <label className="text-[10px] font-black text-[#FFBA22]/40 uppercase mb-1 block">Category</label>
                          <select className="w-full bg-black/20 border border-[#FFBA22]/20 rounded-xl p-3 text-sm text-[#FFBA22] outline-none appearance-none" value={editingProduct.categoryId} onChange={e => setEditingProduct({...editingProduct, categoryId: e.target.value})}>
                             {categories.map(c => <option key={c.id} value={c.id}>{language === 'ar' ? c.name_ar : c.name_en}</option>)}
                          </select>
                       </div>
                    </div>
                    <div>
                       <label className="text-[10px] font-black text-[#FFBA22]/40 uppercase mb-1 block">Description AR</label>
                       <textarea rows={2} className="w-full bg-black/20 border border-[#FFBA22]/20 rounded-xl p-3 text-sm text-[#FFBA22] outline-none resize-none" value={editingProduct.description_ar || ''} onChange={e => setEditingProduct({...editingProduct, description_ar: e.target.value})} />
                    </div>
                    <div>
                       <label className="text-[10px] font-black text-[#FFBA22]/40 uppercase mb-1 block">Description EN</label>
                       <textarea rows={2} className="w-full bg-black/20 border border-[#FFBA22]/20 rounded-xl p-3 text-sm text-[#FFBA22] outline-none resize-none" value={editingProduct.description_en || ''} onChange={e => setEditingProduct({...editingProduct, description_en: e.target.value})} />
                    </div>
                    <button onClick={() => {
                       const final = { ...editingProduct, id: editingProduct.id || Date.now().toString() } as Product;
                       if (editingProduct.id) setProducts(prev => prev.map(p => p.id === editingProduct.id ? final : p));
                       else setProducts(prev => [...prev, final]);
                       setShowProductModal(false);
                    }} className="w-full bg-[#FFBA22] text-[#0D403E] py-4 rounded-2xl font-black text-lg shadow-xl active:scale-95 transition">
                       {language === 'ar' ? 'حفظ البيانات' : 'Save Dish'}
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Category Modal - Simplified */}
      {showCategoryModal && editingCategory && (
        <div className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
           <div className="bg-[#0D403E] border-2 border-[#FFBA22] rounded-[3rem] w-full max-w-md p-8 shadow-2xl relative">
              <h2 className="text-2xl font-black text-[#FFBA22] mb-8">{editingCategory.id ? (language === 'ar' ? 'تعديل القسم' : 'Edit Category') : (language === 'ar' ? 'قسم جديد' : 'New Category')}</h2>
              <div className="space-y-6">
                 <div className="flex justify-center">
                    <label className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-[#FFBA22]/30 group cursor-pointer">
                       <img src={editingCategory.image || 'https://via.placeholder.com/150'} className="w-full h-full object-cover" alt="" />
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                       </div>
                       <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'category')} />
                    </label>
                 </div>
                 <div className="space-y-4">
                    <input className="w-full bg-black/20 border border-[#FFBA22]/20 rounded-2xl p-4 text-[#FFBA22] outline-none" placeholder="Name Arabic" value={editingCategory.name_ar || ''} onChange={e => setEditingCategory({...editingCategory, name_ar: e.target.value})} />
                    <input className="w-full bg-black/20 border border-[#FFBA22]/20 rounded-2xl p-4 text-[#FFBA22] outline-none" placeholder="Name English" value={editingCategory.name_en || ''} onChange={e => setEditingCategory({...editingCategory, name_en: e.target.value})} />
                    <button onClick={() => {
                       const final = { ...editingCategory, id: editingCategory.id || Date.now().toString() } as Category;
                       if (editingCategory.id) setCategories(prev => prev.map(c => c.id === editingCategory.id ? final : c));
                       else setCategories(prev => [...prev, final]);
                       setShowCategoryModal(false);
                    }} className="w-full bg-[#FFBA22] text-[#0D403E] py-4 rounded-2xl font-black shadow-xl active:scale-95 transition">SAVE</button>
                    <button onClick={() => setShowCategoryModal(false)} className="w-full text-[#FFBA22]/50 font-black uppercase text-xs">CANCEL</button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* User Modal */}
      {showUserModal && editingUser && (
        <div className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
           <div className="bg-[#0D403E] border-2 border-[#FFBA22] rounded-[3rem] w-full max-w-md p-8 shadow-2xl relative">
              <h2 className="text-2xl font-black text-[#FFBA22] mb-8">{editingUser.id ? 'Update Team Member' : 'Add Team Member'}</h2>
              <div className="space-y-4">
                 <input className="w-full bg-black/20 border border-[#FFBA22]/20 rounded-2xl p-4 text-[#FFBA22] outline-none" placeholder="Username" value={editingUser.username || ''} onChange={e => setEditingUser({...editingUser, username: e.target.value})} />
                 <input className="w-full bg-black/20 border border-[#FFBA22]/20 rounded-2xl p-4 text-[#FFBA22] outline-none" placeholder="Password (Optional/Reset)" type="password" onChange={e => setEditingUser({...editingUser, password: e.target.value})} />
                 <select className="w-full bg-black/20 border border-[#FFBA22]/20 rounded-2xl p-4 text-[#FFBA22] outline-none" value={editingUser.role} onChange={e => setEditingUser({...editingUser, role: e.target.value as any})}>
                    <option value="staff">Staff Member</option>
                    <option value="admin">Administrator</option>
                 </select>
                 <button onClick={() => {
                    const final = { ...editingUser, id: editingUser.id || Date.now().toString() } as User;
                    if (editingUser.id) setUsers(prev => prev.map(u => u.id === editingUser.id ? final : u));
                    else setUsers(prev => [...prev, final]);
                    setShowUserModal(false);
                 }} className="w-full bg-[#FFBA22] text-[#0D403E] py-4 rounded-2xl font-black shadow-xl">SAVE MEMBER</button>
                 <button onClick={() => setShowUserModal(false)} className="w-full text-[#FFBA22]/50 font-black uppercase text-xs">CANCEL</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;