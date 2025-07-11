// "use client";
// import { api } from "@/lib/axios";
// import Link from "next/link";
// import { useEffect, useState, ChangeEvent, useMemo } from "react";

// type Seller = {
//   id?: string;
//   name?: string;
//   email: string;
//   mobile?: string;
//   address?: string;
//   category?: string;
//   status?: boolean;
//   latitude?: string;
//   longitude?: string;
//   gender?: string[];
//   store_name?: string;
//   area?: string;
//   city?: string;
//   store_types?: string[];
//   outfits?: string[];
//   genders?: string[];
//   created_at?: Date;
// };

// type SortConfig = {
//   key: keyof Seller;
//   direction: 'ascending' | 'descending';
// };

// export default function Home() {
//   const [sellers, setSellers] = useState<Seller[]>([]);
//   const [filteredSellers, setFilteredSellers] = useState<Seller[]>([]);
//   // const [displayedSellers, setDisplayedSellers] = useState<Seller[]>([]);
//   const [search, setSearch] = useState("");
//   const [selectedFacets, setSelectedFacets] = useState<{
//     [key: string]: string[];
//   }>({});
//   const [facets, setFacets] = useState<{ [key: string]: string[] }>({});
//   const [viewAll, setViewAll] = useState(false);
//   const [selectedSellerIds, setSelectedSellerIds] = useState<string[]>([]);
//   const [debouncedSearch, setDebouncedSearch] = useState(search);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

//   const isSelected = (id: string) => selectedSellerIds.includes(id);

//   // Debounce search input
//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedSearch(search);
//     }, 500);

//     return () => {
//       clearTimeout(handler);
//     };
//   }, [search]);

//   // Handle checkbox selection
//   const handleCheckboxChange = (id: string) => {
//     setSelectedSellerIds((prev) =>
//       prev.includes(id)
//         ? prev.filter((sellerId) => sellerId !== id)
//         : [...prev, id]
//     );
//   };

//   // Handle bulk status change
//   const handleBulkStatusChange = async (newStatus: boolean) => {
//     const originalFilteredSellers = JSON.parse(JSON.stringify(filteredSellers));
//     const originalSellers = JSON.parse(JSON.stringify(sellers));

//     const updatedFilteredSellers = filteredSellers.map(
//       (seller) =>
//         selectedSellerIds.includes(seller.id!)
//           ? { ...seller, status: newStatus }
//           : { ...seller }
//     );
//     const updatedSellers = sellers.map(
//       (seller) =>
//         selectedSellerIds.includes(seller.id!)
//           ? { ...seller, status: newStatus }
//           : { ...seller }
//     );

//     setSellers(updatedSellers);
//     setFilteredSellers(updatedFilteredSellers);

//     try {
//       await api.patch("/stores/bulk-active", {
//         ids: selectedSellerIds,
//         active: newStatus,
//       });

//       setSelectedSellerIds([]);
//       alert(`Successfully ${newStatus ? "activated" : "deactivated"} stores`);
//     } catch (error) {
//       console.error("Update failed:", error);
//       setSellers(originalSellers);
//       setFilteredSellers(originalFilteredSellers);
//       alert("Failed to update stores. Changes reverted.");
//     }
//   };

//   // Fetch sellers data
//   useEffect(() => {
//     const fetchSellers = async (query: string) => {
//       try {
//         const res = await api.get(
//           `/search/search_store?query=${query}&facets=city&facets=area&facets=store_types&facets=outfits&facets=genders&facets=price_ranges&facets=age_groups&facets=rental`
//         );
//         const data = res.data;

//         const sellers: Seller[] = data.hits.map((hit:any) => ({
//           id: hit.id,
//           name: hit.store_name,
//           email: hit.registered_email,
//           area: hit.area,
//           address: hit.address,
//           city: hit.city,
//           store_types: hit.store_types ? hit.store_types : [],
//           genders: hit.genders,
//           outfits: hit.outfits,
//           status: hit.active,
//         }));

//         setSellers(sellers);
//         setFilteredSellers(sellers);

//         const newFacets = {
//           area: Object.entries(data.facets?.area || {}),
//           city: Object.entries(data.facets?.city || {}),
//           store_types: Object.entries(data.facets?.store_types || {}),
//           genders: Object.entries(data.facets?.genders || {}),
//           outfits: Object.entries(data.facets?.outfits || {}),
//         };

//         setFacets(newFacets);
//       } catch (error) {
//         console.error("Failed to fetch sellers:", error);
//       }
//     };

//     fetchSellers(debouncedSearch);
//   }, [debouncedSearch]);

