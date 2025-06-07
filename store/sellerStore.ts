'use client'
import { create } from 'zustand'
import {Product, FilterOptions} from '@/types/ProductTypes'

type BrandType = {
  id: string,
  store_type: string
};

type SectionKey = 'brand' | 'price' | 'market' | 'social' | 'photos';

type User = {
  id: string;
  name: string;
  email: string;
  birthday: string;
  contact_number: string | null;
  gender: string;
  location: string | null;
  profile_pic: string;
  provider: string;
  role: 'user' | 'seller' | 'admin'; // adjust based on your app
  created_at: string;
};

type GenderType = {
  id: string,
  gender_value: string
}

type City = {
  id : string,
  name : string,
  state_id : string | null
}

type Area = {
  id : string,
  name : string,
  city_id : string | null
}

type StoreTypePriceRange = {
  store_type: string;
  price_range: string;
};

type BusinessDetailsData = {
  ownerName: string | null;
  ownerEmail: string | null;
  brandName: string;
  businessWpNum: string | null
  brandTypes: BrandType[];
  genders: GenderType[];
  rentOutfits: string | null;
  city: City[];
  area: Area[];
  pinCode: string | null;
  brandAddress: string | null;
};

type PriceFiltersData = {
  avgPriceMin : number,
  avgPriceMax : number,
  priceRanges : StoreTypePriceRange[]
}

type WhereToSellData = {
  isOnline : boolean,
  isBoth : boolean
}

type SocialLinksData = {
  instagramUsname : string | null,
  instagramUrl : string | null,
  facebookUrl : string | null,
  websiteUrl : string | null
}

type StorePhotosData = {
  profileUrl : string,
  bannerUrl : string
}


type SellerState = {
  furthestStep: number;
  setFurthestStep: (step: number | ((prev : number) => number)) => void;

  sellerNumber : string | null;
  setSellerNumber : (num : string) => void;

  sellerId: string | null;
  setSellerId: (id: string) => void;

  sellerName : string | null;
  setSellerName : (name : string) => void;

  sellerEmail : string | null;
  setSellerEmail : (email: string) => void;

  storeId : string | null;
  setStoreId: (id: string) => void;

  activeSection : string;
  setActiveSection : (id : string) => void;

  businessDetailsValid: boolean;
  setBusinessDetailsValid: (valid: boolean) => void;

  businessDetailsData: BusinessDetailsData | null;
  setBusinessDetailsData: (data: BusinessDetailsData) => void;

  priceFiltersValid: boolean;
  setPriceFiltersValid: (valid: boolean) => void;

  priceFiltersData: PriceFiltersData | null;
  setPriceFiltersData : (data: PriceFiltersData) => void;

  whereToSellData : WhereToSellData | null;
  setWhereToSellData: (data : WhereToSellData) => void;

  socialLinksData : SocialLinksData | null;
  setSocialLinksData : (data: SocialLinksData) => void;

  socialLinksValid : boolean;
  setSocialLinksValid : (valid: boolean) => void;

  storePhotosData : StorePhotosData | null;
  setStorePhotosData: (data: StorePhotosData) => void;

  storePhotosValid : boolean;
  setStorePhotosValid : (valid : boolean) => void;

  qrId : string | null;
  setQrId: (id: string) => void;

  user: User | null;
  setUser: (user: User) => void;
  resetUser: () => void;

  products: Product[];
  setProducts: (products: Product[]) => void;
  
  filterOptions: FilterOptions | null;
  setFilterOptions: (filteroptions: FilterOptions) => void;

  hasFetchedProducts: boolean;
  setHasFetchedProducts: (fetched: boolean) => void;


  resetSellerStore: () => void;
}

export const useSellerStore = create<SellerState>((set) => ({
  furthestStep: 0,
  setFurthestStep: (step) =>
  set((state) => ({
    furthestStep: typeof step === 'function' ? step(state.furthestStep) : step,
  })),


  sellerNumber: null,
  setSellerNumber: (num) => set({ sellerNumber: num }),

  sellerId: null,
  setSellerId: (id) => set({ sellerId: id }),

  sellerName: null,
  setSellerName: (name) => set({ sellerName: name }),

  sellerEmail: null,
  setSellerEmail: (email) => set({ sellerEmail: email }),

  storeId: null,
  setStoreId: (id) => set({ storeId: id }),

  activeSection: 'brand',
  setActiveSection : (id) => set({ activeSection : id}),

  businessDetailsValid: false,
  setBusinessDetailsValid: (valid) => set({ businessDetailsValid: valid }),

  businessDetailsData: null,
  setBusinessDetailsData: (data) => set({ businessDetailsData: data }),

  priceFiltersValid: false,
  setPriceFiltersValid: (valid) => set({ priceFiltersValid: valid }),

  priceFiltersData: null,
  setPriceFiltersData: (data) => set({ priceFiltersData: data }),

  whereToSellData : null,
  setWhereToSellData : (data) => set({ whereToSellData : data}),

  socialLinksData: null,
  setSocialLinksData: (data) => set({ socialLinksData: data }),

  socialLinksValid: false,
  setSocialLinksValid: (valid) => set({ socialLinksValid: valid }),

  storePhotosData: null,
  setStorePhotosData: (data) => set({ storePhotosData: data }),

  storePhotosValid: false,
  setStorePhotosValid: (valid) => set({ storePhotosValid: valid }),

  qrId: null,
  setQrId: (id) => set({ qrId: id }),

  user: null,
  setUser: (user) => set({ user }),
  resetUser: () => set({ user: null }),

  products: [],
  setProducts: (products) => set({ products }),

  filterOptions: null,
  setFilterOptions: (filteroptions) => set({ filterOptions: filteroptions }),

  hasFetchedProducts: false,
  setHasFetchedProducts: (fetched) => set({ hasFetchedProducts: fetched }),

  resetSellerStore: () =>
    set({
      furthestStep: 0,
      sellerNumber: null,
      sellerId: null,
      sellerName: null,
      sellerEmail: null,
      storeId: null,
      activeSection: 'brand',
      businessDetailsValid: false,
      businessDetailsData: null,
      priceFiltersValid: false,
      priceFiltersData: null,
      whereToSellData: null,
      socialLinksData: null,
      socialLinksValid: false,
      storePhotosData: null,
      storePhotosValid: false,
      products: [],
      filterOptions: null,
      qrId: null,
      user: null
    }),

}))
