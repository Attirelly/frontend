// src/pages/DiscoverSellersPage.tsx

import React, { useState, useEffect, useCallback, ReactNode, useMemo } from "react";
import {
  InfluencerFilterSidebar,
  SelectedFilters,
  FilterOptions,
} from "@/components/Seller/InfluencerSidebar"; // User's path
import {
  buildFacetFilterString,
  buildNumericFilterString,
} from "@/utils/InfluencerFilterBuilder"; // User's path

// --- 1. IMPORT ALL ICONS (NEW + EXISTING) ---
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
  X, // For Modal
  User, // For Modal
  Mail, // For Modal
  Phone, // For Modal
  Link as LinkIcon, // For Modal
  Globe, // For Modal
  BarChart, // For Modal
  CheckSquare, // For Modal
  Target, // For Modal
  Briefcase, // For Modal
  Award, // For Modal
  FileText, // For Modal
  Calendar, // For Modal
  Languages, // For Modal
} from "lucide-react";
import { toast } from "sonner"; // User's import
import { api } from "@/lib/axios"; // User's import
import { useSellerStore } from "@/store/sellerStore";

// --- 2. INFLUENCER TYPE (Unchanged) ---
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
    website?: string;
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
  engagement_metrics?: Record<string, number | string>; // Allow string for '5.2%'
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
  id: string;
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

interface Bookmark {
seller_id:string,
store_id:string,
influencer_id:string
}

