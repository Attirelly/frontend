"use client";

import { useState, useEffect, useMemo } from "react";
import { api } from "@/lib/axios";
import { AlgoliaHit, ProductFacets, AlgoliaProductResponse } from "@/types/algolia";

import { DynamicFilters } from "@/components/admin/productCRM/DynamicFilters";
import { ProductContainer } from "@/components/admin/productCRM/ProductContainer";
import { StoreFilter, Store } from "@/components/admin/productCRM/StoreFilters";

// Define the structure for selected filters
type SelectedFilters = Record<string, string[]>;
const STORE_IDS = [
  "52b9fab3-60f5-4b4a-83be-be74e26cc329",
  "d18c65b0-7fcc-4429-9dfd-a53fae66cb59",
  "da950e55-dddb-4e2f-8cc0-437bf79ea809",
];

export default function ProductSearchPage() {
  // const storeIds = STORE_IDS;

  

  const [products, setProducts] = useState<AlgoliaHit[]>([]);
  const [facets, setFacets] = useState<Partial<ProductFacets>>({});
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({});
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStores, setSelectedStores] = useState<Store[]>([]);

  const storeIds = useMemo(() => selectedStores.map((item) => String(item.id)), [selectedStores]);


  // Clear filters and facets when storeIds change
  useEffect(() => {
    setFacets({});
    setSelectedFilters({});
  }, [storeIds]);

  // Fetch products when storeIds or selectedFilters change
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);

      const storeFilter = `(${storeIds.map(id => `store_id:"${id}"`).join(" OR ")})`;
      // Map UI keys to Algolia facet keys
    const facetKeyMap: Record<string, string> = {
      size: "variants.size_name",
      colours: "variants.color_name",
    };

    const facetFiltersArray: string[][] = [];
    const numericFilters: string[] = [];

    Object.entries(selectedFilters).forEach(([key, values]) => {
      if (key === "min_price") {
        numericFilters.push(`price > ${values[0]}`);
      } else if (key === "max_price") {
        numericFilters.push(`price < ${values[0]}`);
      } else {
        const mappedKey = facetKeyMap[key] || key;
        facetFiltersArray.push(values.map(value => `${mappedKey}:${value}`));
      }
    });

    const combinedFilters = [storeFilter];

if (numericFilters.length > 0) {
  combinedFilters.push(numericFilters.join(" AND "));
}

const finalFilterString = combinedFilters.join(" AND ");
      try {
        const response = await api.get("/search/search_product", {
          params: {
            filters: finalFilterString,
            facetFilters: JSON.stringify(facetFiltersArray),
            limit: 50,
          },
        });

        const { hits, facets: apiFacets } = response.data as AlgoliaProductResponse;
        setProducts(hits);

        if (Object.keys(facets).length === 0) {
          setFacets(apiFacets);
        }
      } catch (err) {
        setError("Could not load products. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [storeIds, selectedFilters]);


  const handleFilterChange = (category: string, value: string) => {
  setSelectedFilters(prevFilters => {
    // Handle price filters as single-value overrides
    if (category === "min_price" || category === "max_price") {
      return { ...prevFilters, [category]: [value] };
    }

    const currentValues = prevFilters[category] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];

    if (newValues.length === 0) {
      const { [category]: _, ...rest } = prevFilters;
      return rest;
    }

    return { ...prevFilters, [category]: newValues };
  });

  setSelectedProductIds(new Set());
};


  const handleProductSelect = (productId: string) => {
    setSelectedProductIds(prevIds => {
      const newIds = new Set(prevIds);
      if (newIds.has(productId)) {
        newIds.delete(productId);
      } else {
        newIds.add(productId);
      }
      return newIds;
    });
  };

  const handleSelectAll = () => {
    if (selectedProductIds.size === products.length) {
      setSelectedProductIds(new Set());
    } else {
      setSelectedProductIds(new Set(products.map(p => p.id)));
    }
  };

  console.log(selectedStores);

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Product Management</h1>
      <div className="mb-3"> 
<StoreFilter
          selectedStores={selectedStores}
          onStoresChange={setSelectedStores}
        />
      </div>
      

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          {/* Uncomment when ready to use filters */}
          <DynamicFilters
            facets={facets}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
          />
        </aside>

        <main className="lg:col-span-3">
          <ProductContainer
            products={products}
            isLoading={isLoading}
            error={error}
            selectedProductIds={selectedProductIds}
            onProductSelect={handleProductSelect}
            onSelectAll={handleSelectAll}
          />
        </main>
      </div>

      {selectedProductIds.size > 0 && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white py-3 px-6 rounded-lg shadow-lg">
          <p className="font-semibold">{selectedProductIds.size} product(s) selected</p>
        </div>
      )}
    </div>
  );
}
