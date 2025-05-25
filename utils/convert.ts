interface FormData {
  keyDetails: {
    productName: string;
    productDescription: string;
    skuID: string;
    brand?: {
      brand_id: string;
      name: string;
    };
    store?: {
      store_id: string;
      store_name: string;
    };
  };
  attributes: {
    attributes: Record<string, {
      value: string;
      id: string;
    }>;
  };
  category: Record<string, string>;
  pricing: {
    storeListPrice: number;
  };
  variants: {
    colorChoice: string;
    sizeOptions: string;
    colorId?: string;
    sizeId?: string;
  };
  media?: {
    productImage?: string;
  };
}

interface Category {
  id: string;
  name: string;
}

interface Attribute {
  name: string;
  value: string;
  id: string; // Added valueId field
}

interface Variant {
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
  images?: string[];
}

interface ApiPayload {
  product_name: string;
  title: string;
  description: string;
  brand_id: string;
  brand_name: string;
  store_id: string;
  store_name: string;
  target_audience?: string;
  rating?: number;
  like?: number;
  views?: number;
  share?: number;
  categories: Category[];
  attributes: Attribute[];
  variants: Variant[];
  main_image?: string;
}

export default function transformFormToApiPayload(formData: FormData): ApiPayload {
  // Safely destructure with defaults
  const keyDetails = formData.keyDetails || {};
  const attributes = formData.attributes || { attributes: {} };
  const category = formData.category || {};
  const pricing = formData.pricing || {};
  const variants = formData.variants || {};
  const media = formData.media || {};

  // Process categories
  const categories: Category[] = Object.entries(category)
    .filter(([_, value]) => Boolean(value))
    .map(([level, id]) => ({
      id: id || '',
      name: level,
    }));

  // Process attributes - now includes both value and valueId
  const attributeArray: Attribute[] = Object.entries(attributes.attributes)
    .filter(([_, valueObj]) => Boolean(valueObj?.value))
    .map(([name, valueObj]) => ({
      name,
      value: String(valueObj.value),
      id: valueObj.id || '' // Include the valueId
    }));

  // Process variants
  const variant: Variant = {
    sku: keyDetails.skuID || '',
    price: pricing.storeListPrice || 0,
    color: {
      color_id: variants.colorId || '',
      color_name: variants.colorChoice || '',
    },
    size: {
      size_id: variants.sizeId || '',
      size_name: variants.sizeOptions || '',
    },
    images: media.productImage ? [media.productImage] : undefined,
  };

  // Build the final payload
  const payload: ApiPayload = {
    product_name: keyDetails.productName?.trim() || '',
    title: keyDetails.productName?.trim() || '',
    description: keyDetails.productDescription?.trim() || '',
    brand_id: keyDetails.brand?.brand_id || '',
    brand_name: keyDetails.brand?.name || '',
    store_id: keyDetails.store?.store_id || '',
    store_name: keyDetails.store?.store_name || '',
    categories,
    attributes: attributeArray,
    variants: [variant],
  };

  if (media.productImage) {
    payload.main_image = media.productImage;
  }

  return payload;
}