import { useState } from 'react';
import type { Product } from '../lib/types';
import { addToCart } from '../lib/cart';
import PriceTag from './PriceTag';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const handleAddToCart = async () => {
    if (product.stock === 0 || isAdding) return;
    
    setIsAdding(true);
    
    try {
      addToCart(product, 1);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };
  
  const isOutOfStock = product.stock === 0;
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200">
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-48 w-full object-cover object-center group-hover:opacity-75"
          loading="lazy"
        />
      </div>
      
      <div className="p-4">
        <div className="mb-2">
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
            <a href={`/products/${product.slug}`} className="hover:text-primary-600">
              {product.name}
            </a>
          </h3>
          <p className="text-sm text-gray-500">{product.brand}</p>
        </div>
        
        <PriceTag 
          price={product.price} 
          compareAtPrice={product.compareAtPrice}
          className="mb-3"
        />
        
        <div className="flex items-center justify-between">
          <span className={`text-xs px-2 py-1 rounded-full ${
            isOutOfStock 
              ? 'bg-gray-200 text-gray-700' 
              : product.stock <= 5 
                ? 'bg-gray-300 text-gray-800'
                : 'bg-gray-400 text-gray-900'
          }`}>
            {isOutOfStock ? 'Out of Stock' : `${product.stock} in stock`}
          </span>
          
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || isAdding}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              isOutOfStock || isAdding
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : showSuccess
                  ? 'bg-gray-700 text-white'
                  : 'bg-gray-700 text-white hover:bg-gray-800'
            }`}
            aria-label={`Add ${product.name} to cart`}
          >
            {showSuccess ? '✓ Added!' : isAdding ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}