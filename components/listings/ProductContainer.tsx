'use client';

import { useEffect, useRef, useState } from 'react';
import { api } from '@/lib/axios';
import ProductCard from './ProductCard';
import { useProductFilterStore, useFilterStore } from '@/store/filterStore';
import { ProductCardType } from '@/types/ProductTypes';


export default function ProductContainer({ storeId }: { storeId: string }) {
  const { selectedFilters, setFacets, facets } = useFilterStore();
  const [products, setProducts] = useState<ProductCardType[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);

  const buildFacetFilters = (facets: Record<string, string[]>): string => {
    const filters: string[][] = [];
    for (const key in facets) {
      if (facets[key].length > 0) {
        filters.push(facets[key].map((value) => `${key}:${value}`));
      }
    }
    return encodeURIComponent(JSON.stringify(filters));
  };

//   const buildFacetFilters = (filters: Record<string, string[]>) => {
//     const filtersArray: string[][] = [];
//     Object.entries(filters).forEach(([key, values]) => {
//       if (values.length > 0) {
//         filtersArray.push(values.map((v) => `${key}:${v}`));
//       }
//     });
//     return encodeURIComponent(JSON.stringify(filtersArray));
//   };

  const fetchProducts = async (currentPage: number) => {
    setLoading(true);
    const facetFilters = buildFacetFilters(selectedFilters);
    console.log('system hi system', facetFilters, selectedFilters);

    try {
      const res = await api.get(
        `/search/search_product?query=${storeId}&page=${currentPage}&limit=12&filters=${filters}&facetFilters=${facetFilters}`
      );
      const data = res.data;
      console.log(data);
      const formattedProducts: ProductCardType[] = data.hits.map((item: any) => ({
        imageUrl: item.image || 'https://picsum.photos/300/400',
        title: item.title || 'Untitled Product',
        description: item.description || '',
        price: item.price || 500,
        originalPrice: item.originalPrice || item.price || 500,
        discountPercentage: "23"
      }));

      if (currentPage === 0) {
        setFacets(data.facets);
        setProducts(formattedProducts);
      } else {
        setProducts((prev) => [...prev, ...formattedProducts]);
      }

      setTotalPages(data.total_pages || 1);
      setHasMore(currentPage < (data.total_pages || 1) - 1);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(0);
    fetchProducts(0);
  }, [selectedFilters]);

//   console.log(facets)

  useEffect(() => {
    if (page !== 0) fetchProducts(page);
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.5 }
    );
    const currentRef = loaderRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [loaderRef.current, hasMore, loading]);



  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product, index) => (
          <ProductCard key={`${product.title}-${index}`} {...product} />
        ))}
      </div>
      {hasMore && <div ref={loaderRef} className="h-12" />}
    </>
  );
}
