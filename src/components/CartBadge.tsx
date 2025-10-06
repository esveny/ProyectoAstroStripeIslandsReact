import { useState, useEffect } from 'react';
import { getCartItemCount } from '../lib/cart';

export default function CartBadge() {
  const [itemCount, setItemCount] = useState(0);
  
  useEffect(() => {
    // Initial load
    setItemCount(getCartItemCount());
    
    // Listen for cart updates
    const handleCartUpdate = () => {
      setItemCount(getCartItemCount());
    };
    
    window.addEventListener('cart-updated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cart-updated', handleCartUpdate);
    };
  }, []);
  
  return (
    <a
      href="/cart"
      className="relative inline-flex items-center p-2 text-gray-700 hover:text-gray-600 transition-colors"
      aria-label={`Shopping cart with ${itemCount} items`}
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 11-4 0v-6m4 0V9a2 2 0 10-4 0v4.01"
        />
      </svg>
      
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-gray-700 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </a>
  );
}