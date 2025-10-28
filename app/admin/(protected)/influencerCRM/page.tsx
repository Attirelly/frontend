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
import { format } from "date-fns";
import Link from "next/link";
import { RangeSlider } from "@/components/ui/RangeSlider";
import { DateRangeFilter } from "@/components/ui/DateRangeFilter";

// --- 2. COMBINED INFLUENCER TYPE ---
/**
 * @typedef {object} Influencer
 * @description Defines the flattened structure for a single influencer's data (camelCase).
 */

interface FollowerCounts {
  instagram: number;
  youtube: number;
  facebook: number;
}
type Influencer = {
  id: string;
  name: string;
  email: string;
  phoneInternal: string | null;
  phonePublic: string | null;
  gender: string | null;
  ageGroup: string | null;
  languages: string[];
  primaryPlatform: string | null;
  socialLinks: Record<string, string> | null;
  categoryNiche: string[];
  contentStyle: string[];
  followers: Record<string, any> | null;
  engagementMetrics: Record<string, any> | null;
  audienceGenderSplit: Record<string, number> | null;
  topAgeGroups: string[];
  topLocations: string[];
  audienceType: string | null;
  preferredCollabTypes: string[];
  openToBarter: string | null;
  maxCampaignsPerMonth: string | null;
  pricing: Record<string, any> | null;
  barterValueMin: number | null;
  brandsWorkedWith: string[];
  bestCampaignLinks: string[];
  achievements: string[];
  state: string | null;
  city: string | null;
  area: string | null;
  pincode: string | null;
  travelReadiness: string | null;
  attendEvents: boolean | null;
  profilePhoto: string | null;
  portfolioFile: string | null;
  shortBio: string | null;
  onboardingStep: number;
  onboarding_progress: number; // Calculated
  published: boolean;
  status: boolean; // Alias for 'published'
  createdAt: string[] | undefined;
  updatedAt: Date | undefined;
};

/**
 * @typedef {object} SortConfig
 * @description Defines the state for server-side sorting of the table.
 */
type SortConfig = {
  key: keyof Influencer;
  direction: "ascending" | "descending";
};

/**
 * @typedef {[string, number]} FacetEntry
 * @description Represents a single facet value and its count.
 */
type FacetEntry = [string, number];
type Facets = { [key: string]: FacetEntry[] };

type QueryParams = {
  query?: string;
  page?: number;
  limit?: number;
  sortField?: string;
  sortDirection?: "asc" | "desc";
  facets?: {
    [key: string]: string[];
  };
  filters: string;
  sort_by: string;
};

// Progress bar component
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

const numericKeyFilter: Record<string, string> = {
  "followers.facebook": "Facebook Followers",
  "followers.instagram": "Instagram Followers",
  "followers.youtube": "YouTube Followers",
  "pricing.story": "Instagram Story Price",
  "pricing.reel": "Instagram Reel Price",
  "pricing.post": "Instagram Post Price",
  "engagement_metrics.avgViewsPerReel": "Average Views per Reel",
};

