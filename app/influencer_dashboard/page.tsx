import { Suspense } from "react";
import InfluencerDashboardPageContainer from "./InfluencerDashboard";

export default function InfluencerDashboardPage() {
  return (
    // The Suspense component lets child components "wait" for something before they can render.
    // This is typically used for data fetching or code splitting (lazy loading).
    <Suspense>
      <InfluencerDashboardPageContainer />
    </Suspense>
  );
}