
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './AppContext';
import Navbar from './components/Navbar';
import FloatingCart from './components/FloatingCart';
import Notification from './components/Notification';
import Home from './pages/Home';
import CartPage from './pages/CartPage';
import AdminPage from './pages/AdminPage';

const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen pb-24">
      <Navbar />
      <Notification />
      <main className="w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <FloatingCart />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
};

export default App;
