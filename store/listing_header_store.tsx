import { create } from 'zustand'
import { City, BrandType } from '@/types/SellerTypes'


type HeaderState = {
    city: City|null;
    setCity: (city: City|null) => void;
    query: string;
    setQuery: (query: string) => void;
    storeType: BrandType | null;
    setStoreType: (storeType: BrandType | null) => void; 
    deliveryType: string;
    setDeliveryType : (delivery : string) => void;
    viewType: string;
    setViewType: (viewType: string) => void;
}

export const useHeaderStore = create<HeaderState>((set) => ({
    city: null,
    setCity: (city) => set({ city }),
    query: '',
    setQuery: (query) => set({ query }),
    storeType: null,
    setStoreType: (storeType: BrandType | null) => set({ storeType }),
    deliveryType: '',
    setDeliveryType: (delivery: string) => set({ deliveryType: delivery }),
    viewType: '',
    setViewType: (viewType: string) => set({ viewType }),
}));