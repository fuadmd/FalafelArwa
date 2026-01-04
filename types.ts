
export type Language = 'ar' | 'en';

export interface Category {
  id: string;
  name_ar: string;
  name_en: string;
  image: string;
}

export interface Product {
  id: string;
  categoryId: string;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  price: number;
  image: string;
  mostRequested: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  username: string;
  password?: string; // For mock DB authentication
  role: 'admin' | 'staff';
  permissions: string[];
}

export interface SocialLink {
  id: string;
  platform: 'facebook' | 'instagram' | 'twitter' | 'whatsapp' | 'youtube' | 'tiktok' | 'snapchat' | 'other';
  url: string;
  isActive: boolean;
}

export interface DesignConfig {
  mainFont: string;
  primaryTextColor: string;
  productName: {
    color: string;
    weight: string;
    font: string;
  };
  categoryTitle: {
    color: string;
    weight: string;
  };
  sliderLineColor: string;
  section1Bg: string;
  section2Bg: string;
  section3Bg: string;
  backgroundImagePattern?: string;
  patternOpacity?: number;
  patternScale?: number;
}

export interface RestaurantConfig {
  name_ar: string;
  name_en: string;
  logo: string;
  phone: string;
  location_ar: string;
  location_en: string;
  whatsapp: string;
  showFooterPhone: boolean;
  showFooterWhatsapp: boolean;
  status: 'open' | 'closed' | 'auto';
  autoHours: {
    open: string;
    close: string;
  };
  design: DesignConfig;
  sliderImages: string[];
  bottomSliderImages: string[];
  bottomFloatingImage?: string;
  socialLinks: SocialLink[];
}
