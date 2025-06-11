import { useCurrentStep, useFormActions } from "@/store/product_upload_store";
import { use, useEffect } from "react";

export default function Blank() {
  
  const { setStepValidation } = useFormActions() ;
  useEffect(()=>{
    setStepValidation(0,true);
  },[])
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg">
      Disclaimer : Create New Product
    </div>
  );
}