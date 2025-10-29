// src/pages/DiscoverSellersPage.tsx

import React, { useState, useEffect, useCallback } from "react";
import {
  InfluencerFilterSidebar,
  SelectedFilters,
  FilterOptions,
} from "@/components/Seller/InfluencerSidebar"; // User's path
import {
  buildFacetFilterString,
  buildNumericFilterString,
} from "@/utils/InfluencerFilterBuilder"; // User's path
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Download,
  MapPin,
  Tag,
  IndianRupee,
  Users,
  Instagram,
  Youtube,
  Facebook,
} from "lucide-react";
import { toast } from "sonner"; // User's import
import { api } from "@/lib/axios"; // User's import

// --- 1. UPDATED INFLUENCER TYPE ---
// This type matches the Algolia record structure you provided
type Influencer = {
  gender: string;
  age_group: string;
  name: string;
  email: string;
  phone_internal?: string;
  phone_public?: string;
  languages?: string[];
  primary_platform: "YouTube" | "Instagram" | "Facebook" | string;
  social_links: {
    instagram?: string;
    youtube?: string;
    facebook?: string;
    [key: string]: any;
  };
  category_niche?: string[];
  content_style?: string[];
  onboarding_step: number;
  followers: {
    instagram?: number;
    youtube?: number;
    facebook?: number;
  };
  engagement_metrics?: Record<string, number>;
  audience_gender_split?: Record<string, number>;
  top_age_groups?: string[];
  top_locations?: string[];
  preferred_collab_types?: string[];
  open_to_barter: "Yes" | "No" | string;
  max_campaigns_per_month?: number;
  pricing: {
    reel?: number;
    story?: number;
    post?: number;
    campaign_min?: number;
    campaign_max?: number;
  };
  barter_value_min?: number;
  brands_worked_with?: string[];
  best_campaign_links?: string[];
  achievements?: string[];
  state?: string;
  city?: string;
  area?: string;
  pincode?: string;
  travel_readiness?: string;
  attend_events?: boolean;
  profile_photo?: string;
  portfolio_file?: string;
  short_bio?: string;
  created_at: string;
  updated_at: string;
  active: boolean;
  created_at_timestamp: number;
  objectID: string; // Algolia's unique ID
};

// --- DEFAULT STATES (Unchanged) ---
const DEFAULT_RANGE: [number, number] = [0, 10000000];
const ITEMS_PER_PAGE = 20;

const INITIAL_FILTERS: SelectedFilters = {
  location: [],
  genders: [],
  category: [],
  followers_instagram: DEFAULT_RANGE,
  followers_facebook: DEFAULT_RANGE,
  followers_youtube: DEFAULT_RANGE,
  price_story: DEFAULT_RANGE,
  price_reel: DEFAULT_RANGE,
  price_post: DEFAULT_RANGE,
  avg_views: DEFAULT_RANGE,
};

const INITIAL_FACETS: FilterOptions = {
  locations: [],
  genders: [],
  categories: [],
};

// --- MAIN PAGE COMPONENT ---
function DiscoverSellersPage() {
  const [selectedFilters, setSelectedFilters] =
    useState<SelectedFilters>(INITIAL_FILTERS);

  // --- Data and UI State ---
  const [influencers, setInfluencers] = useState<Influencer[]>([]); // Use the new type
  const [dynamicFacets, setDynamicFacets] =
    useState<FilterOptions>(INITIAL_FACETS);
  const [loading, setLoading] = useState(false);

  // --- Pagination State (Unchanged) ---
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  // --- Search & Sort State (Unchanged) ---
  const [searchQuery, setSearchQuery] = useState("");

  // --- Filter Handlers (Unchanged) ---
  const handleFilterChange = (
    key: keyof SelectedFilters,
    value: string | [number, number]
  ) => {
    setSelectedFilters((prev) => {
      const currentValues = prev[key];
      if (Array.isArray(currentValues) && typeof value === "string") {
        const newValues = currentValues.includes(value)
          ? currentValues.filter((v) => v !== value)
          : [...currentValues, value];
        return { ...prev, [key]: newValues };
      }
      if (Array.isArray(currentValues) && Array.isArray(value)) {
        return { ...prev, [key]: value };
      }
      return prev;
    });
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSelectedFilters(INITIAL_FILTERS);
    setCurrentPage(1);
  };

  // --- Data Fetching Function ---
  const fetchInfluencers = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Build Filter Strings
      const facetFilterString = buildFacetFilterString(selectedFilters);
      // NOTE: Make sure your buildNumericFilterString handles the dateRange
      // For now, I'll assume it only needs selectedFilters
      const numericFilterString = buildNumericFilterString(selectedFilters);

      // 2. Build URL (Unchanged, uses "filters")
      const params = new URLSearchParams({
        query: searchQuery || "",
        page: (currentPage - 1).toString(),
        limit: ITEMS_PER_PAGE.toString(),
      });

      if (facetFilterString !== "[]") {
        params.append("facetFilters", facetFilterString);
      }
      // Your user-specific change:
      if (numericFilterString !== "") { 
        params.append("filters", numericFilterString);
      }

      const res: any = await api.get(
        `/search/search_influencers?${params.toString()}`
      );

      const data = res.data;
      setTotalItems(data.total_hits);
      setTotalPages(data.total_pages);

      // --- 3. UPDATED DATA MAPPING ---
      // We can just set the hits directly, as they match our 'Influencer' type
      setInfluencers(data.hits);

      // 4. Map Dynamic Facet Data (Unchanged)
      const newFacets: FilterOptions = {
        locations: Object.keys(data.facets?.city || {}),
        genders: Object.keys(data.facets?.gender || {}),
        categories: Object.keys(data.facets?.category_niche || {}),
      };
      setDynamicFacets(newFacets);
    } catch (error) {
      console.error("Failed to fetch influencers:", error);
      toast.error("Failed to fetch influencers. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [selectedFilters, currentPage, searchQuery]);

  // --- useEffect Hook (Unchanged) ---
  useEffect(() => {
    fetchInfluencers();
  }, [fetchInfluencers]);

  // --- Search Handler (Unchanged) ---
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchInfluencers();
  };

  // --- 4. UPDATED RENDER ---
  return (
    <div className="flex flex-col lg:flex-row gap-8 p-6 bg-gray-50 min-h-screen">
      {/* --- Sidebar Column --- */}
      <aside>
        <InfluencerFilterSidebar
          options={dynamicFacets}
          selectedFilters={selectedFilters}
          onFilterChange={handleFilterChange}
          onClearFilters={clearAllFilters}
        />
      </aside>

      {/* --- Main Content Column --- */}
      <main className="flex-1 min-w-0">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </form>

        {/* Results Area */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-700">
                Results ({totalItems} Found)
              </h2>
              {/* Add SortBy dropdown here if needed */}
            </div>

            {influencers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {influencers.map((inf) => (
                  <InfluencerCard key={inf.objectID} influencer={inf} />
                ))}
              </div>
            ) : (
              <div className="p-4 bg-white rounded-lg shadow text-center text-gray-500">
                <p>No influencers found matching your criteria.</p>
              </div>
            )}
            
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </main>
    </div>
  );
}

