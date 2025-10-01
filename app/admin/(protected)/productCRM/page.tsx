"use client";

import { useState, useEffect, useMemo } from "react";
import { api } from "@/lib/axios";
import { AlgoliaHit, ProductFacets, AlgoliaProductResponse, SelectedProduct, Curation, StoreApiResponse } from "@/types/algolia";

import { DynamicFilters } from "@/components/admin/productCRM/DynamicFilters";
import { ProductContainer } from "@/components/admin/productCRM/ProductContainer";
import { StoreFilter, Store } from "@/components/admin/productCRM/StoreFilters";
import { AddToCuration } from "@/components/admin/productCRM/AddToCuration";
import { SelectionSidebar } from "@/components/admin/productCRM/SelectionSidebar";
import { toast } from "sonner";
import { EditCuration } from "@/components/admin/productCRM/EditCuration";
import Image from "next/image";

// Define the structure for selected filters
type SelectedFilters = Record<string, string[]>;
const STORE_IDS = [
  "52b9fab3-60f5-4b4a-83be-be74e26cc329",
  "d18c65b0-7fcc-4429-9dfd-a53fae66cb59",
  "da950e55-dddb-4e2f-8cc0-437bf79ea809",
];
interface ProductSearchPageProps {
  onConfirmSelection: (selectedProducts: AlgoliaHit[]) => Promise<void>;
}
export default function ProductSearchPage({
  onConfirmSelection,
}: ProductSearchPageProps) {
  // const storeIds = STORE_IDS;

  const [products, setProducts] = useState<AlgoliaHit[]>([]);
  const [facets, setFacets] = useState<Partial<ProductFacets>>({});
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({});
  const [selectedProducts, setSelectedProducts] = useState<AlgoliaHit[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStores, setSelectedStores] = useState<Store[]>([]);
  const [selectedCurations, setSelectedCurations] = useState<Curation[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);


  // NEW State to manage the loading state for the edit curation feature
  const [isEditingCuration, setIsEditingCuration] = useState<boolean>(false);
  // NEW State to hold a master list of all stores for mapping IDs to names
  const [allStores, setAllStores] = useState<Store[]>([]);

  const storeIds = useMemo(
    () => selectedStores.map((item) => String(item.id)),
    [selectedStores]
  );

  // NEW useEffect to fetch the master list of all stores once
  useEffect(() => {
    const fetchAllStores = async () => {
      try {
        const response = await api.get<StoreApiResponse[]>('/stores/');
        const formattedStores = response.data.map((store: any) => ({
          id: store.store_id,
          name: store.store_name,
        }));
        setAllStores(formattedStores);
      } catch (err) {
        console.error("Failed to fetch all stores list:", err);
        toast.error("Could not load the master store list.");
      }
    };
    fetchAllStores();
  }, []);

   // --- START: NEW LOGIC FOR EDITING CURATION ---
  
  /**
   * Handles the selection of a curation from the EditCuration modal.
   * This function orchestrates fetching curation data and setting all relevant states.
   */
  const handleEditCurationSelect = async (curation: Curation) => {
    if (curation.section_type !== 'product') {
      toast.error("This page can only edit 'product' type curations.");
      return;
    }

    setIsEditingCuration(true);
    // Clear previous selections to load the new curation state
    setSelectedProducts([]);
    setSelectedStores([]);
    setSelectedCurations([]);
    
    try {
      // 1. Fetch the store and product IDs for the selected curation
      const response = await api.get<{ store_id: string; product_id?: string }[]>(
        `/homepage/stores_and_products_by_section/${curation.section_id}`
      );
      const storeProductPairs = response.data;

      if (!storeProductPairs || storeProductPairs.length === 0) {
        toast.info("This curation is currently empty.");
        return;
      }

      // 2. Populate the selected stores filter
      const storeIdsFromCuration = [...new Set(storeProductPairs.map(p => p.store_id))];
      const storesToSelect = allStores.filter(store => storeIdsFromCuration.includes(store.id));
      setSelectedStores(storesToSelect);
      
      // 3. Fetch full product details using the new backend endpoint
      const productIds = storeProductPairs.map(p => p.product_id).filter((id): id is string => !!id);
      
      if (productIds.length > 0) {
        // THIS IS THE KEY STEP using the new endpoint

        const prodFilters = `(${productIds
        .map((product_id) => `objectID:"${product_id}"`)
        .join(" OR ")})`;

        const response = await api.get("/search/search_product", {
          params: {
            filters: prodFilters,
            limit: 1000,
          },
        });

        // const productsResponse = await api.post<AlgoliaHit[]>('/search/products_by_ids', {
        //   product_ids: productIds,
        // });
        
        setSelectedProducts(response.data.hits);
      }
      
      // 4. Set the selected curation in the "Add To" dropdown for context
      setSelectedCurations([curation]);
      
      toast.success(`Successfully loaded curation: ${curation.section_name}`);

    } catch (err) {
      console.error("Failed to load curation details:", err);
      toast.error("An error occurred while loading the curation.");
    } finally {
      setIsEditingCuration(false);
    }
  };

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
      const isSelected = prevSelected.some(p => p.id === product.id);

      if (isSelected) {
        // If it is, filter it out (deselect)
        return prevSelected.filter(p => p.id !== product.id);
      } else {
        // If not, add the new object to the array
        return [...prevSelected, product];
      }
    });
  };

  const handleSelectAll = () => {
    const currentPageProductIds = new Set(products.map(p => p.id));
    const areAllCurrentlySelected = products.every(p => selectedProducts.some(sp => sp.id === p.id));

    setSelectedProducts((prevSelected) => {
      if (areAllCurrentlySelected) {
        // DESELECT all on the current page by filtering them out of the master list
        return prevSelected.filter(p => !currentPageProductIds.has(p.id));
      } else {
        // SELECT all on the current page
        const newSelections = products
          .filter(p => !prevSelected.some(sp => sp.id === p.id)) // Avoid adding duplicates
          // .map(p => ({ id: p.id, store_id: p.store_id }));
        
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

  const handleCurationChange = (curations: Curation[]) => {
    setSelectedCurations(curations);
  };

  const handleRemoveFromMasterList = (productId: string) => {
    setSelectedProducts(prev => prev.filter(p => p.id !== productId));
  };
 
  const handleClearAllSelections = () => {
    setSelectedProducts([]);
  };


  const handleSubmit = () => {
    // You can now access all properties of the selected curations
    const curationNames = selectedCurations.map(c => c.section_name).join(', ');
    alert(`Submitting with these curations: ${curationNames}`);
  };

  const selectedCurationIds = useMemo(
  () => selectedCurations.map((c) => c.section_id),
  [JSON.stringify(selectedCurations.map(c => c.section_id))]
);


// Define a function that describes how to render a product
const renderProductItem = (product: AlgoliaHit) => (
  <div className="flex items-center">
    <Image
      src={product.image?.[0] || "/placeholder.png"}
      alt={product.product_name || 'product name'}
      width={60}
      height={60}
      className="w-16 h-16 object-cover rounded-md mr-4"
    />
    <div>
      <p className="text-sm font-semibold">{product.title}</p>
      <p className="text-xs text-gray-500">Rs. {product.price}</p>
    </div>
  </div>
);
  return (
    <div className="container mx-auto text-black">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Product Management
        </h1>
        {/* --- ADD THE NEW EDIT BUTTON HERE --- */}
        <EditCuration onCurationSelect={handleEditCurationSelect} isProcessing={isEditingCuration} />
      </div>
      <div className="mb-3">
        <StoreFilter
          selectedStores={selectedStores}
          allFetchedStores={allStores}
          onStoresChange={setSelectedStores}
        />
      </div>
      {selectedProducts.length > 0 && (
<div className="mb-3">
        <AddToCuration
        onSelectionChange={handleCurationChange}
        selectedObjects={selectedProducts}
        selectedCurations={selectedCurations}
        />
      </div>

      )}
      

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

      {/* NEW: Floating button to open the master list sidebar */}
      {selectedProducts.length > 0 && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 text-white py-3 px-5 rounded-full shadow-lg flex items-center space-x-3 hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 z-30"
        >
          <span className="font-semibold text-lg">{selectedProducts.length}</span>
          <span className="hidden sm:inline">View Selections</span>
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
           </svg>
        </button>
      )}

      {/* NEW: Render the sidebar component */}
      <SelectionSidebar
  isOpen={isSidebarOpen}
  onClose={() => setIsSidebarOpen(false)}
  items={selectedProducts}
  onRemoveItem={handleRemoveFromMasterList} // Your existing function
  onClearAll={handleClearAllSelections}     // Your existing function
  title="Selected Products"
  emptyStateMessage="No products selected yet."
  getKey={(product) => product.id}
  renderItem={renderProductItem}
/>
    </div>
  );
}
