'use client';
import { api } from "@/lib/axios";
import { useHeaderStore } from "@/store/listing_header_store";
import { BrandType, SelectOption } from "@/types/SellerTypes";
import { useEffect, useState } from "react"
import { toast } from "sonner";
import { manrope } from "@/font";
import Image from "next/image";
import { useRouter } from "next/navigation";

const StoreTypeImage = [
    { name: 'Designer Label', url: '/Homepage/designer_labels.svg' },
    { name: 'Retail Store', url: '/Homepage/retail_stores.svg' },
    { name: 'Boutiques', url: '/ListingPageHeader/boutiques.svg' },
    { name: 'Tailor', url: '/Homepage/tailor.svg' },
    { name: 'Stylist', url: '/Homepage/styler.svg' },
];


export default function StoreTypeSelection() {
    const { setStoreType, storeType } = useHeaderStore();
    const [storeTypes, setStoreTypes] = useState<BrandType[]>([]);
    const [tabs, setTabs] = useState<SelectOption[]>([]);
    // const [selectedStoreType, setSelectedStoreType] = useState<BrandType | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    useEffect(() => {
        router.prefetch('/store_listing')
    },[router])
    const handleTabClick = (value: SelectOption) => {
        const storeType: BrandType = {
            id: value.value,
            store_type: value.label
        }
        // event({
        //     action: "Store Type Select",
        //     params: {
        //         "Store Type": value.label
        //     }
        // });
        // setSelectedStoreType(storeType);
        setStoreType(storeType);
        router.push('/store_listing');
        // onChange(value);
    };
    // 

    useEffect(() => {
        const fetchStoreTypes = async () => {
            try {
                setLoading(true)
                const res = await api.get("stores/store_types");
                
                setStoreTypes(res.data);
                const options: SelectOption[] = res.data.map((t: BrandType) => ({
                    label: t.store_type,
                    value: t.id
                }));
                setTabs(options);
            }
            catch (error) {
                toast.error("Failed to fetch store types");
            }
            finally {
                setLoading(false)
            }
        }
        fetchStoreTypes();
    }, []);
    return (
        <div className={`${manrope.className} flex flex-col items-center`}
            style={{ fontWeight: 500 }}>
            <span className="text-3xl text-[#242424]" style={{ fontWeight: 400 }}>SHOP BY CATEGORY</span>
            <div className="flex gap-23 mt-8">
                {tabs.map((tab, index) => {
                    const storeImage = StoreTypeImage.find(
                        (item) => item.name.toLowerCase() === tab.label.toLowerCase()
                    );
                    return (
                            <div key={tab.value} className="flex flex-col items-center cursor-pointer" onClick={() => handleTabClick(tab)}>
                                <div className="w-36 h-36 flex items-center justify-center">
                                    <div className="relative w-40 h-40">
                                        <Image
                                            src={storeImage?.url || '/Homepage/tailor.svg'}
                                            alt='Store Type'
                                            fill
                                            sizes="160px"
                                        />
                                    </div>

                                </div>
                                <div>
                                    <span key={tab.value} className="text-xl text-[#242424]">{tab.label}</span>
                                </div>

                            </div>


                    )
                })}
            </div>
        </div>

    )
}