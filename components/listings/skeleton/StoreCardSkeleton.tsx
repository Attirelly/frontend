import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/**
 * StoreCardSkeleton component
 * 
 * A skeleton loader component that mimics the layout of a single store card.
 * It is displayed as a placeholder while the actual store data is being fetched from an API.
 *
 * ## Features
 * - **Layout Mimicry**: Renders a single, large placeholder element within a container styled to match the dimensions and padding of a real store card.
 * - **Custom Appearance**: Customizes the skeleton's shimmer effect with specific `baseColor` and `highlightColor` props.
 * - **Improved UX**: Enhances the user experience by providing immediate visual feedback during data loading and preventing content layout shifts.
 *
 * ## Logic Flow
 * - This component is purely presentational and stateless.
 * - It has no internal logic or data fetching; it simply renders a static structure of placeholder elements.
 *
 * ## Imports
 * - **Core/Libraries**:
 * - `Skeleton` from `react-loading-skeleton`: The primary component for creating placeholder elements.
 * - `react-loading-skeleton/dist/skeleton.css`: The necessary stylesheet for the skeleton library.
 *
 * ## API Calls
 * - This component does not make any API calls.
 *
 * ## Props
 * - This component does not accept any props.
 *
 * @returns {JSX.Element} The rendered skeleton loader for a store card.
 */
export default function StoreCardSkeleton() {
  return (
    <div className="relative border border-[#F1F1F1] rounded-xl p-4 flex gap-4">
      <Skeleton
        width={640}
        height={240}
        // borderRadius={9999}
        baseColor="#e0e0e0"
        highlightColor="#f5f5f5"
      />
    </div>
  );
}
