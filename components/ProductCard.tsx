import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { Product } from '../types';
import { Button } from './Button';

interface ProductCardProps {
  product: Product;
  quantity: number;
  onAdd: (product: Product) => void;
  onRemove: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  quantity, 
  onAdd, 
  onRemove 
}) => {
  return (
    <div className="group bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      <div className="relative mb-4 overflow-hidden rounded-xl aspect-square bg-gray-50">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {product.discount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
            {product.discount}% OFF
          </div>
        )}
      </div>

      <div className="flex-1">
        <div className="text-xs text-gray-400 font-medium mb-1">{product.weight}</div>
        <h3 className="font-bold text-gray-900 leading-tight mb-1">{product.name}</h3>
        <div className="text-xs text-gray-400 mb-3">{product.category}</div>
      </div>

      <div className="flex items-center justify-between mt-auto">
        <div className="font-bold text-lg text-secondary">
          ${product.price.toFixed(2)}
        </div>

        {quantity === 0 ? (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onAdd(product)}
            className="!rounded-lg !py-1.5 !px-4 text-primary bg-secondary border-transparent hover:bg-gray-800 hover:text-primary"
          >
            ADD
          </Button>
        ) : (
          <div className="flex items-center bg-secondary text-primary rounded-lg shadow-md overflow-hidden h-8">
            <button 
              onClick={() => onRemove(product.id)}
              className="w-8 h-full flex items-center justify-center hover:bg-gray-700 transition-colors"
            >
              <Minus size={14} strokeWidth={3} />
            </button>
            <span className="w-6 text-center text-sm font-bold text-white">{quantity}</span>
            <button 
              onClick={() => onAdd(product)}
              className="w-8 h-full flex items-center justify-center hover:bg-gray-700 transition-colors"
            >
              <Plus size={14} strokeWidth={3} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};