//   // Handle search
//   const handleSearch = (query: string) => {
//     setSearch(query);
//     setCurrentPage(1); // Reset to first page on new search
//   };

//   // Handle facet selection
//   const handleFacetChange = (facet: string, value: string) => {
//     const newSelectedFacets = { ...selectedFacets };
//     if (newSelectedFacets[facet]?.includes(value)) {
//       newSelectedFacets[facet] = newSelectedFacets[facet].filter(
//         (v) => v !== value
//       );
//     } else {
//       newSelectedFacets[facet] = [...(newSelectedFacets[facet] || []), value];
//     }

//     setSelectedFacets(newSelectedFacets);
//     filterSellers(newSelectedFacets);
//     setCurrentPage(1); // Reset to first page on new filter
//   };

//   // Filter sellers based on selected facets
//   const filterSellers = (selectedFacets) => {
//     const filtered = sellers.filter((seller) => {
//       const matchesFacets = Object.keys(selectedFacets).every((facet) => {
//         const selected = selectedFacets[facet];
//         const sellerValue = seller[facet as keyof Seller];

//         if (selected.length === 0) return true;

//         if (Array.isArray(sellerValue)) {
//           return sellerValue.some((val) => selected.includes(val));
//         } else {
//           return selected.includes(sellerValue);
//         }
//       });

//       return matchesFacets;
//     });

//     setFilteredSellers(filtered);
//   };

//   // Handle CSV upload
//   const handleUploadCSV = (e: ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = function (event) {
//       const text = event.target?.result as string;
//       const lines = text.split("\n");
//       const uploaded: Seller[] = lines
//         .slice(1)
//         .map((line) => {
//           const [id, name, email, location, category, status] = line.split(",");
//           return {
//             id: String(id),
//             name: name?.trim(),
//             email: email?.trim(),
//             location: location?.trim(),
//             category: category?.trim(),
//             status: status?.trim(),
//           };
//         })
//         .filter((s) => s.name && s.email);

//       setSellers(uploaded);
//       setFilteredSellers(uploaded);
//       setCurrentPage(1);

//       const newFacets = {
//         location: [...new Set(uploaded.map((s) => s.location))],
//         category: [...new Set(uploaded.map((s) => s.category))],
//         status: [...new Set(uploaded.map((s) => s.status))],
//         email: [...new Set(uploaded.map((s) => s.email))],
//         name: [...new Set(uploaded.map((s) => s.name))],
//       };
//       setFacets(newFacets);
//     };
//     reader.readAsText(file);
//   };

//   // Handle CSV download
//   const handleDownloadCSV = () => {
//     const header = "id,name,email,location,category,status\n";
//     const rows = filteredSellers
//       .map(
//         (s) =>
//           `${s.id},${s.name},${s.email},${s.location},${s.category},${s.status}`
//       )
//       .join("\n");
//     const blob = new Blob([header + rows], { type: "text/csv" });
//     const url = URL.createObjectURL(blob);

//     const link = document.createElement("a");
//     link.href = url;
//     link.download = "sellers.csv";
//     link.click();
//     URL.revokeObjectURL(url);
//   };

//   // Toggle view all facets
//   const toggleViewAll = () => {
//     setViewAll(!viewAll);
//   };

//   // Request sort
//   const requestSort = (key: keyof Seller) => {
//     let direction: 'ascending' | 'descending' = 'ascending';
//     if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
//       direction = 'descending';
//     }
//     setSortConfig({ key, direction });
//   };

//   // Sort sellers
//   const sortedSellers = useMemo(() => {
//     if (!sortConfig) return filteredSellers;

//     return [...filteredSellers].sort((a, b) => {
//       const aValue = a[sortConfig.key];
//       const bValue = b[sortConfig.key];

//       // Handle array values by joining them for comparison
//       const aString = Array.isArray(aValue) ? aValue.join(', ') : String(aValue || '');
//       const bString = Array.isArray(bValue) ? bValue.join(', ') : String(bValue || '');

//       if (aString < bString) {
//         return sortConfig.direction === 'ascending' ? -1 : 1;
//       }
//       if (aString > bString) {
//         return sortConfig.direction === 'ascending' ? 1 : -1;
//       }
//       return 0;
//     });
//   }, [filteredSellers, sortConfig]);

//   // Pagination logic
//   const totalItems = sortedSellers.length;
//   const totalPages = Math.ceil(totalItems / itemsPerPage);
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = sortedSellers.slice(indexOfFirstItem, indexOfLastItem);

//   const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

//   // Get sort direction indicator
//   const getSortIndicator = (key: keyof Seller) => {
//     if (!sortConfig || sortConfig.key !== key) return null;
//     return sortConfig.direction === 'ascending' ? '↑' : '↓';
//   };

