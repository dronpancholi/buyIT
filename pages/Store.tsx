import React, { useState, useMemo } from 'react';
import { INITIAL_CATEGORIES } from '../constants';
import { Product, CartItem } from '../types';
import { Hero } from '../components/Hero';
import { ProductCard } from '../components/ProductCard';

interface StoreProps {
  products: Product[];
  cart: CartItem[];
  onAddToCart: (product: Product) => void;
  onRemoveFromCart: (productId: string) => void;
  searchQuery: string;
}

export const Store: React.FC<StoreProps> = ({
  products,
  cart,
  onAddToCart,
  onRemoveFromCart,
  searchQuery
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filteredProducts = useMemo(() => {
    let result = products;

    if (activeCategory !== 'All') {
      result = result.filter(p => p.category === activeCategory);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q));
    }

    return result;
  }, [products, activeCategory, searchQuery]);

  return (
    <main>
      <Hero />

      {/* Categories Rail */}
      <section className="container mx-auto px-4 md:px-6 mb-12">
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
           <button
            onClick={() => setActiveCategory('All')}
            className={`flex-shrink-0 px-6 py-3 rounded-2xl font-bold transition-all ${
              activeCategory === 'All' 
                ? 'bg-secondary text-primary shadow-lg scale-105' 
                : 'bg-white text-gray-600 hover:bg-gray-100 shadow-sm'
            }`}
          >
            All Items
          </button>
          {INITIAL_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.name)}
              className={`flex-shrink-0 px-6 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 ${
                activeCategory === cat.name 
                  ? 'bg-secondary text-primary shadow-lg scale-105' 
                  : 'bg-white text-gray-600 hover:bg-gray-100 shadow-sm'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Products Grid */}
      <section className="container mx-auto px-4 md:px-6 mb-20">
        <div className="flex items-center justify-between mb-8">
           <h2 className="text-2xl font-bold text-secondary">
             {activeCategory === 'All' ? 'Popular Products' : activeCategory}
           </h2>
           <span className="text-sm text-gray-400 font-medium">{filteredProducts.length} items</span>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {filteredProducts.map(product => {
              const cartItem = cart.find(item => item.id === product.id);
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  quantity={cartItem ? cartItem.quantity : 0}
                  onAdd={onAddToCart}
                  onRemove={onRemoveFromCart}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <p className="text-xl text-gray-400 font-medium">No products found</p>
            <p className="text-sm text-gray-300">Try adjusting your search or category</p>
          </div>
        )}
      </section>
    </main>
  );
};