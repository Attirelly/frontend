// "use client"

// import { api } from "@/lib/axios";
// import React, { useEffect, useMemo, useState } from "react";

// // --- NOTE ---
// // Use axios (`api` instance) for all network calls. Fallbacks for 405 responses
// // attempt the alternate HTTP method via the same axios instance so the UI
// // does not crash with an uncaught `Error: 405`.

// // Types
// type City = { id: number | string; name: string };
// type StoreType = { id: number | string; name: string };
// type Store = { id: number | string; name: string; cityId?: number | string; storeTypeIds: Array<number | string> };

// type Product = {
//   id: number | string;
//   name: string;
//   image?: string;
//   storeTypes: string[];
//   priceRanges: string[];
//   genders: string[];
//   categories: string[];
//   brand?: string;
//   price?: number;
//   mrp?: number;
//   discount?: number;
//   size?: string;
//   color?: string;
//   sku?: string;
// };

// // --- Robust axios helpers ---
// async function apiGet<T = any>(url: string): Promise<T> {
//   try {
//     const r = await api.get(url);
//     return r.data as T;
//   } catch (err: any) {
//     // If server returns 405 for GET, try POST fallback with empty body
//     const status = err?.response?.status;
//     if (status === 405) {
//       console.warn(`GET ${url} returned 405 — trying POST fallback via axios`);
//       try {
//         const r2 = await api.post(url, {});
//         return r2.data as T;
//       } catch (err2: any) {
//         throw new Error(`Fallback POST failed: ${err2?.response?.status || err2?.message || err2}`);
//       }
//     }
//     throw err;
//   }
// }

// async function apiPost<T = any>(url: string, body: any): Promise<T> {
//   try {
//     const r = await api.post(url, body);
//     return r.data as T;
//   } catch (err: any) {
//     // If server returns 405 for POST, try GET fallback with query params
//     const status = err?.response?.status;
//     if (status === 405) {
//       console.warn(`POST ${url} returned 405 — trying GET fallback with params via axios`);
//       try {
//         const r2 = await api.get(url, { params: body });
//         return r2.data as T;
//       } catch (err2: any) {
//         throw new Error(`Fallback GET failed: ${err2?.response?.status || err2?.message || err2}`);
//       }
//     }
//     throw err;
//   }
// }

// // --- Collapsible wrapper component ---
// function Collapsible({ title, defaultOpen = true, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
//   const [open, setOpen] = useState(defaultOpen);
//   return (
//     <div className="border rounded-md shadow-sm bg-white mb-4">
//       <button onClick={() => setOpen((s) => !s)} className="w-full px-4 py-3 flex justify-between items-center text-left">
//         <span className="font-medium">{title}</span>
//         <span className="text-sm text-gray-500">{open ? "▾" : "▸"}</span>
//       </button>
//       {open && <div className="p-4">{children}</div>}
//     </div>
//   );
// }

// // --- Section 1: StoreFilters ---
// function StoreFilters({
//   cities,
//   storeTypes,
//   stores,
//   onShowResults,
//   selectedStores,
//   setSelectedStores,
//   setFilteredProductsCallback,
// }: {
//   cities: City[];
//   storeTypes: StoreType[];
//   stores: Store[];
//   selectedStores: Store[];
//   setSelectedStores: React.Dispatch<React.SetStateAction<Store[]>>;
//   onShowResults: () => void;
//   setFilteredProductsCallback: (cb: (p: Product[]) => Product[]) => void;
// }) {
//   const [selectedCityIds, setSelectedCityIds] = useState<Array<number | string>>([]);
//   const [selectedStoreTypeIds, setSelectedStoreTypeIds] = useState<Array<number | string>>([]);
//   const [storeDropdownQuery, setStoreDropdownQuery] = useState("");

//   // compute stores to show in stores dropdown based on city/storetype selection
//   const availableStores = useMemo(() => {
//     return stores.filter((s) => {
//       if (selectedCityIds.length > 0 && !selectedCityIds.includes(s.cityId ?? "")) return false;
//       if (selectedStoreTypeIds.length > 0 && !s.storeTypeIds.some((id) => selectedStoreTypeIds.includes(id))) return false;
//       return true;
//     });
//   }, [stores, selectedCityIds, selectedStoreTypeIds]);

//   function toggleArray<T>(arr: T[], v: T) {
//     return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
//   }

//   function toggleCity(id: number | string) {
//     setSelectedCityIds((p) => toggleArray(p, id));
//   }
//   function toggleStoreType(id: number | string) {
//     setSelectedStoreTypeIds((p) => toggleArray(p, id));
//   }

