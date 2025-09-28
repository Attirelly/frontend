import { AlgoliaHit } from "@/types/algolia";
import Image from "next/image";

interface ProductContainerProps {
    products: AlgoliaHit[];
    isLoading: boolean;
    error: string | null;
    selectedProductIds: Set<string>;
    onProductSelect: (productId: string) => void;
    onSelectAll: () => void;
}

export function ProductContainer({ 
    products, 
    isLoading, 
    error, 
    selectedProductIds, 
    onProductSelect, 
    onSelectAll 
}: ProductContainerProps) {
    
    if (isLoading) {
        return <div className="text-center p-10">Loading products...</div>;
    }

    if (error) {
        return <div className="text-center p-10 text-red-500">{error}</div>;
    }

    if (products.length === 0) {
        return <div className="text-center p-10 text-gray-500">No products found for the selected criteria.</div>;
    }

    const isAllSelected = products.length > 0 && selectedProductIds.size === products.length;

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="p-4">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    checked={isAllSelected}
                                    onChange={onSelectAll}
                                    aria-label="Select all products"
                                />
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Product
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Price
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Genders
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.map((product) => (
                            <tr key={product.id} className={`hover:bg-gray-50 ${selectedProductIds.has(product.id) ? 'bg-blue-50' : ''}`}>
                                <td className="p-4">
                                     <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        checked={selectedProductIds.has(product.id)}
                                        onChange={() => onProductSelect(product.id)}
                                        aria-labelledby={`product-name-${product.id}`}
                                    />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-12 w-12">
                                            <Image
                                                className="h-12 w-12 rounded-md object-cover"
                                                src={product.image?.[0] || '/placeholder.png'}
                                                alt={product.product_name}
                                                width={48}
                                                height={48}
                                            />
                                        </div>
                                        <div className="ml-4">
                                            <div id={`product-name-${product.id}`} className="text-sm font-medium text-gray-900">{product.product_name}</div>
                                            <div className="text-sm text-gray-500">{product.title}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {product.price ? `$${product.price.toFixed(2)}` : 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {product.genders?.join(', ') || 'Unisex'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}