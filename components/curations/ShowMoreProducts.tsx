import Image from "next/image";
import ProductCard from "../listings/ProductCard";
import { ProductCardType } from '@/types/ProductTypes';
import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { toast } from "sonner";

interface ShowMoreProductProps {
    store_id: string,
    limit?: number
}
export default function ShowMoreProducts({ store_id, limit }: ShowMoreProductProps) {
    const [products, setProducts] = useState<ProductCardType[]>([]);
    const fetchProducts = async (store_id: string) => {
        try {
            const res = await api.get(
                `/search/search_product?query=${store_id}&page=0&limit=${limit}&filters=&facetFilters=`
            );
            
            const data = res.data;
            const formattedProducts: ProductCardType[] = data.hits.map((item: any) => {
                const price = item.price || 500;
                const originalPrice = item.mrp || item.price || 500;

                // Avoid division by zero
                const discount =
                    originalPrice > price
                        ? Math.round(((originalPrice - price) / originalPrice) * 100)
                        : 0;

                return {
                    id:item.id,
                    imageUrl: item.image || [],
                    title: item.title || 'Untitled Product',
                    description: item.description || '',
                    price,
                    originalPrice,
                    discountPercentage: discount.toString(), // If needed as a string
                };
            });
            setProducts(formattedProducts);
        }
        catch (error) {
            toast.error('failed to fetch products');
        }
    }
    useEffect(() => {
        if (store_id) {
            fetchProducts(store_id);
        }
    }, []);
    return (
        <div className="flex gap-5 overflow-x-auto scrollbar-none">

            {products.map((product, index) => (
                <div key={index} className="w-[240px] flex-shrink-0">
                    <ProductCard {...product} />
                </div>
            ))}
        </div>
    )
}

// five product in a row , padding , gap - 5,