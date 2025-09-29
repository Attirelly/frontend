"use client";

import { useState, useEffect, useMemo } from "react";
import { api } from "@/lib/axios";
import {
  AlgoliaHit,
  ProductFacets,
  AlgoliaProductResponse,
  SelectedProduct,
} from "@/types/algolia";

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
interface ProductSearchPageProps {
  onConfirmSelection: (selectedProducts: SelectedProduct[]) => Promise<void>;
}
export default function ProductSearchPage({
  onConfirmSelection,
}: ProductSearchPageProps) {
  // const storeIds = STORE_IDS;

  const [products, setProducts] = useState<AlgoliaHit[]>([]);
  const [facets, setFacets] = useState<Partial<ProductFacets>>({});
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({});
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>(
    []
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStores, setSelectedStores] = useState<Store[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const storeIds = useMemo(
    () => selectedStores.map((item) => String(item.id)),
    [selectedStores]
  );

  const handleConfirm = async () => {
    if (selectedProducts.length === 0) return;

    setIsSubmitting(true);
    try {
      // Execute the function passed from the parent
      console.log("selected inside" , selectedProducts)
      await onConfirmSelection(selectedProducts);
      // Clear selection on success
      setSelectedProducts([]);
    } catch (err) {
      console.error("Confirmation failed", err);
      // The parent component should show its own toast error message
    } finally {
      setIsSubmitting(false);
    }
  };

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

      const storeFilter = `(${storeIds
        .map((id) => `store_id:"${id}"`)
        .join(" OR ")})`;
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
          facetFiltersArray.push(
            values.map((value) => `${mappedKey}:${value}`)
          );
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
            filters: storeIds.length !== 0 ? finalFilterString : "",
            facetFilters: JSON.stringify(facetFiltersArray),
            limit: 20,
            page: currentPage,
          },
        });

        const {
          hits,
          facets: apiFacets,
          total_pages,
        } = response.data as AlgoliaProductResponse;
        setProducts(hits);
        setTotalPages(total_pages);

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
  }, [storeIds, selectedFilters, currentPage]);

  const handleFilterChange = (category: string, value: string) => {
    setSelectedFilters((prevFilters) => {
      // Handle price filters as single-value overrides
      if (category === "min_price" || category === "max_price") {
        return { ...prevFilters, [category]: [value] };
      }

      const currentValues = prevFilters[category] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];

      if (newValues.length === 0) {
        const { [category]: _, ...rest } = prevFilters;
        return rest;
      }

      return { ...prevFilters, [category]: newValues };
    });
  };

  const handleProductSelect = (product: AlgoliaHit) => {
    setSelectedProducts((prevSelected) => {
      // Check if the product is already in the array
      const isSelected = prevSelected.some((p) => p.productId === product.id);

      if (isSelected) {
        // If it is, filter it out (deselect)
        return prevSelected.filter((p) => p.productId !== product.id);
      } else {
        // If not, add the new object to the array
        return [
          ...prevSelected,
          { productId: product.id, storeId: product.store_id },
        ];
      }
    });
  };

  const handleSelectAll = () => {
    const currentPageProductIds = new Set(products.map((p) => p.id));
    const areAllCurrentlySelected = products.every((p) =>
      selectedProducts.some((sp) => sp.productId === p.id)
    );

    setSelectedProducts((prevSelected) => {
      if (areAllCurrentlySelected) {
        // DESELECT all on the current page by filtering them out of the master list
        return prevSelected.filter(
          (p) => !currentPageProductIds.has(p.productId)
        );
      } else {
        // SELECT all on the current page
        const newSelections = products
          .filter((p) => !prevSelected.some((sp) => sp.productId === p.id)) // Avoid adding duplicates
          .map((p) => ({ productId: p.id, storeId: p.store_id }));

        return [...prevSelected, ...newSelections];
      }
    });
  };

  // Handler to update the current page from the child component
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // It's good practice to clear selections when changing pages
    // setSelectedProductIds(new Set());
  };

  console.log(selectedProducts);

  return (
    <div className="container mx-auto text-black">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Product Management
      </h1>
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
            currentPage={currentPage}
            totalPages={totalPages}
            isLoading={isLoading}
            error={error}
            selectedProducts={selectedProducts}
            onProductSelect={handleProductSelect}
            onSelectAll={handleSelectAll}
            onPageChange={handlePageChange}
          />
        </main>
      </div>

        {selectedProducts.length > 0 && (
        <div className=" bg-gray-800 text-white py-3 px-5 rounded-lg shadow-lg flex items-center gap-4">
          <button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Adding..." : "Add to Campaign"}
          </button>
        </div>
      )}
      
      {selectedProducts.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white py-3 px-6 rounded-lg shadow-lg">
          <p className="font-semibold">
            {selectedProducts.length} product(s) selected
          </p>
        </div>
      )}
    </div>
  );
}
