'use client'
import { create } from 'zustand'

type BrandType = {
  id: string,
  store_type: string
};

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
  businessWpNum: number | null
  brandTypes: BrandType[];
  genders: GenderType[];
  rentOutfits: string | null;
  city: City[];
  area: Area[];
  pinCode: string;
  brandAddress: string
};


type SellerState = {
  sellerId: string | null
  setSellerId: (id: string) => void

  businessDetailsValid: boolean;
  setBusinessDetailsValid: (valid: boolean) => void;

  businessDetailsData: BusinessDetailsData | null;
  setBusinessDetailsData: (data: BusinessDetailsData) => void;
}

export const useSellerStore = create<SellerState>((set) => ({
  sellerId: null,
  setSellerId: (id) => set({ sellerId: id }),

  businessDetailsValid: false,
  setBusinessDetailsValid: (valid) => set({ businessDetailsValid: valid }),

  businessDetailsData: null,
  setBusinessDetailsData: (data) => set({ businessDetailsData: data }),
}))