// Main Component
export default function InfluencerCRM() {
  // const { sortBy } = useAdminStore(); // Assuming you have this store
  const sortBy = "default_sort"; // Placeholder

  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [search, setSearch] = useState("");
  const [selectedFacets, setSelectedFacets] = useState<{
    [key: string]: string[];
  }>({});
  const [selectedFilters, setSelectedFilters] = useState<{
    [key: string]: [number, number];
  }>({});
  const [dateRange, setDateRange] = useState<[Date, Date]>([
    new Date("2025-10-01"),
    new Date("2030-10-01"),
  ]);
  const [finalFilter, setFinalFilter] = useState<string>("");
  const [facets, setFacets] = useState<Facets>({});
  const [viewAll, setViewAll] = useState<{ [key: string]: boolean }>({});
  const [selectedInfluencerIds, setSelectedInfluencerIds] = useState<string[]>(
    []
  );
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [totalItems, setTotalItems] = useState(0);

  /**
   * Builds the facet filter string for the Algolia API.
   * We use snake_case keys here, mapping 'status' to 'published'.
   */
  const buildFacetFilters = (facets: Record<string, string[]>): string => {
    const filters: string[][] = [];
    for (const key in facets) {
      if (facets[key].length > 0) {
        // Map our component's 'status' key to the API's 'published' key
        const filterKey = key === "status" ? "published" : key;
        filters.push(facets[key].map((value) => `${filterKey}:${value}`));
      }
    }
    return encodeURIComponent(JSON.stringify(filters));
  };

  /**
   * Checks if a specific Influencer ID is in the selection list.
   */
  const isSelected = (id: string) => selectedInfluencerIds.includes(id);

  /**
   * Debounces search input.
   */
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1); // Reset to first page
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  /**
   * Handles selecting/deselecting a single influencer checkbox.
   */
  const handleCheckboxChange = (id: string) => {
    setSelectedInfluencerIds((prev) =>
      prev.includes(id) ? prev.filter((infId) => infId !== id) : [...prev, id]
    );
  };

  /**
   * Handles bulk status change (Publish/Unpublish).
   */
  const handleBulkStatusChange = async (newStatus: boolean) => {
    if (selectedInfluencerIds.length === 0) return;

    // Optimistic UI update
    const originalInfluencers = JSON.parse(JSON.stringify(influencers));
    const updatedInfluencers = influencers.map((inf) =>
      selectedInfluencerIds.includes(inf.id!)
        ? { ...inf, status: newStatus, published: newStatus }
        : inf
    );
    setInfluencers(updatedInfluencers);

    try {
      await api.patch("/influencers/bulk-active", {
        // Assumed endpoint
        ids: selectedInfluencerIds,
        active: newStatus, // API expects 'active' or 'published'
      });

      setSelectedInfluencerIds([]);
      toast.success(
        `Successfully ${newStatus ? "published" : "unpublished"} ${
          selectedInfluencerIds.length
        } influencers.`
      );
    } catch (error) {
      console.error("Bulk update failed:", error);
      setInfluencers(originalInfluencers); // Revert on failure
      toast.error("Failed to update influencers. Changes reverted.");
    }
  };

  /**
   * Fetches influencers from the backend.
   */
  const fetchInfluencers = async (params: QueryParams) => {
    setLoading(true);
    try {
      // Map component sort key (camelCase) to API sort key (snake_case)
      let sortKey = params.sortField;
      if (sortKey === "status") sortKey = "published";
      if (sortKey === "primaryPlatform") sortKey = "primary_platform";
      if (sortKey === "followers") sortKey = "followers";
      if (sortKey === "ageGroup") sortKey = "age_group";
      // ... add other mappings if needed

      const sortParams = params.sortField
        ? `&sortField=${sortKey}&sortDirection=${params.sortDirection || "asc"}`
        : "";

      const algoia_facets = buildFacetFilters(selectedFacets);

      const res: any = await api.get(
        // Assumed endpoint
        `/search/search_influencers?query=${params.query || ""}&page=${
          (params.page || 1) - 1
        }&limit=${
          params.limit || 50
        }&facetFilters=${algoia_facets}&filters=${finalFilter}&sort_by=${
          params.sort_by
        }${sortParams}`
      );

      const data = res.data;
      setTotalItems(data.total_hits);
      setTotalPages(data.total_pages);

      // --- Data Mapping ---
      // Map snake_case from API to camelCase for component state
      const influencersData: Influencer[] = data.hits.map((hit: any) => {
        // Calculate onboarding progress (Assuming 10 steps for an influencer)
        const maxSteps = 10;
        const currentStep = hit.onboarding_step || 0;
        const progress = Math.min(
          100,
          Math.round((currentStep / maxSteps) * 100)
        );

        return {
          id: hit.id,
          name: hit.name || "",
          email: hit.email || "",
          phoneInternal: hit.phone_internal || null,
          phonePublic: hit.phone_public || null,
          gender: hit.gender || null,
          ageGroup: hit.age_group || null,
          languages: hit.languages || [],
          primaryPlatform: hit.primary_platform || null,
          socialLinks: hit.social_links || null,
          categoryNiche: hit.category_niche || [],
          contentStyle: hit.content_style || [],
          // followers: hit.followers ? Number(hit.followers) : null,
          followers: hit.followers || null,
          engagementMetrics: hit.engagement_metrics || null,
          audienceGenderSplit: hit.audience_gender_split || null,
          topAgeGroups: hit.top_age_groups || [],
          topLocations: hit.top_locations || [],
          audienceType: hit.audience_type || null,
          preferredCollabTypes: hit.preferred_collab_types || [],
          openToBarter: hit.open_to_barter || null,
          maxCampaignsPerMonth: hit.max_campaigns_per_month || null,
          pricing: hit.pricing || null,
          barterValueMin: hit.barter_value_min
            ? Number(hit.barter_value_min)
            : null,
          brandsWorkedWith: hit.brands_worked_with || [],
          bestCampaignLinks: hit.best_campaign_links || [],
          achievements: hit.achievements || [],
          state: hit.state || null,
          city: hit.city || null,
          area: hit.area || null,
          pincode: hit.pincode || null,
          travelReadiness: hit.travel_readiness || null,
          attendEvents: hit.attend_events || null,
          profilePhoto: hit.profile_photo || null,
          portfolioFile: hit.portfolio_file || null,
          shortBio: hit.short_bio || null,
          onboardingStep: hit.onboarding_step || 0,
          onboarding_progress: progress,
          published: hit.published || false,
          status: hit.published || false, // Alias
          // createdAt: hit.created_at ? new Date(hit.created_at) : undefined,
          createdAt: hit.created_at || null,
          updatedAt: hit.updated_at ? new Date(hit.updated_at) : undefined,
        };
      });

      setInfluencers(influencersData);

      // --- Facet Mapping ---
      // Keys MUST match the snake_case keys from the API facets response
      const newFacets: Facets = {
        gender: Object.entries(data.facets?.gender || {}),
        city: Object.entries(data.facets?.city || {}),
        top_age_groups: Object.entries(data.facets?.top_age_groups || {}),
        category_niche: Object.entries(data.facets?.category_niche || {}),
        top_locations: Object.entries(data.facets?.top_locations || {}),
      };
      setFacets(newFacets);
    } catch (error) {
      console.error("Failed to fetch influencers:", error);
      toast.error("Failed to fetch influencers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Main data fetching effect.
   */
  useEffect(() => {
    fetchInfluencers({
      query: debouncedSearch,
      page: currentPage,
      limit: itemsPerPage,
      sortField: sortConfig?.key,
      sortDirection: sortConfig?.direction === "ascending" ? "asc" : "desc",
      facets: selectedFacets,
      filters: finalFilter,
      sort_by: sortBy,
    });
  }, [
    debouncedSearch,
    currentPage,
    itemsPerPage,
    sortConfig,
    selectedFacets,
    sortBy,
    finalFilter,
  ]);

  /**
   * Handles search input.
   */
  const handleSearch = (query: string) => {
    setSearch(query);
  };

  /**
   * Handles facet checkbox changes.
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
    setCurrentPage(1); // Reset to first page
  };

  const handleFacetRangeChange = (facet: string, low: number, high: number) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [facet]: [low, high],
    }));
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      let filterString = buildFilterString(selectedFilters);
      let datefilterString = buildDateFilter("created_at_timestamp", dateRange);
      const finalFilterString = [filterString, datefilterString]
        .filter(Boolean) // removes undefined, null, or empty ""
        .join(" AND ");
      setFinalFilter(finalFilterString);
    }, 500);

    return () => clearTimeout(handler);
  }, [selectedFilters, dateRange]);

  const buildFilterString = (
    filters: Record<string, [number, number]>
  ): string => {
    const parts: string[] = [];

    for (const [facet, [low, high]] of Object.entries(filters)) {
      if (low != null && high != null) {
        parts.push(`${facet} >= ${low} AND ${facet} <= ${high}`);
      }
    }

    return parts.join(" AND ");
  };
  const buildDateFilter = (
    facet: string,
    dateRange?: [Date, Date] | null
  ): string | null => {
    if (!dateRange || !dateRange[0] || !dateRange[1]) return null;
  const [start, end] = dateRange;
  const startUnix = Math.floor(start.getTime() / 1000);
  const endUnix = Math.floor(end.getTime() / 1000);

  return `${facet} >= ${startUnix} AND ${facet} <= ${endUnix}`;
  };
  /**
   * Handles CSV upload (simplified).
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

      const uploaded: Influencer[] = lines
        .map((line) => {
          try {
            // Must match the download header
            const [
              id,
              name,
              email,
              phonePublic,
              city,
              state,
              primaryPlatform,
              followers,
              published,
            ] = line.split(",").map((val) => val.replace(/"/g, "")); // Basic un-escaping

            if (!name || !email) return null;

            return {
              id: id?.trim(),
              name: name?.trim(),
              email: email?.trim(),
              phonePublic: phonePublic?.trim() || null,
              city: city?.trim() || null,
              state: state?.trim() || null,
              primaryPlatform: primaryPlatform?.trim() || null,
              followers: followers ? Number(followers.trim()) : null,
              published: published?.trim().toLowerCase() === "true",
              status: published?.trim().toLowerCase() === "true",

              // --- Add empty defaults for all other fields ---
              phoneInternal: null,
              gender: null,
              ageGroup: null,
              languages: [],
              socialLinks: null,
              categoryNiche: [],
              contentStyle: [],
              engagementMetrics: null,
              audienceGenderSplit: null,
              topAgeGroups: [],
              topLocations: [],
              audienceType: null,
              preferredCollabTypes: [],
              openToBarter: null,
              maxCampaignsPerMonth: null,
              pricing: null,
              barterValueMin: null,
              brandsWorkedWith: [],
              bestCampaignLinks: [],
              achievements: [],
              area: null,
              pincode: null,
              travelReadiness: null,
              attendEvents: null,
              profilePhoto: null,
              portfolioFile: null,
              shortBio: null,
              onboardingStep: 0,
              onboarding_progress: 0,
              createdAt: undefined,
              updatedAt: undefined,
            };
          } catch (err) {
            console.warn("Skipping invalid CSV line:", line, err);
            return null;
          }
        })
        .filter((p): p is Influencer => p !== null);

      setInfluencers(uploaded);
      setCurrentPage(1);
      toast.success(`Uploaded ${uploaded.length} influencers from CSV.`);

      // Re-generate simple facets
      const newFacets: Facets = {
        primary_platform: [
          ...new Set(uploaded.map((p) => p.primaryPlatform).filter(Boolean)),
        ].map((item) => [item!, 1]),
        city: [...new Set(uploaded.map((p) => p.city).filter(Boolean))].map(
          (item) => [item!, 1]
        ),
      };
      setFacets(newFacets);
    };
    reader.readAsText(file);
  };

  /**
   * Handles CSV download (simplified).
   */
  const handleDownloadCSV = () => {
    // Simplified header based on key table columns
    const header =
      "id,name,email,phonePublic,city,state,primaryPlatform,followers,published\n";

    const escape = (str: string | number | null | undefined) =>
      `"${String(str || "").replace(/"/g, '""')}"`;

    const rows = influencers
      .map((p) => {
        return [
          p.id,
          p.name,
          p.email,
          p.phonePublic,
          p.city,
          p.state,
          p.primaryPlatform,
          p.followers,
          p.published,
        ]
          .map(escape)
          .join(",");
      })
      .join("\n");

    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "influencers.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  /**
   * Toggles "View All" for a facet.
   */
  const toggleViewAll = (facet: string) => {
    setViewAll((prev) => ({ ...prev, [facet]: !prev[facet] }));
  };

  /**
   * Sets sorting configuration.
   */
  const requestSort = (key: keyof Influencer) => {
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
   * Gets sort indicator icon.
   */
  const getSortIndicator = (key: keyof Influencer) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === "ascending" ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  // --- JSX RENDER ---
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="w-full max-w-full mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 mb-8 p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center justify-center mb-6 gap-3">
            <Users className="w-8 h-8 text-shadow-gray-700 text-black" />
            <h1 className="text-3xl md:text-4xl font-bold text-shadow-gray-700 text-black text-center">
              Influencer CRM
            </h1>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-4 justify-center items-center">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search influencers..."
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
                key={Date.now()}
              />
            </label>

            <button
              onClick={handleDownloadCSV}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all flex items-center gap-2 shadow-md"
              disabled={influencers.length === 0}
            >
              <Download className="w-5 h-5" />
              Download CSV
            </button>
          </div>

          {selectedInfluencerIds.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center mt-4 border-t border-gray-100 pt-4">
              <button
                onClick={() => handleBulkStatusChange(true)}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Publish ({selectedInfluencerIds.length})
              </button>
              <button
                onClick={() => handleBulkStatusChange(false)}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Unpublish ({selectedInfluencerIds.length})
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
                  aria-label={
                    showFilters ? "Collapse filters" : "Expand filters"
                  }
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

              <div
                className={`transition-opacity ${
                  showFilters ? "opacity-100" : "opacity-0 hidden"
                }`}
              >
                {Object.keys(facets).length > 0 ? (
                  // --- START MODIFICATION ---
                  <div>
                    {(Object.keys(facets) as (keyof Facets)[]) // Cast keys to correct type
                      .filter((key) => facets[key] && facets[key]!.length > 0) // Filter empty facets
                      .sort() // Optional: sort keys alphabetically
                      .map((facetKey) => {
                        // Use facetKey (e.g., "followers.instagram")
                        // --- Define Title Mapping Here ---
                        const titleMap: Record<string, string> = {
                          "followers.instagram": "Instagram Followers",
                          "followers.youtube": "YouTube Followers",
                          "followers.facebook": "Facebook Followers",
                          "pricing.reel": "Instagram Reel Price",
                          "pricing.story": "Instagram Story Price",
                          "pricing.post": "Instagram Post Price",
                          "pricing.campaign_min":
                            "Instagram Min Campaign Price",
                          "pricing.campaign_max":
                            "Instagram Max Campaign Price",

                          // Add other keys as needed
                        };

                        const options = facets[facetKey]!; // Options for this key
                        // Get display title from map, fallback to formatting the key
                        const displayTitle =
                          titleMap[facetKey] ||
                          facetKey
                            .replace(/_/g, " ")
                            .replace(/\./g, " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase());

                        return (
                          // --- Render FilterGroup with Display Title ---
                          <div key={facetKey} className="mb-6">
                            <h3 className="text-base font-semibold text-gray-700 mb-3 capitalize">
                              {displayTitle} {/* <--- USE DISPLAY TITLE HERE */}
                            </h3>
                            <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
                              {options // Use options variable
                                .slice(
                                  0,
                                  viewAll[facetKey] ? options.length : 5
                                )
                                .map(([value, count]) => (
                                  <label
                                    key={value as string} // Ensure value is treated as string for key
                                    className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={
                                        selectedFacets[facetKey]?.includes(
                                          String(value)
                                        ) || false
                                      }
                                      onChange={() =>
                                        handleFacetChange(
                                          facetKey,
                                          String(value)
                                        )
                                      } // Pass original facetKey
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
                              {options.length > 5 && (
                                <button
                                  onClick={() => toggleViewAll(facetKey)}
                                  className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2"
                                >
                                  {viewAll[facetKey]
                                    ? "Show Less"
                                    : `View All (${options.length})`}
                                </button>
                              )}
                            </div>
                          </div>
                          // --- END Render ---
                        );
                      })}

                    {Object.keys(numericKeyFilter).map((key: string) => {
                      const displayFilterName = numericKeyFilter[key];
                      const currentRange = selectedFilters[key];
                      return (
                        <div key={key} className="mb-6">
                          <h3 className="text-base font-semibold text-gray-700 mb-3 capitalize">
                            {displayFilterName}
                          </h3>
                          <RangeSlider
                            label={displayFilterName}
                            min={0}
                            max={10000000}
                            step={1000}
                            values={currentRange ?? [0, 10000000]}
                            onChange={(range) =>
                              handleFacetRangeChange(key, range[0], range[1])
                            }
                          />
                        </div>
                      );
                    })}

                    <DateRangeFilter
                      startDate={dateRange ? dateRange[0].toISOString() : ""}
                      endDate={dateRange ? dateRange[1].toISOString() : ""}
                      onChange={(start, end) => {
                        setDateRange([new Date(start), new Date(end)]);
                      }}
                    />
                  </div>
                ) : (
                  // --- END MODIFICATION ---
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
                    {totalItems} influencers
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
                              setSelectedInfluencerIds(
                                e.target.checked
                                  ? influencers
                                      .map((p) => p.id!)
                                      .filter(Boolean)
                                  : []
                              )
                            }
                            checked={
                              influencers.length > 0 &&
                              selectedInfluencerIds.length ===
                                influencers.length
                            }
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </th>
                        <th
                          className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => requestSort("name")}
                        >
                          <div className="flex items-center gap-2">
                            Influencer {getSortIndicator("name")}
                          </div>
                        </th>
                        <th
                          className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => requestSort("email")}
                        >
                          <div className="flex items-center gap-2">
                            E-mail {getSortIndicator("email")}
                          </div>
                        </th>
                        <th
                          className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => requestSort("phonePublic")}
                        >
                          <div className="flex items-center gap-2">
                            Contact Number {getSortIndicator("phonePublic")}
                          </div>
                        </th>
                        <th
                          className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => requestSort("topAgeGroups")}
                        >
                          <div className="flex items-center gap-2">
                            Top Age Groups {getSortIndicator("topAgeGroups")}
                          </div>
                        </th>
                        <th
                          className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => requestSort("languages")}
                        >
                          <div className="flex items-center gap-2">
                            Languages {getSortIndicator("languages")}
                          </div>
                        </th>
                        <th
                          className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          onClick={() => requestSort("primaryPlatform")}
                        >
                          <div className="flex items-center gap-2">
                            Primary Platform{" "}
                            {getSortIndicator("primaryPlatform")}
                          </div>
                        </th>
                        <th
                          className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => requestSort("categoryNiche")}
                        >
                          <div className="flex items-center gap-2">
                            Category/Niche {getSortIndicator("categoryNiche")}
                          </div>
                        </th>
                        <th
                          className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => requestSort("followers")}
                        >
                          <div className="flex items-center gap-2">
                            Followers {getSortIndicator("followers")}
                          </div>
                        </th>
                        <th
                          className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => requestSort("topLocations")}
                        >
                          <div className="flex items-center gap-2">
                            Top Locations {getSortIndicator("topLocations")}
                          </div>
                        </th>
                        <th
                          className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => requestSort("pricing")}
                        >
                          <div className="flex items-center gap-2">
                            Pricing {getSortIndicator("pricing")}
                          </div>
                        </th>
                        <th
                          className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => requestSort("createdAt")}
                        >
                          <div className="flex items-center gap-2">
                            Created At {getSortIndicator("createdAt")}
                          </div>
                        </th>
                        <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Progress
                        </th>
                        <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {influencers.length === 0 ? (
                        <tr>
                          <td
                            colSpan={9} // Updated colspan
                            className="px-6 py-12 text-center text-gray-500"
                          >
                            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-lg font-medium">
                              No influencers found
                            </p>
                            <p className="text-sm">
                              Try adjusting your search or filters
                            </p>
                          </td>
                        </tr>
                      ) : (
                        influencers.map((influencer) => (
                          <tr
                            key={influencer.id}
                            className={`hover:bg-gray-50 transition-colors ${
                              isSelected(influencer.id!) ? "bg-blue-50" : ""
                            }`}
                          >
                            <td className="px-4 py-4">
                              <input
                                type="checkbox"
                                checked={isSelected(influencer.id!)}
                                onChange={() =>
                                  handleCheckboxChange(influencer.id!)
                                }
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                            </td>
                            <td className="px-4 py-4 w-fit">
                              <div className="flex items-center gap-3">
                                {/* <img 
                                  src={influencer.profilePhoto || `https://placehold.co/100x100/E2F0D1/4A6B2A?text=${influencer.name.charAt(0)}`}
                                  alt={influencer.name}
                                  className="w-10 h-10 rounded-full object-cover"
                                  onError={(e) => (e.currentTarget.src = `https://placehold.co/100x100/E2F0D1/4A6B2A?text=${influencer.name.charAt(0)}`)}
                                /> */}
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {influencer.name || "N/A"}
                                  </div>
                                  {/* <div className="text-sm text-gray-500">
                                    {influencer.gender} {influencer.ageGroup ? `(${influencer.ageGroup})` : ''}
                                  </div> */}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="text-sm text-gray-900">
                                {influencer.email}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="text-sm text-gray-900">
                                {influencer.phonePublic}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="text-sm text-gray-900">
                                {influencer.topAgeGroups}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="text-sm text-gray-900">
                                {influencer.languages}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="text-sm text-gray-900">
                                {influencer.primaryPlatform}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="text-sm text-gray-900">
                                {influencer.categoryNiche}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              {/* <div className="text-sm text-gray-900">
                                {influencer.followers}
                              </div> */}
                              <div className="text-sm text-gray-900">
                                {/* {influencer.followers?.instagram?.toLocaleString() ?? <span className="italic text-gray-400">N/A</span>} */}
                                {/* {influencer.followers} */}
                                {influencer.followers ? (
                                  // Use a div or span to hold the follower counts
                                  <div className="text-sm text-gray-900">
                                    {" "}
                                    {/* Stack vertically, adjust line height */}
                                    {/* Conditionally render Instagram count if > 0 */}
                                    {influencer.followers.instagram > 0 && (
                                      <span>
                                        Instagram:{" "}
                                        {influencer.followers.instagram.toLocaleString()}{" "}
                                      </span>
                                    )}
                                    {/* Conditionally render YouTube count if > 0 */}
                                    {influencer.followers.youtube > 0 && (
                                      <span>
                                        Youtube:{" "}
                                        {influencer.followers.youtube.toLocaleString()}{" "}
                                      </span>
                                    )}
                                    {/* Conditionally render Facebook count if > 0 */}
                                    {influencer.followers.facebook > 0 && (
                                      <span>
                                        Facebook:{" "}
                                        {influencer.followers.facebook.toLocaleString()}{" "}
                                      </span>
                                    )}
                                    {/* Show N/A only if ALL are 0 or object is missing */}
                                    {influencer.followers.instagram <= 0 &&
                                      influencer.followers.youtube <= 0 &&
                                      influencer.followers.facebook <= 0 && (
                                        <span className="italic text-gray-400">
                                          N/A
                                        </span>
                                      )}
                                  </div>
                                ) : (
                                  // Show N/A if the entire followers object is null/missing
                                  <span className="italic text-gray-400">
                                    N/A
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="text-sm text-gray-900">
                                {influencer.topLocations ? (
                                  influencer.topLocations
                                ) : (
                                  <span className="italic text-gray-400">
                                    N/A
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="text-sm text-gray-900">
                                {influencer.pricing ? (
                                  // Use a div or span to hold the follower counts
                                  <div className="text-sm text-gray-900">
                                    {" "}
                                    {/* Stack vertically, adjust line height */}
                                    {/* Conditionally render Instagram count if > 0 */}
                                    {influencer.pricing.reel > 0 && (
                                      <span>
                                        Reels:{" "}
                                        {influencer.pricing.reel.toLocaleString()}{" "}
                                      </span>
                                    )}
                                    {/* Conditionally render YouTube count if > 0 */}
                                    {influencer.pricing.story > 0 && (
                                      <span>
                                        Story:{" "}
                                        {influencer.pricing.story.toLocaleString()}{" "}
                                      </span>
                                    )}
                                    {/* Conditionally render Facebook count if > 0 */}
                                    {influencer.pricing.post > 0 && (
                                      <span>
                                        Post:{" "}
                                        {influencer.pricing.post.toLocaleString()}{" "}
                                      </span>
                                    )}
                                    {influencer.pricing.campaign_min > 0 && (
                                      <span>
                                        Post:{" "}
                                        {influencer.pricing.campaign_min.toLocaleString()}{" "}
                                      </span>
                                    )}
                                    {influencer.pricing.campaign_max > 0 && (
                                      <span>
                                        Post:{" "}
                                        {influencer.pricing.campaign_max.toLocaleString()}{" "}
                                      </span>
                                    )}
                                    {/* Show N/A only if ALL are 0 or object is missing */}
                                    {influencer.pricing.reel <= 0 &&
                                      influencer.pricing.story <= 0 &&
                                      influencer.pricing.post <= 0 &&
                                      influencer.pricing.campaign_min <= 0 &&
                                      influencer.pricing.campaign_max <= 0 && (
                                        <span className="italic text-gray-400">
                                          N/A
                                        </span>
                                      )}
                                  </div>
                                ) : (
                                  // Show N/A if the entire followers object is null/missing
                                  <span className="italic text-gray-400">
                                    N/A
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="text-sm text-gray-900">
                                {influencer.createdAt
                                  ? format(
                                      new Date(influencer.createdAt),
                                      "HH:mm:ss dd/MM/yyyy"
                                    )
                                  : "N/A"}
                              </div>
                            </td>

                            <td className="px-4 py-4">
                              <div className="flex items-center gap-2">
                                <ProgressBar
                                  progress={influencer.onboarding_progress || 0}
                                />
                                <span className="text-sm text-gray-600 w-10 text-right">
                                  {influencer.onboarding_progress || 0}%
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                  influencer.status // 'status' is mapped from 'published'
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {influencer.status ? "Published" : "Draft"}
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                              <Link
                                href={`/admin/influencers/${influencer.id}`} // Updated link
                                className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                              >
                                <Eye className="w-4 h-4" />
                                View
                              </Link>
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
