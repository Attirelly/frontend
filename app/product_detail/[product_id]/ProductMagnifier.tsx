"use client";

import { useRef, useState } from "react";
import Image from "next/image";

/**
 * @interface ProductMagnifierProps
 * @description Defines the props for the ProductMagnifier component.
 */
interface ProductMagnifierProps {
  /**
   * @description The URL of the full-resolution image to be displayed and magnified.
   */
  src: string;
  /**
   * @description The width of the main product image container.
   * @default 500
   */
  width?: number;
  /**
   * @description The height of the main product image container.
   * @default 500
   */
  height?: number;
  /**
   * @description The magnification level for the zoom effect.
   * @default 2
   */
  zoom?: number;
  /**
   * @description The size (width and height) of the square zoom preview pane.
   * @default 300
   */
  previewSize?: number;
}

/**
 * A component that provides a hover-to-zoom (magnifier) effect for a product image.
 *
 * This component displays a primary product image and a separate preview pane. When the user
 * hovers their mouse over the primary image, the preview pane shows a magnified portion
 * of the image corresponding to the cursor's position.
 *
 * ### How It Works
 * The magnifier effect is achieved by tracking the mouse coordinates over the main image.
 * These coordinates are then used to calculate the `backgroundPosition` for a `div` element
 * whose `backgroundImage` is set to the same source image. By scaling the `backgroundSize`
 * and adjusting the position, it creates the illusion of a magnifying lens.
 *
 * @param {ProductMagnifierProps} props - The props for the component.
 * @returns {JSX.Element} A layout containing the main product image and a zoom preview pane.
 * @see {@link https://react.dev/reference/react/useState | React useState Hook}
 * @see {@link https://react.dev/reference/react/useRef | React useRef Hook}
 * @see {@link https://nextjs.org/docs/pages/api-reference/components/image | Next.js Image Component}
 */
export default function ProductMagnifier({
  src,
  width = 500,
  height = 500,
  zoom = 2,
  previewSize = 300,
}: ProductMagnifierProps) {
  // A ref to the main image container to get its dimensions and position.
  const containerRef = useRef<HTMLDivElement>(null);
  // State to hold the current x/y coordinates of the mouse cursor over the image.
  // It is null when the mouse is not over the image.
  const [lensPosition, setLensPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  /**
   * Handles the mouse move event on the image container.
   * It calculates the cursor's position relative to the container and updates the state.
   * @param {React.MouseEvent<HTMLDivElement>} e - The mouse event.
   */
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setLensPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setLensPosition(null);
  };

  /**
   * Handles the mouse leave event on the image container.
   * Resets the lens position to null, which hides the zoom effect.
   */
  const zoomStyle = lensPosition
    ? {
        // The background image of the preview pane is the same as the main image.
        backgroundImage: `url(${src})`,
        backgroundRepeat: "no-repeat",
        // The background image is scaled up by the zoom factor.
        backgroundSize: `${width * zoom}px ${height * zoom}px`,
        // The background position is shifted in the opposite direction of the cursor,
        // scaled by the zoom factor. This is what creates the magnifier effect.
        // The preview size is used to center the "lens" on the cursor.
        backgroundPosition: `-${lensPosition.x * zoom - previewSize / 2}px -${
          lensPosition.y * zoom - previewSize / 2
        }px`,
      }
    : {
        // When not hovering, show a neutral background.
        background: "#f8f8f8",
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
