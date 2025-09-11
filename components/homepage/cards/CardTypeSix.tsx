import Image from "next/image";
import { manrope } from "@/font";

interface CardProps {
  imageUrl: string;
  title: string;
  description?: string;
}

/**
 * CardTypeSix component
 * 
 * A reusable, presentational card component designed as a strong call-to-action (CTA).
 * It features a full-bleed image with an overlaid description and "SHOP NOW" button,
 * with the main title displayed below the card.
 *
 * ## Features
 * - Displays a prominent background image in a container with a fixed 3:4 portrait aspect ratio.
 * - **Gradient Overlay**: Includes a semi-transparent black gradient from the bottom upwards to ensure the overlaid content is always readable.
 * - **Hover Effect**: The background image smoothly scales up on user hover for a dynamic visual effect.
 * - **Distinct Layout**: Overlays a `description` and a "SHOP NOW" button on the image, while the main `title` is rendered separately underneath the card.
 * - **Responsive**: Typography and button padding adjust for different screen sizes.
 * - **Performance Optimized**: Includes a `sizes` attribute on the `next/image` component for optimal image loading.
 *
 * ## Logic Flow
 * - This component is purely presentational and stateless.
 * - It receives all data to be displayed (image URL, title, description) via props.
 * - The image card section uses `absolute` positioning for its layers within a `relative` parent. The entire component then stacks this card above the title.
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
 * @param {string} props.title - The main title text, displayed *below* the card.
 * @param {string} [props.description] - Optional description text, displayed *on* the card above the button.
 *
 * @returns {JSX.Element} The rendered CTA card component.
 */
const CardTypeSix: React.FC<CardProps> = ({ imageUrl, title, description }) => {
  return (
    // This outer div now just acts as a container for the card and its title below.
    <div>
      {/* CHANGED: Main container is now fluid with an aspect ratio. */}
      <div className={`${manrope.className} relative w-full aspect-[3/4] rounded-2xl overflow-hidden group`}>
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
            // ADDED: A sizes attribute optimized for the parent's new grid layout.
            sizes="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw"
            priority
          />
        </div>

        {/* ADDED: A gradient overlay for better text readability. */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />

        {/* Text Content */}
        <div className="flex flex-col items-center justify-end text-center absolute inset-0 z-20 p-4 lg:p-6 text-white">
          <h2 className="text-base md:text-lg font-medium whitespace-nowrap" style={{ fontWeight: 400 }}>
            {description}
          </h2>
          {/* CHANGED: Button now uses padding and responsive text for flexible sizing. */}
          <button
            className="px-4 py-1 lg:px-6 lg:py-2 text-xs lg:text-sm bg-white text-black mt-3 lg:mt-4 rounded-md"
            style={{ fontWeight: 500 }}
          >
            SHOP NOW
          </button>
        </div>
      </div>

      {/* CHANGED: Title below the card is now responsive. */}
      <h3
        className="text-sm md:text-base lg:text-lg text-black font-medium whitespace-nowrap text-center mt-2"
        style={{ fontWeight: 500 }}
      >
        {title}
      </h3>
    </div>
  );
};

export default CardTypeSix;