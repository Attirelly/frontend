import SellerDashboardContainer from "@/components/Seller/SellerDashboardContainer";
import { Suspense } from "react";

export default function SellerDashboardPage(){
  return (
    <Suspense>
      <SellerDashboardContainer/>
    </Suspense>
  )
}