export interface ProductFiltersType {
  category: string[];
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
  categories: string[];
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
  category: string;
  size: string;
  color: string;
  // fabric: string;
  mrp: number;
  price: number;
  rent: boolean;
  inventory: number;
  status: boolean;
  // city: string;
  // subLocation: string;
  imageUploadStatus: "Pending" | "Completed";
}