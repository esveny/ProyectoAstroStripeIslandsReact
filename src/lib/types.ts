export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  images: string[];
  price: number;
  compareAtPrice?: number;
  sku: string;
  stock: number;
  tags: string[];
  description: string;
  specs: Record<string, string>;
}

export interface CartLine {
  id: string;
  sku: string;
  name: string;
  price: number;
  image: string;
  qty: number;
  maxQty: number;
}

export interface Cart {
  lines: CartLine[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

export interface CheckoutItem {
  sku: string;
  name: string;
  unit_amount: number;
  qty: number;
  image: string;
}