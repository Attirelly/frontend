'use client'
import { create } from 'zustand'

type BrandType = {
  id: string,
  store_type: string
};

type SectionKey = 'brand' | 'price' | 'market' | 'social' | 'photos';


type GenderType = {
  id: string,
  gender_value: string
}

type City = {
  id : string,
  name : string,
  state_id : string
}

type Area = {
  id : string,
  name : string,
  city_id : string
}

type BusinessDetailsData = {
  ownerName: string;
  ownerEmail: string;
  brandName: string;
  businessWpNum: string | null
  brandTypes: BrandType[];
  genders: GenderType[];
  rentOutfits: string | null;
  city: City[];
  area: Area[];
  pinCode: string;
  brandAddress: string | null;
};

type PriceFiltersData = {
  avgPriceMin : number,
  avgPriceMax : number,
  priceRanges : Record<string, string>
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


type SellerState = {
  furthestStep: number;
  setFurthestStep: (step: number | ((prev : number) => number)) => void;

  sellerNumber : string | null;
  setSellerNumber : (num : string) => void;

  sellerId: string | null
  setSellerId: (id: string) => void

  storeId : string | null
  setStoreId: (id: string) => void

  activeSection : string
  setActiveSection : (id : string) => void

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
  setSocialLinksValid: (valid) => set({ socialLinksValid: valid })

}))
