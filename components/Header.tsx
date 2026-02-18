import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, MapPin, User, Menu } from 'lucide-react';
import { CartItem } from '../types';

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
  onSearch: (query: string) => void;
  onAdminClick: () => void;
  onHomeClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  cartCount, 
  onCartClick, 
  onSearch, 
  onAdminClick,
  onHomeClick
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${
      isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-white py-5'
    }`}>
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between gap-4">
        {/* Logo & Location */}
        <div className="flex items-center gap-6 cursor-pointer" onClick={onHomeClick}>
          <div className="text-3xl font-extrabold tracking-tighter text-secondary">
            BUY<span className="text-primary">IT</span>
          </div>
          <div className="hidden lg:flex items-center gap-2 text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors">
            <MapPin size={16} className="text-secondary" />
            <span>Downtown, New York</span>
            <span className="text-xs">▼</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl relative hidden md:block">
          <input
            type="text"
            placeholder="Search for 'avocado'..."
            value={searchValue}
            onChange={handleSearchChange}
            className="w-full bg-gray-100 border-none rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none text-sm font-medium"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onAdminClick}
            className="p-2.5 rounded-full hover:bg-gray-100 text-gray-700 transition-colors hidden sm:block" 
            title="Admin Login"
          >
            <User size={22} />
          </button>
          
          <button 
            onClick={onCartClick}
            className="relative p-2.5 rounded-full bg-secondary text-white hover:bg-black transition-transform active:scale-95"
          >
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-secondary text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search - Visible only on small screens */}
      <div className="md:hidden px-4 pb-2 mt-2">
         <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchValue}
            onChange={handleSearchChange}
            className="w-full bg-gray-100 border-none rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-primary outline-none text-sm"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        </div>
      </div>
    </header>
  );
};