//   return (
//     <div className="w-[90%] mx-auto p-6 font-sans flex flex-col">
//       <div>
//         <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
//           Seller CRM
//         </h1>

//         <div className="flex flex-wrap gap-4 justify-center items-center mb-8">
//           <div className="relative w-full sm:w-64">
//             <input
//               type="text"
//               placeholder="Search Sellers"
//               value={search}
//               onChange={(e) => handleSearch(e.target.value)}
//               className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <label className="cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
//             Upload CSV
//             <input
//               type="file"
//               accept=".csv"
//               onChange={handleUploadCSV}
//               className="hidden"
//             />
//           </label>

//           <button
//             onClick={handleDownloadCSV}
//             className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
//           >
//             Download CSV
//           </button>

//           <button
//             onClick={() => handleBulkStatusChange(true)}
//             className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
//             disabled={selectedSellerIds.length === 0}
//           >
//             Mark Active ({selectedSellerIds.length})
//           </button>
//           <button
//             onClick={() => handleBulkStatusChange(false)}
//             className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
//             disabled={selectedSellerIds.length === 0}
//           >
//             Mark Inactive ({selectedSellerIds.length})
//           </button>
//         </div>
//       </div>
//       <div className="flex flex-row gap-2">
//         {/* Left Sidebar for Facets */}
//         <div className="w-full md:w-[20%] p-6 border-2 border-solid border-gray-200 bg-gray-50 rounded-lg mb-8 md:mb-0">
//           <h2 className="text-xl font-semibold mb-4">Filters</h2>

//           {Object.keys(facets).map((facet) => (
//             <div key={facet} className="mb-6">
//               <h3 className="text-lg font-semibold text-gray-800 mb-3">
//                 {facet.charAt(0).toUpperCase() + facet.slice(1)}
//               </h3>
//               <div className="space-y-2">
//                 {facets[facet]
//                   .slice(0, viewAll ? facets[facet].length : 5)
//                   .map((value) => (
//                     <label
//                       key={value[0]}
//                       className="flex items-center space-x-2 cursor-pointer"
//                     >
//                       <input
//                         type="checkbox"
//                         checked={selectedFacets[facet]?.includes(value[0])}
//                         onChange={() => handleFacetChange(facet, value[0])}
//                         className="h-5 w-5 rounded border-gray-300"
//                       />
//                       <span className="text-sm text-gray-700 text-right">
//                         {value[0]} ({value[1]})
//                       </span>
//                     </label>
//                   ))}
//                 {facets[facet].length > 5 && !viewAll && (
//                   <button
//                     onClick={toggleViewAll}
//                     className="text-blue-600 underline text-sm"
//                   >
//                     View All
//                   </button>
//                 )}
//                 {viewAll && facets[facet].length > 5 && (
//                   <button
//                     onClick={toggleViewAll}
//                     className="text-blue-600 underline text-sm"
//                   >
//                     Show Less
//                   </button>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Main Content */}
//         <div className="flex-1 overflow-x-auto">
//           <div className="min-w-[1000px]">
//             <div className="flex justify-between items-center mb-4">
//               <div className="flex items-center space-x-4">
//                 <span className="text-sm text-gray-600">
//                   Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, totalItems)} of {totalItems} sellers
//                 </span>
//                 <select
//                   value={itemsPerPage}
//                   onChange={(e) => {
//                     setItemsPerPage(Number(e.target.value));
//                     setCurrentPage(1);
//                   }}
//                   className="border border-gray-300 rounded px-2 py-1 text-sm"
//                 >
//                   <option value="5">5 per page</option>
//                   <option value="10">10 per page</option>
//                   <option value="20">20 per page</option>
//                   <option value="50">50 per page</option>
//                 </select>
//               </div>
//             </div>

