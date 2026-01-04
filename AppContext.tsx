
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, Category, Product, CartItem, RestaurantConfig, User } from './types';
import { initialCategories, initialProducts, initialConfig, initialUsers } from './initialData';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  categories: Category[];
  products: Product[];
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  config: RestaurantConfig;
  updateConfig: (newConfig: RestaurantConfig) => void;
  users: User[];
  currentUser: User | null;
  login: (username: string, password?: string) => boolean;
  logout: () => void;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  notification: string | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('lang');
    return (saved as Language) || 'ar';
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('categories_db');
    return saved ? JSON.parse(saved) : initialCategories;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('products_db');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  const [config, setConfig] = useState<RestaurantConfig>(() => {
    const saved = localStorage.getItem('config_db');
    return saved ? JSON.parse(saved) : initialConfig;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('users_db');
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('currentUser_db');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('lang', language);
    document.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => localStorage.setItem('categories_db', JSON.stringify(categories)), [categories]);
  useEffect(() => localStorage.setItem('products_db', JSON.stringify(products)), [products]);
  useEffect(() => localStorage.setItem('config_db', JSON.stringify(config)), [config]);
  useEffect(() => localStorage.setItem('users_db', JSON.stringify(users)), [users]);
  useEffect(() => {
    if (currentUser) localStorage.setItem('currentUser_db', JSON.stringify(currentUser));
    else localStorage.removeItem('currentUser_db');
  }, [currentUser]);

  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 1500);
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    triggerNotification(language === 'ar' ? 'تمت الإضافة بنجاح' : 'Added successfully');
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
    triggerNotification(language === 'ar' ? 'تم الحذف' : 'Removed');
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setCart(prev => {
      const item = prev.find(i => i.id === productId);
      if (item && item.quantity + delta <= 0) {
        triggerNotification(language === 'ar' ? 'تم الحذف' : 'Removed');
      }
      return prev.map(item => {
        if (item.id === productId) {
          const newQty = Math.max(0, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const clearCart = () => {
    setCart([]);
    triggerNotification(language === 'ar' ? 'تم إفراغ السلة' : 'Cart cleared');
  };

  const updateConfig = (newConfig: RestaurantConfig) => setConfig(newConfig);

  const login = (username: string, password?: string) => {
    const user = users.find(u => 
      u.username.toLowerCase() === username.toLowerCase() && 
      (!password || u.password === password)
    );
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => setCurrentUser(null);

  return (
    <AppContext.Provider value={{
      language, setLanguage,
      categories, products, cart, addToCart, removeFromCart, updateCartQuantity, clearCart,
      config, updateConfig,
      users, currentUser, login, logout,
      setProducts, setCategories, setUsers,
      notification
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
