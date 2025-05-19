// "use client";
// import { InstantSearch, SearchBox, RefinementList, Pagination, SortBy, Configure , useHits } from 'react-instantsearch';
// import {liteClient as algoliasearch }  from 'algoliasearch/lite';
// import { api } from "@/lib/axios";
// import Link from "next/link";
// import { useEffect, useState, ChangeEvent } from "react";

// const searchClient = algoliasearch(
//   process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || 'latency',
//   process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY || '6be0576ff61c053d5f9a3225e2a90f76'
// );

// type Seller = {
//   id?: string;
//   objectID?: string;
//   name?: string;
//   email: string;
//   area?: string;
//   city?: string;
//   store_types?: string[];
//   outfits?: string[];
//   genders?: string[];
//   status?: boolean;
// };

// export default function Home() {
//   const [selectedSellerIds, setSelectedSellerIds] = useState<string[]>([]);
//   const [localSellers, setLocalSellers] = useState<Seller[]>([]);
//   const isSelected = (id: string) => selectedSellerIds.includes(id);

//   const handleCheckboxChange = (id: string) => {
//     setSelectedSellerIds((prev) =>
//       prev.includes(id)
//         ? prev.filter((sellerId) => sellerId !== id)
//         : [...prev, id]
//     );
//   };

//   const handleBulkStatusChange = async (newStatus: boolean) => {
//     try {
//       await api.patch("/stores/bulk-active", {
//         ids: selectedSellerIds,
//         active: newStatus
//       });
//       setSelectedSellerIds([]);
//       alert(`Successfully ${newStatus ? "activated" : "deactivated"} stores`);
//     } catch (error) {
//       console.error("Update failed:", error);
//       alert("Failed to update stores");
//     }
//   };

//   const handleUploadCSV = (e: ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = function (event) {
//       const text = event.target?.result as string;
//       const lines = text.split("\n");
//       const uploaded: Seller[] = lines.slice(1).map((line) => {
//         const [id, name, email, location, category, status] = line.split(",");
//         return {
//           id: String(id),
//           objectID: String(id),
//           name: name?.trim(),
//           email: email?.trim(),
//           location: location?.trim(),
//           category: category?.trim(),
//           status: status?.trim() === 'true',
//         };
//       }).filter((s) => s.name && s.email);

//       setLocalSellers(uploaded);
//     };
//     reader.readAsText(file);
//   };

//   const handleDownloadCSV = () => {
//     const header = "id,name,email,location,category,status\n";
//     const rows = localSellers.map((s) =>
//       `${s.id},${s.name},${s.email},${s.location},${s.category},${s.status}`
//     ).join("\n");
//     const blob = new Blob([header + rows], { type: "text/csv" });
//     const url = URL.createObjectURL(blob);

//     const link = document.createElement("a");
//     link.href = url;
//     link.download = "sellers.csv";
//     link.click();
//     URL.revokeObjectURL(url);
//   };
//   interface TableHitsProps {
//   isSelected: (id: string) => boolean;
//   handleCheckboxChange: (id: string) => void;
// }

//   function TableHits({ isSelected, handleCheckboxChange }:TableHitsProps) {
//   const { hits } = useHits();

  

//   return (
//     <>
//       {hits.length === 0 ? (
//         <tr>
//           <td colSpan={10} className="text-center py-6 text-gray-500">
//             No sellers found.
//           </td>
//         </tr>
//       ) : (
//         hits.map((hit: any) => (
//           <tr key={hit.objectID} className="hover:bg-gray-50">
//             <td className="px-4 py-3 border text-center">
//               <input
//                 type="checkbox"
//                 checked={isSelected(hit.id)}
//                 onChange={() => handleCheckboxChange(hit.id)}
//               />
//             </td>
//             <td className="px-6 py-3 border">{hit.name}</td>
//             <td className="px-6 py-3 border">{hit.email}</td>
//             <td className="px-6 py-3 border">{hit.area}</td>
//             <td className="px-6 py-3 border">{hit.city}</td>
//             <td className="px-6 py-3 border">
//               {hit?.store_types?.join(', ')}
//             </td>
//             <td className="px-6 py-3 border">
//               {hit?.outfits?.join(', ')}
//             </td>
//             <td className="px-6 py-3 border">
//               {hit?.genders?.join(', ')}
//             </td>
//             <td className="px-6 py-3 border">
//               {hit.status ? 'Active' : 'Inactive'}
//             </td>
//             <td className="px-6 py-3 border text-center">
//               <div className="flex gap-2 justify-center">
//                 <Link href={`/store/${hit.id}`}>
//                   <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-yellow-600">
//                     View
//                   </button>
//                 </Link>
//               </div>
//             </td>
//           </tr>
//         ))
//       )}
//     </>
//   );
// }

