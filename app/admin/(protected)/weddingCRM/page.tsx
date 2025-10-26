"use client";

import { useState, useEffect, ChangeEvent, useRef } from "react";
import {
  Search,
  Upload,
  Download,
  Users,
  Filter,
  ChevronDown,
  ChevronUp,
  Eye,
  Check,
  X,
} from "lucide-react";
// import { api } from "@/lib/axios"; // Removed for preview, mock below
// import Link from "next/link"; // Removed for preview, mock below
import { toast } from "sonner"; // Assuming you use sonner for toasts
import { api } from "@/lib/axios";


const Link: React.FC<React.PropsWithChildren<{ href: string; className?: string }>> = ({
  href,
  className,
  children,
}) => (
  <a
    href={href}
    className={className}
    onClick={(e) => {
      e.preventDefault();
      toast.info(`Mock navigation to: ${href}`);
    }}
  >
    {children}
  </a>
);

type WeddingPlanner = {
  id?: string;
  status?: boolean;
  created_at?: string | null;
  onboarding_progress?: number; // Calculated field (0-100)

  // Section 1: Basic Information
  fullName: string;
  businessName: string;
  email: string;
  internalPhone: string;
  whatsappPhone: string;
  publicPhone: string;

  // Section 2: Business Profile & Scale
  clientPersona: string | null;
  weddingAestheticStyles: string[];
  baseLocation: string;
  primaryCities: string[];
  averageWeddingBudget: string | null;
  weddingsManagedLastYear: string | null;
  averageGuestSize: string | null;
  yearsOfExperience: string | null;
  teamSize: string | null;

  // Section 3: Influence & Network
  clientAcquisationMethods: string[];
  assistsWithOutfits: boolean;
  recommendsDesigners: boolean;
  partnerDesigners: string[];
  bridesGuidedPerYear: string | null;
  collaboratesWithStylistsMuas: boolean;
  recommendedFashionCategories: string[];
  partnerVendorHandles: Record<string, string>; // Will be stringified for CSV
  referralPotential: string | null;

  // Section 4: Collaboration Preferences
  interestedInCollaborationsWith: string[];
  preferredCollaborationType: string[];
  preferredCommissionModel: string | null;
  barterAcceptance: "Yes" | "No" | "Depends" | null;
  monthlyCollaborationsOpenTo: string | null;

  // Section 5: Social Links & Insights
  instagramUrl: string;
  youtubeLink: string;
  websiteUrl: string;
  facebookLink: string;
  totalFollowers: string | null;
  totalPosts: string | null;
  engagementRate: string | null;
  averageStoryViews: string | null;
  averageReelViews: string | null;
};

/**
 * @typedef {object} SortConfig
 * @description Defines the state for server-side sorting of the table.
 */
type SortConfig = {
  key: keyof WeddingPlanner; // Use the keys from our flat type
  direction: "ascending" | "descending";
};

/**
 * @typedef {[string, number]} FacetEntry
 * @description Represents a single facet value and its count (e.g., ['Mumbai', 25]).
 */
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
  sort_by: string; // From your original code, assuming this is still needed
};

// A simple progress bar component to be used inside the table
const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => {
  const safeProgress = Math.max(0, Math.min(100, progress));
  let bgColor = "bg-blue-600";
  if (safeProgress < 30) bgColor = "bg-red-600";
  else if (safeProgress < 70) bgColor = "bg-yellow-500";
  else if (safeProgress === 100) bgColor = "bg-green-600";

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div
        className={`h-2.5 rounded-full transition-all duration-500 ${bgColor}`}
        style={{ width: `${safeProgress}%` }}
      ></div>
    </div>
  );
};

