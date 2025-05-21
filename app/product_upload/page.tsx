"use client" 
import BrandAndSeller from "@/components/ProductUploadSection/BrandAndSeller";
import PricingAndAvailability from "@/components/ProductUploadSection/PricingAndAvailability";
import ProductUploadSideBar from "@/components/ProductUploadSection/ProductUploadSideBar";
import VariantAndInventory from "@/components/ProductUploadSection/VariantAndInventory";
import { useState } from "react";

export default function ProductUploadPage(){   

    const [activeSection, setActiveSection] = useState('brand');
    return (
        <div className="flex flex-col md:flex-row gap-6 p-6">
                <ProductUploadSideBar selected={activeSection} onSelect={setActiveSection} />
                <VariantAndInventory />
                <PricingAndAvailability/>
                <BrandAndSeller/>

        </div>
    )
}   