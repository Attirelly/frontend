'use client';

import React, { use, useEffect, useState } from 'react';
import clsx from 'clsx';
import { SelectOption, PriceRangeType } from '@/types/SellerTypes';
import { api } from '@/lib/axios';
import { toast } from 'sonner';
import { useHeaderStore } from '@/store/listing_header_store';
import { event } from '@/lib/gtag';
import { manrope } from '@/font';
import StoreTypeTabsSkeleton from './skeleton/StoreTypeHeaderSkeleton';




interface PriceRangeProps {
    //   tabs: SelectOption[];
    //   onChange: (value: string) => void;
    defaultValue?: string;
}

export default function PriceRangeTabs({
    //   tabs,
    //   onChange,
    defaultValue,
}: PriceRangeProps) {
    const { setPriceRangeType } = useHeaderStore();
    const [priceRanges, setPriceRange] = useState<PriceRangeType[]>([]);
    const [tabs, setTabs] = useState<SelectOption[]>([]);
    const [selectedPriceRange, setSelectedPriceRange] = useState<PriceRangeType | null>(null);
    const [loading, setLoading] = useState(true);
    const handleTabClick = (value: SelectOption) => {
        const priceRange: PriceRangeType = {
            id: value.value,
            label: value.label
        }
        // event({
        //     action: "Store Type Select",
        //     params: {
        //         "Store Type": value.label
        //     }
        // });
        setSelectedPriceRange(priceRange);
        setPriceRangeType(priceRange);
        // onChange(value);
    };
    // console.log(selected);

    useEffect(() => {
        const fetchStoreTypes = async () => {
            try {
                setLoading(true)
                const res = await api.get(`/stores/price_ranges`)
                console.log(res.data);
                setPriceRange(res.data);
                const options: SelectOption[] = res.data.map((t: PriceRangeType) => ({
                    label: t.label,
                    value: t.id
                }));
                setTabs(options);
            }
            catch (error) {
                toast.error("Failed to fetch price Ranges");
            }
            finally{
                setLoading(false)
            }
        }
        fetchStoreTypes();
    }, []);

    if(loading){
        return <StoreTypeTabsSkeleton/>
    }
    return (
        <div className="flex bg-[#F5F5F5] rounded-full overflow-hidden w-fit px-10 py-1">
            {tabs.map((tab, index) => (
                <div key={tab.value} className="flex items-center">
                    <button
                        className={clsx(
                            manrope.className,
                            'px-10  rounded-full transition-all duration-200 mx-2',
                            selectedPriceRange?.id === tab.value
                                ? 'bg-white shadow text-black'
                                : 'text-[#565656] hover:text-black'
                        )}
                        style={{fontWeight:500}}
                        onClick={() => handleTabClick(tab)}
                    >
                        <span className='text-base'>{tab.label}</span>
                        <br />
                        <span className='text-xs text-[#8E8E8E]'>{tab.label === 'Affordable' ? '< 10,000' : tab.label === 'Premium' ? '10,000 - 25,000' : '> 25,000'}</span> 
                    </button>

                    {index !== tabs.length - 1 && (
                        <div className="h-6 border-r border-gray-300 mx-2" />
                    )}
                </div>
            ))}
        </div>
    );
}