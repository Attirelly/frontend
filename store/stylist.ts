'use client'
import { create } from 'zustand'
import {Product, FilterOptions} from '@/types/ProductTypes'
import { BrandType, GenderType, City, Area, Pincode, Category, StylistTypePriceRange, PriceRangeType, Expertise } from '@/types/StylistTypes';
import { connect } from 'http2';

// type BrandType = {
//   id: string,
//   store_type: string
// };

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
  role: 'user' | 'seller' | 'admin' ; // adjust based on your app
  created_at: string;
};

// type GenderType = {
//   id: string,
//   gender_value: string
// }


// type City = {
//   id : string,
//   name : string,
//   state_id : string
// }

// type Area = {
//   id : string,
//   name : string,
//   city_id : string
// }

// type Pincode = {
//   id: string,
//   code: string,
//   city_id: string
// }

// type StoreTypePriceRange = {
//   store_type: string;
//   price_range: string;
// };

type BusinessDetailsData = {
  stylistName: string | null;
  stylistEmail: string | null;
  // brandName: string;
  stylistNumber: string | null;
  stylistWpNum: string | null
  brandTypes: BrandType[];
  categories: Category[]; 
  genders: GenderType[];
  // rentOutfits: string | null;
  city: City[];
  area: Area[];
  pinCode: Pincode[];
  StylistAddress: string | null;
  Expertise : Expertise[];
  returnDays: number;
  experienceYears: number;
  // storeLocation: string | null; // New field for storing the full address or location details
};

type PriceFiltersData = {
  avgPriceMin : number | null,
  avgPriceMax : number | null,
  priceRanges : StylistTypePriceRange[],
  priceRangesStr : PriceRangeType[]
}

type WhereToSellData = {
  isOnline : boolean,
  isOffline : boolean,
  isBoth : boolean
}

type SocialLinksData = {
  instagramUsname : string | null,
  instagramUrl : string | null,
  facebookUrl : string | null,
  websiteUrl : string | null
}

type StylistPhotosData = {
  profileUrl : string,
  bannerUrl : string
}


type StylistState = {
  furthestStep: number;
  setFurthestStep: (step: number | ((prev : number) => number)) => void;

  stylistNumber : string | null;
  setStylistNumber : (num : string) => void;

  stylistId: string | null;
  setStylistId: (id: string) => void;

  stylistName : string | null;
  setStylistName : (name : string) => void;

  stylistEmail : string | null;
  setStylistEmail : (email: string) => void;

  stylistExperience : number | null;
  setStylistExperience: (year: number) => void;

  expertise : string | null;
  setExpertise : ( expertise : string) => void;

  activeSection : string;
  setActiveSection : (id : string) => void;

  whereToSellData : WhereToSellData | null;
  setWhereToSellData: (data : WhereToSellData) => void;

  businessDetailsValid: boolean;
  setBusinessDetailsValid: (valid: boolean) => void;

  businessDetailsData: BusinessDetailsData | null;
  setBusinessDetailsData: (data: BusinessDetailsData) => void;

  priceFiltersValid: boolean;
  setPriceFiltersValid: (valid: boolean) => void;

  priceFiltersData: PriceFiltersData | null;
  setPriceFiltersData : (data: PriceFiltersData) => void;

  location : Location | null;
  setLocation: (data : Location) => void;

  socialLinksData : SocialLinksData | null;
  setSocialLinksData : (data: SocialLinksData) => void;

  socialLinksValid : boolean;
  setSocialLinksValid : (valid: boolean) => void;

  stylistPhotosData : StylistPhotosData | null;
  setStylistPhotosData: (data: StylistPhotosData) => void;

  stylistPhotosValid : boolean;
  setStylistPhotosValid : (valid : boolean) => void;

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
  
  batch_id : string | null , 
  setBatchId : (batch_id :string|null )=>void ;

  isInstagramConnected : boolean ,
  setIsInstagramConnected: (connect : boolean)=>void;


  resetStylist: () => void;
}

export const useStylist = create<StylistState>((set) => ({
  furthestStep: 0,
  setFurthestStep: (step) =>
  set((state) => ({
    furthestStep: typeof step === 'function' ? step(state.furthestStep) : step,
  })),

  batch_id :null,
  setBatchId : (batch_id)=>set({batch_id:batch_id}), 
  
  stylistNumber: null,
  setStylistNumber: (num) => set({ stylistNumber: num }),

  stylistId: null,
  setStylistId: (id) => set({ stylistId: id }),

  stylistName: null,
  setStylistName: (name) => set({ stylistName: name }),

  stylistEmail: null,
  setStylistEmail: (email) => set({ stylistEmail: email }),

  stylistExperience: null,
  setStylistExperience: (num) => set({ stylistExperience: num }),

  expertise : null,
  setExpertise : (expertise) => set({expertise : expertise}),

  activeSection: 'brand',
  setActiveSection : (id) => set({ activeSection : id}),

  whereToSellData : null,
  setWhereToSellData : (data) => set({ whereToSellData : data}),

  businessDetailsValid: false,
  setBusinessDetailsValid: (valid) => set({ businessDetailsValid: valid }),

  businessDetailsData: null,
  setBusinessDetailsData: (data) => set({ businessDetailsData: data }),

  priceFiltersValid: false,
  setPriceFiltersValid: (valid) => set({ priceFiltersValid: valid }),

  priceFiltersData: null,
  setPriceFiltersData: (data) => set({ priceFiltersData: data }),

  location : null,
  setLocation : (data) => set({ location : data}),

  socialLinksData: null,
  setSocialLinksData: (data) => set({ socialLinksData: data }),

  socialLinksValid: false,
  setSocialLinksValid: (valid) => set({ socialLinksValid: valid }),

  stylistPhotosData: null,
  setStylistPhotosData: (data) => set({ stylistPhotosData: data }),
  

  stylistPhotosValid: false,
  setStylistPhotosValid: (valid) => set({ stylistPhotosValid: valid }),

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

  resetStylist: () =>
    set({
      furthestStep: 0,
      stylistNumber: null,
      stylistId: null,
      stylistName: null,
      stylistEmail: null,
      stylistExperience: null,
      expertise: null,
      activeSection: 'brand',
      businessDetailsValid: false,
      businessDetailsData: null,
      priceFiltersValid: false,
      priceFiltersData: null,
      location: null,
      socialLinksData: null,
      socialLinksValid: false,
      stylistPhotosData: null,
      stylistPhotosValid: false,
      products: [],
      filterOptions: null,
      qrId: null,
      user: null
    }),

    isInstagramConnected:false ,
    setIsInstagramConnected:(connect)=>set({isInstagramConnected:connect})

}))
