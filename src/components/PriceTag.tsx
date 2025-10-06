import { formatUSD } from '../lib/currency';

interface PriceTagProps {
  price: number;
  compareAtPrice?: number;
  className?: string;
}

export default function PriceTag({ price, compareAtPrice, className = '' }: PriceTagProps) {
  const hasDiscount = compareAtPrice && compareAtPrice > price;
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-lg font-bold text-gray-900">
        {formatUSD(price)}
      </span>
      {hasDiscount && (
        <span className="text-sm text-gray-500 line-through">
          {formatUSD(compareAtPrice)}
        </span>
      )}
    </div>
  );
}