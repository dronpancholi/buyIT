import { Product, CartItem } from '../types';
import { STORAGE_KEYS, INITIAL_PRODUCTS } from '../constants';

export const getStoredProducts = (): Product[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  }
  return JSON.parse(stored);
};

export const saveStoredProducts = (products: Product[]) => {
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
};

export const getStoredCart = (): CartItem[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.CART);
  return stored ? JSON.parse(stored) : [];
};

export const saveStoredCart = (cart: CartItem[]) => {
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
};

export const clearStoredCart = () => {
  localStorage.removeItem(STORAGE_KEYS.CART);
};