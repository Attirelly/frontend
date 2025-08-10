import { create } from 'zustand'
import { City, BrandType, instaMediaType, PriceRangeType, MediaResponseType, MediaItemType } from '@/types/SellerTypes'

// Replace with actual Ludhiana city object from your database
const defaultCity: City = {
  id: '2a3a78c1-2405-4ddf-b0a2-96e742e7b576',  // Use actual ID from your DB
  name: 'Ludhiana',
  state_id: "25234602-2c6e-4600-89d3-460bc2559a1d",
  // Add any other fields your `City` type requires
};



type HeaderState = {
    ambassadorType: string;
    setAmbassadorType:(ambassadorType:string) => void;
    city: City|null;
    setCity: (city: City|null) => void;
    query: string;
    setQuery: (query: string) => void;
    searchFocus:boolean;
    setSearchFocus: (search:boolean) => void;
    priceRangeType : PriceRangeType | null;
    setPriceRangeType : (priceRangeType : PriceRangeType | null) => void;
    storeType: BrandType | null;
    setStoreType: (storeType: BrandType | null) => void; 
    sortBy : string;
    setSortBy : (sortBy : string) => void;
    storeTypeString : string;
    setStoreTypeString : (storeTypeString : string) => void;
    deliveryType: string;
    setDeliveryType : (delivery : string) => void;
    viewType: string;
    setViewType: (viewType: string) => void;
    instaUsername : string;
    setInstaUsername: (instaUsername:string)=>void;
    instaMedia: instaMediaType[];
    setInstaMedia:(instaMedia: instaMediaType[]) => void;
    instaMediaApify : MediaItemType[];
    setInstaMediaApify: (instaMediaApify: MediaItemType[]) => void; 
    instaMediaLoading:boolean;
    setInstaMediaLoading: (instaMediaLoading:boolean) => void;
    profilePic: string;
    setProfilePic: (pic: string) => void;
    storeName: string;
    setStoreName: (name: string) => void;

}

export const useHeaderStore = create<HeaderState>((set) => ({
    ambassadorType: 'Students',
    setAmbassadorType: (ambassadorType: string) => set({ ambassadorType }),
    city: null,
    setCity: (city) => set({ city }),
    query: '',
    setQuery: (query) => set({ query }),
    searchFocus: false,
    setSearchFocus: (search: boolean) => set({ searchFocus: search }),
    priceRangeType: null,
    setPriceRangeType: (priceRangeType) => set({ priceRangeType }),
    storeType: null,
    setStoreType: (storeType: BrandType | null) => set({ storeType }),
    sortBy: 'date_desc',
    setSortBy: (sortBy: string) => set({ sortBy }),
    storeTypeString: '',
    setStoreTypeString: (storeTypeString: string) => set({ storeTypeString }),
    deliveryType: '',
    setDeliveryType: (delivery: string) => set({ deliveryType: delivery }),
    viewType: 'Posts',
    setViewType: (viewType: string) => set({ viewType }),
    instaUsername: '',
    setInstaUsername: (instaUsername: string) => set({ instaUsername }),
    instaMedia: [],
    setInstaMedia: (instaMedia) => set({ instaMedia }),
    instaMediaApify: [],
    setInstaMediaApify: (instaMediaApify: MediaItemType[]) => set({ instaMediaApify }),
    instaMediaLoading: false,
    setInstaMediaLoading: (instaMediaLoading: boolean) => set({ instaMediaLoading }),
    profilePic: '',
    setProfilePic: (pic: string) => set({ profilePic: pic }),
    storeName: '',
    setStoreName: (name: string) => set({ storeName: name }),
}));