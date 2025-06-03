export interface ProductFiltersType {
  category: string[];
  size: string[];
  color: string[];
  fabric: string[];
  rentAvailable: boolean | null;
  status: string[];
  city: string | null;
  subLocation: string[];
  productName: string;
  sku: string;
  imageUploadStatus: "Pending" | "Completed" | null;
}