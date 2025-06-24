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
    const { setStoreType } = useHeaderStore();
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
    // console.log(selected);

    useEffect(() => {
        const fetchStoreTypes = async () => {
            try {
                setLoading(true)
                const res = await api.get("stores/store_types");
                console.log(res.data);
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
        <div className="flex bg-[#F5F5F5] rounded-full overflow-hidden w-fit px-2 py-2">
            {tabs.map((tab, index) => (
                <div key={tab.value} className="flex items-center">
                    <button
                        className={clsx(
                            manrope.className,
                            'px-4 py-2 rounded-full transition-all duration-200 mx-2',
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



// 'use client';

// import React, { useEffect, useState } from 'react';
// import clsx from 'clsx';
// import { SelectOption } from '@/types/SellerTypes'; // ensure this has { label: string; value: string }
// import { api } from '@/lib/axios';

// interface StoreTypeTabsProps {
//   defaultValue?: string;
// }

// export default function StoreTypeTabs({ defaultValue = 'Designer Label' }: StoreTypeTabsProps) {
//   const [tabs, setTabs] = useState<SelectOption[]>([]);
//   const [selected, setSelected] = useState<string | undefined>(defaultValue);

//   useEffect(() => {
//     const fetchTabs = async () => {
//       try {
//         const response = await api.get('/stores/store_types'); // replace with actual API
//         setTabs(response.data || []);
//         if (!defaultValue && response.data.length > 0) {
//           setSelected(response.data[0].value);
//         }
//       } catch (error) {
//         console.error('Failed to fetch tabs:', error);
//       }
//     };

//     fetchTabs();
//   }, [defaultValue]);
//   console.log(tabs, selected);

//   const handleTabClick = (value: string) => {
//     setSelected(value);
//     // Optionally you can trigger something like URL param change or global state update here
//   };

//   if (tabs.length === 0) return null; // or a loader

//   return (
//     <div className="flex bg-gray-200 rounded-full overflow-hidden w-fit px-2 py-2">
//       {tabs.map((tab, index) => (
//         <div key={tab.value} className="flex items-center">
//           <button
//             className={clsx(
//               'px-4 py-2 text-sm font-medium rounded-full transition-all duration-200',
//               selected === tab.value
//                 ? 'bg-white shadow text-black'
//                 : 'text-gray-600 hover:text-black'
//             )}
//             onClick={() => handleTabClick(tab.value)}
//           >
//             {tab.label}
//           </button>

//           {index !== tabs.length - 1 && (
//             <div className="h-6 border-r border-gray-300 mx-1" />
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }
