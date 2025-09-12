import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/**
 * StoreTypeTabsSkeleton component
 * 
 * A skeleton loader component designed to mimic the layout of a set of filter tabs,
 * such as those used for selecting a store type. It is displayed as a placeholder while the
 * actual tab data is being fetched.
 *
 * ## Features
 * - **Layout Mimicry**: Renders a horizontal row of pill-shaped placeholders to accurately represent the tabbed interface.
 * - **Structural Details**: Includes vertical line separators between the tabs to closely match the real component's design.
 * - **Custom Appearance**: Uses custom `baseColor` and `highlightColor` props to control the shimmer effect's appearance.
 * - **Improved UX**: Enhances the user experience by providing immediate visual feedback during data loading and preventing content layout shifts.
 *
 * ## Logic Flow
 * - This component is purely presentational and stateless.
 * - It uses a simple loop to render a fixed number of placeholder tabs (in this case, 3).
 *
 * ## Imports
 * - **Core/Libraries**:
 *    - `Skeleton` from `react-loading-skeleton`: The primary component for creating placeholder elements.
 *    - `react-loading-skeleton/dist/skeleton.css`: The necessary stylesheet for the skeleton library.
 *
 * ## API Calls
 * - This component does not make any API calls.
 *
 * ## Props
 * - This component does not accept any props.
 *
 * @returns {JSX.Element} The rendered skeleton loader for the store type tabs.
 */
export default function StoreTypeTabsSkeleton() {
  return (
    <div className="flex bg-[#F5F5F5] rounded-full overflow-hidden w-fit px-2 py-2">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex items-center">
          <Skeleton
            width={100}
            height={36}
            borderRadius={9999}
            baseColor="#e0e0e0"
            highlightColor="#f5f5f5"
          />
          {index !== 2 && (
            <div className="h-6 border-r border-gray-300 mx-2" />
          )}
        </div>
      ))}
    </div>
  );
}
