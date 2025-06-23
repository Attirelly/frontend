export interface City { id: string; name: string; state_id: string };

export interface Area { id: string, name: string, city_id: string };

export interface Pincode { id: string, code: string, city_id: string };

export interface SelectOption { value: string; label: string };
export interface BrandType { id: string; store_type: string };
export interface GenderType { id: string; gender_value: string };
export interface Category { category_id: string; name: string }

export interface StoreTypePriceRange {
  store_type_id:string;
  price_range_id:string;
  store_type?: string;
  price_range?: string;
};

export interface PriceRangeType{
  id : string,
  label? : string
}

export interface StoreCardType {
  id: string;
  imageUrl: string;
  storeName: string;
  location: string;
  storeTypes: string[];
  priceRanges: string[];
  bestSelling?: string[] | []
  discount?: number;
  instagramFollowers?: string;
}

export interface StoreInfoType {
  id : string, 
  imageUrl : string,
  locationUrl: string,
  storeName: string,
  post_count: string, 
  instagramFollowers?: string,
  product_count: string,
  bio: string,
  storeTypes: string[],
  priceRanges: string[]
}