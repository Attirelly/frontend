import Image from "next/image";
import { manrope } from "@/font";

interface CardTwoTypeProps {
  imageUrl: string;
  title: string;
  description: string;
}


/**
 * CardTwoType component
 * 
 * A reusable, presentational card component that displays an item with a square image
 * and centered text content below it.
 *
 * ## Features
 * - Displays a prominent, square-shaped image using a `w-full aspect-square` container, making it fluid and responsive.
 * - Shows a `title` and `description` centered directly below the image.
 * - **Responsive Typography**: The font size of the title and description adjusts automatically for different screen sizes using Tailwind CSS prefixes.
 * - **Performance Optimized**: Includes a `sizes` attribute on the `next/image` component, which helps Next.js serve the most appropriately sized image for the user's viewport, improving load times.
 *
 * ## Logic Flow
 * - This component is purely presentational and stateless.
 * - It receives all data to be displayed (image URL, title, description) via props.
 * - The layout is a simple flex column. The image is contained within a relative parent with a fixed aspect ratio, ensuring a consistent square shape.
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
 * @param {string} props.imageUrl - The URL of the image to be displayed.
 * @param {string} props.title - The main title text displayed below the image.
 * @param {string} props.description - The description text displayed below the title.
 *
 * @returns {JSX.Element} The rendered card component.
 */
export default function CardTwoType({
  imageUrl,
  title,
  description,
}: CardTwoTypeProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      {/* CHANGED: This container is now fluid and maintains a square shape */}
      <div className="relative w-full aspect-square">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-contain rounded-xl"
          // ADDED: A sizes attribute optimized for the parent's new grid layout
          sizes="(max-width: 767px) 50vw, 25vw"
        />
      </div>
      <div className="flex flex-col gap-1 items-center justify-center text-center">
        <span
          // CHANGED: Using responsive prefixes for text size
          className={`${manrope.className} text-base md:text-lg lg:text-xl text-black`}
          style={{ fontWeight: 500 }}
        >
          {title}
        </span>
        <span
          // CHANGED: Using responsive prefixes for text size
          className={`${manrope.className} text-sm md:text-base lg:text-lg text-[#5F5F5F]`}
          style={{ fontWeight: 400 }}
        >
          {description}
        </span>
      </div>
    </div>
  );
}