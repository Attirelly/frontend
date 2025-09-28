// src/components/ProductCard.tsx
import Image from 'next/image';
import { AlgoliaHit } from '@/types/ProductCRM';

interface ProductCardProps {
  product: AlgoliaHit;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="border rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:scale-105">
      <div className="relative w-full h-64 bg-gray-200">
        <Image
          src={product.image?.[0] || '/placeholder.png'} // Provide a placeholder image
          alt={product.product_name || 'Product Image'}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold truncate">{product.product_name}</h3>
        <p className="text-gray-600 mt-1">{product.title}</p>
        <p className="text-xl font-bold mt-2">${product.price?.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default ProductCard;