//   function addStore(store: Store) {
//     setSelectedStores((prev) => (prev.find((s) => String(s.id) === String(store.id)) ? prev : [...prev, store]));
//   }

//   function removeStore(storeId: number | string) {
//     setSelectedStores((prev) => prev.filter((s) => String(s.id) !== String(storeId)));
//   }

//   return (
//     <Collapsible title="Store Filters" defaultOpen>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         {/* Cities multiselect */}
//         <div>
//           <label className="block text-sm mb-2">Cities</label>
//           <div className="border rounded p-2 max-h-40 overflow-auto">
//             {cities.map((c) => (
//               <label key={String(c.id)} className="flex items-center gap-2 mb-1">
//                 <input type="checkbox" checked={selectedCityIds.includes(c.id)} onChange={() => toggleCity(c.id)} />
//                 <span className="text-sm">{c.name}</span>
//               </label>
//             ))}
//           </div>
//         </div>

//         {/* Store types multiselect */}
//         <div>
//           <label className="block text-sm mb-2">Store Types</label>
//           <div className="border rounded p-2 max-h-40 overflow-auto">
//             {storeTypes.map((t) => (
//               <label key={String(t.id)} className="flex items-center gap-2 mb-1">
//                 <input type="checkbox" checked={selectedStoreTypeIds.includes(t.id)} onChange={() => toggleStoreType(t.id)} />
//                 <span className="text-sm">{t.name}</span>
//               </label>
//             ))}
//           </div>
//         </div>

//         {/* Stores dropdown + add */}
//         <div>
//           <label className="block text-sm mb-2">Stores</label>
//           <input placeholder="search stores..." value={storeDropdownQuery} onChange={(e) => setStoreDropdownQuery(e.target.value)} className="w-full border rounded px-3 py-2 mb-2" />
//           <div className="border rounded p-2 max-h-40 overflow-auto">
//             {availableStores
//               .filter((s) => s.name.toLowerCase().includes(storeDropdownQuery.toLowerCase()))
//               .map((s) => (
//                 <div key={String(s.id)} className="flex justify-between items-center py-1">
//                   <div className="text-sm">{s.name}</div>
//                   <button onClick={() => addStore(s)} className="text-xs px-2 py-1 rounded bg-blue-600 text-white">
//                     Add
//                   </button>
//                 </div>
//               ))}
//             {availableStores.length === 0 && <div className="text-sm text-gray-500">No stores</div>}
//           </div>
//         </div>
//       </div>

//       {/* Selected stores list */}
//       <div className="mt-4">
//         <label className="block text-sm mb-2">Selected Stores</label>
//         <div className="flex flex-wrap gap-2">
//           {selectedStores.map((s) => (
//             <div key={String(s.id)} className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded">
//               <span className="text-sm">{s.name}</span>
//               <button className="text-red-500" onClick={() => removeStore(s.id)}>
//                 ✕
//               </button>
//             </div>
//           ))}
//           {selectedStores.length === 0 && <div className="text-sm text-gray-500">No stores selected</div>}
//         </div>
//       </div>

//       <div className="mt-4 flex gap-2">
//         <button onClick={() => onShowResults()} className="px-4 py-2 bg-green-600 text-white rounded">
//           Show Results
//         </button>
//         <button onClick={() => setFilteredProductsCallback((p) => p)} className="px-4 py-2 border rounded">
//           Reset Store-based Product Filter (client)
//         </button>
//       </div>
//     </Collapsible>
//   );
// }

// // --- Section 2: ProductFilters ---
// function ProductFilters({ productFilterOptions, productFilters, setProductFilters }: {
//   productFilterOptions: Partial<Record<string, string[]>>;
//   productFilters: Record<string, any>;
//   setProductFilters: React.Dispatch<React.SetStateAction<Record<string, any>>>;
// }) {
//   // helper to toggle simple multiselect
//   function toggleFilter(name: string, value: string) {
//     setProductFilters((prev: any) => {
//       const current = (prev[name] as string[]) || [];
//       return { ...prev, [name]: current.includes(value) ? current.filter((x) => x !== value) : [...current, value] };
//     });
//   }

//   function setPrice(min: number, max: number) {
//     setProductFilters((prev: any) => ({ ...prev, price: [min, max] }));
//   }

