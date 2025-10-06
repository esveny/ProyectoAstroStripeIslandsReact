import type { Product, CartLine, Cart } from './types';
import { getProductById } from './products';

const CART_STORAGE_KEY = 'ecommerce-cart';

export function loadCart(): CartLine[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveCart(lines: CartLine[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines));
    // Dispatch custom event for cart updates
    window.dispatchEvent(new CustomEvent('cart-updated', { detail: lines }));
  } catch (error) {
    console.error('Failed to save cart:', error);
  }
}

export function addToCart(product: Product, qty: number = 1): CartLine[] {
  const lines = loadCart();
  const existingLine = lines.find(line => line.sku === product.sku);
  
  if (existingLine) {
    const newQty = Math.min(existingLine.qty + qty, product.stock);
    existingLine.qty = newQty;
  } else {
    const newLine: CartLine = {
      id: product.id,
      sku: product.sku,
      name: product.name,
      price: product.price,
      image: product.images[0],
      qty: Math.min(qty, product.stock),
      maxQty: product.stock,
    };
    lines.push(newLine);
  }
  
  saveCart(lines);
  return lines;
}

export function removeFromCart(sku: string): CartLine[] {
  const lines = loadCart().filter(line => line.sku !== sku);
  saveCart(lines);
  return lines;
}

export function updateQuantity(sku: string, qty: number): CartLine[] {
  const lines = loadCart();
  const line = lines.find(line => line.sku === sku);
  
  if (line) {
    if (qty <= 0) {
      return removeFromCart(sku);
    }
    line.qty = Math.min(qty, line.maxQty);
    saveCart(lines);
  }
  
  return lines;
}

export function clearCart(): void {
  saveCart([]);
}

export function calculateTotals(
  lines: CartLine[],
  taxRate: number = 0.13,
  freeShippingThreshold: number = 60,
  shippingFlat: number = 6
): Cart {
  const subtotal = lines.reduce((sum, line) => sum + (line.price * line.qty), 0);
  const tax = subtotal * taxRate;
  const shipping = subtotal >= freeShippingThreshold ? 0 : shippingFlat;
  const total = subtotal + tax + shipping;
  
  return {
    lines,
    subtotal: Math.round(subtotal * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    shipping: Math.round(shipping * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
}

export function getCartItemCount(): number {
  const lines = loadCart();
  return lines.reduce((count, line) => count + line.qty, 0);
}