//             <table className="min-w-full table-auto border-2 border-solid border-gray-200">
//               <thead className="bg-gray-100 text-gray-700 uppercase text-sm font-semibold">
//                 <tr>
//                   <th className="px-4 py-3 border">
//                     <input
//                       type="checkbox"
//                       onChange={(e) =>
//                         setSelectedSellerIds(
//                           e.target.checked
//                             ? currentItems.map((s) => s.id!).filter(Boolean)
//                             : []
//                         )
//                       }
//                       checked={
//                         selectedSellerIds.length > 0 &&
//                         currentItems.every((seller) => selectedSellerIds.includes(seller.id!))
//                       }
//                     />
//                   </th>
//                   <th 
//                     className="px-6 py-3 border cursor-pointer hover:bg-gray-200"
//                     onClick={() => requestSort('name')}
//                   >
//                     <div className="flex items-center">
//                       Name {getSortIndicator('name')}
//                     </div>
//                   </th>
//                   <th 
//                     className="px-6 py-3 border cursor-pointer hover:bg-gray-200"
//                     onClick={() => requestSort('email')}
//                   >
//                     <div className="flex items-center">
//                       Email {getSortIndicator('email')}
//                     </div>
//                   </th>
//                   <th 
//                     className="px-6 py-3 border cursor-pointer hover:bg-gray-200"
//                     onClick={() => requestSort('area')}
//                   >
//                     <div className="flex items-center">
//                       Area {getSortIndicator('area')}
//                     </div>
//                   </th>
//                   <th 
//                     className="px-6 py-3 border cursor-pointer hover:bg-gray-200"
//                     onClick={() => requestSort('city')}
//                   >
//                     <div className="flex items-center">
//                       City {getSortIndicator('city')}
//                     </div>
//                   </th>
//                   <th className="px-6 py-3 border">Store Type</th>
//                   <th className="px-6 py-3 border">Outfits</th>
//                   <th className="px-6 py-3 border">Gender</th>
//                   <th 
//                     className="px-6 py-3 border cursor-pointer hover:bg-gray-200"
//                     onClick={() => requestSort('status')}
//                   >
//                     <div className="flex items-center">
//                       Status {getSortIndicator('status')}
//                     </div>
//                   </th>
//                   <th className="px-6 py-3 border">Operation</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentItems.length === 0 ? (
//                   <tr>
//                     <td colSpan={10} className="text-center py-6 text-gray-500">
//                       No sellers found.
//                     </td>
//                   </tr>
//                 ) : (
//                   currentItems.map((seller) => (
//                     <tr key={seller.id} className="hover:bg-gray-50">
//                       <td className="px-4 py-3 border text-center">
//                         <input
//                           type="checkbox"
//                           checked={isSelected(seller.id!)}
//                           onChange={() => handleCheckboxChange(seller.id!)}
//                         />
//                       </td>
//                       <td className="px-6 py-3 border">{seller.name}</td>
//                       <td className="px-6 py-3 border">{seller.email}</td>
//                       <td className="px-6 py-3 border">{seller.area}</td>
//                       <td className="px-6 py-3 border">{seller.city}</td>
//                       <td className="px-6 py-3 border">
//                         {seller?.store_types?.join(" , ")}
//                       </td>
//                       <td className="px-6 py-3 border">
//                         {seller?.outfits?.join(" , ")}
//                       </td>
//                       <td className="px-6 py-3 border">
//                         {seller?.genders?.join(" , ")}
//                       </td>
//                       <td className="px-6 py-3 border">
//                         <span className={`px-2 py-1 rounded-full text-xs ${
//                           seller.status 
//                             ? "bg-green-100 text-green-800" 
//                             : "bg-red-100 text-red-800"
//                         }`}>
//                           {seller.status ? "Active" : "Inactive"}
//                         </span>
//                       </td>
//                       <td className="px-6 py-3 border text-center space-x-2">
//                         <div className="flex gap-2 justify-center">
//                           <Link href={`/store/${seller.id}`}>
//                             <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
//                               View
//                             </button>
//                           </Link>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>

//             {/* Pagination Controls */}
//             <div className="flex justify-between items-center mt-4">
//               <div>
//                 <span className="text-sm text-gray-600">
//                   Page {currentPage} of {totalPages}
//                 </span>
//               </div>
//               <div className="flex space-x-2">
//                 <button
//                   onClick={() => paginate(1)}
//                   disabled={currentPage === 1}
//                   className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
//                 >
//                   First
//                 </button>
//                 <button
//                   onClick={() => paginate(currentPage - 1)}
//                   disabled={currentPage === 1}
//                   className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
//                 >
//                   Previous
//                 </button>

//                 {/* Page numbers */}
//                 {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                   let pageNum;
//                   if (totalPages <= 5) {
//                     pageNum = i + 1;
//                   } else if (currentPage <= 3) {
//                     pageNum = i + 1;
//                   } else if (currentPage >= totalPages - 2) {
//                     pageNum = totalPages - 4 + i;
//                   } else {
//                     pageNum = currentPage - 2 + i;
//                   }

//                   return (
//                     <button
//                       key={pageNum}
//                       onClick={() => paginate(pageNum)}
//                       className={`px-3 py-1 rounded ${currentPage === pageNum ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
//                     >
//                       {pageNum}
//                     </button>
//                   );
//                 })}

