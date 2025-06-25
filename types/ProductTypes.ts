export interface CategoryType {
  name: string;
  category_id: string;
  level: number | null;
  parent_id?: string | null;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
  active?: boolean;
}

export interface ProductFiltersType {
  category: string[];
  pmCat : string[];
  subCat1: string[];
  subCat2: string[];
  subCat3: string[];
  size: string[];
  color: string[];
  // fabric: string[];
  rentAvailable: boolean | null;
  status: boolean[];
  // city: string | null;
  // subLocation: string[];
  productName: string[];
  sku: string[];
  imageUploadStatus: "Pending" | "Completed" | null;
}


export interface FilterOptions{
  categories: CategoryType[];
  sizes: string[];
  colors: string[];
  statuses: boolean[]; // e.g., ["Active", "Inactive"]
  productNames: string[];
  skus: string[];
  image_upload_statuses: ("Pending" | "Completed")[];
}

export interface Product {
  product_id: string;
  image: string;
  product_name: string;
  sku: string;
  category: CategoryType[];
  size: string;
  color: string;
  images:string[]
  mrp: number;
  shopify_id : string;
  price: number;
  rent: boolean;
  inventory: number;
  status: boolean;
  // city: string;
  // subLocation: string;
  imageUploadStatus: "Pending" | "Completed";
}

export interface Image {
  product_id: string;
  image_url: string;
  image_id: string;
}

export interface ProductCardType {
  imageUrl: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
}