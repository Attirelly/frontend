import { AlgoliaHit } from "@/types/algolia";
import Image from "next/image";

interface ProductContainerProps {
    products: AlgoliaHit[];
    currentPage: number;
    totalPages: number;
    isLoading: boolean;
    error: string | null;
    // ✨ Update the props to match the new structure
  selectedProducts: AlgoliaHit[];
  onProductSelect: (product: AlgoliaHit) => void;
    onSelectAll: () => void;
    onPageChange: (page: number) => void;
}


const generatePagination = (currentPage: number, totalPages: number) => {
  // If there are 7 or fewer pages, show all of them
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is near the start
  if (currentPage < 3) {
    return [1, 2, 3, 4, '...', totalPages];
  }

  // If the current page is near the end
  if (currentPage > totalPages - 4) {
    return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is in the middle
  return [1, '...', currentPage, currentPage + 1, currentPage + 2, '...', totalPages];
};

export function ProductContainer({ 
    products, 
    currentPage,
    totalPages,
    isLoading, 
    error, 
    selectedProducts, // ✨ Destructure the new prop name
    onProductSelect, 
    onSelectAll,
    onPageChange, 
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

    // const isAllSelected = products.length > 0 && selectedProductIds.size === products.length;
    const isAllSelected = products.length > 0 && products.every(p => selectedProducts.some(sp => sp.id === p.id));
    const paginationRange = generatePagination(currentPage, totalPages);

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
                            <tr key={product.id} className={`hover:bg-gray-50 ${selectedProducts.some(p => p.id === product.id) ? 'bg-blue-50' : ''}`}>
                                <td className="p-4">
                                     <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        checked={selectedProducts.some(p => p.id === product.id)}
                                        onChange={() => onProductSelect(product)}
                                        aria-labelledby={`product-name-${product.id}`}
                                    />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-12 w-12">
                                            <Image
                                                className="h-12 w-12 rounded-md object-cover"
                                                src={product.image?.[0] || '/placeholder.png'}
                                                alt={product.product_name || 'product Name' }
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
            {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
          <div>
            <p className="text-sm text-gray-700">
              Page <span className="font-medium">{currentPage + 1}</span> of{' '}
              <span className="font-medium">{totalPages}</span>
            </p>
          </div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
            >
              &lt; <span className="sr-only">Previous</span>
            </button>
            
            {paginationRange.map((page, index) => {
              if (typeof page === 'string') {
                return (
                  <span key={`${page}-${index}`} className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300">
                    ...
                  </span>
                );
              }

              return (
                <button
                  key={page}
                  onClick={() => onPageChange(page - 1)}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                    currentPage === page - 1
                      ? 'z-10 bg-blue-600 text-white focus:outline-none'
                      : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              );
            })}
            
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
            >
              &gt; <span className="sr-only">Next</span>
            </button>
          </nav>
        </div>
      )}
        </div>
    );
}