//                 <button
//                   onClick={() => paginate(currentPage + 1)}
//                   disabled={currentPage === totalPages}
//                   className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-200 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
//                 >
//                   Next
//                 </button>
//                 <button
//                   onClick={() => paginate(totalPages)}
//                   disabled={currentPage === totalPages}
//                   className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-200 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
//                 >
//                   Last
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";
import { useState, useEffect, useMemo, ChangeEvent, useRef } from "react";
import { Search, Upload, Download, Users, Filter, ChevronDown, ChevronUp, Eye, Check, X } from "lucide-react";
import { api } from "@/lib/axios";
import Link from "next/link";
import { toast } from "sonner";

type Seller = {
  id?: string;
  name?: string;
  email: string;
  mobile?: string;
  address?: string;
  category?: string;
  status?: boolean;
  latitude?: string;
  longitude?: string;
  gender?: string[];
  store_name?: string;
  area?: string;
  city?: string;
  store_types?: string[];
  outfits?: string[];
  genders?: string[];
  created_at?: Date;
  curr_section?: number;
  location?: string; // Added for CSV compatibility
};

type SortConfig = {
  key: keyof Seller;
  direction: 'ascending' | 'descending';
};

type FacetEntry = [string, number];
type Facets = { [key: string]: FacetEntry[] };

type QueryParams = {
  query?: string;
  page?: number;
  limit?: number;
  sortField?: string;
  sortDirection?: "asc" | "desc";
  filters?: {
    [key: string]: string[];
  };
};