//   return (
//     <Collapsible title="Product Filters" defaultOpen>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         {[
//           { key: "categories", label: "Categories" },
//           { key: "subcat1", label: "Subcategory 1" },
//           { key: "subcat2", label: "Subcategory 2" },
//           { key: "skus", label: "SKUs" },
//           { key: "sizes", label: "Sizes" },
//           { key: "colors", label: "Colors" },
//           { key: "fabrics", label: "Fabrics" },
//           { key: "occasions", label: "Occasions" },
//         ].map((f) => (
//           <div key={f.key}>
//             <label className="block text-sm mb-2">{f.label}</label>
//             <div className="border rounded p-2 max-h-40 overflow-auto">
//               {(productFilterOptions[f.key] || []).map((opt) => (
//                 <label key={opt} className="flex items-center gap-2 mb-1">
//                   <input type="checkbox" checked={((productFilters[f.key] as string[]) || []).includes(opt)} onChange={() => toggleFilter(f.key, opt)} />
//                   <span className="text-sm">{opt}</span>
//                 </label>
//               ))}
//             </div>
//           </div>
//         ))}

//         {/* Price */}
//         <div>
//           <label className="block text-sm mb-2">Price range</label>
//           <div className="flex gap-2">
//             <input
//               type="number"
//               value={((productFilters.price as [number, number])?.[0]) ?? ""}
//               onChange={(e) => setPrice(Number(e.target.value || 0), Number((productFilters.price as [number, number])?.[1] || 0))}
//               className="w-full border rounded px-3 py-2"
//               placeholder="min"
//             />
//             <input
//               type="number"
//               value={((productFilters.price as [number, number])?.[1]) ?? ""}
//               onChange={(e) => setPrice(Number((productFilters.price as [number, number])?.[0] || 0), Number(e.target.value || 0))}
//               className="w-full border rounded px-3 py-2"
//               placeholder="max"
//             />
//           </div>
//         </div>
//       </div>
//     </Collapsible>
//   );
// }

// // --- Section 3: ActionsPanel ---
// function ActionsPanel({
//   selectedProducts,
//   labels,
//   curations,
//   campaigns,
//   selectedLabel,
//   setSelectedLabel,
//   selectedCurations,
//   setSelectedCurations,
//   selectedCampaigns,
//   setSelectedCampaigns,
// }: {
//   selectedProducts: Array<number | string>;
//   labels: string[];
//   curations: string[];
//   campaigns: string[];
//   selectedLabel: string | null;
//   setSelectedLabel: (s: string | null) => void;
//   selectedCurations: string[];
//   setSelectedCurations: (s: string[]) => void;
//   selectedCampaigns: string[];
//   setSelectedCampaigns: (s: string[]) => void;
// }) {
//   const disabled = selectedProducts.length === 0;
//   function toggleMulti(arr: string[], setFn: (s: string[]) => void, v: string) {
//     setFn(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
//   }

//   return (
//     <Collapsible title="Actions" defaultOpen>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <div>
//           <label className="block text-sm mb-2">Add to label</label>
//           <select disabled={disabled} value={selectedLabel ?? ""} onChange={(e) => setSelectedLabel(e.target.value || null)} className="w-full border rounded px-3 py-2">
//             <option value="">-- choose label --</option>
//             {labels.map((l) => (
//               <option key={l} value={l}>
//                 {l}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label className="block text-sm mb-2">Curations</label>
//           <div className="border rounded p-2 max-h-40 overflow-auto">
//             {curations.map((c) => (
//               <label key={c} className={`flex items-center gap-2 mb-1 ${disabled ? "opacity-50" : ""}`}>
//                 <input type="checkbox" disabled={disabled} checked={selectedCurations.includes(c)} onChange={() => toggleMulti(selectedCurations, setSelectedCurations, c)} />
//                 <span className="text-sm">{c}</span>
//               </label>
//             ))}
//           </div>
//         </div>

//         <div>
//           <label className="block text-sm mb-2">Campaigns</label>
//           <div className="border rounded p-2 max-h-40 overflow-auto">
//             {campaigns.map((c) => (
//               <label key={c} className={`flex items-center gap-2 mb-1 ${disabled ? "opacity-50" : ""}`}>
//                 <input type="checkbox" disabled={disabled} checked={selectedCampaigns.includes(c)} onChange={() => toggleMulti(selectedCampaigns, setSelectedCampaigns, c)} />
//                 <span className="text-sm">{c}</span>
//               </label>
//             ))}
//           </div>
//         </div>
//       </div>
//     </Collapsible>
//   );
// }

