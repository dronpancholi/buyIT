import React, { useState, useEffect } from 'react';
import { ViewState, Product, CartItem } from './types';
import { getStoredProducts, saveStoredProducts, getStoredCart, saveStoredCart } from './services/storage';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { Store } from './pages/Store';
import { AdminLogin } from './pages/AdminLogin';
import { Admin } from './pages/Admin';
import { HashRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';

const AppContent: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setProducts(getStoredProducts());
    setCart(getStoredCart());
  }, []);

  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      let newCart;
      if (existing) {
        newCart = prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        newCart = [...prev, { ...product, quantity: 1 }];
      }
      saveStoredCart(newCart);
      return newCart;
    });
    // Optional: Show toast here
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === productId);
      let newCart;
      if (existing && existing.quantity > 1) {
        newCart = prev.map(item => 
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        );
      } else {
        newCart = prev.filter(item => item.id !== productId);
      }
      saveStoredCart(newCart);
      return newCart;
    });
  };

  const handleDeleteFromCart = (productId: string) => {
    setCart(prev => {
      const newCart = prev.filter(item => item.id !== productId);
      saveStoredCart(newCart);
      return newCart;
    });
  };

  const updateProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    saveStoredProducts(newProducts);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Simple layout wrapper logic
  const isStorePage = location.pathname === '/';

  return (
    <>
      {isStorePage && (
        <Header 
          cartCount={cartCount} 
          onCartClick={() => setIsCartOpen(true)}
          onSearch={setSearchQuery}
          onAdminClick={() => navigate('/admin/login')}
          onHomeClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            navigate('/');
          }}
        />
      )}

      <Routes>
        <Route path="/" element={
          <Store 
            products={products}
            cart={cart}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={handleRemoveFromCart}
            searchQuery={searchQuery}
          />
        } />
        
        <Route path="/admin/login" element={
          <AdminLogin 
            onLogin={() => navigate('/admin/dashboard')} 
            onBack={() => navigate('/')} 
          />
        } />
        
        <Route path="/admin/dashboard" element={
          <Admin 
            products={products} 
            onUpdateProducts={updateProducts}
            onLogout={() => navigate('/admin/login')}
          />
        } />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {isStorePage && <Footer />}

      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onAdd={(item) => handleAddToCart(item)}
        onRemove={handleRemoveFromCart}
        onDelete={handleDeleteFromCart}
      />
    </>
  );
};

export default function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}