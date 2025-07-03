import CardTypeOne from "@/components/homepage/CardTypeOne";
import CardTwoType from "@/components/homepage/CardTypeTwo";
import HeroSection from "@/components/homepage/HeroSection";
import StoreTypeSelection from "@/components/homepage/StoreTypeSelection";
import ListingPageHeader from "@/components/listings/ListingPageHeader";

export default function HomePage() {
    return (
        <div className="flex flex-col">
            <ListingPageHeader />
            <HeroSection />
            <div className="mt-16 mx-auto mb-16">
                <StoreTypeSelection />
            </div>
            <div className="mx-auto">
               <CardTwoType imageurl="/Homepage/CardTypeTwo.svg" title="Label Parampara by Archit" description="Modal Town, Ludhiana"/>
            </div>

            <div className="mx-auto">
                <CardTypeOne imageUrl="/Homepage/CardTypeOne.svg" discountText="23" title="Embroidary Kurta"/>
            </div>



        </div>
    )
}