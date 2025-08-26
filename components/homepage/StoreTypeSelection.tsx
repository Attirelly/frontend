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
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        router.prefetch('/store_listing')
    },[router]);

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
            <span className="text-2xl lg:text-3xl text-[#242424]" style={{ fontWeight: 400, wordSpacing: '2px' }}>SHOP BY CATEGORY</span>
            <div className="grid grid-cols-2 gap-x-10 gap-y-15 mt-8 md:flex lg:gap-23 ">
                {tabs.map((tab, index) => {
                    const storeImage = StoreTypeImage.find(
                        (item) => item.name.toLowerCase() === tab.label.toLowerCase()
                    );
                    return (
                            <div key={tab.value} className="flex flex-col items-center cursor-pointer gap-[18px] lg:gap-[24px]" onClick={() => handleTabClick(tab)}>
                                <div className="relative w-[75px] h-[75px] lg:w-[95px] lg:h-[95px] flex items-center justify-center">
                                    {/* <div className="relative w-40 h-40"> */}
                                        <Image
                                            src={storeImage?.url || '/Homepage/tailor.svg'}
                                            alt='Store Type'
                                            fill
                                            className="object-contain"
                                            sizes="95px"
                                        />
                                    {/* </div> */}

                                </div>
                                <div>
                                    <span key={tab.value} className="text-base lg:text-xl text-[#242424] text-center">{tab.label}</span>
                                </div>

                            </div>


                    )
                })}
            </div>
        </div>

    )
}