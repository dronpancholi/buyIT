export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  weight: string;
  image: string;
  discount?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string; // Emoji or Lucide icon name context
}

export type ViewState = 'STORE' | 'ADMIN_LOGIN' | 'ADMIN_DASHBOARD' | 'ADMIN_PRODUCTS';

export interface AdminStats {
  totalProducts: number;
  totalCategories: number;
  totalOrders: number;
  revenue: number;
}