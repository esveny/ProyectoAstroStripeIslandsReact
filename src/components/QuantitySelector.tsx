import { useState } from 'react';

interface QuantitySelectorProps {
  value: number;
  max: number;
  min?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export default function QuantitySelector({ 
  value, 
  max, 
  min = 1, 
  onChange, 
  disabled = false 
}: QuantitySelectorProps) {
  const [quantity, setQuantity] = useState(value);
  
  const handleDecrease = () => {
    const newValue = Math.max(min, quantity - 1);
    setQuantity(newValue);
    onChange(newValue);
  };
  
  const handleIncrease = () => {
    const newValue = Math.min(max, quantity + 1);
    setQuantity(newValue);
    onChange(newValue);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Math.max(min, Math.min(max, parseInt(e.target.value) || min));
    setQuantity(newValue);
    onChange(newValue);
  };
  
  return (
    <div className="flex items-center border border-gray-300 rounded-md">
      <button
        type="button"
        onClick={handleDecrease}
        disabled={disabled || quantity <= min}
        className="px-3 py-1 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Decrease quantity"
      >
        −
      </button>
      <input
        type="number"
        value={quantity}
        onChange={handleInputChange}
        min={min}
        max={max}
        disabled={disabled}
        className="w-16 px-2 py-1 text-center border-0 focus:ring-0 disabled:bg-gray-50"
        aria-label="Quantity"
      />
      <button
        type="button"
        onClick={handleIncrease}
        disabled={disabled || quantity >= max}
        className="px-3 py-1 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}