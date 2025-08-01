import { Suspense } from "react";
import StoreProfilePage from "./StoreProfilePage";

export default function StoreDescriptionPage(){
  return (
    <Suspense>
      <StoreProfilePage/>
    </Suspense>
  )
}