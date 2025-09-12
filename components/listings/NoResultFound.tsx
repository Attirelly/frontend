import { manrope } from "@/font";
import Image from "next/image";

/**
 * NoResultFound component
 * 
 * A simple, reusable UI component displayed when a search query, filter,
 * or data fetch returns no results.
 *
 * ## Features
 * - Provides clear visual feedback to the user that their action resulted in an empty state.
 * - Includes a relevant illustration (`empty_cupboard.svg`) for a more user-friendly experience.
 * - Displays a primary message indicating no results were found.
 * - Offers a secondary hint suggesting the user check for typos or try a different search.
 * - This is a stateless, presentational component with no internal logic.
 *
 * ## Logic Flow
 * This component has no internal logic or data flow. It is purely for display purposes.
 *
 * ## Imports
 * - **Core/Libraries**: `Image` from `next/image` for optimized image rendering.
 * - **Utilities**: `manrope` from `@/font` for consistent typography.
 *
 * @returns {JSX.Element} The rendered "No Results Found" message.
 */
export default function NoResultFound() {
  return (
    <div className={`${manrope.className} text-black flex flex-col items-center justify-start min-h-screen`} style={{fontWeight: 500}}>
      <Image
        src="/ListingPageHeader/empty_cupboard.svg"
        alt="No Results Found"
        width={315}
        height={327}
        className="mb-4"
        priority
      />
      <h2 className="text-2xl">Sorry Nothing to show here</h2>
      <p className="text-xs text-[#333333]" style={{fontWeight:400}}>Probably a wrong search or typo, please try again.</p>
    </div>
  );
}