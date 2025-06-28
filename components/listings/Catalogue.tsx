import ProductContainer from '@/components/listings/ProductContainer';
import { useSellerStore } from '@/store/sellerStore';

export default function Catalogue() {
  const{storeId} = useSellerStore();
  console.log(storeId);
  return (
    <div className="overflow-y-auto scrollbar-none h-[900]">
      <ProductContainer storeId='d013b10b-af22-407d-aa32-eec4d6e1bb50'/>
    </div>
  );
}