import ProductContainer from '@/components/listings/ProductContainer';
import { useSellerStore } from '@/store/sellerStore';


type StoreInfoContainerProps = {
  storeId: string;
};
export default function Catalogue({ storeId }: StoreInfoContainerProps) {
  return (
    <div className="overflow-y-auto scrollbar-none h-490">
      <ProductContainer storeId={storeId} />
    </div>
  );
}