// This mirrors the Pydantic models from your backend code.

export interface AlgoliaHit {
  id: string;
  store_id:string,
  product_name: string;
  title: string;
  description?: string;
  image?: string[];
  genders?: string[];
  price?: number;
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