"use client";
import { api } from "@/lib/axios";
import Link from "next/link";
import { useEffect, useState, ChangeEvent } from "react";

/**
 * @typedef {object} Customer
 * @description Defines the structure for a single customer's data.
 */
type Customer = {
  id: string;
  email: string;
  name: string;
  provider: string;
  gender: string;
  birthday: string;
  location: string;
  profile_pic: string;
  contact_number: string;
  created_at: string;
};

/**
 * A client-side component that provides a CRM interface for viewing and managing customer data.
 *
 * This component fetches a complete list of customers on mount and then provides client-side
 * tools for searching, filtering by date, and exporting the data. It's designed for administrative
 * purposes to get an overview of the customer base.
 *
 * ### State Management
 * - All state is managed locally within the component using React's `useState` and `useEffect` hooks.
 * - This includes the master list of `customers`, the `filteredCustomers` list for display, search terms, and date range filters.
 *
 * ### Features
 * - **Data Fetching**: Retrieves all customers from the API on initial load.
 * - **Client-Side Filtering**: Allows users to filter the customer list by a search query (name or contact number) and by a "created at" date range.
 * - **Debounced Search**: The search input is debounced by 500ms to prevent excessive re-filtering while the user is typing.
 * - **CSV Functionality**: Includes buttons to download the currently filtered list of customers as a CSV file and to upload a CSV to replace the current data.
 *
 * ### API Endpoint
 * **`GET /users/customer`**: Fetches the entire list of customer users. This endpoint is called once when the component mounts.
 *
 * @returns {JSX.Element} A fully interactive CRM page for customer management.
 */