// --- 3. MAIN PAGE COMPONENT (UPDATED) ---
function DiscoverSellersPage() {
  const [selectedFilters, setSelectedFilters] =
    useState<SelectedFilters>(INITIAL_FILTERS);
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [dynamicFacets, setDynamicFacets] =
    useState<FilterOptions>(INITIAL_FACETS);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [defaultBookmarks, setDefaultBookmarks] = useState<Bookmark[]>([]);
  const {storeId, sellerId} = useSellerStore();
  
  // console.log(storeId,sellerId);

  // --- !! NEW STATE FOR MODAL !! ---
  const [selectedInfluencer, setSelectedInfluencer] =
    useState<Influencer | null>(null);

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

  useEffect(()=>{
    const fetchBookmarks = async () => {
      if (!sellerId || !storeId) return;
      try {
        const res = await api.get(
          `influencers/by-seller-store/?seller_id=${sellerId}&store_id=${storeId}`
        );
        setDefaultBookmarks(res.data);
      } catch (error) {
        console.error("Failed to fetch bookmarks:", error);
        toast.error("Failed to load your bookmarks.");
      }
    }
    fetchBookmarks();
  },[sellerId, storeId])

  const bookmarkedIds = useMemo(() => {
    return new Set(defaultBookmarks.map((b) => b.influencer_id));
  }, [defaultBookmarks]);

  // --- Data Fetching Function (Unchanged) ---
  const fetchInfluencers = useCallback(async () => {
    setLoading(true);
    try {
      const facetFilterString = buildFacetFilterString(selectedFilters);
      const numericFilterString = buildNumericFilterString(selectedFilters);

      const params = new URLSearchParams({
        query: searchQuery || "",
        page: (currentPage - 1).toString(),
        limit: ITEMS_PER_PAGE.toString(),
      });

      if (facetFilterString !== "[]") {
        params.append("facetFilters", facetFilterString);
      }
      if (numericFilterString !== "") {
        params.append("filters", numericFilterString);
      }

      const res: any = await api.get(
        `/search/search_influencers?${params.toString()}`
      );

      const data = res.data;
      setTotalItems(data.total_hits);
      setTotalPages(data.total_pages);
      setInfluencers(data.hits);

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

  // --- 4. RENDER (UPDATED) ---
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:gap-0 p-6 bg-gray-50 min-h-screen">
      {/* --- Sidebar Column --- */}

      


      <aside className="w-full lg:w-72 xl:w-80 flex-shrink-0">

        <div className="bg-white rounded-2xl sm:w-full lg:w-60 hidden lg:block">
         <form onSubmit={handleSearchSubmit} className="relative mb-4 border-black-600 sm:w-full lg:w-60">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email..."
            className="w-full pl-10 pr-4 py-2 border text-black border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </form>
      </div>

        <InfluencerFilterSidebar
          options={dynamicFacets}
          selectedFilters={selectedFilters}
          onFilterChange={handleFilterChange}
          onClearFilters={clearAllFilters}
        />

        <div className="bg-white rounded-2xl mt-5 sm:w-full lg:w-60 sm:block lg:hidden">
         <form onSubmit={handleSearchSubmit} className="relative mb-4 border-black-600 sm:w-full lg:w-60">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email..."
            className="w-full pl-10 pr-4 py-2 border text-black border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </form>
      </div>
      </aside>

      {/* --- Main Content Column --- */}
      <main className="flex-1 w-full ">
        

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
            </div>

            {influencers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {influencers.map((inf) => (
                  // --- !! PASS ONCLICK HANDLER TO CARD !! ---
                  <InfluencerCard
                    key={inf.id}
                    influencer={inf}
                    onViewProfile={setSelectedInfluencer}
                    sellerId={sellerId}
                    storeId={storeId}
                    isInitiallyBookmarked={bookmarkedIds.has(inf.id)}
                  />
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

      {/* --- !! RENDER THE MODAL !! --- */}
      <InfluencerDetailModal
        influencer={selectedInfluencer}
        onClose={() => setSelectedInfluencer(null)}
      />
    </div>
  );
}

// --- 5. INFLUENCER CARD COMPONENT (UPDATED) ---

function InfluencerCard({
  influencer,
  onViewProfile, // <-- NEW PROP
  sellerId,
  storeId,
  isInitiallyBookmarked,
}: {
  influencer: Influencer;
  onViewProfile: (influencer: Influencer) => void; // <-- NEW PROP TYPE
  sellerId:string | null;
  storeId:string | null;
  isInitiallyBookmarked: boolean;
}) {
  const [isBookmarked, setIsBookmarked] = useState(isInitiallyBookmarked);
  // const { storeId, sellerId } = useSellerStore();

  useEffect(() => {
    setIsBookmarked(isInitiallyBookmarked);
  }, [isInitiallyBookmarked]);

  // --- !! UPDATE CLICK HANDLER !! ---
  const handleCardClick = () => {
    onViewProfile(influencer); // Open the modal
  };

  const handleBookmarkClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isBookmarked) {
      // delete operation
      try {
        const payload = {
          "seller_id": sellerId,
          "store_id": storeId,
          "influencer_id": influencer.id
        }
        await api.delete(`/influencers/?seller_id=${sellerId}&store_id=${storeId}&influencer_id=${influencer.id}`)
        toast.success("Bookmark removed")
      }
      catch (err) {
        toast.error("Failed to remove bookmark")
      }
    }
    else {
      // post operation
      const payload = {
        "seller_id": sellerId,
        "store_id": storeId,
        "influencer_id": influencer.id
      }
      try {
        await api.post('/influencers/', payload)
        toast.success("Bookmark added successfully")
      }
      catch (err) {
        toast.error("Failed to add bookmark")
      }
    }
    setIsBookmarked(!isBookmarked);
    toast.success(
      isBookmarked
        ? `Removed bookmark for ${influencer.name}`
        : `Bookmarked ${influencer.name}`
    );
  };

  const handleExportClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.info("Export feature coming soon!");
  };

  // Helpers (Unchanged)
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
    return influencer.followers?.instagram || influencer.followers?.youtube || 0;
  };

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
      onClick={handleCardClick} // <-- ATTACH HANDLER
      className="bg-white w-full rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer"
    >
      {/* Card content... (Unchanged) */}
      <div className="relative">
        <img
          src={influencer.profile_photo || "https://via.placeholder.com/400x300"}
          alt={influencer.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute bottom-1 left-1 right-1 flex justify-between">
          <button
            onClick={handleExportClick}
            className="p-2 rounded-full bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white transition-colors"
            aria-label="Export"
          >
            <Download className="w-3 h-3" />
          </button>
          <button
            onClick={handleBookmarkClick}
            className={`p-2 rounded-full bg-white/80 backdrop-blur-sm transition-colors ${isBookmarked
              ? "text-blue-600 hover:bg-blue-50"
              : "text-gray-700 hover:bg-white"
              }`}
            aria-label="Bookmark"
          >
            <Bookmark
              className="w-3 h-3"
              fill={isBookmarked ? "currentColor" : "none"}
            />
          </button>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 truncate">
          {influencer.name}
        </h3>
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
          {influencer.category_niche &&
            influencer.category_niche.length > 0 && (
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
          {influencer.city && (
            <div className="flex items-center">
              <MapPin className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0" />
              <span className="text-gray-600">{influencer.city}</span>
            </div>
          )}
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

// --- 6. !! NEW INFLUENCER DETAIL MODAL COMPONENT !! ---
// (You can move this to its own file: components/Seller/InfluencerDetailModal.tsx)

function InfluencerDetailModal({
  influencer,
  onClose,
}: {
  influencer: Influencer | null;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState("overview");

  if (!influencer) {
    return null;
  }

  // --- Helper Functions & Components ---

  const formatPrice = (num?: number) => {
    if (num === undefined || num === null) return "N/A";
    return `₹${num.toLocaleString("en-IN")}`;
  };

  const formatCount = (num?: number) => {
    if (num === undefined || num === null) return "N/A";
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(0) + "K";
    return num.toString();
  };

  const DetailItem = ({
    icon: Icon,
    label,
    value,
  }: {
    icon: React.ElementType;
    label: string;
    value?: string | number | null;
  }) => (
    <div className="flex">
      <Icon className="w-4 h-4 text-gray-500 mr-3 flex-shrink-0 mt-1" />
      <div>
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="text-sm text-gray-900">{value || "N/A"}</dd>
      </div>
    </div>
  );

  const InfoChip = ({ children }: { children: React.ReactNode }) => (
    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
      {children}
    </span>
  );

  const SocialLinkButton = ({
    platform,
    url,
  }: {
    platform: "instagram" | "youtube" | "facebook" | "website" | string;
    url?: string;
  }) => {
    if (!url) return null;

    let Icon;
    let text;
    let classes;
    switch (platform) {
      case "instagram":
        Icon = Instagram;
        text = "Instagram";
        classes = "bg-[#E4405F] text-white";
        break;
      case "youtube":
        Icon = Youtube;
        text = "YouTube";
        classes = "bg-[#FF0000] text-white";
        break;
      case "facebook":
        Icon = Facebook;
        text = "Facebook";
        classes = "bg-[#1877F2] text-white";
        break;
      default:
        Icon = Globe;
        text = "Website";
        classes = "bg-gray-600 text-white";
    }

    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${classes} transition-opacity hover:opacity-90`}
      >
        <Icon className="w-4 h-4" />
        <span>{text}</span>
      </a>
    );
  };

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-lg font-semibold text-gray-900 mb-4">{children}</h3>
  );

  // --- Main Modal Content ---
  return (
    // Overlay
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center"
    >
      {/* Modal Container */}
      <div
        onClick={(e) => e.stopPropagation()} // Prevent closing on content click
        className="bg-gray-50 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* --- Header --- */}
        <div className="flex items-start justify-between p-6 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-4">
            <img
              src={
                influencer.profile_photo || "https://via.placeholder.com/100"
              }
              alt={influencer.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {influencer.name}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {influencer.short_bio || "No bio available."}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* --- Body (Scrollable) --- */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* --- Left Column (Contact & Links) --- */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white p-5 rounded-lg shadow-sm">
              <SectionTitle>Contact & Links</SectionTitle>
              <dl className="space-y-4">
                <DetailItem icon={Mail} label="Email" value={influencer.email} />
                <DetailItem
                  icon={Phone}
                  label="Phone"
                  value={influencer.phone_public}
                />
              </dl>
              <div className="flex flex-col gap-2 mt-4">
                <SocialLinkButton
                  platform="instagram"
                  url={influencer.social_links?.instagram}
                />
                <SocialLinkButton
                  platform="youtube"
                  url={influencer.social_links?.youtube}
                />
                <SocialLinkButton
                  platform="facebook"
                  url={influencer.social_links?.facebook}
                />
                <SocialLinkButton
                  platform="website"
                  url={influencer.social_links?.website}
                />
              </div>
            </div>
            {influencer.portfolio_file && (
              <div className="bg-white p-5 rounded-lg shadow-sm">
                <SectionTitle>Media Kit</SectionTitle>
                <a
                  href={influencer.portfolio_file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span>View Media Kit</span>
                </a>
              </div>
            )}
          </div>

          {/* --- Right Column (Tabs) --- */}
          <div className="md:col-span-2 bg-white p-5 rounded-lg shadow-sm">
            {/* Tab Headers */}
            <div className="border-b border-gray-200 mb-4">
              <nav className="-mb-px flex space-x-6 overflow-x-auto">
                {[
                  "overview",
                  "audience",
                  "collaboration",
                  "portfolio",
                ].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm capitalize ${activeTab === tab
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <SectionTitle>Basic Info</SectionTitle>
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-6">
                    <DetailItem
                      icon={User}
                      label="Gender"
                      value={influencer.gender}
                    />
                    <DetailItem
                      icon={MapPin}
                      label="City"
                      value={influencer.city}
                    />
                    <DetailItem
                      icon={Calendar}
                      label="Age Group"
                      value={influencer.age_group}
                    />
                    <DetailItem
                      icon={Languages}
                      label="Languages"
                      value={influencer.languages?.join(", ")}
                    />
                  </dl>
                  <SectionTitle>Niche & Style</SectionTitle>
                  <div className="flex flex-wrap gap-2">
                    {influencer.category_niche?.map((niche) => (
                      <InfoChip key={niche}>{niche}</InfoChip>
                    ))}
                    {influencer.content_style?.map((style) => (
                      <InfoChip key={style}>{style}</InfoChip>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "audience" && (
                <div className="space-y-6">
                  <SectionTitle>Followers</SectionTitle>
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-6">
                    <DetailItem
                      icon={Instagram}
                      label="Instagram"
                      value={formatCount(influencer.followers?.instagram)}
                    />
                    <DetailItem
                      icon={Youtube}
                      label="YouTube"
                      value={formatCount(influencer.followers?.youtube)}
                    />
                    <DetailItem
                      icon={Facebook}
                      label="Facebook"
                      value={formatCount(influencer.followers?.facebook)}
                    />
                  </dl>
                  <SectionTitle>Engagement</SectionTitle>
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-6">
                    <DetailItem
                      icon={BarChart}
                      label="Avg. Engagement"
                      value={influencer.engagement_metrics?.rate as string} // Assuming it's a string like '5.2%'
                    />
                    <DetailItem
                      icon={BarChart}
                      label="Avg. Reel Views"
                      value={formatCount(
                        influencer.engagement_metrics?.avg_reel_views as number
                      )}
                    />
                  </dl>
                  <SectionTitle>Demographics</SectionTitle>
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-6">
                    <DetailItem
                      icon={Users}
                      label="Top Age Groups"
                      value={influencer.top_age_groups?.join(", ")}
                    />
                    <DetailItem
                      icon={MapPin}
                      label="Top Locations"
                      value={influencer.top_locations?.join(", ")}
                    />
                  </dl>
                  {/* You could add a simple bar chart for audience_gender_split here */}
                </div>
              )}

              {activeTab === "collaboration" && (
                <div className="space-y-6">
                  <SectionTitle>Preferences</SectionTitle>
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-6">
                    <DetailItem
                      icon={CheckSquare}
                      label="Open to Barter"
                      value={influencer.open_to_barter}
                    />
                    <DetailItem
                      icon={Target}
                      label="Max Campaigns / Month"
                      value={influencer.max_campaigns_per_month}
                    />
                  </dl>
                  <div className="space-y-2">
                    <dt className="text-sm font-medium text-gray-500">
                      Preferred Collab Types
                    </dt>
                    <div className="flex flex-wrap gap-2">
                      {influencer.preferred_collab_types?.map((type) => (
                        <InfoChip key={type}>{type}</InfoChip>
                      ))}
                    </div>
                  </div>
                  <SectionTitle>Pricing Structure</SectionTitle>
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-6">
                    <DetailItem
                      icon={IndianRupee}
                      label="Instagram Reel"
                      value={formatPrice(influencer.pricing?.reel)}
                    />
                    <DetailItem
                      icon={IndianRupee}
                      label="Instagram Story"
                      value={formatPrice(influencer.pricing?.story)}
                    />
                    <DetailItem
                      icon={IndianRupee}
                      label="Instagram Post"
                      value={formatPrice(influencer.pricing?.post)}
                    />
                    <DetailItem
                      icon={IndianRupee}
                      label="Min. Campaign"
                      value={formatPrice(influencer.pricing?.campaign_min)}
                    />
                  </dl>
                </div>
              )}

              {activeTab === "portfolio" && (
                <div className="space-y-6">
                  <SectionTitle>Past Work</SectionTitle>
                  <div className="space-y-2">
                    <dt className="text-sm font-medium text-gray-500">
                      Brands Worked With
                    </dt>
                    <div className="flex flex-wrap gap-2">
                      {influencer.brands_worked_with?.length ? (
                        influencer.brands_worked_with.map((brand) => (
                          <InfoChip key={brand}>{brand}</InfoChip>
                        ))
                      ) : (
                        <p className="text-sm text-gray-600">N/A</p>
                      )}
                    </div>
                  </div>
                  <SectionTitle>Achievements</SectionTitle>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    {influencer.achievements?.length ? (
                      influencer.achievements.map((ach) => (
                        <li key={ach}>{ach}</li>
                      ))
                    ) : (
                      <li>N/A</li>
                    )}
                  </ul>
                  <SectionTitle>Best Campaign Links</SectionTitle>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {influencer.best_campaign_links?.length ? (
                      influencer.best_campaign_links.map((link) => (
                        <li key={link}>
                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline break-all"
                          >
                            {link}
                          </a>
                        </li>
                      ))
                    ) : (
                      <li>N/A</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiscoverSellersPage;