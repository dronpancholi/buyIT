export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  weight: string;
  image: string;
  discount?: number;
}

export interface CartItem extends Product {
  quantity: number;
}
