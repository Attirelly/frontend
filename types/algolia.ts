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
  mrp?:number;
  categories:string[];
  store_name:string;
  // Add any other fields you expect in a product hit
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

export interface StoreApiResponse {
    store_id: string;
    store_name: string;
    // Add other fields from your API response here if needed in the future
    // city: { city_id: string, city_name: string };
    // store_types: { store_type_id: string, store_type_name: string }[];
}