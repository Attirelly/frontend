import Image from "next/image";
import { manrope } from "@/font";

interface CardFiveProps {
  imageUrl: string;
  title: string;
  description: string;
  price: number;
  mrp: number;
  discount: number;
}


/**
 * CardTypeFive component
 * 
 * A reusable, presentational card component designed specifically for displaying products.
 * It features an image with a portrait aspect ratio and detailed text content below, including pricing.
 *
 * ## Features
 * - Displays a prominent product image in a container with a fixed 3:4 portrait aspect ratio.
 * - Renders detailed product information below the image, including:
 * - A `title` and `description`, which are truncated with an ellipsis if they overflow.
 * - The current `price`.
 * - The original `mrp` (Maximum Retail Price), conditionally displayed with a strikethrough.
 * - The `discount` percentage, conditionally displayed in a distinct color.
 * - **Responsive Typography**: Text sizes for all elements adjust for different screen sizes.
 * - **Performance Optimized**: Includes a `sizes` attribute on the `next/image` component for optimal image loading.
 *
 * ## Logic Flow
 * - This component is purely presentational and stateless.
 * - It receives all product data (image URL, text, pricing) via props.
 * - It contains conditional rendering logic to show the `mrp` only if it's greater than the `price`, and the `discount` only if it's greater than zero.
 * - The `toLocaleString()` method is used to format the price and MRP numbers for better readability.
 *
 * ## Imports
 * - **Core/Libraries**: `Image` from `next/image` for optimized image rendering.
 * - **Utilities**: `manrope` from `@/font` for consistent typography.
 *
 * ## API Calls
 * - This component does not make any API calls.
 *
 * ## Props
 * @param {object} props - The props for the component.
 * @param {string} props.imageUrl - The URL of the product image.
 * @param {string} props.title - The title of the product.
 * @param {string} props.description - The description or brand of the product.
 * @param {number} props.price - The current selling price of the product.
 * @param {number} props.mrp - The original maximum retail price of the product.
 * @param {number} props.discount - The discount percentage for the product.
 *
 * @returns {JSX.Element} The rendered product card component.
 */
export default function CardTypeFive({
  imageUrl,
  title,
  description,
  price,
  mrp,
  discount,
}: CardFiveProps) {
  return (
    // The main container is now a simple flex column.
    <div className={`${manrope.className} flex flex-col`}>
      {/* Image container is now fluid with a fixed aspect ratio */}
      <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover object-center"
          // ADDED: An optimized sizes attribute for the new carousel layout
          sizes="
            (max-width: 767px) 50vw,
            (max-width: 1023px) 33vw,
            20vw"
        />
      </div>

      {/* Text content with responsive font sizes */}
      <div className={`${manrope.className} w-full flex flex-col gap-1 mt-2`} style={{ fontWeight: 500 }}>
        <span className="text-sm md:text-base text-[#1E1E1E] truncate" title={title}>
          {title}
        </span>
        <span className="text-xs md:text-sm text-gray-600 truncate" style={{ fontWeight: 300 }} title={description}>
          {description}
        </span>
        <div className="flex flex-wrap items-center gap-x-2">
          <span className="text-sm md:text-base text-black">
            ₹{price.toLocaleString()}
          </span>
          {price < mrp && (
            <span className="text-xs md:text-sm text-gray-400 line-through">
              ₹{mrp.toLocaleString()}
            </span>
          )}
          {discount > 0 && (
            <span className="text-xs md:text-sm text-green-600 font-semibold">
              {discount}% OFF
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
