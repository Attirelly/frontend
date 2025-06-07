import { useCurrentStep, useFormActions } from "@/store/product_upload_store";
import { use, useEffect } from "react";

export default function Blank() {
  
  const { setCurrentStep } = useFormActions();

  useEffect(() => {
    // Reset to step 1 when this component mounts
    setTimeout(() => {   
      setCurrentStep(1);
    }, 2000);
  }, [setCurrentStep]);

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg">
      Loading
    </div>
  );
}