import React from 'react';
import { Product } from '../types';
import { Package, DollarSign, Users, ShoppingBag } from 'lucide-react';

export const AdminDashboard: React.FC<{ products: Product[] }> = ({ products }) => {
  // Simulated stats
  const stats = [
    { label: 'Total Products', value: products.length, icon: Package, color: 'text-blue-500', bg: 'bg-blue-100' },
    { label: 'Total Revenue', value: '$12,450', icon: DollarSign, color: 'text-green-500', bg: 'bg-green-100' },
    { label: 'Total Orders', value: '1,240', icon: ShoppingBag, color: 'text-purple-500', bg: 'bg-purple-100' },
    { label: 'Active Users', value: '854', icon: Users, color: 'text-orange-500', bg: 'bg-orange-100' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-secondary mb-2">Overview</h2>
        <p className="text-gray-500">Welcome back, here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
                <stat.icon size={24} />
              </div>
              <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full">+12%</span>
            </div>
            <h3 className="text-2xl font-black text-secondary">{stat.value}</h3>
            <p className="text-sm text-gray-400 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-64 flex items-center justify-center text-gray-400">
           [Sales Chart Placeholder using Recharts or D3 would go here]
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-lg mb-4">Recent Products</h3>
          <div className="space-y-4">
            {products.slice(0, 4).map(p => (
              <div key={p.id} className="flex items-center gap-4">
                <img src={p.image} alt={p.name} className="w-12 h-12 rounded-lg object-cover" />
                <div>
                  <h4 className="font-bold text-sm">{p.name}</h4>
                  <p className="text-xs text-gray-500">{p.category}</p>
                </div>
                <div className="ml-auto font-bold text-sm">${p.price}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};