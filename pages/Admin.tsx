import React, { useState } from 'react';
import { LayoutDashboard, Package, LogOut, ArrowLeft } from 'lucide-react';
import { Product } from '../types';
import { AdminDashboard } from './AdminDashboard';
import { AdminProducts } from './AdminProducts';

interface AdminProps {
  products: Product[];
  onUpdateProducts: (products: Product[]) => void;
  onLogout: () => void;
}

type Tab = 'dashboard' | 'products';

export const Admin: React.FC<AdminProps> = ({ products, onUpdateProducts, onLogout }) => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-secondary text-white flex-shrink-0">
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <div className="text-2xl font-extrabold tracking-tighter">
            BUY<span className="text-primary">IT</span>
          </div>
        </div>
        
        <nav className="p-4 space-y-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'dashboard' ? 'bg-primary text-secondary font-bold' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'products' ? 'bg-primary text-secondary font-bold' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <Package size={20} />
            Products
          </button>
        </nav>

        <div className="p-4 mt-auto border-t border-gray-800">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-gray-800 transition-all"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto max-h-screen">
        <header className="bg-white p-6 shadow-sm flex items-center justify-between md:hidden">
           <h1 className="font-bold text-lg capitalize">{activeTab}</h1>
           <button onClick={onLogout}><LogOut size={20} /></button>
        </header>
        
        <div className="p-6 md:p-10">
          {activeTab === 'dashboard' ? (
            <AdminDashboard products={products} />
          ) : (
            <AdminProducts products={products} onUpdateProducts={onUpdateProducts} />
          )}
        </div>
      </div>
    </div>
  );
};