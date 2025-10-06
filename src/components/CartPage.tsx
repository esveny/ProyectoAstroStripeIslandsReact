import { useState, useEffect } from 'react';
import type { CartLine } from '../lib/types';
import {
  loadCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  calculateTotals,
} from '../lib/cart';
import { createCheckoutSession } from '../lib/stripe';
import { formatUSD, dollarsToCents } from '../lib/currency';
import QuantitySelector from './QuantitySelector';

export default function CartPage() {
  const [cartLines, setCartLines] = useState<CartLine[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cart = calculateTotals(cartLines);

  useEffect(() => {
    setCartLines(loadCart());
  }, []);

  const handleQuantityChange = (sku: string, newQty: number) => {
    const updatedLines = updateQuantity(sku, newQty);
    setCartLines(updatedLines);
  };

  const handleRemoveItem = (sku: string) => {
    const updatedLines = removeFromCart(sku);
    setCartLines(updatedLines);
  };

  const handleClearCart = () => {
    clearCart();
    setCartLines([]);
  };

  // Convierte rutas relativas ("/images/x.jpg") a absolutas para Stripe
  const toAbsolute = (img: string) => {
    try {
      if (!img) return img;
      if (img.startsWith('http') || img.startsWith('data:')) return img;
      return new URL(img, window.location.origin).href;
    } catch {
      return img;
    }
  };

  const handleCheckout = async () => {
    if (cartLines.length === 0) return;

    setIsLoading(true);
    setError(null);

    try {
      const checkoutItems = cartLines.map((line) => ({
        sku: line.sku,
        name: line.name,
        unit_amount: dollarsToCents(line.price), // en centavos
        qty: line.qty,
        image: toAbsolute(line.image),
      }));

      const result = await createCheckoutSession(checkoutItems);

      if ('error' in result) {
        setError(result.error);
      } else {
        window.location.href = result.url;
      }
    } catch {
      setError('Failed to proceed to checkout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (cartLines.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 11-4 0v-6m4 0V9a2 2 0 10-4 0v4.01"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">Your cart is empty</h3>
        <p className="mt-1 text-sm text-gray-500">Start adding some products to your cart.</p>
        <div className="mt-6">
          <a
            href="/products"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Continue Shopping
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
        <button onClick={handleClearCart} className="text-sm text-gray-600 hover:text-gray-800">
          Clear Cart
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-gray-100 border border-gray-300 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {cartLines.map((line) => (
            <li key={line.sku} className="px-6 py-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <img className="h-16 w-16 rounded-md object-cover" src={line.image} alt={line.name} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{line.name}</p>
                  <p className="text-sm text-gray-500">SKU: {line.sku}</p>
                  <p className="text-sm font-medium text-gray-900">{formatUSD(line.price)}</p>
                </div>

                <div className="flex items-center space-x-4">
                  <QuantitySelector
                    value={line.qty}
                    max={line.maxQty}
                    onChange={(newQty) => handleQuantityChange(line.sku, newQty)}
                  />

                  <div className="text-sm font-medium text-gray-900 w-20 text-right">
                    {formatUSD(line.price * line.qty)}
                  </div>

                  <button
                    onClick={() => handleRemoveItem(line.sku)}
                    className="text-gray-600 hover:text-gray-800"
                    aria-label={`Remove ${line.name} from cart`}
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9zM4 5a2 2 0 012-2h8a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zM8 8a1 1 0 012 0v3a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v3a1 1 0 11-2 0V8z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>{formatUSD(cart.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax (13%)</span>
            <span>{formatUSD(cart.tax)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span>{cart.shipping === 0 ? 'Free' : formatUSD(cart.shipping)}</span>
          </div>
          <div className="border-t border-gray-200 pt-2">
            <div className="flex justify-between text-lg font-medium">
              <span>Total</span>
              <span>{formatUSD(cart.total)}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleCheckout}
          disabled={isLoading || cartLines.length === 0}
          className="w-full mt-6 bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Processing...' : 'Proceed to Checkout'}
        </button>

        <p className="mt-2 text-xs text-gray-500 text-center">
          {cart.shipping === 0
            ? '🎉 You qualify for free shipping!'
            : `Add ${formatUSD(Math.max(0, 60 - cart.subtotal))} more for free shipping`}
        </p>
      </div>
    </div>
  );
}