export default function Home() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [filteredSellers, setFilteredSellers] = useState<Seller[]>([]);
  
  const [search, setSearch] = useState("");
  const [selectedFacets, setSelectedFacets] = useState<{
    [key: string]: string[];
  }>({});
  const [facets, setFacets] = useState<Facets>({});
  const [viewAll, setViewAll] = useState<{ [key: string]: boolean }>({});
  const [selectedSellerIds, setSelectedSellerIds] = useState<string[]>([]);
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const buildFacetFilters = (facets: Record<string, string[]>): string => {
    const filters: string[][] = [];

    for (const key in facets) {
      if (facets[key].length > 0) {
        filters.push(facets[key].map((value) => `${key}:${value}`));
      }
    }

    console.log(filters);
    const encoded = encodeURIComponent(JSON.stringify(filters));
    return encoded;
  };

  const isSelected = (id: string) => selectedSellerIds.includes(id);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  // Handle checkbox selection
  const handleCheckboxChange = (id: string) => {
    setSelectedSellerIds((prev) =>
      prev.includes(id)
        ? prev.filter((sellerId) => sellerId !== id)
        : [...prev, id]
    );
  };

  // Handle bulk status change
  const handleBulkStatusChange = async (newStatus: boolean) => {
    if (selectedSellerIds.length === 0) return;

    const originalFilteredSellers = JSON.parse(JSON.stringify(filteredSellers));
    const originalSellers = JSON.parse(JSON.stringify(sellers));

    const updatedFilteredSellers = filteredSellers.map(
      (seller) =>
        selectedSellerIds.includes(seller.id!)
          ? { ...seller, status: newStatus }
          : { ...seller }
    );
    const updatedSellers = sellers.map(
      (seller) =>
        selectedSellerIds.includes(seller.id!)
          ? { ...seller, status: newStatus }
          : { ...seller }
    );

    setSellers(updatedSellers);
    setFilteredSellers(updatedFilteredSellers);

    try {
      await api.patch("/stores/bulk-active", {
        ids: selectedSellerIds,
        active: newStatus,
      });

      setSelectedSellerIds([]);
      alert(`Successfully ${newStatus ? "activated" : "deactivated"} stores`);
    } catch (error) {
      console.error("Update failed:", error);
      setSellers(originalSellers);
      setFilteredSellers(originalFilteredSellers);
      alert("Failed to update stores. Changes reverted.");
    }
  };

  // Fetch sellers data with pagination and filters
   const fetchSellers = async (params: QueryParams) => {
      setLoading(true);
      try {
        // Convert filters to query string
        const filterParams = Object.entries(params.filters || {}).map(
          ([key, values]) =>
            values
              .map((value) => `filters[${key}]=${encodeURIComponent(value)}`)
              .flat()
              .join("&")
        );
  
        const sortParams = params.sortField
          ? `&sortField=${params.sortField}&sortDirection=${
              params.sortDirection || "asc"
            }`
          : "";
  
        const algoia_facets = buildFacetFilters(selectedFacets);
        console.log("facets", algoia_facets);
  
        const res = await api.get(
          `/search/search_store?query=${params.query || ""}&page=${
            (params.page || 1) - 1
          }&limit=${params.limit || 10}&facetFilters=${algoia_facets}`
        );
  
        const data = res.data;
        console.log("algolia", data);
        setTotalItems(data.total_hits);
        setTotalPages(data.total_pages);
        const sellers: Seller[] = data.hits.map((hit: any) => ({
          id: hit.id,
          name: hit.store_name,
          email: hit.registered_email,
          area: hit.area,
          address: hit.address,
          city: hit.city,
          store_types: hit.store_types || [],
          genders: hit.genders || [],
          curr_section: hit.curr_section || 0,
          created_at: hit.created_at ? new Date(hit.created_at) : undefined,
          outfits: hit.outfits || [],
          status: hit.active,
        }));
  
        setSellers(sellers);
        setTotalItems(data.total || data.hits.length);
        console.log("algolia", data);
        const newFacets: Facets = {
          area: Object.entries(data.facets?.area || {}),
          city: Object.entries(data.facets?.city || {}),
          store_types: Object.entries(data.facets?.store_types || {}),
          genders: Object.entries(data.facets?.genders || {}),
          outfits: Object.entries(data.facets?.outfits || {}),
        };
  
        setFacets(newFacets);
      } catch (error) {
        console.error("Failed to fetch sellers:", error);
      } finally {
        setLoading(false);
      }
    };

  // Fetch sellers data
  useEffect(() => {
    // const fetchSellers = async (query: string) => {
    //   setLoading(true);
    //   try {
    //     const res = await api.get(
    //       `/search/search_store?query=${query}&page=${currentPage - 1}&limit=${itemsPerPage}&facets=city&facets=area&facets=store_types&facets=outfits&facets=genders&facets=price_ranges&facets=age_groups&facets=rental`
    //     );
    //     const data = res.data;
    //     console.log(data)

    //     const sellers: Seller[] = data.hits.map((hit: any) => ({
    //       id: hit.id,
    //       name: hit.store_name,
    //       email: hit.registered_email,
    //       area: hit.area,
    //       address: hit.address,
    //       city: hit.city,
    //       store_types: hit.store_types || [],
    //       genders: hit.genders || [],
    //       curr_section: hit.curr_section || 0,
    //       created_at: hit.created_at ? new Date(hit.created_at) : undefined,
    //       outfits: hit.outfits || [],
    //       status: hit.active,
    //     }));

    //     setSellers(sellers);
    //     setFilteredSellers(sellers);

    //     const newFacets: Facets = {
    //       area: Object.entries(data.facets?.area || {}),
    //       city: Object.entries(data.facets?.city || {}),
    //       store_types: Object.entries(data.facets?.store_types || {}),
    //       genders: Object.entries(data.facets?.genders || {}),
    //       outfits: Object.entries(data.facets?.outfits || {}),
    //     };

    //     setFacets(newFacets);
    //   } catch (error) {
    //     console.error("Failed to fetch sellers:", error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    fetchSellers({
      query: debouncedSearch,
      page: currentPage,
      limit: itemsPerPage,
      sortField: sortConfig?.key,
      sortDirection: sortConfig?.direction === "ascending" ? "asc" : "desc",
      filters: selectedFacets,
    });
  }, [debouncedSearch, currentPage, itemsPerPage, sortConfig, selectedFacets]);

  // Handle search
  const handleSearch = (query: string) => {
    setSearch(query);
    setCurrentPage(1);
  };

  // Handle facet selection
  const handleFacetChange = (facet: string, value: string) => {
    const newSelectedFacets = { ...selectedFacets };
    if (newSelectedFacets[facet]?.includes(value)) {
      newSelectedFacets[facet] = newSelectedFacets[facet].filter(
        (v) => v !== value
      );
    } else {
      newSelectedFacets[facet] = [...(newSelectedFacets[facet] || []), value];
    }

    setSelectedFacets(newSelectedFacets);
    filterSellers(newSelectedFacets);
    setCurrentPage(1);
  };

  // Filter sellers based on selected facets
  const filterSellers = (selectedFacets: { [key: string]: string[] }) => {
    const filtered = sellers.filter((seller) => {
      const matchesFacets = Object.keys(selectedFacets).every((facet) => {
        const selected = selectedFacets[facet];
        const sellerValue = seller[facet as keyof Seller];

        if (selected.length === 0) return true;

        if (Array.isArray(sellerValue)) {
          return sellerValue.some((val) => selected.includes(val));
        } else {
          return selected.includes(String(sellerValue));
        }
      });

      return matchesFacets;
    });

    setFilteredSellers(filtered);
  };

  // Handle CSV upload
  const handleUploadCSV = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      toast.error("Please select a CSV file");
      return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
      const text = event.target?.result as string;
      const lines = text.split("\n");
      const uploaded: Seller[] = lines
        .slice(1)
        .map((line) => {
          const [id, name, email, location, category, status] = line.split(",");
          return {
            id: String(id),
            name: name?.trim(),
            email: email?.trim(),
            location: location?.trim(),
            category: category?.trim(),
            status: status?.trim() === 'true',
          };
        })
        .filter((s) => s.name && s.email);

      setSellers(uploaded);
      setFilteredSellers(uploaded);
      setCurrentPage(1);

      const newFacets: Facets = {
        location: [...new Set(uploaded.map((s) => s.location).filter(Boolean))].map(item => [item!, 1]),
        category: [...new Set(uploaded.map((s) => s.category).filter(Boolean))].map(item => [item!, 1]),
        status: [...new Set(uploaded.map((s) => String(s.status)))].map(item => [item, 1]),
        email: [...new Set(uploaded.map((s) => s.email))].map(item => [item, 1]),
        name: [...new Set(uploaded.map((s) => s.name).filter(Boolean))].map(item => [item!, 1]),
      };
      setFacets(newFacets);
    };
    reader.readAsText(file);
  };

  // Handle CSV download
  const handleDownloadCSV = () => {
    const header = "id,name,email,area,city,status\n";
    const rows = filteredSellers
      .map(
        (s) =>
          `${s.id},${s.name},${s.email},${s.area},${s.city},${s.status}`
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "sellers.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  // Toggle view all facets
  const toggleViewAll = (facet: string) => {
    setViewAll(prev => ({
      ...prev,
      [facet]: !prev[facet]
    }));
  };

  // Request sort
  const requestSort = (key: keyof Seller) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Sort sellers
  const sortedSellers = useMemo(() => {
    if (!sortConfig) return filteredSellers;

    return [...filteredSellers].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      const aString = Array.isArray(aValue) ? aValue.join(', ') : String(aValue || '');
      const bString = Array.isArray(bValue) ? bValue.join(', ') : String(bValue || '');

      if (aString < bString) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aString > bString) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredSellers, sortConfig]);

  // Pagination logic
  // const totalItems = sortedSellers.length;
  // const totalPages = Math.ceil(totalItems / itemsPerPage);
  // const indexOfLastItem = currentPage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentItems = sortedSellers.slice(indexOfFirstItem, indexOfLastItem);

  // console.log(currentItems)
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Get sort direction indicator
  const getSortIndicator = (key: keyof Seller) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
  };

  // const handleClickView = (id: string) => {
  //     console.log(id);
  // };

  // const handleLocationRoute = () => {
  //      console.log(locationUrl);
  //      window.open(locationUrl, '_blank', 'noopener,noreferrer');
  //   };
  console.log("bas teri bas teri", selectedFacets);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="w-full max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 mb-8 p-8">
          <div className="flex items-center justify-center mb-6">
            <Users className="w-8 h-8 text-shadow-gray-700 mr-3" />
            <h1 className="text-4xl font-bold text-shadow-gray-700">
              Seller CRM Dashboard
            </h1>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-4 justify-center items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search sellers..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 pr-4 py-3 w-80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            <label className="cursor-pointer bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all flex items-center gap-2 shadow-md">
              <Upload className="w-5 h-5" />
              Upload CSV
              <input
                type="file"
                accept=".csv"
                onChange={handleUploadCSV}
                className="hidden"
              />
            </label>

            <button
              onClick={handleDownloadCSV}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all flex items-center gap-2 shadow-md"
            >
              <Download className="w-5 h-5" />
              Download CSV
            </button>

            {selectedSellerIds.length > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleBulkStatusChange(true)}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Activate ({selectedSellerIds.length})
                </button>
                <button
                  onClick={() => handleBulkStatusChange(false)}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Deactivate ({selectedSellerIds.length})
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <div className={`transition-all duration-300 ${showFilters ? 'w-80' : 'w-12'}`}>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-600" />
                  {showFilters && <h2 className="text-xl font-semibold text-gray-800">Filters</h2>}
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {showFilters ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>

              <div className="flex flex-wrap gap-2 max-w-xs">
                {Object.keys(selectedFacets).length > 0 && (
                  <div className="mb-6 flex flex-wrap gap-2">
                    {Object.entries(selectedFacets).flatMap(([facet, values]) =>
                      values.map((value) => (
                        <div
                          key={`${facet}-${value}`}
                          className="flex items-center text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
                        >
                          <span className="capitalize mr-1">
                            {facet.replace('_', ' ')}: {value}
                          </span>
                          <button
                            onClick={() => handleFacetChange(facet, value)}
                            className="ml-1 text-blue-500 hover:text-blue-700 focus:outline-none"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {showFilters && Object.keys(facets).map((facet) => (
                <div key={facet} className="mb-6">
                  <h3 className="text-base font-semibold text-gray-700 mb-3 capitalize">
                    {facet.replace('_', ' ')}
                  </h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {facets[facet]
                      .slice(0, viewAll[facet] ? facets[facet].length : 5)
                      .map(([value, count]) => (
                        <label
                          key={value}
                          className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={selectedFacets[facet]?.includes(value) || false}
                            onChange={() => handleFacetChange(facet, value)}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700 flex-1">
                            {value}
                          </span>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {count}
                          </span>
                        </label>
                      ))}
                    {facets[facet].length > 5 && (
                      <button
                        onClick={() => toggleViewAll(facet)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        {viewAll[facet] ? "Show Less" : `View All (${facets[facet].length})`}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              {/* Table Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    Showing {(currentPage - 1) * itemsPerPage + 1}-
                    {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
                    {totalItems} sellers
                  </span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="5">5 per page</option>
                    <option value="10">10 per page</option>
                    <option value="20">20 per page</option>
                    <option value="50">50 per page</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left">
                          <input
                            type="checkbox"
                            onChange={(e) =>
                              setSelectedSellerIds(
                                e.target.checked
                                  ? sellers.map((s) => s.id!).filter(Boolean)
                                  : []
                              )
                            }
                            checked={
                              selectedSellerIds.length > 0 &&
                              sellers.every((seller) =>
                                selectedSellerIds.includes(seller.id!)
                              )
                            }
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </th>
                        <th
                          className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => requestSort('name')}
                        >
                          <div className="flex items-center gap-2">
                            Name {getSortIndicator('name')}
                          </div>
                        </th>
                        <th
                          className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => requestSort('email')}
                        >
                          <div className="flex items-center gap-2">
                            Email {getSortIndicator('email')}
                          </div>
                        </th>
                        <th
                          className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => requestSort('area')}
                        >
                          <div className="flex items-center gap-2">
                            Area {getSortIndicator('area')}
                          </div>
                        </th>
                        <th
                          className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => requestSort('city')}
                        >
                          <div className="flex items-center gap-2">
                            City {getSortIndicator('city')}
                          </div>
                        </th>
                        {/* <th
                          className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => requestSort('created_at')}
                        >
                          <div className="flex items-center gap-2">
                            Created At {getSortIndicator('created_at')}
                          </div>
                        </th> */}
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Store Type</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Outfits</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                        <th
                          className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => requestSort('status')}
                        >
                          <div className="flex items-center gap-2">
                            Status {getSortIndicator('status')}
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {sellers.length === 0 ? (
                        <tr>
                          <td colSpan={10} className="px-6 py-12 text-center text-gray-500">
                            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-lg font-medium">No sellers found</p>
                            <p className="text-sm">Try adjusting your search or filters</p>
                          </td>
                        </tr>
                      ) : (
                        sellers.map((seller) => (
                          <tr key={seller.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <input
                                type="checkbox"
                                checked={isSelected(seller.id!)}
                                onChange={() => handleCheckboxChange(seller.id!)}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{seller.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{seller.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{seller.area}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{seller.city}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{seller.created_at ? seller.created_at?.toLocaleDateString() + " " + seller.created_at?.toLocaleTimeString() : "N/A"}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-wrap gap-1">
                                {seller.store_types?.map((type, idx) => (
                                  <span key={idx} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {type}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-wrap gap-1">
                                {seller.outfits?.map((outfit, idx) => (
                                  <span key={idx} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {outfit}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-wrap gap-1">
                                {seller.genders?.map((gender, idx) => (
                                  <span key={idx} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {gender}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-wrap gap-1">
                                {seller.curr_section !== undefined && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {/* {(seller.curr_section / 6) * 100}% */}
                                    {seller.curr_section} / 6
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${seller.status
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                                }`}>
                                {seller.status ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {/* <Link href={`/seller_dashboard/${seller.id}`} target="blank" rel="noopener noreferrer"> */}
                              <Link href={`/seller_dashboard?storeId=${encodeURIComponent(seller.id ?? "")}`} target="blank" rel="noopener noreferrer">
                                <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                // onClick={() => handleClickView(seller.id)}
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  View
                                </button>
                              </Link>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div>
                    <span className="text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => paginate(1)}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                    >
                      First
                    </button>
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                    >
                      Previous
                    </button>

                    {/* Page numbers */}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => paginate(pageNum)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                    >
                      Next
                    </button>
                    <button
                      onClick={() => paginate(totalPages)}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                    >
                      Last
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}