// // --- Section 4: ProductsTable ---
// function ProductsTable({
//   products,
//   selectedProductIds,
//   setSelectedProductIds,
//   onToggleSelectAll,
// }: {
//   products: Product[];
//   selectedProductIds: string[];
//   setSelectedProductIds: React.Dispatch<React.SetStateAction<string[]>>;
//   onToggleSelectAll: (all: boolean) => void;
// }) {
//   function toggle(id: number | string) {
//     const sid = String(id);
//     setSelectedProductIds((prev: string[]) => (prev.includes(sid) ? prev.filter((x) => x !== sid) : [...prev, sid]));
//   }

//   const allSelected = products.length > 0 && products.every((p) => selectedProductIds.includes(String(p.id)));

//   return (
//     <Collapsible title="Products" defaultOpen>
//       <div className="overflow-auto">
//         <table className="min-w-full text-sm">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-3 py-2">
//                 <input type="checkbox" checked={allSelected} onChange={(e) => onToggleSelectAll(e.target.checked)} />
//               </th>
//               <th className="px-3 py-2">Image</th>
//               <th className="px-3 py-2">Name</th>
//               <th className="px-3 py-2">Store types</th>
//               <th className="px-3 py-2">Price ranges</th>
//               <th className="px-3 py-2">Genders</th>
//               <th className="px-3 py-2">Categories</th>
//               <th className="px-3 py-2">Brand</th>
//               <th className="px-3 py-2">Price</th>
//               <th className="px-3 py-2">MRP</th>
//               <th className="px-3 py-2">Discount</th>
//               <th className="px-3 py-2">Size</th>
//               <th className="px-3 py-2">Color</th>
//               <th className="px-3 py-2">SKU</th>
//             </tr>
//           </thead>
//           <tbody>
//             {products.map((p) => (
//               <tr key={String(p.id)} className="border-b even:bg-white odd:bg-gray-50">
//                 <td className="px-3 py-2 text-center">
//                   <input type="checkbox" checked={selectedProductIds.includes(String(p.id))} onChange={() => toggle(p.id)} />
//                 </td>
//                 <td className="px-3 py-2">
//                   <img src={p.image || "/placeholder.png"} alt="img" className="w-12 h-12 object-cover rounded" />
//                 </td>
//                 <td className="px-3 py-2">{p.name}</td>
//                 <td className="px-3 py-2">{(p.storeTypes || []).join(", ")}</td>
//                 <td className="px-3 py-2">{(p.priceRanges || []).join(", ")}</td>
//                 <td className="px-3 py-2">{(p.genders || []).join(", ")}</td>
//                 <td className="px-3 py-2">{(p.categories || []).join(" > ")}</td>
//                 <td className="px-3 py-2">{p.brand}</td>
//                 <td className="px-3 py-2">{p.price}</td>
//                 <td className="px-3 py-2">{p.mrp}</td>
//                 <td className="px-3 py-2">{p.discount}</td>
//                 <td className="px-3 py-2">{p.size}</td>
//                 <td className="px-3 py-2">{p.color}</td>
//                 <td className="px-3 py-2">{p.sku}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </Collapsible>
//   );
// }

// // --- PAGE component that wires everything together ---
// export default function ProductCRMPage() {
//   // backend-provided lists
//   const [cities, setCities] = useState<City[]>([]);
//   const [storeTypes, setStoreTypes] = useState<StoreType[]>([]);
//   const [stores, setStores] = useState<Store[]>([]);

//   // selected stores (detailed objects)
//   const [selectedStores, setSelectedStores] = useState<Store[]>([]);

//   // product area
//   const [productFilterOptions, setProductFilterOptions] = useState<Partial<Record<string, string[]>>>({});
//   const [productFilters, setProductFilters] = useState<Record<string, any>>({});
//   const [products, setProducts] = useState<Product[]>([]);

//   // actions & selections
//   const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
//   const [labels] = useState<string[]>(["Label A", "Label B"]);
//   const [curations] = useState<string[]>(["Curation 1", "Curation 2"]);
//   const [campaigns] = useState<string[]>(["Summer", "Winter"]);
//   const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
//   const [selectedCurations, setSelectedCurations] = useState<string[]>([]);
//   const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);

//   // product-fetch control
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // fetch initial meta lists on mount (with robust fallbacks inside api helpers)
//   useEffect(() => {
//     let mounted = true;
//     (async () => {
//       try {
//         setLoading(true);
//         const [citiesData, storeTypesData, storesData] = await Promise.all([
//           apiGet<City[]>('/location/cities'),
//           apiGet<StoreType[]>('/api/store-types'),
//           apiGet<Store[]>('/api/stores'),
//         ]);
//         if (!mounted) return;
//         setCities(citiesData || []);
//         setStoreTypes(storeTypesData || []);
//         setStores(storesData || []);
//       } catch (err: any) {
//         console.error('Failed to load meta lists', err);
//         setError(String(err?.message || err));
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     })();
//     return () => {
//       mounted = false;
//     };
//   }, []);

