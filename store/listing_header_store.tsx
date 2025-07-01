import { create } from 'zustand'
import { City, BrandType, instaMediaType, PriceRangeType } from '@/types/SellerTypes'


type HeaderState = {
    city: City|null;
    setCity: (city: City|null) => void;
    query: string;
    setQuery: (query: string) => void;
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
    instaMedia: instaMediaType[];
    setInstaMedia:(instaMedia: instaMediaType[]) => void;
    profilePic: string;
    setProfilePic: (pic: string) => void;

}

export const useHeaderStore = create<HeaderState>((set) => ({
    city: null,
    setCity: (city) => set({ city }),
    query: '',
    setQuery: (query) => set({ query }),
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
    instaMedia: [],
    setInstaMedia: (instaMedia) => set({ instaMedia }),
    profilePic: '',
    setProfilePic: (pic: string) => set({ profilePic: pic }),
}));