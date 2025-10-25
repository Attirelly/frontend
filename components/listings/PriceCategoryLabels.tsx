'use client';
import { useState } from 'react';
import { useProductFilterStore } from '@/store/filterStore';

const PriceCategoryLabels = ({ payload }) => {
  const { setPriceRange } = useProductFilterStore();
  const [selected, setSelected] = useState(null);

  const handleClick = (item) => {
    if (selected === item.id) {
      // Deselect
      setSelected(null);
      setPriceRange([null, null]);
    } else {
      setSelected(item.id);
      setPriceRange([item.lower_value, item.upper_value]);
    }
  };

  if (!payload || payload.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-3 mt-2">
      {payload.map((item) => {
        const isSelected = item.id === selected;

        return (
          <button
            key={item.id}
            className={`
              px-4 py-2 rounded-full flex flex-col items-center gap-0.5 transition
              ${isSelected
                ? 'bg-black text-white font-semibold'
                : 'bg-white text-black border border-gray-400 font-normal hover:shadow-sm'}
            `}
            onClick={() => handleClick(item)}
          >
            <span className="text-xs">{item.label.toUpperCase()}</span>
            <span className="text-[10px]">
              {item.lower_value && item.upper_value
                ? `₹${item.lower_value.toLocaleString()} - ₹${item.upper_value.toLocaleString()}`
                : item.lower_value
                ? `₹${item.lower_value.toLocaleString()}`
                : 'N/A'}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default PriceCategoryLabels;