//   // const TableHits = connectHits(({ hits }) => (
//   //   <>
//   //     {hits.length === 0 ? (
//   //       <tr>
//   //         <td colSpan={10} className="text-center py-6 text-gray-500">
//   //           No sellers found.
//   //         </td>
//   //       </tr>
//   //     ) : (
//   //       hits.map((hit: any) => (
//   //         <tr key={hit.objectID} className="hover:bg-gray-50">
//   //           <td className="px-4 py-3 border text-center">
//   //             <input
//   //               type="checkbox"
//   //               checked={isSelected(hit.id)}
//   //               onChange={() => handleCheckboxChange(hit.id)}
//   //             />
//   //           </td>
//   //           <td className="px-6 py-3 border">{hit.name}</td>
//   //           <td className="px-6 py-3 border">{hit.email}</td>
//   //           <td className="px-6 py-3 border">{hit.area}</td>
//   //           <td className="px-6 py-3 border">{hit.city}</td>
//   //           <td className="px-6 py-3 border">
//   //             {hit?.store_types?.join(" , ")}
//   //           </td>
//   //           <td className="px-6 py-3 border">
//   //             {hit?.outfits?.join(" , ")}
//   //           </td>
//   //           <td className="px-6 py-3 border">
//   //             {hit?.genders?.join(" , ")}
//   //           </td>
//   //           <td className="px-6 py-3 border">
//   //             {hit.status ? "Active" : "Inactive"}
//   //           </td>
//   //           <td className="px-6 py-3 border text-center space-x-2">
//   //             <div className="flex gap-2 justify-center">
//   //               <Link href={`/store/${hit.id}`}>
//   //                 <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-yellow-600">
//   //                   View
//   //                 </button>
//   //               </Link>
//   //             </div>
//   //           </td>
//   //         </tr>
//   //       ))
//   //     )}
//   //   </>
//   // ));

//   return (
//     <div className="w-[90%] mx-auto p-6 font-sans flex flex-col">
//       <div>
//         <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
//           Seller CRM
//         </h1>

//         <InstantSearch
//           searchClient={searchClient}
//           indexName="stores"
//         >
//           <Configure
//             hitsPerPage={50}
//             attributesToSnippet={['description:30']}
//             snippetEllipsisText="..."
//           />

//           <div className="flex flex-wrap gap-4 justify-center items-center mb-8">
//             <div className="relative w-full sm:w-64">
//               <SearchBox
//                 translations={{ placeholder: 'Search sellers...' }}
//                 className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             <label className="cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
//               Upload CSV
//               <input
//                 type="file"
//                 accept=".csv"
//                 onChange={handleUploadCSV}
//                 className="hidden"
//               />
//             </label>

//             <button
//               onClick={handleDownloadCSV}
//               className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
//             >
//               Download CSV
//             </button>

//             <button
//               onClick={() => handleBulkStatusChange(true)}
//               className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
//             >
//               Mark Active ({selectedSellerIds.length})
//             </button>
//             <button
//               onClick={() => handleBulkStatusChange(false)}
//               className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
//             >
//               Mark Inactive ({selectedSellerIds.length})
//             </button>
//           </div>

//           <div className="flex flex-row gap-2">
//             {/* Left Sidebar for Facets */}
//             <div className="w-full md:w-[20%] p-6 border-2 border-solid border-gray-200 bg-gray-50 rounded-lg mb-8 md:mb-0">
//               <h2 className="text-xl font-semibold mb-4">Filters</h2>
//               <SortBy
//                 items={[
//                   { value: 'instant_search', label: 'Relevance' },
//                   { value: 'instant_search_created_at_asc', label: 'Oldest First' },
//                   { value: 'instant_search_created_at_desc', label: 'Newest First' },
//                 ]}
                
//               />F
//               <RefinementList attribute="city" />
//               <RefinementList attribute="area" />
//               <RefinementList attribute="store_types" />
//               <RefinementList attribute="genders" />
//             </div>

//             {/* Main Content */}
//             <div className="flex-1 overflow-x-auto">
//               <div className="min-w-[1000px]">
//                 <table className="min-w-full table-auto border-2 border-solid border-gray-200">
//                   <thead className="bg-gray-100 text-gray-700 uppercase text-sm font-semibold">
//                     <tr>
//                       <th className="px-4 py-3 border">
//                         <input
//                           type="checkbox"
//                           onChange={(e) =>
//                             setSelectedSellerIds(
//                               e.target.checked
//                                 ? localSellers.map((s) => s.id!).filter(Boolean)
//                                 : []
//                             )
//                           }
//                           checked={
//                             selectedSellerIds.length === localSellers.length &&
//                             localSellers.length > 0
//                           }
//                         />
//                       </th>
//                       <th className="px-6 py-3 border">Name</th>
//                       <th className="px-6 py-3 border">Email</th>
//                       <th className="px-6 py-3 border">Area</th>
//                       <th className="px-6 py-3 border">City</th>
//                       <th className="px-6 py-3 border">Store Type</th>
//                       <th className="px-6 py-3 border">Outfits</th>
//                       <th className="px-6 py-3 border">Gender</th>
//                       <th className="px-6 py-3 border">Status</th>
//                       <th className="px-6 py-3 border">Operation</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     <TableHits />
//                   </tbody>
//                 </table>
//                 <div className="mt-4">
//                   <Pagination />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </InstantSearch>
//       </div>
//     </div>
//   );
// }