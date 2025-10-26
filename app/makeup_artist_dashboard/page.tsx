import { Suspense } from "react";
import MakeUpArtistDashboardContanier from "./MakeupArtistDashboard";

export default function MakeupArtistPage() {
  return (
    // The Suspense component lets child components "wait" for something before they can render.
    // This is typically used for data fetching or code splitting (lazy loading).
    <Suspense>
      <MakeUpArtistDashboardContanier />
    </Suspense>
  );
}