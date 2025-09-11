import { Suspense } from "react";
import ProductListPage from "./ProductListPage";

/**
 * A wrapper component that provides a React Suspense boundary for the product listing page.
 *
 * This component's primary role is to enable asynchronous rendering features for its children.
 * By wrapping `ProductListPage` in `<Suspense>`, we can gracefully handle loading states
 * for data fetching or lazy-loaded components within the `ProductListPage`
 *
 * @returns {JSX.Element} The `ProductListPage` component rendered within a `Suspense` boundary.
 * @see {@link https://react.dev/reference/react/Suspense | React Suspense Documentation}
 * @ComponentsUsed {@link ProductListPage} - The main page component that is being wrapped.
 */
export default function ProductDirectoryPage() {
  return (
    // The Suspense component lets child components "wait" for something before they can render.
    // This is typically used for data fetching or code splitting (lazy loading).
    <Suspense>
      <ProductListPage />
    </Suspense>
  );
}