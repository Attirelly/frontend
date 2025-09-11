import Image from "next/image";
import { manrope } from "@/font";

interface CardProps {
  imageUrl: string;
  title: string;
  description?: string;
}

/**
 * CardTypeFour component
 * 
 * A reusable, presentational card component that displays an item with a
 * full-bleed square background image and overlaid text content.
 *
 * ## Features
 * - Displays a prominent background image that covers the entire card.
 * - **Square Aspect Ratio**: Maintains a fixed 1:1 aspect ratio, making it fluid and responsive to its parent container's width.
 * - **Gradient Overlay**: Includes a semi-transparent black gradient from the bottom upwards to ensure the white text content is always readable.
 * - **Hover Effect**: The background image smoothly scales up on user hover for a dynamic visual effect.
 * - Shows a `title` and an optional `description` overlaid at the bottom of the card with responsive font sizes.
 * - **Performance Optimized**: Includes a detailed `sizes` attribute on the `next/image` component to ensure optimal image loading across different devices.
 *
 * ## Logic Flow
 * - This component is purely presentational and stateless.
 * - It receives all data to be displayed (image URL, title, description) via props.
 * - The `description` is only rendered if it is provided as a prop.
 * - The layout is achieved using `absolute` positioning for the image, gradient, and text within a `relative` parent container.
 * - The hover animation is handled by Tailwind's `group` and `group-hover` utilities.
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
 * @param {string} props.imageUrl - The URL of the background image to be displayed.
 * @param {string} props.title - The main title text to be displayed on the card.
 * @param {string} [props.description] - Optional description text displayed below the title.
 *
 * @returns {JSX.Element} The rendered card component.
 */
const CardTypeFour: React.FC<CardProps> = ({
  imageUrl,
  title,
  description,
}) => {
  return (
    <div
      className={`${manrope.className} relative w-full aspect-square overflow-hidden rounded-sm group`}
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="
            (max-width: 639px) 50vw,
            (max-width: 767px) 33vw,
            (max-width: 1023px) 25vw,
            17vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
          priority
        />
      </div>

      {/* Gradient Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />

      {/* Text Content */}
      <div className="flex flex-col items-center justify-end absolute inset-0 z-20 p-2 md:p-4 text-center text-white">
        <h3
          className="text-sm md:text-base lg:text-lg font-semibold whitespace-nowrap"
          style={{ fontWeight: 400 }}
        >
          {title}
        </h3>
        {description && (
          <h2
            className="text-xs md:text-sm lg:text-base whitespace-nowrap"
            style={{ fontWeight: 400 }}
          >
            {description}
          </h2>
        )}
      </div>
    </div>
  );
};

export default CardTypeFour;
