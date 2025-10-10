import ProductCard from "../listings/ProductCard";
import { Product, ProductCardType } from "@/types/ProductTypes";
import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { toast } from "sonner";

interface ShowMoreProductProps {
  product?: Product;
  limit?: number;
  same_store?: boolean;
  price?: number;
}
export default function ShowMoreProducts({
  product,
  limit,
  same_store,
  price,
}: ShowMoreProductProps) {
  const [products, setProducts] = useState<ProductCardType[]>([]);
  const fetchProducts = async () => {
    try {
      let res;
      if (same_store) {
        res = await api.get(
          `/search/search_product?query=${product?.store_id}&page=0&limit=${limit}`
        );
      } else {
        const price_tolerance = 0.2;
        const min_price = (price ?? 0) * (1 - price_tolerance);
        const max_price = (price ?? 0) * (1 + price_tolerance);
        const filters = `NOT store_id:${product?.store_id} AND categories:"${product?.primary_category?.name}" AND price >= ${min_price} AND price <= ${max_price}`;
        const encodedFilters = encodeURIComponent(filters);

        res = await api.get(
          `/search/search_product?filters=${encodedFilters}&page=0&limit=${limit}`
        );
      }

      const data = res.data;
      const formattedProducts: ProductCardType[] = data.hits.map(
        (item: any) => {
          const price = item.price || 500;
          const originalPrice = item.mrp || item.price || 500;

          // Avoid division by zero
          const discount =
            originalPrice > price
              ? Math.round(((originalPrice - price) / originalPrice) * 100)
              : 0;

          return {
            id: item.id,
            imageUrl: item.image || [],
            title: item.store_name || "Untitled Product",
            description: item.title || "",
            price,
            originalPrice,
            discountPercentage: discount.toString(), // If needed as a string
          };
        }
      );
      setProducts(formattedProducts);
    } catch (error) {
      toast.error("failed to fetch products");
    }
  };
  useEffect(() => {
    if (product?.store_id) {
      fetchProducts();
    }
  }, [product]);
  return (
    // <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 overflow-x-auto scrollbar-none gap-2 md:gap-4">
    <div className="flex gap-2 overflow-x-scroll scrollbar-none">
      {products.map((product, index) => (
        <div key={index} className="flex-shrink-0 w-40 sm:w-50 md:w-60 lg:w-64">
          <ProductCard {...product} />
        </div>
      ))}
    </div>
  );
}

// five product in a row , padding , gap - 5,
