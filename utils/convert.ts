import { log } from "console";
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
    price: number;
    mrp: number;
    rent: boolean;
  };
  variants: {
    variants: [{

      sku: string;
      size: { size_id: string; size_name: string };
      color: { color_id: string; color_name: string   ; hex_code : string};
      images: string[];
      active: boolean;
      // quantity: number;
    }];
  };
  media: {
    mainImage?: string[];
    variantImages?: {
      sku: string;
      images: string[];
    }[];
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
  images?: string[];
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
    // quantity: number;
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
  const images = formData.media.mainImage || [];

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
  
  const variants = formData.variants?.variants.map((v) => ({
    sku: v.sku,
    price: price,
    mrp: mrp,
    color: {
      color_id: v.color.color_id,
      color_name: v.color.color_name,
    },
    size: {
      size_id: v.size.size_id,
      size_name: v.size.size_name,
    },
    images: formData.media.variantImages?.find(
      (img) => img.sku === v.sku
    )?.images || [],
    active: v.active ?? true,
    // quantity: v.quantity ?? 0,
  }));
  
  const result =  {
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
    images, // mainImage is now a list of strings
    brand_name: brand.name,
    store_name: storeName,
  };
  console.log("my convert result" , result) ;
  return result;
  
}


export function convertToFormData(response: any) {

  return {
    keyDetails: {
      productName: response.product_name || "",
      productDescription: response.description || "",
      title: response.title || "",
      brand: response.brands || undefined,
      store: response.store_id ? { id: response.store_id, name: "" } : undefined,
    },
    category: response.categories
      ? response.categories.reduce((acc: any, c: any) => {
          if (c.level) {
            acc[`level${c.level}`] = { category_id: c.category_id, name: c.name };
          }
          return acc;
        }, {})
      : {},
    attributes: {
      attributes: response.attributes || [],
    },
    pricing: {
      price: response.variants && response.variants[0] ? response.variants[0].price : undefined,
      mrp: response.variants && response.variants[0] ? response.variants[0].mrp : undefined,
      rent: response.rent || false,
    },
    variants: {
      variants: (response.variants || []).map((v: any) => ({
        sku: v.sku,
        // quantity: v.quantity ?? 0,
        size: v.size
          ? { size_id: v.size.size_id ?? "", size_name: v.size.size_name ?? "" }
          : { size_id: "", size_name: "" },
        color: v.color
          ? { color_id: v.color.color_id ?? "", color_name: v.color.color_name ?? "", hex_code: "" }
          : { color_id: "", color_name: "", hex_code: "" }
      })),
    },
    media: {
      mainImage: (response?.images || []).map((image:any)=>image.image_url), // You can set this if you have a main image field
      variantImages: (response.variants || []).map((v: any) => ({
        sku: v.sku,
        images: (v.images || []).map((img: any) => img.image_url || img),
      })),
    },
  };
}
