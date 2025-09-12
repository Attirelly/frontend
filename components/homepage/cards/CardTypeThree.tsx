import Image from 'next/image';
import { manrope } from '@/font';

interface CardProps {
  imageUrl: string;
  discountText?: string;
  title: string;
  description?: string;
}


/**
 * CardTypeThree component
 * 
 * A reusable, presentational card component that displays an item with a
 * full-bleed background image, a portrait aspect ratio, and overlaid text.
 *
 * ## Features
 * - Displays a prominent background image that covers the entire card.
 * - **Portrait Aspect Ratio**: Maintains a fixed portrait aspect ratio of 3:4, making it fluid and responsive to its parent container's width.
 * - **Gradient Overlay**: Includes a semi-transparent black gradient from the bottom upwards to ensure the white text content is always readable against any background image.
 * - **Hover Effect**: The background image smoothly scales up on user hover for a dynamic visual effect.
 * - Shows a `title` and `description` overlaid at the bottom of the card with responsive font sizes.
 * - **Performance Optimized**: Includes a detailed `sizes` attribute on the `next/image` component to ensure optimal image loading across different devices.
 *
 * ## Logic Flow
 * - This component is purely presentational and stateless.
 * - It receives all data to be displayed (image URL, title, description) via props.
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
 * @param {string} [props.discountText] - Optional text for a discount badge (unused in this implementation).
 * @param {string} props.title - The main title text to be displayed on the card.
 * @param {string} [props.description] - Optional description text displayed below the title.
 *
 * @returns {JSX.Element} The rendered card component.
 */
const CardTypeThree: React.FC<CardProps> = ({ imageUrl, title, description }) => {
  return (
    // CHANGED: The container is now fluid with a portrait aspect ratio.
    <div className={`${manrope.className} relative w-full aspect-[3/4] rounded-2xl overflow-hidden group`}>
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
          // ADDED: An optimized sizes attribute for the new carousel layout.
          sizes="
            (max-width: 767px) 50vw,
            (max-width: 1023px) 33vw,
            20vw"
          priority
        />
      </div>

      {/* ADDED: A gradient overlay to ensure text is always readable. */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />

      {/* Text Content with responsive font sizes */}
      <div className="flex flex-col items-center justify-end text-center absolute inset-0 z-20 p-4 md:p-6 text-white">
        <h3 className="text-lg md:text-xl font-medium whitespace-nowrap" style={{ fontWeight: 500 }}>
          {title}
        </h3>
        <h2 className="text-sm md:text-base whitespace-nowrap" style={{ fontWeight: 400 }}>
          {description}
        </h2>
      </div>
    </div>
  );
};

export default CardTypeThree;