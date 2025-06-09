"use client";
import { api } from "@/lib/axios";
import Link from "next/link";
import { useEffect, useState, ChangeEvent, useMemo } from "react";

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
};

type SortConfig = {
  key: keyof Seller;
  direction: 'ascending' | 'descending';
};

export default function SellerCRM() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [filteredSellers, setFilteredSellers] = useState<Seller[]>([]);
  // const [displayedSellers, setDisplayedSellers] = useState<Seller[]>([]);
  const [search, setSearch] = useState("");
  const [selectedFacets, setSelectedFacets] = useState<{
    [key: string]: string[];
  }>({});
  const [facets, setFacets] = useState<{ [key: string]: string[] }>({});
  const [viewAll, setViewAll] = useState(false);
  const [selectedSellerIds, setSelectedSellerIds] = useState<string[]>([]);
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

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

  // Fetch sellers data
  useEffect(() => {
    const fetchSellers = async (query: string) => {
      try {
        const res = await api.get(
          `/search/search_store?query=${query}&facets=city&facets=area&facets=store_types&facets=outfits&facets=genders&facets=price_ranges&facets=age_groups&facets=rental`
        );
        const data = res.data;

        const sellers: Seller[] = data.hits.map((hit: any) => ({
          id: hit.id,
          name: hit.store_name,
          email: hit.registered_email,
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

        setFacets(newFacets);
      } catch (error) {
        console.error("Failed to fetch sellers:", error);
      }
    };

    fetchSellers(debouncedSearch);
  }, [debouncedSearch]);

  // Handle search
  const handleSearch = (query: string) => {
    setSearch(query);
    setCurrentPage(1); // Reset to first page on new search
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
    setCurrentPage(1); // Reset to first page on new filter
  };

  // Filter sellers based on selected facets
  const filterSellers = (selectedFacets) => {
    const filtered = sellers.filter((seller) => {
      const matchesFacets = Object.keys(selectedFacets).every((facet) => {
        const selected = selectedFacets[facet];
        const sellerValue = seller[facet as keyof Seller];

        if (selected.length === 0) return true;

        if (Array.isArray(sellerValue)) {
          return sellerValue.some((val) => selected.includes(val));
        } else {
          return selected.includes(sellerValue);
        }
      });

      return matchesFacets;
    });

    setFilteredSellers(filtered);
  };

  // Handle CSV upload
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
      setCurrentPage(1);

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

  // Handle CSV download
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

  // Toggle view all facets
  const toggleViewAll = () => {
    setViewAll(!viewAll);
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

      // Handle array values by joining them for comparison
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
  const totalItems = sortedSellers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedSellers.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Get sort direction indicator
  const getSortIndicator = (key: keyof Seller) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? '↑' : '↓';
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
            disabled={selectedSellerIds.length === 0}
          >
            Mark Active ({selectedSellerIds.length})
          </button>
          <button
            onClick={() => handleBulkStatusChange(false)}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
            disabled={selectedSellerIds.length === 0}
          >
            Mark Inactive ({selectedSellerIds.length})
          </button>
        </div>
      </div>
      <div className="flex flex-row gap-2">
        {/* Left Sidebar for Facets */}
        <div className="w-full md:w-[20%] p-6 border-2 border-solid border-gray-200 bg-gray-50 rounded-lg mb-8 md:mb-0">
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
                        {value[0]} ({value[1]})
                      </span>
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
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, totalItems)} of {totalItems} sellers
                </span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  <option value="5">5 per page</option>
                  <option value="10">10 per page</option>
                  <option value="20">20 per page</option>
                  <option value="50">50 per page</option>
                </select>
              </div>
            </div>

            <table className="min-w-full table-auto border-2 border-solid border-gray-200">
              <thead className="bg-gray-100 text-gray-700 uppercase text-sm font-semibold">
                <tr>
                  <th className="px-4 py-3 border">
                    <input
                      type="checkbox"
                      onChange={(e) =>
                        setSelectedSellerIds(
                          e.target.checked
                            ? currentItems.map((s) => s.id!).filter(Boolean)
                            : []
                        )
                      }
                      checked={
                        selectedSellerIds.length > 0 &&
                        currentItems.every((seller) => selectedSellerIds.includes(seller.id!))
                      }
                    />
                  </th>
                  <th
                    className="px-6 py-3 border cursor-pointer hover:bg-gray-200"
                    onClick={() => requestSort('name')}
                  >
                    <div className="flex items-center">
                      Name {getSortIndicator('name')}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 border cursor-pointer hover:bg-gray-200"
                    onClick={() => requestSort('email')}
                  >
                    <div className="flex items-center">
                      Email {getSortIndicator('email')}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 border cursor-pointer hover:bg-gray-200"
                    onClick={() => requestSort('area')}
                  >
                    <div className="flex items-center">
                      Area {getSortIndicator('area')}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 border cursor-pointer hover:bg-gray-200"
                    onClick={() => requestSort('city')}
                  >
                    <div className="flex items-center">
                      City {getSortIndicator('city')}
                    </div>
                  </th>
                  <th className="px-6 py-3 border">Store Type</th>
                  <th className="px-6 py-3 border">Outfits</th>
                  <th className="px-6 py-3 border">Gender</th>
                  <th
                    className="px-6 py-3 border cursor-pointer hover:bg-gray-200"
                    onClick={() => requestSort('created_at')}
                  >
                    <div className="flex items-center">
                      Created At {getSortIndicator('created_at')}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 border cursor-pointer hover:bg-gray-200"
                    onClick={() => requestSort('status')}
                  >
                    <div className="flex items-center">
                      Status {getSortIndicator('status')}
                    </div>
                  </th>
                  <th className="px-6 py-3 border">Operation</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="text-center py-6 text-gray-500">
                      No sellers found.
                    </td>
                  </tr>
                ) : (
                  currentItems.map((seller) => (
                    <tr key={seller.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 border text-center">
                        <input
                          type="checkbox"
                          checked={isSelected(seller.id!)}
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
                        {seller.created_at ? new Date(seller.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        }) : "-"}
                      </td>
                      <td className="px-6 py-3 border">
                        <span className={`px-2 py-1 rounded-full text-xs ${seller.status
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                          }`}>
                          {seller.status ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-3 border text-center space-x-2">
                        <div className="flex gap-2 justify-center">
                          <Link href={`/store/${seller.id}`}>
                            <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                              View
                            </button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
              <div>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => paginate(1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                >
                  First
                </button>
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
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
                      className={`px-3 py-1 rounded ${currentPage === pageNum ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-200 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                >
                  Next
                </button>
                <button
                  onClick={() => paginate(totalPages)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-200 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                >
                  Last
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}