// Main Component
export default function WeddingPlannerCRM() {
  // const { sortBy } = useAdminStore(); // Assuming you have this store
  const sortBy = "default_sort"; // Placeholder since useAdminStore wasn't provided

  const [planners, setPlanners] = useState<WeddingPlanner[]>([]);
  const [search, setSearch] = useState("");
  const [selectedFacets, setSelectedFacets] = useState<{
    [key: string]: string[];
  }>({});
  const [facets, setFacets] = useState<Facets>({});
  const [viewAll, setViewAll] = useState<{ [key: string]: boolean }>({});
  const [selectedPlannerIds, setSelectedPlannerIds] = useState<string[]>([]);
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [totalItems, setTotalItems] = useState(0);

  /**
   * Builds the facet filter string required by the backend search API.
   * The keys (e.g., 'base_location') are expected to be in snake_case.
   */
  const buildFacetFilters = (facets: Record<string, string[]>): string => {
    const filters: string[][] = [];
    for (const key in facets) {
      if (facets[key].length > 0) {
        // Special case for 'status' filter, map to 'published'
        const filterKey = key === 'status' ? 'published' : key;
        filters.push(facets[key].map((value) => `${filterKey}:${value}`));
      }
    }
    return encodeURIComponent(JSON.stringify(filters));
  };

  /**
   * Checks if a specific planner ID is in the selection list.
   */
  const isSelected = (id: string) => selectedPlannerIds.includes(id);

  /**
   * Debounces the user's search input to avoid excessive API calls.
   */
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1); // Reset to first page on new search
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  /**
   * Handles selecting/deselecting a single planner checkbox.
   */
  const handleCheckboxChange = (id: string) => {
    setSelectedPlannerIds((prev) =>
      prev.includes(id)
        ? prev.filter((plannerId) => plannerId !== id)
        : [...prev, id]
    );
  };

  /**
   * Handles the bulk status change (Activate/Deactivate) for all selected planners.
   */
  const handleBulkStatusChange = async (newStatus: boolean) => {
    if (selectedPlannerIds.length === 0) return;

    // Optimistic UI update
    const originalPlanners = JSON.parse(JSON.stringify(planners));
    const updatedPlanners = planners.map((planner) =>
      selectedPlannerIds.includes(planner.id!)
        ? { ...planner, status: newStatus }
        : planner
    );
    setPlanners(updatedPlanners);

    try {
      // --- API Endpoint Update ---
      await api.patch("/planners/bulk-active", {
        ids: selectedPlannerIds,
        active: newStatus,
      });

      setSelectedPlannerIds([]);
      toast.success(
        `Successfully ${
          newStatus ? "activated" : "deactivated"
        } ${selectedPlannerIds.length} planners.`
      );
    } catch (error) {
      console.error("Bulk update failed:", error);
      setPlanners(originalPlanners); // Revert on failure
      toast.error("Failed to update planners. Changes reverted.");
    }
  };

  const fetchPlanners = async (params: QueryParams) => {
    setLoading(true);
    try {
      // --- Sort Parameter Fix ---
      // Added sortParams to the request URL.
      const sortParams = params.sortField
        ? `&sortField=${params.sortField}&sortDirection=${
            params.sortDirection || "asc"
          }`
        : "";

      const algoia_facets = buildFacetFilters(selectedFacets);

      // --- API Endpoint Update ---
      // Using the real API endpoint
      const res: any = await api.get( 
        `/search/search_wedding_planners?query=${params.query || ""}&page=${
          (params.page || 1) - 1
        }&limit=${
          params.limit || 50
        }&facetFilters=${algoia_facets}&sort_by=${params.sort_by}${sortParams}`
      );

      const data = res.data;
      setTotalItems(data.total_hits);
      setTotalPages(data.total_pages);

      // --- 3. DATA MAPPING ---
      // Maps the flat API response (snake_case) to our flat WeddingPlanner type (camelCase).
      const plannersData: WeddingPlanner[] = data.hits.map((hit: any) => {
        
        // Calculate onboarding progress (example logic)
        // Updated maxSteps to 6 based on sample data
        const maxSteps = 6; 
        const currentStep = hit.onboarding_step || 0;
        const progress = Math.min(100, Math.round((currentStep / maxSteps) * 100));

        return {
          id: hit.id, // From WeddingPlannerOut
          
          // Updated status logic: Check for 'status', then 'active', then default to false.
          // Your sample 'published' facet suggests this field exists.
          status: hit.status !== undefined ? hit.status : (hit.active !== undefined ? hit.active : false),

          created_at: hit.created_at ? new Date(hit.created_at) : undefined,
          onboarding_progress: progress,

          // Section 1: Basic Information
          fullName: hit.full_name || "",
          businessName: hit.business_name || "",
          email: hit.email || "",
          internalPhone: hit.internal_phone || "",
          whatsappPhone: hit.whatsapp_phone || "",
          publicPhone: hit.public_phone || "",

          // Section 2: Business Profile & Scale
          clientPersona: hit.client_persona || null,
          weddingAestheticStyles: hit.wedding_aesthetic_styles || [],
          baseLocation: hit.base_location || "",
          primaryCities: hit.primary_cities || [],
          averageWeddingBudget: hit.average_wedding_budget || null,
          weddingsManagedLastYear: hit.weddings_managed_last_year || null,
          averageGuestSize: hit.average_guest_size || null,
          yearsOfExperience: hit.years_of_experience || null,
          teamSize: hit.team_size || null,

          // Section 3: Influence & Network
          clientAcquisationMethods: hit.client_acquisation_methods || [],
          assistsWithOutfits: hit.assists_with_outfits || false,
          recommendsDesigners: hit.recommends_designers || false,
          partnerDesigners: hit.partner_designers || [],
          bridesGuidedPerYear: hit.brides_guided_per_year || null,
          collaboratesWithStylistsMuas: hit.collaborates_with_stylists_muas || false,
          recommendedFashionCategories: hit.recommended_fashion_categories || [],
          partnerVendorHandles: hit.partner_vendor_handles || {},
          referralPotential: hit.referral_potential || null,

          // Section 4: Collaboration Preferences
          interestedInCollaborationsWith: hit.interested_in_collaborations_with || [],
          preferredCollaborationType: hit.preferred_collaboration_type || [],
          preferredCommissionModel: hit.preferred_commission_model || null,
          barterAcceptance: hit.barter_acceptance || null,
          monthlyCollaborationsOpenTo: hit.monthly_collaborations_open_to || null,

          // Section 5: Social Links & Insights
          instagramUrl: hit.instagram_url || "",
          youtubeLink: hit.youtube_link || "",
          websiteUrl: hit.website_url || "",
          facebookLink: hit.facebook_link || "",
          totalFollowers: hit.total_followers || null,
          totalPosts: hit.total_posts || null,
          engagementRate: hit.engagement_rate || null,
          averageStoryViews: hit.average_story_views || null,
          averageReelViews: hit.average_reel_views || null,
        };
      });

      setPlanners(plannersData);

      // --- 4. FACET MAPPING ---
      // Update to use snake_case keys from the API response, as defined
      // in your Pydantic model (WeddingPlannerFacets with extra='allow').
      const newFacets: Facets = {
        base_location: Object.entries(data.facets?.base_location || {}),
        primary_cities: Object.entries(data.facets?.primary_cities || {}),
        average_wedding_budget: Object.entries(
          data.facets?.average_wedding_budget || {}
        ),
        years_of_experience: Object.entries(
          data.facets?.years_of_experience || {}
        ),
        total_followers: Object.entries(
          data.facets?.total_followers || {}
        ),
        // Use 'published' from your Pydantic model for the 'status' filter
        // We'll map this key to 'status' for filtering
        status: Object.entries(data.facets?.published || {}),
      };
      setFacets(newFacets);
    } catch (error) {
      console.error("Failed to fetch planners:", error);
      toast.error("Failed to fetch planners. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Main data fetching effect.
   * Re-runs when search, filters, sorting, or pagination changes.
   */
  useEffect(() => {
    fetchPlanners({
      query: debouncedSearch,
      page: currentPage,
      limit: itemsPerPage,
      sortField: sortConfig?.key,
      sortDirection: sortConfig?.direction === "ascending" ? "asc" : "desc",
      filters: selectedFacets,
      sort_by: sortBy,
    });
  }, [
    debouncedSearch,
    currentPage,
    itemsPerPage,
    sortConfig,
    selectedFacets,
    sortBy,
  ]);

  /**
   * Handles search input changes.
   */
  const handleSearch = (query: string) => {
    setSearch(query);
  };

  /**
   * Handles facet checkbox changes.
   * This now *only* updates state, triggering the useEffect to re-fetch.
   */
  const handleFacetChange = (facet: string, value: string) => {
    setSelectedFacets((prev) => {
      const current = prev[facet] || [];
      const newSelectedFacets = { ...prev };

      if (current.includes(value)) {
        newSelectedFacets[facet] = current.filter((v) => v !== value);
      } else {
        newSelectedFacets[facet] = [...current, value];
      }
      return newSelectedFacets;
    });
    setCurrentPage(1); // Reset to first page on filter change
  };

  /**
   * Handles CSV upload.
   * Note: This is simplified to only handle a few key fields.
   */
  const handleUploadCSV = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      toast.error("Please select a CSV file");
      return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
      const text = event.target?.result as string;
      const lines = text.split("\n").slice(1); // Skip header

      const uploaded: WeddingPlanner[] = lines
        .map((line) => {
          try {
            // Simplified CSV structure (maps to camelCase)
            const [
              id,
              businessName,
              fullName,
              email,
              internalPhone,
              baseLocation,
              status,
            ] = line.split(",");

            if (!businessName || !email) return null; // Skip invalid lines

            return {
              id: String(id?.trim() || ""),
              businessName: businessName?.trim() || "",
              fullName: fullName?.trim() || "",
              email: email?.trim() || "",
              internalPhone: internalPhone?.trim() || "",
              baseLocation: baseLocation?.trim() || "",
              status: status?.trim().toLowerCase() === "true",

              // Add empty defaults for all other fields
              whatsappPhone: "",
              publicPhone: "",
              clientPersona: null,
              weddingAestheticStyles: [],
              primaryCities: [],
              averageWeddingBudget: null,
              weddingsManagedLastYear: null,
              averageGuestSize: null,
              yearsOfExperience: null,
              teamSize: null,
              clientAcquisationMethods: [],
              assistsWithOutfits: false,
              recommendsDesigners: false,
              partnerDesigners: [],
              bridesGuidedPerYear: null,
              collaboratesWithStylistsMuas: false,
              recommendedFashionCategories: [],
              partnerVendorHandles: {},
              referralPotential: null,
              interestedInCollaborationsWith: [],
              preferredCollaborationType: [],
              preferredCommissionModel: null,
              barterAcceptance: null,
              monthlyCollaborationsOpenTo: null,
              instagramUrl: "",
              youtubeLink: "",
              websiteUrl: "",
              facebookLink: "",
              totalFollowers: null,
              totalPosts: null,
              engagementRate: null,
              averageStoryViews: null,
              averageReelViews: null,
            };
          } catch (err) {
            console.warn("Skipping invalid CSV line:", line, err);
            return null;
          }
        })
        .filter(
          (p): p is WeddingPlanner => p !== null && !!p.businessName && !!p.email
        );

      setPlanners(uploaded);
      setCurrentPage(1);
      toast.success(`Uploaded ${uploaded.length} planners from CSV.`);

      // Simple facet generation from uploaded data (using snake_case)
      const newFacets: Facets = {
        base_location: [
          ...new Set(uploaded.map((p) => p.baseLocation).filter(Boolean)),
        ].map((item) => [item, 1]), // Note: count is just 1
      };
      setFacets(newFacets);
    };
    reader.readAsText(file);
  };

  /**
   * Handles CSV download.
   * Note: This is simplified to only include key fields (camelCase).
   */
  const handleDownloadCSV = () => {
    // Simplified header
    const header =
      "id,businessName,fullName,email,internalPhone,baseLocation,primaryCities,averageWeddingBudget,status\n";

    const rows = planners
      .map((p) => {
        // Escape commas in fields
        const escape = (str: string) => `"${str.replace(/"/g, '""')}"`;
        
        return [
          p.id,
          p.businessName,
          p.fullName,
          p.email,
          p.internalPhone,
          p.baseLocation,
          p.primaryCities.join("|"), // Use pipe for array
          p.averageWeddingBudget,
          p.status,
        ]
          .map((val) => (val ? escape(String(val)) : ""))
          .join(",");
      })
      .join("\n");

    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "wedding_planners.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  /**
   * Toggles the "View All" state for a given facet list.
   */
  const toggleViewAll = (facet: string) => {
    setViewAll((prev) => ({ ...prev, [facet]: !prev[facet] }));
  };

  /**
   * Sets the sorting configuration.
   */
  const requestSort = (key: keyof WeddingPlanner) => {
    let direction: "ascending" | "descending" = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  /**
   * Gets the visual indicator (up/down arrow) for a sorted column.
   */
  const getSortIndicator = (key: keyof WeddingPlanner) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === "ascending" ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  // --- JSX RENDER ---
  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="w-full max-w-full mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 mb-8 p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center justify-center mb-6 gap-3">
            <Users className="w-8 h-8 text-shadow-gray-700 text-black" />
            <h1 className="text-3xl md:text-4xl font-bold text-shadow-gray-700 text-black text-center">
              Wedding Planner CRM
            </h1>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-4 justify-center items-center">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search planners..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 pr-4 py-3 w-full border border-gray-200 placeholder:text-gray-400 text-black rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
                // Add key to reset file input
                key={Date.now()}
              />
            </label>

            <button
              onClick={handleDownloadCSV}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all flex items-center gap-2 shadow-md"
              disabled={planners.length === 0}
            >
              <Download className="w-5 h-5" />
              Download CSV
            </button>
          </div>

          {selectedPlannerIds.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center mt-4 border-t border-gray-100 pt-4">
              <button
                onClick={() => handleBulkStatusChange(true)}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Activate ({selectedPlannerIds.length})
              </button>
              <button
                onClick={() => handleBulkStatusChange(false)}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Deactivate ({selectedPlannerIds.length})
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters */}
          <div
            className={`transition-all duration-300 ${
              showFilters ? "lg:w-80 w-full" : "w-16"
            }`}
          >
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`flex items-center gap-2 transition-opacity ${
                    showFilters ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <Filter className="w-5 h-5 text-gray-600" />
                  <h2 className="text-xl font-semibold text-gray-800">
                    Filters
                  </h2>
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label={showFilters ? "Collapse filters" : "Expand filters"}
                >
                  {showFilters ? (
                    <ChevronDown className="w-5 h-5 text-black" />
                  ) : (
                    <Filter className="w-5 h-5 text-black" />
                  )}
                </button>
              </div>

              {/* Selected Filters Chips */}
              {showFilters && (
                <div className="flex flex-wrap gap-2 max-w-xs mb-4">
                  {Object.entries(selectedFacets).flatMap(([facet, values]) =>
                    values.map((value) => (
                      <div
                        key={`${facet}-${value}`}
                        className="flex items-center text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
                      >
                        {/* Convert snake_case to Title Case for display */}
                        <span className="capitalize mr-1">
                          {facet.replace(/_/g, " ")}: {value}
                        </span>
                        <button
                          onClick={() => handleFacetChange(facet, value)}
                          className="ml-1 text-blue-500 hover:text-blue-700 focus:outline-none"
                          aria-label={`Remove ${value} filter`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Facet Groups */}
              <div
                className={`transition-opacity ${
                  showFilters ? "opacity-100" : "opacity-0 hidden"
                }`}
              >
                {Object.keys(facets).length > 0 ? (
                  Object.keys(facets).map((facet) => (
                    <div key={facet} className="mb-6">
                      {/* Convert snake_case to Title Case for display */}
                      <h3 className="text-base font-semibold text-gray-700 mb-3 capitalize">
                        {facet.replace(/_/g, " ")} 
                      </h3>
                      <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
                        {facets[facet]
                          .slice(0, viewAll[facet] ? facets[facet].length : 5)
                          .map(([value, count]) => (
                            <label
                              key={value}
                              className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                            >
                              <input
                                type="checkbox"
                                checked={
                                  selectedFacets[facet]?.includes(String(value)) ||
                                  false
                                }
                                onChange={() => handleFacetChange(facet, String(value))}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-700 flex-1">
                                {String(value) || "N/A"}
                              </span>
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                {count}
                              </span>
                            </label>
                          ))}
                        {facets[facet].length > 5 && (
                          <button
                            onClick={() => toggleViewAll(facet)}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2"
                          >
                            {viewAll[facet]
                              ? "Show Less"
                              : `View All (${facets[facet].length})`}
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-500">
                    No filters available for the current search.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              {/* Table Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    Showing {(currentPage - 1) * itemsPerPage + 1}-
                    {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
                    {totalItems} planners
                  </span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="10">10 per page</option>
                    <option value="20">20 per page</option>
                    <option value="50">50 per page</option>
                    <option value="100">100 per page</option>
                  </select>
                </div>
                {/* <SortBySellerCRM /> Placeholder for your sort component */}
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="flex justify-center items-center py-24">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left">
                          <input
                            type="checkbox"
                            onChange={(e) =>
                              setSelectedPlannerIds(
                                e.target.checked
                                  ? planners.map((p) => p.id!).filter(Boolean)
                                  : []
                              )
                            }
                            checked={
                              planners.length > 0 &&
                              selectedPlannerIds.length === planners.length
                            }
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </th>
                        <th
                          className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => requestSort("fullName")}
                        >
                          <div className="flex items-center gap-2">
                            Name {getSortIndicator("fullName")}
                          </div>
                        </th>
                        <th
                          className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => requestSort("businessName")}
                        >
                          <div className="flex items-center gap-2">
                            Business Name {getSortIndicator("businessName")}
                          </div>
                        </th>
                        <th
                          className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => requestSort("email")}
                        >
                          <div className="flex items-center gap-2">
                            E-Mail {getSortIndicator("email")}
                          </div>
                        </th>
                        <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact Number
                        </th>
                        <th
                          className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => requestSort("yearsOfExperience")}
                        >
                          <div className="flex items-center gap-2">
                            Years Of Experience {getSortIndicator("yearsOfExperience")}
                          </div>
                        </th>
                        <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Client Persona
                        </th>
                        <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Wedding Aesthetic Styles
                        </th>
                        <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Primary Cities
                        </th>
                        <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Average Wedding Budget
                        </th>
                        <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Followers
                        </th>
                        <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Base Location
                        </th>
                        <th
                          className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          onClick={() => requestSort("onboarding_progress")}
                        >
                           <div className="flex items-center gap-2">
                            Progress {getSortIndicator("onboarding_progress")}
                          </div>
                        </th>
                        <th
                          className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => requestSort("status")}
                        >
                          <div className="flex items-center gap-2">
                            Status {getSortIndicator("status")}
                          </div>
                        </th>
                        <th
                          className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => requestSort("created_at")}
                        >
                          <div className="flex items-center gap-2">
                            Created At {getSortIndicator("created_at")}
                          </div>
                        </th>
                        <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {planners.length === 0 ? (
                        <tr>
                          <td
                            colSpan={8} // Updated colspan
                            className="px-6 py-12 text-center text-gray-500"
                          >
                            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-lg font-medium">
                              No planners found
                            </p>
                            <p className="text-sm">
                              Try adjusting your search or filters
                            </p>
                          </td>
                        </tr>
                      ) : (
                        planners.map((planner) => (
                          <tr
                            key={planner.id}
                            className={`hover:bg-gray-50 transition-colors ${
                              isSelected(planner.id!) ? "bg-blue-50" : ""
                            }`}
                          >
                            <td className="px-4 py-4">
                              <input
                                type="checkbox"
                                checked={isSelected(planner.id!)}
                                onChange={() =>
                                  handleCheckboxChange(planner.id!)
                                }
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                            </td>
                            <td className="px-4 py-4 w-fit">
                              <div className="text-sm text-gray-500">
                                {planner.fullName}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="text-sm text-gray-500">
                                {planner.businessName}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="text-sm text-gray-500">
                                {planner.email}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="text-sm text-gray-500">
                                {planner.publicPhone}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="text-sm text-gray-500">
                                {planner.yearsOfExperience}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="text-sm text-gray-500">
                                {planner.clientPersona}
                              </div>
                            </td>
                            {/* <td className="px-4 py-4">
                              <div className="text-sm text-gray-500">
                                {planner.weddingAestheticStyles}
                              </div>
                            </td> */}
                            <td className="px-4 py-4">
                              <div className="flex flex-wrap gap-1 max-w-xs">
                                {planner.weddingAestheticStyles
                                  .slice(0, 2)
                                  .map((style, idx) => (
                                    <span
                                      key={idx}
                                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                                    >
                                      {style}
                                    </span>
                                  ))}
                                {planner.weddingAestheticStyles.length > 2 && (
                                  <span className="text-xs text-gray-500">
                                    +
                                    {planner.weddingAestheticStyles.length - 2}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                {planner.primaryCities.join(", ")}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="text-sm text-gray-500">
                                {planner.averageWeddingBudget}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="text-sm text-gray-500">
                                {planner.totalFollowers}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="text-sm text-gray-500">
                                {planner.baseLocation}
                              </div>
                            </td>

                            <td className="px-4 py-4">
                              <div className="flex items-center gap-2">
                                <ProgressBar
                                  progress={planner.onboarding_progress || 0}
                                />
                                <span className="text-sm text-gray-600 w-10 text-right">
                                  {planner.onboarding_progress || 0}%
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                  planner.status
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {planner.status ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                              {/* --- Link Update --- */}
                              <Link
                                href={`/admin/planners/${planner.id}`}
                                className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                              >
                                <Eye className="w-4 h-4" />
                                View
                              </Link>
                            </td>
                            <td className="px-4 py-4">
                              <div className="text-sm text-gray-500">
                                {planner.created_at}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

