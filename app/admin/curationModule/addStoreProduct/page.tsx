import AddStoreProduct from "@/components/AddStoreProducts";
import React, { Suspense } from 'react';

export default function AddStoreProductPage() {
  return (
      <Suspense fallback={<div>Loading...</div>}>
      <AddStoreProduct />
      </Suspense>
  );
}
