import { Suspense } from "react";
import StoreListingPage from "./StoreListingPage";


export default function StoreDirectoryPage() {
  return (
    <Suspense>
      <StoreListingPage />
    </Suspense>
  );
}
