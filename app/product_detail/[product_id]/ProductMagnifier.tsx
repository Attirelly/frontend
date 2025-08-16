'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';

interface ProductMagnifierProps {
  src: string;
  width?: number;
  height?: number;
  zoom?: number;
  previewSize?: number;
}

export default function ProductMagnifier({
  src,
  width = 500,
  height = 500,
  zoom = 2,
  previewSize = 300,
}: ProductMagnifierProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lensPosition, setLensPosition] = useState<{ x: number; y: number } | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setLensPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setLensPosition(null);
  };

  const zoomStyle = lensPosition
    ? {
        backgroundImage: `url(${src})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: `${width * zoom}px ${height * zoom}px`,
        backgroundPosition: `-${lensPosition.x * zoom - previewSize / 2}px -${
          lensPosition.y * zoom - previewSize / 2
        }px`,
      }
    : {
        background: '#f8f8f8',
      };

  return (
    <div className="flex gap-10">
      {/* Left Side: Product Image */}
      <div
        ref={containerRef}
        style={{ width, height }}
        className="relative"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <Image
          src={src}
          alt="Product"
          width={width}
          height={height}
          className="object-cover object-top"
        />
      </div>

      {/* Right Side: Product Description */}
      <div className="flex flex-col space-y-4">
        <div className="text-xl font-bold">Product Description</div>
        <p className="text-gray-600">
          This is your product description. It contains details about the item.
        </p>

        {/* Zoom Preview Area inside product description */}
        <div
          className="border border-gray-300 mt-4"
          style={{
            width: previewSize,
            height: previewSize,
            ...zoomStyle,
          }}
        />
      </div>
    </div>
  );
}
