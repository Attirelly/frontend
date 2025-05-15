"use client";

import { api } from "@/lib/axios";
import { useEffect, useState, ChangeEvent } from "react";

type Seller = {
  id: string;
  store_name: string;
  city: string;
  area: string;
  location: { lat: number; lng: number };
  image: string | null;
  store_types: string[];
  genders: string[];
  average_price_min: number;
  average_price_max: number;
  sponsor: number;
};

export default function Home() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [filteredSellers, setFilteredSellers] = useState<Seller[]>([]);
  const [search, setSearch] = useState<string>("");
  const [facets, setFacets] = useState<any>({});
  const [selectedFacets, setSelectedFacets] = useState<any>({});
  const [viewAll, setViewAll] = useState<boolean>(false);

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        console.log("Sending request to /api/sellers");
        const response = await api.get("/search/search_store");
        console.log(response)
        const fetchedSellers = response.data.hits.map((item: any) => ({
          id: item.id,
          store_name: item.store_name,
          city: item.city,
          area: item.area,
          location: item.location,
          image: item.image,
          store_types: item.store_types,
          genders: item.genders,
          average_price_min: item.average_price_min,
          average_price_max: item.average_price_max,
          sponsor: item.sponsor,
        }));

        setSellers(fetchedSellers);
        setFilteredSellers(fetchedSellers);

        // Set facets dynamically
        const newFacets = {
          city: [...new Set(fetchedSellers.map((seller) => seller.city))],
          area: [...new Set(fetchedSellers.map((seller) => seller.area))],
        };
        setFacets(newFacets);
      } catch (error) {
        console.error("Failed to fetch sellers:", error);
      }
    };

    fetchSellers();
  }, []);

  const handleSearch = (query: string) => {
    setSearch(query);
    filterSellers(query, selectedFacets);
  };

  const handleFacetChange = (facet: string, value: string) => {
    const newSelectedFacets = { ...selectedFacets };
    if (newSelectedFacets[facet]?.includes(value)) {
      newSelectedFacets[facet] = newSelectedFacets[facet].filter(
        (v: string) => v !== value
      );
    } else {
      newSelectedFacets[facet] = [...(newSelectedFacets[facet] || []), value];
    }
    setSelectedFacets(newSelectedFacets);
    filterSellers(search, newSelectedFacets);
  };

  const filterSellers = (searchQuery: string, selectedFacets: any) => {
    const filtered = sellers.filter((seller) => {
      const matchesSearch = seller.store_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesFacets = Object.keys(selectedFacets).every((facet) => {
        return (
          selectedFacets[facet].length === 0 ||
          selectedFacets[facet].includes(seller[facet])
        );
      });
      return matchesSearch && matchesFacets;
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
          const [id, store_name, city, area] = line.split(",");
          return {
            id,
            store_name,
            city,
            area,
            location: { lat: 0, lng: 0 },
            image: null,
            store_types: [],
            genders: [],
            average_price_min: 0,
            average_price_max: 0,
            sponsor: 1,
          };
        })
        .filter((s) => s.store_name);

      setSellers(uploaded);
      setFilteredSellers(uploaded);

      // Update facets
      const newFacets = {
        city: [...new Set(uploaded.map((seller) => seller.city))],
        area: [...new Set(uploaded.map((seller) => seller.area))],
      };
      setFacets(newFacets);
    };
    reader.readAsText(file);
  };

  const handleDownloadCSV = () => {
    const header = "id,store_name,city,area\n";
    const rows = filteredSellers
      .map((s) => `${s.id},${s.store_name},${s.city},${s.area}`)
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
    <div className="max-w-5xl mx-auto p-6 font-sans flex flex-col md:flex-row">
      {/* Left Sidebar for Facets */}
      <div className="w-full md:w-1/4 p-6 border-r bg-gray-50 shadow-lg rounded-lg mb-8 md:mb-0">
        <h2 className="text-xl font-semibold mb-4">Filters</h2>

        {Object.keys(facets).map((facet) => (
          <div key={facet} className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              {facet.charAt(0).toUpperCase() + facet.slice(1)}
            </h3>
            <div className="space-y-2">
              {facets[facet]
                .slice(0, viewAll ? facets[facet].length : 5)
                .map((value: string) => (
                  <label
                    key={value}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedFacets[facet]?.includes(value)}
                      onChange={() => handleFacetChange(facet, value)}
                      className="h-5 w-5 rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
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
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          🛍️ Seller Manager
        </h1>

        <div className="flex flex-wrap gap-4 justify-center items-center mb-8">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search sellers..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 17l-4 4m0 0l4-4m-4 4h16"
                />
              </svg>
            </div>
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
            ⬇️ Download CSV
          </button>
        </div>

        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="min-w-full table-auto border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">Store Name</th>
                <th className="p-4 text-left">City</th>
                <th className="p-4 text-left">Area</th>
                <th className="p-4 text-left">Price Range</th>
              </tr>
            </thead>
            <tbody>
              {filteredSellers.map((seller) => (
                <tr key={seller.id}>
                  <td className="p-4">{seller.store_name}</td>
                  <td className="p-4">{seller.city}</td>
                  <td className="p-4">{seller.area}</td>
                  <td className="p-4">
                    ₹{seller.average_price_min} - ₹{seller.average_price_max}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
