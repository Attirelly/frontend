import { Suspense } from "react";
import ProductListPage from "./ProductListPage";

export default function ProductDirectoryPage() {
  return (
    <Suspense>
      <ProductListPage />
    </Suspense>
  );
}