//   // when user presses Show Results in StoreFilters, we fetch products filtered by selectedStores
//   async function fetchProductsByStores() {
//     setLoading(true);
//     setError(null);
//     try {
//       const storeIds = selectedStores.map((s) => s.id);
//       // Backend should accept storeIds and return products + also aggregated filter options based on returned products
//       const data = await apiPost<{ products: Product[]; aggregations?: Partial<Record<string, string[]>> }>('/api/products/search', { storeIds });
//       setProducts((data && data.products) || []);
//       // set aggregations that will be used to populate product filter dropdowns
//       if (data && data.aggregations) setProductFilterOptions(data.aggregations);
//       // reset selected products
//       setSelectedProductIds([]);
//     } catch (err: any) {
//       console.error('Failed to fetch products by stores', err);
//       setError(String(err?.message || err));
//       setProducts([]);
//     } finally {
//       setLoading(false);
//     }
//   }

//   // Debounce behavior: whenever productFilters change, re-query backend (assumes backend accepts filter object)
//   useEffect(() => {
//     const t = setTimeout(async () => {
//       setError(null);
//       try {
//         setLoading(true);
//         const body = { filters: productFilters };
//         const data = await apiPost<{ products: Product[]; aggregations?: Partial<Record<string, string[]>> }>('/api/products/search', body);
//         setProducts((data && data.products) || []);
//         if (data && data.aggregations) setProductFilterOptions((prev) => ({ ...prev, ...data.aggregations }));
//       } catch (err: any) {
//         console.error('Failed to fetch products by filters', err);
//         setError(String(err?.message || err));
//       } finally {
//         setLoading(false);
//       }
//     }, 350);
//     return () => clearTimeout(t);
//   }, [productFilters]);

//   function handleToggleSelectAll(all: boolean) {
//     if (all) setSelectedProductIds(products.map((p) => String(p.id)));
//     else setSelectedProductIds([]);
//   }

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <h1 className="text-2xl font-bold mb-6">Product CRM</h1>

//       {error && (
//         <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-red-700">
//           <strong>Error:</strong> {error}
//         </div>
//       )}

//       <StoreFilters
//         cities={cities}
//         storeTypes={storeTypes}
//         stores={stores}
//         selectedStores={selectedStores}
//         setSelectedStores={setSelectedStores}
//         onShowResults={fetchProductsByStores}
//         setFilteredProductsCallback={(cb) => setProducts((prev) => cb(prev))}
//       />

//       <ProductFilters productFilterOptions={productFilterOptions} productFilters={productFilters} setProductFilters={setProductFilters} />

//       <ActionsPanel
//         selectedProducts={selectedProductIds}
//         labels={labels}
//         curations={curations}
//         campaigns={campaigns}
//         selectedLabel={selectedLabel}
//         setSelectedLabel={setSelectedLabel}
//         selectedCurations={selectedCurations}
//         setSelectedCurations={setSelectedCurations}
//         selectedCampaigns={selectedCampaigns}
//         setSelectedCampaigns={setSelectedCampaigns}
//       />

//       <div className="mt-4">
//         {loading ? (
//           <div className="py-4">Loading products...</div>
//         ) : (
//           <div className="py-2 text-sm text-gray-600">{products.length} products</div>
//         )}
//         <ProductsTable products={products} selectedProductIds={selectedProductIds} setSelectedProductIds={setSelectedProductIds} onToggleSelectAll={handleToggleSelectAll} />
//       </div>
//     </div>
//   );
// }

// "use client";
// import { useState } from 'react';
// import { ChevronDown } from 'lucide-react';
// import { StoreFilter, Store} from '@/components/admin/productCRM/StoreFilters';

// export default function ProductCRMPage() {
//   // CHANGED: State is now managed here in the parent component
//   const [selectedStores, setSelectedStores] = useState<Store[]>([]);

//   // For demonstration, log the stores to the console whenever they change
//   console.log("Stores selected in parent:", selectedStores);

//   return (
//     <div className="p-8 bg-gray-50 min-h-screen font-sans">
//       <div>
//         {/* CHANGED: Pass the state and the updater function as props */}
//         <StoreFilter
//           selectedStores={selectedStores}
//           onStoresChange={setSelectedStores}
//         />


//       </div>
//     </div>
//   );
// }

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
