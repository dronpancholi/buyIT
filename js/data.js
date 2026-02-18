/**
 * Shared Data & Storage Service
 * Handles all LocalStorage operations for Products and Cart.
 */

const CONSTANTS = {
  PRODUCTS_KEY: 'buyit_products',
  CART_KEY: 'buyit_cart',
  CURRENCY: 'USD'
};

const INITIAL_CATEGORIES = [
  { id: 'cat_1', name: 'Fruits & Veg', icon: 'carrot' }, // Using lucide icon names
  { id: 'cat_2', name: 'Dairy & Bakery', icon: 'croissant' },
  { id: 'cat_3', name: 'Snacks', icon: 'popcorn' },
  { id: 'cat_4', name: 'Beverages', icon: 'cup-soda' },
  { id: 'cat_5', name: 'Household', icon: 'spray-can' },
  { id: 'cat_6', name: 'Personal Care', icon: 'sparkles' },
];

const INITIAL_PRODUCTS = [
  { id: 'p1', name: 'Fresh Avocado', category: 'Fruits & Veg', price: 2.99, weight: '2 pcs', image: 'https://picsum.photos/seed/avocado/400/400', discount: 10 },
  { id: 'p2', name: 'Organic Bananas', category: 'Fruits & Veg', price: 1.49, weight: '1 bunch', image: 'https://picsum.photos/seed/banana/400/400' },
  { id: 'p3', name: 'Whole Milk', category: 'Dairy & Bakery', price: 3.50, weight: '1 gallon', image: 'https://picsum.photos/seed/milk/400/400' },
  { id: 'p4', name: 'Sourdough Bread', category: 'Dairy & Bakery', price: 5.00, weight: '1 loaf', image: 'https://picsum.photos/seed/bread/400/400' },
  { id: 'p5', name: 'Potato Chips', category: 'Snacks', price: 4.20, weight: '200g', image: 'https://picsum.photos/seed/chips/400/400', discount: 5 },
  { id: 'p6', name: 'Orange Juice', category: 'Beverages', price: 6.00, weight: '1L', image: 'https://picsum.photos/seed/juice/400/400' },
  { id: 'p7', name: 'Paper Towels', category: 'Household', price: 8.99, weight: '6 rolls', image: 'https://picsum.photos/seed/paper/400/400' },
  { id: 'p8', name: 'Shampoo', category: 'Personal Care', price: 12.50, weight: '500ml', image: 'https://picsum.photos/seed/shampoo/400/400' },
];

// --- Product Service ---
const ProductService = {
  getAll: () => {
    const stored = localStorage.getItem(CONSTANTS.PRODUCTS_KEY);
    if (!stored) {
      localStorage.setItem(CONSTANTS.PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    return JSON.parse(stored);
  },

  save: (products) => {
    localStorage.setItem(CONSTANTS.PRODUCTS_KEY, JSON.stringify(products));
    // Dispatch event so other tabs/components know data changed
    window.dispatchEvent(new Event('storage-update'));
  }
};

// --- Cart Service ---
const CartService = {
  get: () => {
    const stored = localStorage.getItem(CONSTANTS.CART_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  add: (product) => {
    const cart = CartService.get();
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    CartService.save(cart);
  },

  removeOne: (productId) => {
    let cart = CartService.get();
    const existing = cart.find(item => item.id === productId);
    if (existing) {
      if (existing.quantity > 1) {
        existing.quantity -= 1;
      } else {
        cart = cart.filter(item => item.id !== productId);
      }
      CartService.save(cart);
    }
  },

  delete: (productId) => {
    const cart = CartService.get().filter(item => item.id !== productId);
    CartService.save(cart);
  },

  save: (cart) => {
    localStorage.setItem(CONSTANTS.CART_KEY, JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent('cart-update', { detail: cart }));
  },

  getTotalCount: () => {
    return CartService.get().reduce((acc, item) => acc + item.quantity, 0);
  },

  getTotalPrice: () => {
    return CartService.get().reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }
};

// Formatting Utilities
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};