import { Category, Product } from './types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat_1', name: 'Fruits & Veg', icon: '🥦' },
  { id: 'cat_2', name: 'Dairy & Bakery', icon: '🥐' },
  { id: 'cat_3', name: 'Snacks', icon: '🍿' },
  { id: 'cat_4', name: 'Beverages', icon: '🥤' },
  { id: 'cat_5', name: 'Household', icon: '🧹' },
  { id: 'cat_6', name: 'Personal Care', icon: '🧼' },
];

export const INITIAL_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Fresh Avocado', category: 'Fruits & Veg', price: 2.99, weight: '2 pcs', image: 'https://picsum.photos/seed/avocado/400/400', discount: 10 },
  { id: 'p2', name: 'Organic Bananas', category: 'Fruits & Veg', price: 1.49, weight: '1 bunch', image: 'https://picsum.photos/seed/banana/400/400' },
  { id: 'p3', name: 'Whole Milk', category: 'Dairy & Bakery', price: 3.50, weight: '1 gallon', image: 'https://picsum.photos/seed/milk/400/400' },
  { id: 'p4', name: 'Sourdough Bread', category: 'Dairy & Bakery', price: 5.00, weight: '1 loaf', image: 'https://picsum.photos/seed/bread/400/400' },
  { id: 'p5', name: 'Potato Chips', category: 'Snacks', price: 4.20, weight: '200g', image: 'https://picsum.photos/seed/chips/400/400', discount: 5 },
  { id: 'p6', name: 'Orange Juice', category: 'Beverages', price: 6.00, weight: '1L', image: 'https://picsum.photos/seed/juice/400/400' },
  { id: 'p7', name: 'Paper Towels', category: 'Household', price: 8.99, weight: '6 rolls', image: 'https://picsum.photos/seed/paper/400/400' },
  { id: 'p8', name: 'Shampoo', category: 'Personal Care', price: 12.50, weight: '500ml', image: 'https://picsum.photos/seed/shampoo/400/400' },
];

export const STORAGE_KEYS = {
  PRODUCTS: 'buyit_products',
  CART: 'buyit_cart',
};