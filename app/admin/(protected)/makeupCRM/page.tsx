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
import { RangeSlider } from "@/components/ui/RangeSlider";
import { DateRangeFilter } from "@/components/ui/DateRangeFilter";

// --- 1. MOCK IMPLEMENTATIONS ---
// Mock objects for 'api' and 'Link' to allow previewing.
// The real imports are commented out above.

// Mock Link component
const Link: React.FC<
  React.PropsWithChildren<{ href: string; className?: string }>
> = ({ href, className, children }) => (
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

// --- 2. COMBINED MAKEUP ARTIST TYPE ---
/**
 * @typedef {object} MakeupArtist
 * @description Defines the flattened structure for a single MUA's data within the CRM.
 */
type MakeupArtist = {
  id?: string;
  created_at?: string;
  onboarding_progress?: number; // Calculated field (0-100)

  // Section 1: Basic Information
  fullName: string;
  brandName: string;
  email: string;
  whatsappNumber: string;
  yearsExperience: string;
  teamSize: string;
  artistType: string;

  // Section 2: Client & Service Profile
  clientTypes: string[];
  occasionFocus: string[];
  avgBookingsPerMonth: string;
  avgPriceRange: string;
  readyToTravel: boolean;

  // Section 3: Fashion & Outfit Influence
  recommendsBoutiques: boolean;
  guidanceTypes: string[];
  guidesOnTrends: string[];
  helpsWithOutfitCoordination: boolean;
  designersOrLabels: string[];

  // Section 4: Social Media Collaborations (with Others)
  collabsWithOthers: boolean;
  collabTypes: string[];
  collabFrequency: string;
  collabNature: string;
  collabReadyToTravel: boolean;

  // Section 5: Social Media Collaborations (with Attirelly)
  attirellyCollabTypes: string[];
  attirellyCollabModel: string;
  attirellyCollabFrequency: string;
  attirellyReadyToTravel: boolean;
  referralPotential: string;

  // Section 6: Commission / Partnership Program
  commissionOptIn: boolean;
  avgMonthlyReferrals: string;

  // Section 7: Social Links
  socialLinks: Record<string, string>;
  featuredOn: string[];

  // Section 8: Instagram Insights
  instagramHandle: string;
  totalFollowers: number | null;
  totalPosts: number | null;
  engagementRate: number | null;
  audienceGenderSplit: Record<string, number> | null;
  topAudienceLocations: string[];
  contentNiche: string[];
  avgStoryViews: number | null;
  avgReelViews: number | null;
  bestPerformingContentType: string;
  audienceInsightSummary: string[];

  // Section 9: Location (Simplified to strings)
  state: string | null;
  city: string | null;
  area: string | null;
  pincode: string | null;

  // Section 10: Media & Bio
  profilePhoto: string | null;
  portfolioFile: string | null;
  shortBio: string;
  status: boolean; // This is the source of 'status'
};

/**
 * @typedef {object} SortConfig
 * @description Defines the state for server-side sorting of the table.
 */
type SortConfig = {
  key: keyof MakeupArtist; // Use the keys from our flat type
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
  filters?: {
    [key: string]: string[];
  };
  sort_by: string; // From your original code
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
  total_followers: "Total Followers",
  engagement_rate: "Engagement Rate",
  avg_story_views: "Instagram Story Views",
  total_posts: "Instagram Total Post",
  years_experience: "Years of Experience",
};

// Main Component
export default function MakeupArtistCRM() {
  // const { sortBy } = useAdminStore(); // Assuming you have this store
  const sortBy = "default_sort"; // Placeholder

  const [muas, setMuas] = useState<MakeupArtist[]>([]);
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
  const [selectedMuaIds, setSelectedMuaIds] = useState<string[]>([]);
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
   * We use snake_case keys here.
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
   * Checks if a specific MUA ID is in the selection list.
   */
  const isSelected = (id: string) => selectedMuaIds.includes(id);

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
   * Handles selecting/deselecting a single MUA checkbox.
   */
  const handleCheckboxChange = (id: string) => {
    setSelectedMuaIds((prev) =>
      prev.includes(id) ? prev.filter((muaId) => muaId !== id) : [...prev, id]
    );
  };

  /**
   * Handles bulk status change (Activate/Deactivate).
   */
  const handleBulkStatusChange = async (newStatus: boolean) => {
    if (selectedMuaIds.length === 0) return;

    // Optimistic UI update
    const originalMuas = JSON.parse(JSON.stringify(muas));
    const updatedMuas = muas.map((mua) =>
      selectedMuaIds.includes(mua.id!)
        ? { ...mua, status: newStatus, published: newStatus }
        : mua
    );
    setMuas(updatedMuas);

    try {
      await api.patch("/makeup_artists/bulk-active", {
        // Assumed endpoint
        ids: selectedMuaIds,
        active: newStatus, // API expects 'active'
      });

      setSelectedMuaIds([]);
      toast.success(
        `Successfully ${newStatus ? "Activated" : "Deactivated"} ${
          selectedMuaIds.length
        } artists.`
      );
    } catch (error) {
      console.error("Bulk update failed:", error);
      setMuas(originalMuas); // Revert on failure
      toast.error("Failed to update artists. Changes reverted.");
    }
  };

  /**
   * Fetches MUAs from the backend.
   */
  const fetchMuas = async (params: QueryParams) => {
    setLoading(true);
    try {
      // Map component sort key (camelCase) to API sort key (snake_case)
      let sortKey = params.sortField;
      if (sortKey === "status") sortKey = "published";
      if (sortKey === "brandName") sortKey = "brand_name";
      if (sortKey === "yearsExperience") sortKey = "years_experience";
      if (sortKey === "totalFollowers") sortKey = "total_followers";
      // ... add other mappings if needed

      const sortParams = params.sortField
        ? `&sortField=${sortKey}&sortDirection=${params.sortDirection || "asc"}`
        : "";

      const algoia_facets = buildFacetFilters(selectedFacets);

      const res: any = await api.get(
        `/search/search_makeup_artists?query=${params.query || ""}&page=${
          (params.page || 1) - 1
        }&limit=${params.limit || 50}&facetFilters=${algoia_facets}&sort_by=${
          params.sort_by
        }${sortParams}`
      );

      const data = res.data;
      setTotalItems(data.total_hits);
      setTotalPages(data.total_pages);

      // --- Data Mapping ---
      // Map snake_case from API to camelCase for component state
      const muasData: MakeupArtist[] = data.hits.map((hit: any) => {
        // Calculate onboarding progress
        const maxSteps = 10; // 10 sections
        const currentStep = hit.onboarding_step || 0;
        const progress = Math.min(
          100,
          Math.round((currentStep / maxSteps) * 100)
        );

        return {
          id: hit.id,
          created_at: hit.created_at ? new Date(hit.created_at) : undefined,
          onboarding_progress: progress,

          // Section 1
          fullName: hit.full_name || "",
          brandName: hit.brand_name || "",
          email: hit.email || "",
          whatsappNumber: hit.whatsapp_number || "",
          yearsExperience: hit.years_experience || "",
          teamSize: hit.team_size || "",
          artistType: hit.artist_type || "",

          // Section 2
          clientTypes: hit.client_types || [],
          occasionFocus: hit.occasion_focus || [],
          avgBookingsPerMonth: hit.avg_bookings_per_month || "",
          avgPriceRange: hit.avg_price_range || "",
          readyToTravel: hit.ready_to_travel || false,

          // Section 3
          recommendsBoutiques: hit.recommends_boutiques || false,
          guidanceTypes: hit.guidance_types || [],
          guidesOnTrends: hit.guides_on_trends || [],
          helpsWithOutfitCoordination:
            hit.helps_with_outfit_coordination || false,
          designersOrLabels: hit.designers_or_labels || [],

          // Section 4
          collabsWithOthers: hit.collabs_with_others || false,
          collabTypes: hit.collab_types || [],
          collabFrequency: hit.collab_frequency || "",
          collabNature: hit.collab_nature || "",
          collabReadyToTravel: hit.collab_ready_to_travel || false,

          // Section 5
          attirellyCollabTypes: hit.attirelly_collab_types || [],
          attirellyCollabModel: hit.attirelly_collab_model || "",
          attirellyCollabFrequency: hit.attirelly_collab_frequency || "",
          attirellyReadyToTravel: hit.attirelly_ready_to_travel || false,
          referralPotential: hit.referral_potential || "",

          // Section 6
          commissionOptIn: hit.commission_opt_in || false,
          avgMonthlyReferrals: hit.avg_monthly_referrals || "",

          // Section 7
          socialLinks: hit.social_links || {},
          featuredOn: hit.featured_on || [],

          // Section 8
          instagramHandle: hit.instagram_handle || "",
          totalFollowers: hit.total_followers
            ? Number(hit.total_followers)
            : null,
          totalPosts: hit.total_posts ? Number(hit.total_posts) : null,
          engagementRate: hit.engagement_rate
            ? Number(hit.engagement_rate)
            : null,
          audienceGenderSplit: hit.audience_gender_split || null,
          topAudienceLocations: hit.top_audience_locations || [],
          contentNiche: hit.content_niche || [],
          avgStoryViews: hit.avg_story_views
            ? Number(hit.avg_story_views)
            : null,
          avgReelViews: hit.avg_reel_views ? Number(hit.avg_reel_views) : null,
          bestPerformingContentType: hit.best_performing_content_type || "",
          audienceInsightSummary: hit.audience_insight_summary || [],

          // Section 9
          state: hit.state || null, // Assuming state/city/area are flat strings
          city: hit.city || null,
          area: hit.area || null,
          pincode: hit.pincode || null,

          // Section 10
          profilePhoto: hit.profile_photo || null,
          portfolioFile: hit.portfolio_file || null,
          shortBio: hit.short_bio || "",
          status: hit.active || false,
        };
      });

      setMuas(muasData);

      // --- Facet Mapping ---
      // Map snake_case keys from API to our state
      const newFacets: Facets = {
        city: Object.entries(data.facets?.city || {}),
        state: Object.entries(data.facets?.state || {}),
        team_size: Object.entries(data.facets?.team_size || {}),
        client_types: Object.entries(data.facets?.client_types || {}),
        collab_types: Object.entries(data.facets?.collab_types || {}),
        collab_nature: Object.entries(data.facets?.collab_nature || {}),
        content_niche: Object.entries(data.facets?.content_niche || {}),
        occasion_focus: Object.entries(data.facets?.occasion_focus || {}),
        ready_to_travel: Object.entries(data.facets?.ready_to_travel || {}),
        recommends_boutiques: Object.entries(
          data.facets?.recommends_boutiques || {}
        ),
      };
      setFacets(newFacets);
    } catch (error) {
      console.error("Failed to fetch MUAs:", error);
      toast.error("Failed to fetch artists. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Main data fetching effect.
   */
  useEffect(() => {
    fetchMuas({
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

      const uploaded: MakeupArtist[] = lines
        .map((line) => {
          try {
            // Must match the download header
            const [
              id,
              brandName,
              fullName,
              email,
              whatsappNumber,
              city,
              state,
              artistType,
              yearsExperience,
              totalFollowers,
              published,
            ] = line.split(",").map((val) => val.replace(/"/g, "")); // Basic un-escaping

            if (!brandName || !email) return null;

            return {
              id: id?.trim(),
              brandName: brandName?.trim(),
              fullName: fullName?.trim(),
              email: email?.trim(),
              whatsappNumber: whatsappNumber?.trim(),
              city: city?.trim() || null,
              state: state?.trim() || null,
              artistType: artistType?.trim(),
              yearsExperience: yearsExperience?.trim(),
              totalFollowers: totalFollowers
                ? Number(totalFollowers.trim())
                : null,
              published: published?.trim().toLowerCase() === "true",
              status: published?.trim().toLowerCase() === "true",

              // --- Add empty defaults for all other fields ---
              teamSize: "",
              clientTypes: [],
              occasionFocus: [],
              avgBookingsPerMonth: "",
              avgPriceRange: "",
              readyToTravel: false,
              recommendsBoutiques: false,
              guidanceTypes: [],
              guidesOnTrends: [],
              helpsWithOutfitCoordination: false,
              designersOrLabels: [],
              collabsWithOthers: false,
              collabTypes: [],
              collabFrequency: "",
              collabNature: "",
              collabReadyToTravel: false,
              attirellyCollabTypes: [],
              attirellyCollabModel: "",
              attirellyCollabFrequency: "",
              attirellyReadyToTravel: false,
              referralPotential: "",
              commissionOptIn: false,
              avgMonthlyReferrals: "",
              socialLinks: {},
              featuredOn: [],
              instagramHandle: "",
              totalPosts: null,
              engagementRate: null,
              audienceGenderSplit: null,
              topAudienceLocations: [],
              contentNiche: [],
              avgStoryViews: null,
              avgReelViews: null,
              bestPerformingContentType: "",
              audienceInsightSummary: [],
              area: null,
              pincode: null,
              profilePhoto: null,
              portfolioFile: null,
              shortBio: "",
            };
          } catch (err) {
            console.warn("Skipping invalid CSV line:", line, err);
            return null;
          }
        })
        .filter((p): p is MakeupArtist => p !== null);

      setMuas(uploaded);
      setCurrentPage(1);
      toast.success(`Uploaded ${uploaded.length} artists from CSV.`);

      // Re-generate simple facets
      const newFacets: Facets = {
        artist_type: [
          ...new Set(uploaded.map((p) => p.artistType).filter(Boolean)),
        ].map((item) => [item, 1]),
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
      "id,brandName,fullName,email,whatsappNumber,city,state,artistType,yearsExperience,totalFollowers,published\n";

    const escape = (str: string) =>
      `"${String(str || "").replace(/"/g, '""')}"`;

    const rows = muas
      .map((p) => {
        return [
          p.id,
          p.brandName,
          p.fullName,
          p.email,
          p.whatsappNumber,
          p.city,
          p.state,
          p.artistType,
          p.yearsExperience,
          p.totalFollowers,
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
    link.download = "makeup_artists.csv";
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
  const requestSort = (key: keyof MakeupArtist) => {
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
  const getSortIndicator = (key: keyof MakeupArtist) => {
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
              Makeup Artist CRM
            </h1>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-4 justify-center items-center">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search artists..."
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
              disabled={muas.length === 0}
            >
              <Download className="w-5 h-5" />
              Download CSV
            </button>
          </div>

          {selectedMuaIds.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center mt-4 border-t border-gray-100 pt-4">
              <button
                onClick={() => handleBulkStatusChange(true)}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Activate ({selectedMuaIds.length})
              </button>
              <button
                onClick={() => handleBulkStatusChange(false)}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Deactivate ({selectedMuaIds.length})
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

              {/* Facet Groups */}
              <div
                className={`transition-opacity ${
                  showFilters ? "opacity-100" : "opacity-0 hidden"
                }`}
              >
                {Object.keys(facets).length > 0 ? (
                  <div>
                    {Object.keys(facets).map((facet) => (
                      <div key={facet} className="mb-6">
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
                                    selectedFacets[facet]?.includes(
                                      String(value)
                                    ) || false
                                  }
                                  onChange={() =>
                                    handleFacetChange(facet, String(value))
                                  }
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
                    ))}

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
                    {totalItems} artists
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
                              setSelectedMuaIds(
                                e.target.checked
                                  ? muas.map((p) => p.id!).filter(Boolean)
                                  : []
                              )
                            }
                            checked={
                              muas.length > 0 &&
                              selectedMuaIds.length === muas.length
                            }
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </th>
                        <th
                          className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => requestSort("fullName")}
                        >
                          <div className="flex items-center gap-2">
                            Full Name {getSortIndicator("fullName")}
                          </div>
                        </th>
                        <th
                          className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => requestSort("brandName")}
                        >
                          <div className="flex items-center gap-2">
                            Brand Name {getSortIndicator("brandName")}
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
                          onClick={() => requestSort("yearsExperience")}
                        >
                          <div className="flex items-center gap-2">
                            Years Of Experience{" "}
                            {getSortIndicator("yearsExperience")}
                          </div>
                        </th>
                        <th
                          className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => requestSort("avgPriceRange")}
                        >
                          <div className="flex items-center gap-2">
                            Average Price Range{" "}
                            {getSortIndicator("avgPriceRange")}
                          </div>
                        </th>
                        <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Followers
                        </th>
                        <th
                          className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => requestSort("city")}
                        >
                          <div className="flex items-center gap-2">
                            City {getSortIndicator("city")}
                          </div>
                        </th>
                        <th
                          className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => requestSort("state")}
                        >
                          <div className="flex items-center gap-2">
                            State {getSortIndicator("state")}
                          </div>
                        </th>
                        <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Average Monthly referels
                        </th>
                        <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Occasion Focus
                        </th>
                        <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created At
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
                        <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {muas.length === 0 ? (
                        <tr>
                          <td
                            colSpan={9} // Updated colspan
                            className="px-6 py-12 text-center text-gray-500"
                          >
                            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-lg font-medium">
                              No artists found
                            </p>
                            <p className="text-sm">
                              Try adjusting your search or filters
                            </p>
                          </td>
                        </tr>
                      ) : (
                        muas.map((mua) => (
                          <tr
                            key={mua.id}
                            className={`hover:bg-gray-50 transition-colors ${
                              isSelected(mua.id!) ? "bg-blue-50" : ""
                            }`}
                          >
                            <td className="px-4 py-4">
                              <input
                                type="checkbox"
                                checked={isSelected(mua.id!)}
                                onChange={() => handleCheckboxChange(mua.id!)}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                            </td>
                            <td className="px-4 py-4 w-fit">
                              <div className="flex items-center gap-3">
                                <div>
                                  <div className="text-sm text-gray-500">
                                    {mua.fullName}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="text-sm text-gray-500">
                                {mua.brandName}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="text-sm text-gray-500">
                                {mua.email}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="text-sm text-gray-500">
                                {mua.yearsExperience}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="text-sm text-gray-500">
                                {mua.avgPriceRange}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="text-sm text-gray-500">
                                {mua.totalFollowers}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="text-sm text-gray-500">
                                {mua.city}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="text-sm text-gray-500">
                                {mua.state}
                              </div>
                            </td>

                            <td className="px-4 py-4">
                              <div className="text-sm text-gray-500">
                                {mua.avgMonthlyReferrals}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="text-sm text-gray-500">
                                {mua.occasionFocus}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="text-sm text-gray-500">
                                {mua.created_at
                                  ? format(
                                      new Date(mua.created_at),
                                      "HH:mm:ss dd:mm:yyyy"
                                    )
                                  : "N/A"}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-2">
                                <ProgressBar
                                  progress={mua.onboarding_progress || 0}
                                />
                                <span className="text-sm text-gray-600 w-10 text-right">
                                  {mua.onboarding_progress || 0}%
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                  mua.status // 'status' is mapped from 'published'
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {mua.status ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                              <Link
                                href={`/admin/muas/${mua.id}`} // Updated link
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
