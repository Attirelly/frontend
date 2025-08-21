import ProductContainer from "@/components/listings/ProductContainer";

type StoreInfoContainerProps = {
  storeId: string;
};
export default function Catalogue({ storeId }: StoreInfoContainerProps) {
  return (
    <div className="h-full">
      <ProductContainer storeId = {storeId} colCount={4} />
    </div>
  );
}
