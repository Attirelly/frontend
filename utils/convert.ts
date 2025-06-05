import { parse } from "path";

// Define input payload type
type InputPayload = {
  keyDetails: {
    productName: string;
    brand: {
      brand_id: string;
      name: string;
    };
    productDescription: string;
    productTitle: string;
    targetAudience: string;
    rating?: number;
    like?: number;
    views?: number;
    share?: number;
  };
  category: {
    [key: string]: { category_id: string; name: string } | undefined;
  };
  attributes: {
    attributes: {
      attribute_id: string;
      name: string;
      value: string;
    }[];
  };
  pricing: {
    price: number ; 
    mrp: number;
    rent : boolean;
  };
  variants: {
    variants: [{
      product_id?: string;
      sku: string;
      size: { id: string; name: string };
      color: { color_id: string; name: string   ; hex_code : string};
      images: string[];
      active: boolean;
      quantity: number;
    }];
  };
};

// Define output structure
type OutputPayload = {
  product_name: string;
  brand_id: string;
  store_id: string;
  description: string;
  title: string;
  target_audience: string;
  rating: number;
  like: number;
  views: number;
  share: number;
  rent: boolean;
  categories: { category_id: string; name: string }[];
  attributes: { attribute_id: string; name: string; value: string }[];
  variants: {
    product_id?: string;
    sku: string;
    price: number;
    color: {
      color_id: string;
      color_name: string;
    };
    size: {
      size_id: string;
      size_name: string;
    };
    images: string[];
    active: boolean;
    quantity: number;
  }[];
  brand_name: string;
  store_name: string;
};

// Transformer function
export function transformPayload(
  input: InputPayload,
  storeId: string,
  storeName: string
): OutputPayload {
  const formData = input;
  
  

  const {
    productName,
    productDescription,
    productTitle,
    targetAudience,
    rating = 0,
    like = 0,
    views = 0,
    share = 0,
    brand
  } = formData.keyDetails;

  const product_name = productName.trim();
  const title = productTitle?.trim() || product_name;

  const categories = Object.values(formData.category).filter(Boolean) as {
    category_id: string;
    name: string;
  }[];

  const attributes = formData.attributes.attributes.map((attr) => ({
    attribute_id: attr.attribute_id,
    name: attr.name,
    value: attr.value,
  }));

  const price = formData.pricing.price || 0
  const mrp =   formData.pricing.mrp || 0;
  const rent = formData.pricing.rent || false;
  console.log("form"  , formData)
  
  const variants = formData.variants?.variants.map((v) => ({
    sku: v.sku,
    price: price,
    mrp: mrp,
    color: {
      color_id: v.color.color_id,
      color_name: v.color.name,
    },
    size: {
      size_id: v.size.id,
      size_name: v.size.name,
    },
    images: v.images || [],
    active: v.active ?? true,
    quantity: v.quantity ?? 0,
  }));
  
  console.log("my convert variants" , variants) ; 
  return {
    product_name,
    brand_id: brand.brand_id,
    store_id: storeId,
    description: productDescription,
    title,
    target_audience: targetAudience,
    rating,
    rent,
    like,
    views,
    share,
    categories,
    attributes,
    variants,
    brand_name: brand.name,
    store_name: storeName,
  };
}
