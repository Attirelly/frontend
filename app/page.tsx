"use client";
import { api } from "@/lib/axios";
import Link from "next/link";
import { useEffect, useState, ChangeEvent } from "react";

// import { api } from "@/lib/axios";

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
};

export default function Home() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [filteredSellers, setFilteredSellers] = useState<Seller[]>([]);
  const [search, setSearch] = useState("");
  const [selectedFacets, setSelectedFacets] = useState<{
    [key: string]: string[];
  }>({});
  const [facets, setFacets] = useState<{ [key: string]: string[] }>({});
  const [viewAll, setViewAll] = useState(false);
  const [selectedSellerIds, setSelectedSellerIds] = useState<string[]>([]);
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const isSelected = (id: string) => selectedSellerIds.includes(id);


  useEffect(() => {
  const handler = setTimeout(() => {
    setDebouncedSearch(search);
  }, 500);

  return () => {
    clearTimeout(handler);
  };
}, [search]);

  const handleCheckboxChange = (id: string) => {

    console.log("testing checkbox")
    setSelectedSellerIds((prev) =>
      prev.includes(id)
        ? prev.filter((sellerId) => sellerId !== id)
        : [...prev, id] 
    );
  };

  // Handle bulk status change
const handleBulkStatusChange = async (newStatus: boolean) => {
  // 1. Create a true copy of current state
  const originalFilteredSellers = JSON.parse(JSON.stringify(filteredSellers));
  const originalSellers = JSON.parse(JSON.stringify(sellers)) ; 
  
  // 2. Optimistic update with new array reference
  const updatedFilteredSellers = filteredSellers.map(seller => 
    selectedSellerIds.includes(seller.id!)
      ? { ...seller, status: newStatus } // Create new object
      : { ...seller } // Also clone unchanged sellers
  );
   const updatedSellers = sellers.map(seller => 
    selectedSellerIds.includes(seller.id!)
      ? { ...seller, status: newStatus } // Create new object
      : { ...seller } // Also clone unchanged sellers
  );

  
  // 3. Force state update with new array
  setSellers(updatedSellers);
  setFilteredSellers(updatedFilteredSellers)

  try {
    // 4. API call with proper error handling
    const response = await api.patch("/stores/bulk-active", {
      ids: selectedSellerIds,
      active: newStatus
    });
        
    // 5. Clear selection only after success
    setSelectedSellerIds([]);
    
    // 6. Single success notification
    alert(`Successfully ${newStatus ? "activated" : "deactivated"} stores`);
    
  } catch (error) {
    // 7. Proper rollback
    console.error("Update failed:", error);
    setSellers(originalSellers);
    setFilteredSellers(originalFilteredSellers)
    alert("Failed to update stores. Changes reverted.");
  }
};
  useEffect(() => {
  console.log("Sellers state changed:", sellers);
}, [sellers]);
  useEffect(() => {
    console.log("hello test")
    const fetchSellers = async (query: string, filters: string) => {
      try {
        const res = await api.get(
          `/search/search_store?query=${query}&facets=city&facets=area&facets=store_types&facets=outfits&facets=genders&facets=price_ranges&facets=age_groups&facets=rental`
        );
        const data = res.data;
        console.log("mydata", data);

        const sellers: Seller[] = data.hits.map((hit: any, index: number) => ({
          id: hit.id,
          name: hit.store_name,
          email: hit.registered_email, // not provided
          area: hit.area,
          address: hit.address,
          city: hit.city,
          store_types: hit.store_types ? hit.store_types : [],
          genders: hit.genders,
          outfits: hit.outfits,
          status: hit.active,
        }));

        setSellers(sellers);
        setFilteredSellers(sellers);

        const newFacets = {
          area: Object.entries(data.facets?.area || {}),
          city: Object.entries(data.facets?.city || {}),
          store_types: Object.entries(data.facets?.store_types || {}),
          genders: Object.entries(data.facets?.genders || {}),
          outfits: Object.entries(data.facets?.outfits || {}),
        };
        console.log("myfacets", newFacets);

        // Flatten and merge as needed
        setFacets(newFacets);
      } catch (error) {
        console.error("Failed to fetch sellers:", error);
      }
    };

    fetchSellers(debouncedSearch , "");
  }, [debouncedSearch]);

  const handleSearch = (query: string) => {
    setSearch(query);
    // filterSellers(query, selectedFacets);
  };

  const handleFacetChange = (facet: string, value: string) => {
    console.log("change facet", facet, value);

    const newSelectedFacets = { ...selectedFacets };
    if (newSelectedFacets[facet]?.includes(value)) {
      newSelectedFacets[facet] = newSelectedFacets[facet].filter(
        (v) => v !== value
      );
    } else {
      newSelectedFacets[facet] = [...(newSelectedFacets[facet] || []), value];
    }

    console.log("new facets", newSelectedFacets);

    setSelectedFacets(newSelectedFacets);
    filterSellers( newSelectedFacets);
  };

  const filterSellers = ( selectedFacets: any) => {
    const filtered = sellers.filter((seller) => {
      
      const matchesFacets = Object.keys(selectedFacets).every((facet) => {
        const selected = selectedFacets[facet];
        const sellerValue = seller[facet];
        console.log("sellervalue", seller);

        if (selected.length === 0) return true;

        if (Array.isArray(sellerValue)) {
          // Check if at least one selected value is in seller's values
          console.log("hello");
          return sellerValue.some((val) => selected.includes(val));
        } else {
          // Single value case
          return selected.includes(sellerValue);
        }
      });

      return  matchesFacets;
    });

    setFilteredSellers(filtered);
  };

  const handleUploadCSV = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
            status: status?.trim(),
          };
        })
        .filter((s) => s.name && s.email);

      setSellers(uploaded);
      setFilteredSellers(uploaded);

      const newFacets = {
        location: [...new Set(uploaded.map((s) => s.location))],
        category: [...new Set(uploaded.map((s) => s.category))],
        status: [...new Set(uploaded.map((s) => s.status))],
        email: [...new Set(uploaded.map((s) => s.email))],
        name: [...new Set(uploaded.map((s) => s.name))],
      };
      setFacets(newFacets);
    };
    reader.readAsText(file);
  };

  const handleDownloadCSV = () => {
    const header = "id,name,email,location,category,status\n";
    const rows = filteredSellers
      .map(
        (s) =>
          `${s.id},${s.name},${s.email},${s.location},${s.category},${s.status}`
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

  const toggleViewAll = () => {
    setViewAll(!viewAll);
  };

  return (
    <div className="w-[90%] mx-auto p-6 font-sans flex flex-col">
      <div>
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Seller CRM
        </h1>

        <div className="flex flex-wrap gap-4 justify-center items-center mb-8">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search Sellers"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <label className="cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
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
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
          >
            Download CSV
          </button>

          <button
            onClick={() => handleBulkStatusChange(true)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Mark Active ({selectedSellerIds.length})
          </button>
          <button
            onClick={() => handleBulkStatusChange(false)}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Mark Inactive ({selectedSellerIds.length})
          </button>
        </div>
      </div>
      <div className="flex flex-row gap-2">
        {/* Left Sidebar for Facets */}
        <div className="w-full md:w-[20%] p-6 border-2 border-solid border-gray-200 bg-gray-50  rounded-lg mb-8 md:mb-0">
          <h2 className="text-xl font-semibold mb-4">Filters</h2>

          {Object.keys(facets).map((facet) => (
            <div key={facet} className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                {facet.charAt(0).toUpperCase() + facet.slice(1)}
              </h3>
              <div className="space-y-2">
                {facets[facet]
                  .slice(0, viewAll ? facets[facet].length : 5)
                  .map((value) => (
                    <label
                      key={value[0]}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedFacets[facet]?.includes(value[0])}
                        onChange={() => handleFacetChange(facet, value[0])}
                        className="h-5 w-5 rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700 text-right">
                        {value[0]}
                      </span>
                      {/* <span className="text-sm text-gray-700 text-right">{value[1]}</span> */}
                    </label>
                  ))}
                {facets[facet].length > 5 && !viewAll && (
                  <button
                    onClick={toggleViewAll}
                    className="text-blue-600 underline text-sm"
                  >
                    View All
                  </button>
                )}
                {viewAll && facets[facet].length > 5 && (
                  <button
                    onClick={toggleViewAll}
                    className="text-blue-600 underline text-sm"
                  >
                    Show Less
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-x-auto">
          <div className="min-w-[1000px]">
            <table className="min-w-full table-auto border-2 border-solid border-gray-200">
              <thead className="bg-gray-100 text-gray-700 uppercase text-sm font-semibold">
                <tr>
                  <th className="px-4 py-3 border">
                    <input
                      type="checkbox"
                      onChange={(e) =>
                        setSelectedSellerIds(
                          e.target.checked
                            ? filteredSellers.map((s) => s.id!).filter(Boolean)
                            : []
                        )
                      }
                      checked={
                        selectedSellerIds.length === filteredSellers.length &&
                        filteredSellers.length > 0
                      }
                    />
                  </th>
                  <th className="px-6 py-3 border">Name</th>
                  <th className="px-6 py-3 border">Email</th>
                  <th className="px-6 py-3 border">Area</th>
                  <th className="px-6 py-3 border">City</th>
                  <th className="px-6 py-3 border">Store Type</th>
                  <th className="px-6 py-3 border">Outfits</th>
                  <th className="px-6 py-3 border">Gender</th>
                  <th className="px-6 py-3 border">Status</th>
                  <th className="px-6 py-3 border">Operation</th>
                </tr>
              </thead>
              <tbody>
                {filteredSellers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-gray-500">
                      No sellers found.
                    </td>
                  </tr>
                ) : (
                  filteredSellers.map((seller) => (
                    <tr key={seller.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 border text-center">
                        <input
                          type="checkbox"
                          checked={isSelected(seller.id)}
                          onChange={() => handleCheckboxChange(seller.id!)}
                        />
                      </td>
                      <td className="px-6 py-3 border">{seller.name}</td>
                      <td className="px-6 py-3 border">{seller.email}</td>
                      <td className="px-6 py-3 border">{seller.area}</td>
                      <td className="px-6 py-3 border">{seller.city}</td>
                      <td className="px-6 py-3 border">
                        {seller?.store_types?.join(" , ")}
                      </td>
                      <td className="px-6 py-3 border">
                        {seller?.outfits?.join(" , ")}
                      </td>
                      <td className="px-6 py-3 border">
                        {seller?.genders?.join(" , ")}
                      </td>
                        <td className="px-6 py-3 border">
                          {seller.status ? "Active" : "Inactive"}
                        </td>
                      <td className="px-6 py-3 border text-center space-x-2">
                        <div className="flex gap-2 justify-center">
                          <Link href={`/store/${seller.id}`}>
                            <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-yellow-600">
                              View
                            </button>
                          </Link>
                          {/* <button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">
                            Edit
                          </button>
                          <button className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
                            Delete
                          </button> */}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
