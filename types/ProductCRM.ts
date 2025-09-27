export interface Store {
  id: string;
  name: string;
  city: string;
  storeType: string;
}

export interface Product {
  id: string;
  imageUrl: string;
  name: string;
  storeTypes: string[];
  priceRanges: string[];
  genders: string[];
  categories: {
    main: string;
    subcat1: string;
    subcat2: string;
  };
  brand: string;
  price: number;
  mrp: number;
  discount: number;
  size: string;
  color: string;
  sku: string;
  fabric: string;
  occasion: string;
}

export interface ProductFilters {
  categories: string[];
  subcat1: string[];
  subcat2: string[];
  skus: string[];
  sizes: string[];
  colors: string[];
  fabrics: string[];
  occasions: string[];
  minPrice: number | '';
  maxPrice: number | '';
}

export interface FilterOptions {
  categories: string[];
  subcat1: string[];
  subcat2: string[];
  skus: string[];
  sizes: string[];
  colors: string[];
  fabrics: string[];
  occasions: string[];
}