import React from 'react';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { CartItem } from '../types';
import { Button } from './Button';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onAdd: (item: CartItem) => void;
  onRemove: (itemId: string) => void;
  onDelete: (itemId: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onAdd,
  onRemove,
  onDelete
}) => {
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = total > 50 ? 0 : 5.99;
  const grandTotal = total + deliveryFee;

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl transform transition-transform duration-300 flex flex-col ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-5 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 p-2 rounded-xl">
              <ShoppingBag size={20} className="text-yellow-700" />
            </div>
            <h2 className="text-xl font-bold text-secondary">My Cart</h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
              <ShoppingBag size={64} className="text-gray-300" />
              <p className="text-lg font-medium">Your cart is empty</p>
              <Button variant="outline" onClick={onClose}>Start Shopping</Button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg bg-white" />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-secondary line-clamp-1">{item.name}</h3>
                    <p className="text-xs text-gray-500">{item.weight}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-secondary">${(item.price * item.quantity).toFixed(2)}</div>
                    <div className="flex items-center gap-3 bg-white px-2 py-1 rounded-lg border border-gray-200 shadow-sm">
                       <button onClick={() => onRemove(item.id)} className="text-gray-500 hover:text-red-500 transition-colors">
                         <Minus size={14} />
                       </button>
                       <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                       <button onClick={() => onAdd(item)} className="text-gray-500 hover:text-green-600 transition-colors">
                         <Plus size={14} />
                       </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Delivery Fee</span>
                <span className={deliveryFee === 0 ? "text-green-600 font-bold" : ""}>
                  {deliveryFee === 0 ? "FREE" : `$${deliveryFee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold text-secondary pt-2 border-t border-gray-100">
                <span>Total</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>
            <Button size="lg" className="w-full text-base py-4 shadow-lg shadow-primary/20">
              Proceed to Checkout
            </Button>
            <p className="text-center text-[10px] text-gray-400 mt-2">
              By placing an order you agree to our Terms
            </p>
          </div>
        )}
      </div>
    </>
  );
};