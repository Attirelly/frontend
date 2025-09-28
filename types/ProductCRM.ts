// --- Store Related Types ---
export interface City {
  id: number;
  name: string;
}

export interface StoreType {
  id: number;
  name: string;
}

export interface Store {
  id: number;
  name: string;
  cityId: number;
  storeTypeId: number;
}

// --- Product Related Types ---
export interface Product {
  id: string;
  name: string;
  imageUrl: string;
  storeTypes: string[];
  priceRange: [number, number];
  genders: string[];
  categories: string[];
  brand: string;
  price: number;
  mrp: number;
  discount: number;
  size: string;
  color: string;
  sku: string;
}

export interface ProductFiltersState {
  categories: string[];
  skus: string[];
  sizes: string[];
  colors: string[];
  minPrice: number | string;
  maxPrice: number | string;
  // Add other filter states here (fabric, occasion, etc.)
}

// src/types/product.ts
export interface AlgoliaHit {
  id?: string;
  product_name?: string;
  title?: string;
  description?: string;
  image?: string[];
  genders?: string[];
  price?: number;
}

export interface ProductFacets {
  genders?: Record<string, number>;
  primary_category?: Record<string, number>;
  prices?: Record<string, number>;
  size?: Record<string, number>;
  colours?: Record<string, number>;
}

export interface AlgoliaProductResponse {
  hits: AlgoliaHit[];
  facets: ProductFacets;
  page: number;
  total_hits: number;
  total_pages: number;
}