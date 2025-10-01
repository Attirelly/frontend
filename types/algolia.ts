// This mirrors the Pydantic models from your backend code.

export interface AlgoliaHit {
  id: string;
  store_id:string,
  product_name?: string;
  title?: string;
  description?: string;
  image?: string[];
  genders?: string[];
  price?: number;
  // Add any other fields you expect in a product hit
}

export interface AlgoliaStorehit {
  id:string;
  store_name:string;
  city:string;
  area:string;
  registered_email:string;
  profile_image:string;
  home_page_image:string;
  store_address:string;
  store_types:string[];
  outfits:string[];
  genders:string[];
  average_price_min:number;
  average_price_max:number;
  sponsor:number;
  active:boolean;
  store_type_price_range:string[];
  discount:string;
  categories:string[];
  mobile:string;
  curr_section:number;
  followers_count:number;
}

export interface ProductFacets {
  genders: Record<string, number>;
  primary_category: Record<string, number>;
  prices: Record<string, number>;
  "variants.size_name": Record<string, number>;
  "variants.color_name": Record<string, number>;
}

export interface AlgoliaProductResponse {
  hits: AlgoliaHit[];
  facets: ProductFacets;
  page: number;
  total_hits: number;
  total_pages: number;
}

export interface SelectedProduct {
  productId: string;
  storeId: string;
};

export interface Curation{
  section_id:string;
  section_name:string;
  section_number:number;
  section_type:string;
  section_url:string;
}

