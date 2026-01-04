
import { Category, Product, RestaurantConfig, User, SocialLink, DesignConfig } from './types';

export const initialCategories: Category[] = [
  { id: '1', name_ar: 'المقبلات', name_en: 'Appetizers', image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?q=80&w=200&auto=format&fit=crop' },
  { id: '2', name_ar: 'الأطباق الرئيسية', name_en: 'Main Courses', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=200&auto=format&fit=crop' },
  { id: '3', name_ar: 'السندويشات', name_en: 'Sandwiches', image: 'https://images.unsplash.com/photo-1521390188846-e2a3a97453a0?q=80&w=200&auto=format&fit=crop' },
  { id: '4', name_ar: 'السلطات', name_en: 'Salads', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=200&auto=format&fit=crop' },
  { id: '5', name_ar: 'المشروبات', name_en: 'Drinks', image: 'https://images.unsplash.com/photo-1544145945-f904253d0c7b?q=80&w=200&auto=format&fit=crop' },
  { id: '6', name_ar: 'الحلويات', name_en: 'Desserts', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=200&auto=format&fit=crop' },
];

export const initialProducts: Product[] = [
  {
    id: 'p1',
    categoryId: '1',
    name_ar: 'حمص بيروتي',
    name_en: 'Beiruti Hummus',
    description_ar: 'حمص مطحون مع الثوم والبقدونس والليمون وزيت الزيتون البكر',
    description_en: 'Mashed chickpeas with garlic, parsley, lemon and extra virgin olive oil',
    price: 15,
    image: 'https://images.unsplash.com/photo-1577906030559-facc47b08124?q=80&w=400&auto=format&fit=crop',
    mostRequested: true
  },
  {
    id: 'p2',
    categoryId: '2',
    name_ar: 'مشاوي مشكلة',
    name_en: 'Mixed Grill',
    description_ar: 'تشكيلة فاخرة من اللحم والدجاج والكباب المشوي على الفحم',
    description_en: 'Assortment of grilled meat, chicken, and charcoal-grilled kebab',
    price: 65,
    image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?q=80&w=400&auto=format&fit=crop',
    mostRequested: true
  },
  {
    id: 'p3',
    categoryId: '3',
    name_ar: 'شاورما دجاج',
    name_en: 'Chicken Shawarma',
    description_ar: 'دجاج متبل بخلطة أروى السرية مع صلصة الثوم والمخلل',
    description_en: 'Marinated chicken with Arwa secret blend, garlic sauce and pickles',
    price: 25,
    image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?q=80&w=400&auto=format&fit=crop',
    mostRequested: true
  },
  {
    id: 'p4',
    categoryId: '4',
    name_ar: 'فتوش',
    name_en: 'Fattoush',
    description_ar: 'سلطة خضار طازجة مع الخبز المحمص ودبس الرمان الجبلي',
    description_en: 'Fresh vegetable salad with toasted bread and mountain pomegranate molasses',
    price: 18,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=400&auto=format&fit=crop',
    mostRequested: false
  },
  {
    id: 'p5',
    categoryId: '5',
    name_ar: 'شاي عدني',
    name_en: 'Adani Tea',
    description_ar: 'شاي بالحليب مع الهيل والبهارات العدنية التقليدية',
    description_en: 'Milk tea with cardamom and traditional Adani spices',
    price: 8,
    image: 'https://images.unsplash.com/photo-1544787210-2827448b3dc3?q=80&w=400&auto=format&fit=crop',
    mostRequested: true
  },
];

export const initialSocialLinks: SocialLink[] = [
  { id: 's1', platform: 'facebook', url: 'https://facebook.com/arwarestaurant', isActive: true },
  { id: 's2', platform: 'instagram', url: 'https://instagram.com/arwa_food', isActive: true },
  { id: 's3', platform: 'twitter', url: 'https://twitter.com/arwarest', isActive: true },
];

export const defaultDesign: DesignConfig = {
  mainFont: 'Cairo',
  primaryTextColor: '#FFBA22',
  productName: { color: '#F7F3ED', weight: '700', font: 'Cairo' },
  categoryTitle: { color: '#FFBA22', weight: '700' },
  sliderLineColor: '#F7F3ED',
  section1Bg: '#0D403E',
  section2Bg: '#0D403E',
  section3Bg: '#F7F3ED',
  backgroundImagePattern: '',
  patternOpacity: 0.1,
  patternScale: 150
};

export const initialConfig: RestaurantConfig = {
  name_ar: 'مطعم أروى',
  name_en: 'Arwa Restaurant',
  logo: 'https://images.unsplash.com/photo-1550966841-3ee3ad15fed0?q=80&w=200&auto=format&fit=crop',
  phone: '+966 50 123 4567',
  location_ar: 'الرياض، المملكة العربية السعودية',
  location_en: 'Riyadh, Saudi Arabia',
  whatsapp: '966501234567',
  showFooterPhone: true,
  showFooterWhatsapp: true,
  status: 'open',
  autoHours: { open: '08:00', close: '23:00' },
  design: defaultDesign,
  sliderImages: [
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1473093226795-af9932fe5856?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800&auto=format&fit=crop'
  ],
  bottomSliderImages: [
    'https://images.unsplash.com/photo-1541014741259-df529411b96a?q=80&w=300&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=300&auto=format&fit=crop'
  ],
  bottomFloatingImage: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=300&auto=format&fit=crop',
  socialLinks: initialSocialLinks
};

export const initialUsers: User[] = [
  { id: '1', username: 'admin', password: 'admin', role: 'admin', permissions: ['full'] },
  { id: '2', username: 'staff', password: 'staff', role: 'staff', permissions: ['edit', 'publish'] },
];
