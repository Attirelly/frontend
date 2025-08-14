'use client';

import React, { use, useEffect, useState } from 'react';
import clsx from 'clsx';
import { SelectOption, BrandType } from '@/types/SellerTypes';
import { api } from '@/lib/axios';
import { toast } from 'sonner';
import { useHeaderStore } from '@/store/listing_header_store';
import { event } from '@/lib/gtag';
import { manrope } from '@/font';
import StoreTypeTabsSkeleton from './skeleton/StoreTypeHeaderSkeleton';




interface StoreTypeTabsProps {
    //   tabs: SelectOption[];
    //   onChange: (value: string) => void;
    defaultValue?: string;
}

export default function StoreTypeTabs({
    //   tabs,
    //   onChange,
    defaultValue,
}: StoreTypeTabsProps) {
    const { setStoreType, storeType } = useHeaderStore();
    const [storeTypes, setStoreTypes] = useState<BrandType[]>([]);
    const [tabs, setTabs] = useState<SelectOption[]>([]);
    const [selectedStoreType, setSelectedStoreType] = useState<BrandType | null>(null);
    const [loading, setLoading] = useState(true);
    const handleTabClick = (value: SelectOption) => {
        const storeType: BrandType = {
            id: value.value,
            store_type: value.label
        }
        event({
            action: "Store Type Select",
            params: {
                "Store Type": value.label
            }
        });
        setSelectedStoreType(storeType);
        setStoreType(storeType);
        // onChange(value);
    };
    // 

    useEffect(() => {
    const fetchStoreTypes = async () => {
        try {
            setLoading(true);
            const res = await api.get("stores/store_types");
            
            setStoreTypes(res.data);
            const options: SelectOption[] = res.data.map((t: BrandType) => ({
                label: t.store_type,
                value: t.id
            }));
            setTabs(options);

            // Prefer storeType from Zustand, fallback to defaultValue
            const initialId = storeType?.id ?? defaultValue;

            if (initialId) {
                const initialOption = res.data.find((t: BrandType) => t.id === initialId);
                if (initialOption) {
                    const storeTypeObj: BrandType = {
                        id: initialOption.id,
                        store_type: initialOption.store_type,
                    };
                    setSelectedStoreType(storeTypeObj);
                    setStoreType(storeTypeObj); // update Zustand
                }
            }
        }
        catch (error) {
            toast.error("Failed to fetch store types");
        }
        finally {
            setLoading(false);
        }
    };

    fetchStoreTypes();
}, [defaultValue, storeType?.id, setStoreType]);


    if(loading){
        return <StoreTypeTabsSkeleton/>
    }
    return (
        <div className="flex bg-[#F5F5F5] rounded-full overflow-hidden w-fit px-2 py-2">
            {tabs.map((tab, index) => (
                <div key={tab.value} className="flex items-center">
                    <button
                        className={clsx(
                            manrope.className,
                            'px-4 py-2 rounded-full transition-all duration-200 mx-2 text-base',
                            selectedStoreType?.id === tab.value
                                ? 'bg-white shadow text-black'
                                : 'text-[#565656] hover:text-black'
                        )}
                        style={{fontWeight:500}}
                        onClick={() => handleTabClick(tab)}
                    >
                        {tab.label}
                    </button>

                    {index !== tabs.length - 1 && (
                        <div className="h-6 border-r border-gray-300 mx-2" />
                    )}
                </div>
            ))}
        </div>
    );
}
