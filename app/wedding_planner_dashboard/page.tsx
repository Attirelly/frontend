import { Suspense } from "react";
import WeddingPlannerDashboardContainer from "./WeddingPlannerDashboard";

export default function WeddingDashboardPage() {
  return (
    // The Suspense component lets child components "wait" for something before they can render.
    // This is typically used for data fetching or code splitting (lazy loading).
    <Suspense>
      <WeddingPlannerDashboardContainer />
    </Suspense>
  );
}