export default function CustomerPage() {
  // --- Local State ---
  // The master list of all customers fetched from the API.
  const [customers, setCustomers] = useState<Customer[]>([]);
  // The list of customers displayed to the user after applying filters.
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  // State for the main search input.
  const [search, setSearch] = useState("");
  // State for the debounced search term that triggers filtering.
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  // State for the date range filter inputs.
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  // State for tracking selected customers via checkboxes.
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<string[]>([]);

  const isSelected = (id: string) => selectedCustomerIds.includes(id);
  const hasFilters = search || debouncedSearch || startDate || endDate;

  /**
   * Clears all active search and date filters, resetting the view to the full customer list.
   */
  const clearAllFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setStartDate("");
    setEndDate("");
  };

  /**
   * This effect debounces the user's search input. It waits for 500ms after the user
   * stops typing before updating the `debouncedSearch` state, which triggers the filtering logic.
   */
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    // Cleanup function to clear the timeout if the user types again within the 500ms window.

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  /**
   * This effect fetches the initial list of all customers from the API when the component first mounts.
   */
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await api.get(`users/customer`);
        const data = res.data;

        setCustomers(data);
        setFilteredCustomers(data);
      } catch (error) {
        console.error("Failed to fetch customers:", error);
      }
    };

    fetchCustomers();
  }, [debouncedSearch]);

  const handleSearch = (query: string) => {
    setSearch(query);
  };

  /**
   * This effect re-applies all client-side filters whenever the debounced search term,
   * the master customer list, or the date range changes.
   */
  useEffect(() => {
    filterCustomers(debouncedSearch);
  }, [debouncedSearch, customers, startDate, endDate]);

  const filterCustomers = (searchQuery: string) => {
    const filtered = customers.filter((customer) => {
      const query = searchQuery.toLowerCase();

      const nameMatch = (customer.name || "").toLowerCase().includes(query);
      const mobileMatch = (customer.contact_number || "")
        .toLowerCase()
        .includes(query); // assuming mobile is a string

      const customerDate = new Date(customer.created_at);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      const inRange =
        (!start || customerDate >= start) && (!end || customerDate <= end);

      return (nameMatch || mobileMatch) && inRange;
    });

    setFilteredCustomers(filtered);
  };

  const handleCheckboxChange = (id: string) => {
    setSelectedCustomerIds((prev) =>
      prev.includes(id)
        ? prev.filter((customerId) => customerId !== id)
        : [...prev, id]
    );
  };

  const handleUploadCSV = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
      const text = event.target?.result as string;
      const lines = text.split("\n");
      const uploaded: Customer[] = lines
        .slice(1)
        .map((line) => {
          const [
            id,
            email,
            name,
            provider,
            gender,
            birthday,
            location,
            profile_pic,
            contact_number,
            created_at,
          ] = line.split(",");
          return {
            id: String(id),
            email: email?.trim(),
            name: name?.trim(),
            provider: provider?.trim(),
            gender: gender?.trim(),
            birthday: birthday?.trim(),
            location: location?.trim(),
            profile_pic: profile_pic?.trim(),
            contact_number: contact_number?.trim(),
            created_at: created_at?.trim(),
          };
        })
        .filter((c) => c.email && c.name);

      setCustomers(uploaded);
      setFilteredCustomers(uploaded);
    };
    reader.readAsText(file);
  };
  /**
   * Generates and triggers the download of a CSV file containing the currently filtered customers.
   */
  const handleDownloadCSV = () => {
    const header =
      "id,email,name,provider,gender,birthday,location,profile_pic,contact_number,created_at\n";
    const rows = filteredCustomers
      .map(
        (c) =>
          `${c.id},${c.email},${c.name},${c.provider},${c.gender},${c.birthday},${c.location},${c.profile_pic},${c.contact_number},${c.created_at}`
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "customers.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  // const toggleViewAll = () => {
  //   setViewAll(!viewAll);
  // };

  return (
    <div className="w-full font-sans flex flex-col">
      <div>
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Customer CRM
        </h1>

        <div className="flex flex-wrap gap-4 justify-center items-center mb-8">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search Customers"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="border border-gray-300 rounded px-4 py-2 w-full placeholder:text-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        </div>
      </div>
      <div
        // className="flex flex-row gap-2"
        className="flex flex-col md:flex-row gap-4 w-full"
      >
        {/* Left Sidebar for Facets */}
        <div className="w-full md:w-[15%] p-4 border-2 border-solid border-gray-200 bg-gray-50 rounded-lg mb-8 md:mb-0">
          <h2 className="text-xl font-semibold mb-4 text-black">Filters</h2>
          <div>
            <div className="text-black">Start Date</div>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-300 rounded px-4 placeholder:text-gray-400 text-black py-2 w-full max-w-full"
              placeholder="Start Date"
            />
          </div>

          <div>
            <div className="text-black">End Date</div>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-300 rounded px-4 placeholder:text-gray-400 text-black  py-2 w-full max-w-full"
              placeholder="End Date"
            />
          </div>
          <div>
            {/* Clear All Filters Button - Only shows when filters are active */}
            {hasFilters && (
              <button
                onClick={clearAllFilters}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition flex items-center gap-2 mt-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Clear All
              </button>
            )}
          </div>
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
                        setSelectedCustomerIds(
                          e.target.checked
                            ? filteredCustomers.map((c) => c.id)
                            : []
                        )
                      }
                      checked={
                        selectedCustomerIds.length ===
                          filteredCustomers.length &&
                        filteredCustomers.length > 0
                      }
                    />
                  </th>
                  <th className="px-4 py-3 border">Name</th>
                  <th className="px-4 py-3 border">Email</th>
                  <th className="px-4 py-3 border">Provider</th>
                  <th className="px-4 py-3 border">Gender</th>
                  <th className="px-4 py-3 border">Birthday</th>
                  <th className="px-4 py-3 border">Location</th>
                  <th className="px-4 py-3 border">Contact</th>
                  <th className="px-4 py-3 border">Created At</th>
                  <th className="px-4 py-3 border">Operation</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="text-center py-6 text-gray-500">
                      No customers found.
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 border text-center text-black">
                        <input
                          type="checkbox"
                          checked={isSelected(customer.id)}
                          onChange={() => handleCheckboxChange(customer.id)}
                        />
                      </td>
                      <td className="px-4 py-3 border text-black">
                        {customer.name}
                      </td>
                      <td className="px-4 py-3 border text-black">
                        {customer.email}
                      </td>
                      <td className="px-4 py-3 border text-black">
                        {customer.provider}
                      </td>
                      <td className="px-4 py-3 border text-black">
                        {customer.gender}
                      </td>
                      <td className="px-4 py-3 border text-black">
                        {customer.birthday}
                      </td>
                      <td className="px-4 py-3 border text-black">
                        {customer.location}
                      </td>
                      <td className="px-4 py-3 border text-black">
                        {customer.contact_number}
                      </td>
                      <td className="px-4 py-3 border text-black">
                        {new Date(customer.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 border text-center space-x-2 text-black">
                        <div className="flex gap-2 justify-center">
                          <Link
                            href={`/customer/${customer.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-yellow-600">
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
          </div>
        </div>
      </div>
    </div>
  );
}
