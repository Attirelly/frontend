export interface Brand {
  brand_id: string;
  name: string;
  logo_url: string;
}

export interface Category {
  category_id: string;
  name: string;
  level: number;
}

export interface Attribute {
  attribute_id: string;
  name: string;
  value: string;
}

export interface Color {
  color_id: string;
  color_name: string;
  hex_code: string | null;
}

export interface Size {
  size_id: string;
  size_name: string;
}

export interface VariantImage {
  variant_id: string;
  image_url: string;
  image_id: string;
}

export interface Variant {
  product_id: string;
  sku: string;
  price: number;
  mrp: number;
  discount: number;
  shopify_id: string | null;
  color: Color;
  size: Size;
  images: VariantImage[];
  active: boolean;
  quantity: number;
  variant_id: string;
}

export interface ProductImage {
  image_id: string;
  product_id: string;
  image_url: string;
}

export interface Product {
  product_id: string;
  store_id: string;
  product_name: string;
  brands: Brand;
  primary_category_id: string | null;
  primary_category?: Category;
  description: string;
  title: string;
  rent: boolean;
  target_audience: string | null;
  rating: number;
  like: number;
  views: number;
  share: number;
  shopify_id:string | null;
  categories: Category[];
  attributes: Attribute[];
  variants: Variant[];
  images: ProductImage[];
}