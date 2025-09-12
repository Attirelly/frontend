import SellerDashboardContainer from "@/components/Seller/SellerDashboardContainer";
import { Suspense } from "react";

/**
 * SellerDashboardPage component
 * 
 * This is the primary Next.js Page component for the seller dashboard route.
 * Its main responsibility is to act as an entry point and wrap the main dashboard
 * container in a React Suspense boundary.
 *
 * ## Features
 * - **Entry Point**: Serves as the main file for the seller dashboard route in a Next.js application.
 * - **Suspense Boundary**: Wraps the `SellerDashboardContainer` in `<Suspense>`. This is essential
 * for allowing child components to use Suspense-enabled hooks like `useSearchParams`
 * without causing rendering errors. It enables streaming UI from the server.
 *
 * ## Logic Flow
 * - This component is a simple, stateless wrapper.
 * - It renders the React `<Suspense>` component. A fallback UI could be added here to be shown
 * while Suspense-enabled child components are loading their data.
 * - Inside the Suspense boundary, it renders the main {@link SellerDashboardContainer}, which contains
 * all the actual logic, state, and UI for the dashboard.
 *
 * ## Imports
 * - **Key Components**:
 * - {@link SellerDashboardContainer}: The main container component that holds the entire dashboard UI and logic.
 * - **Core/Libraries**:
 * - `Suspense` from `react`: A mechanism for managing loading states in components.
 *
 * ## API Calls
 * - This component does not make any direct API calls; it delegates all data fetching to its child, `SellerDashboardContainer`.
 *
 * ## Props
 * - This is a page component and does not accept any props.
 *
 * @returns {JSX.Element} The rendered seller dashboard page with a Suspense boundary.
 */
export default function SellerDashboardPage(){
  return (
    <Suspense>
      <SellerDashboardContainer/>
    </Suspense>
  )
}