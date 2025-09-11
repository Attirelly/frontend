import Image from 'next/image';
import { manrope } from '@/font';

interface CardProps {
  imageUrl: string;
  discountText?: string;
  title: string;
  description?: string;
  screenSize?:string;
}


/**
 * Card component
 * 
 * A reusable, presentational card component designed to display an item with a
 * full-bleed background image and overlaid text content. Its width is controlled via a prop.
 *
 * ## Features
 * - Displays a prominent background image that covers the entire card.
 * - Shows a `title` and `description` overlaid at the bottom of the card.
 * - **Prop-driven Responsiveness**: The card's width is determined by a `screenSize` prop, allowing parent components to control its dimensions.
 * - Includes a placeholder for an optional discount badge.
 *
 * ## Logic Flow
 * - This component is purely presentational and stateless.
 * - It receives all data to be displayed (image URL, title, description) via props.
 * - The layout is achieved using `absolute` positioning for the image and text within a `relative` parent container.
 * - Conditional CSS classes are applied based on the `screenSize` prop to set the component's width.
 *
 * ## Imports
 * - **Core/Libraries**: `React` from `react`; `Image` from `next/image`.
 * - **Utilities**: `manrope` from `@/font` for consistent typography.
 *
 * ## API Calls
 * - This component does not make any API calls.
 *
 * ## Props
 * @param {object} props - The props for the component.
 * @param {string} props.imageUrl - The URL of the background image to be displayed.
 * @param {string} [props.discountText] - Optional text for a discount badge (currently commented out).
 * @param {string} props.title - The main title text to be displayed on the card.
 * @param {string} [props.description] - Optional description text displayed below the title.
 * @param {string} [props.screenSize='sm'] - Controls the width of the card ('sm', 'md', 'lg', 'xl').
 *
 * @returns {JSX.Element} The rendered card component.
 */
const Card: React.FC<CardProps> = ({ imageUrl, discountText, title, description, screenSize='sm' }) => {
  return (
    <div className={`${manrope.className} relative
     ${screenSize === 'sm' ? 'w-[350px]' : ''}
      ${screenSize === 'md' ? 'w-[210px]' : ''}
      ${screenSize === 'lg' ? 'w-[250px]' : ''}
      ${screenSize === 'xl' ? 'w-[293px]' : ''}
      h-full rounded-xl overflow-hidden shadow-lg`}>
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover object-top"
          priority
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-transparent z-10" />

      {/* Discount Badge */}
      {/* <div className="absolute top-0 right-0 z-20 bg-black text-white text-sm font-semibold px-3 py-1 rounded-bl-xl shadow-md">
        Sale : {discountText} %
      </div> */}

      {/* Text Content */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-20 text-center  pb-4 text-white w-full">
        <h3 className="text-[20px]" style={{fontWeight:500}}>{title}</h3>
        <h4 className='text-base' style={{fontWeight:400}}>{description}</h4>
      </div>
    </div>
  );
};

export default Card;