// --- 5. NEW INFLUENCER CARD COMPONENT ---

function InfluencerCard({ influencer }: { influencer: Influencer }) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleCardClick = () => {
    toast.success(`Clicked on ${influencer.name}`);
    // We will decide later what to do with it
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    setIsBookmarked(!isBookmarked);
    console.log(
      isBookmarked
        ? `Removed bookmark for ${influencer.name}`
        : `Bookmarked ${influencer.name}`
    );
  };

  const handleExportClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    console.log(`Exporting ${influencer.name} as CSV/PDF...`);
    toast.info("Export feature coming soon!");
  };

  // Helper to get platform-specific follower count
  const getFollowerCount = () => {
    const platform = influencer.primary_platform?.toLowerCase();
    if (platform === "instagram") {
      return influencer.followers?.instagram || 0;
    }
    if (platform === "youtube") {
      return influencer.followers?.youtube || 0;
    }
    if (platform === "facebook") {
      return influencer.followers?.facebook || 0;
    }
    // Fallback
    return influencer.followers?.instagram || influencer.followers?.youtube || 0;
  };

  // Helper to format large numbers
  const formatCount = (num: number) => {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(0) + "K";
    return num;
  };

  const followers = formatCount(getFollowerCount());
  const platform = influencer.primary_platform;
  const basePrice = influencer.pricing?.campaign_min;

  return (
    <div
      onClick={handleCardClick}
      className="bg-white w-full rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer"
    >
      <div className="relative">
        <img
          src={influencer.profile_photo || "https://via.placeholder.com/400x300"}
          alt={influencer.name}
          className="w-full h-48 object-cover"
        />
        {/* Bookmark & Export Buttons */}
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            onClick={handleExportClick}
            className="p-2 rounded-full bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white transition-colors"
            aria-label="Export"
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={handleBookmarkClick}
            className={`p-2 rounded-full bg-white/80 backdrop-blur-sm transition-colors ${
              isBookmarked
                ? "text-blue-600 hover:bg-blue-50"
                : "text-gray-700 hover:bg-white"
            }`}
            aria-label="Bookmark"
          >
            <Bookmark
              className="w-5 h-5"
              fill={isBookmarked ? "currentColor" : "none"}
            />
          </button>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 truncate">
          {influencer.name}
        </h3>
        
        {/* Platform & Followers */}
        <div className="flex items-center text-gray-600 mt-2">
          {platform === "Instagram" && <Instagram className="w-4 h-4 mr-2" />}
          {platform === "YouTube" && <Youtube className="w-4 h-4 mr-2" />}
          {platform === "Facebook" && <Facebook className="w-4 h-4 mr-2" />}
          <span className="font-semibold">{platform}</span>
          <span className="mx-2">|</span>
          <Users className="w-4 h-4 mr-1" />
          <span className="font-semibold">{followers}</span>
        </div>

        <div className="mt-4 space-y-2 text-sm">
          {/* Category/Niche */}
          {influencer.category_niche && influencer.category_niche.length > 0 && (
            <div className="flex items-start">
              <Tag className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0 mt-0.5" />
              <div className="flex flex-wrap gap-1">
                {influencer.category_niche.slice(0, 3).map((niche) => (
                  <span
                    key={niche}
                    className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                  >
                    {niche}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Location */}
          {influencer.city && (
            <div className="flex items-center">
              <MapPin className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0" />
              <span className="text-gray-600">{influencer.city}</span>
            </div>
          )}

          {/* Base Price */}
          {basePrice && (
            <div className="flex items-center">
              <IndianRupee className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0" />
              <span className="text-gray-600">
                Starts from{" "}
                <span className="font-semibold text-gray-800">
                  ₹{basePrice.toLocaleString("en-IN")}
                </span>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Pagination Component (Unchanged) ---
function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </button>

      <span className="text-sm text-gray-700">
        Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

export default DiscoverSellersPage;