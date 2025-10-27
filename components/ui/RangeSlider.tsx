import React from "react";
import { Range, getTrackBackground } from "react-range";

interface SliderProps {
  min: number;
  max: number;
  step?: number;
  values: number[];
  label: string;
  onChange: (values: number[]) => void;
}

export const RangeSlider: React.FC<SliderProps> = ({
  min,
  max,
  step = 100,
  values,
  label,
  onChange,
}) => {
  const handleInputChange = (index: number, value: string) => {
    let num = Number(value);
    if (isNaN(num)) return;

    num = Math.min(Math.max(num, min), max); // clamp between min & max
    const newValues = [...values];

    if (index === 0) {
      // left handle
      newValues[0] = Math.min(num, newValues[1]); // ensure left ≤ right
    } else {
      // right handle
      newValues[1] = Math.max(num, newValues[0]); // ensure right ≥ left
    }

    onChange(newValues);
  };

  return (
    <div className="mb-6 w-full">
      {/* Label */}
      <p className="text-sm font-medium mb-2 text-gray-700">{label}</p>

      {/* Inputs */}
      <div className="flex items-center gap-3 mb-3">
        <input
          type="number"
          className="w-24 px-2 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          value={values[0]}
          min={min}
          max={max}
          onChange={(e) => handleInputChange(0, e.target.value)}
        />
        <span className="text-gray-500">–</span>
        <input
          type="number"
          className="w-24 px-2 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          value={values[1]}
          min={min}
          max={max}
          onChange={(e) => handleInputChange(1, e.target.value)}
        />
      </div>

      {/* Range Slider */}
      <Range
        step={step}
        min={min}
        max={max}
        values={values}
        onChange={(vals) => {
          const [left, right] = vals;
          // ensure left ≤ right
          if (left <= right) {
            onChange(vals);
          }
        }}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            className="h-2 w-full rounded-md"
            style={{
              background: getTrackBackground({
                values,
                colors: ["#ccc", "#6366f1", "#ccc"],
                min,
                max,
              }),
            }}
          >
            {children}
          </div>
        )}
        renderThumb={({ props }) => (
          <div
            {...props}
            className="h-4 w-4 bg-indigo-500 rounded-full shadow-md cursor-pointer"
          />
        )}
      />
    </div>
  );
};
