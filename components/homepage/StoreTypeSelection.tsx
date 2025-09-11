'use client';
import { api } from "@/lib/axios";
import { useHeaderStore } from "@/store/listing_header_store";
import { BrandType, SelectOption } from "@/types/SellerTypes";
import { useEffect, useState } from "react"
import { toast } from "sonner";
import { manrope } from "@/font";
import Image from "next/image";
import { useRouter } from "next/navigation";
import StoreTypeSelectionSkeleton from "./skeleton/StoreTypeSelectionSkeleton";

const StoreTypeImage = [
    { name: 'Designer Label', url: '/Homepage/designer_labels.svg' },
    { name: 'Retail Store', url: '/Homepage/retail_stores.svg' },
    { name: 'Boutiques', url: '/ListingPageHeader/boutiques.svg' },
    { name: 'Tailor', url: '/Homepage/tailor.svg' },
    { name: 'Stylist', url: '/Homepage/styler.svg' },
];

/**
 * StoreTypeSelection component
 * 
 * A component that displays a grid of store categories (e.g., "Designer Label", "Boutiques")
 * for users to select. It handles fetching the categories, showing a loading state, and navigating
 * the user to a filtered list upon selection.
 *
 * ## Features
 * - Displays a "SHOP BY CATEGORY" heading.
 * - Fetches a list of store types dynamically from an API on component mount.
 * - **Skeleton Loading**: Renders a skeleton placeholder component (`StoreTypeSelectionSkeleton`) while data is being fetched to improve user experience and prevent layout shifts.
 * - Renders a responsive grid of clickable store type categories, each with a corresponding icon.
 * - Navigates the user to the main store listing page with the selected category when an item is clicked.
 *
 * ## Data Flow
 * 1.  On component mount, `useEffect` sets a `loading` state to `true` and initiates the data fetch.
 * 2.  While `loading` is true, the `StoreTypeSelectionSkeleton` component is rendered.
 * 3.  An API call is made to `GET /stores/store_types` to retrieve the list of available store types.
 * 4.  Upon success, the fetched data is stored in state, and `loading` is set to `false`.
 * 5.  The component re-renders, mapping over the fetched data to display the grid of store types. Each type is matched with a local image from the `StoreTypeImage` constant.
 * 6.  When a user clicks a category, `handleTabClick` updates the global `useHeaderStore` and navigates the user to the `/store_listing` page.
 *
 * ## Imports
 * - **Core/Libraries**:
 *      - `useEffect`, `useState` from `react`: For managing side effects and component state.
 *      - `useRouter` from `next/navigation`: Hook for programmatic client-side routing.
 *      - `Image` from `next/image`: Component for optimized image rendering.
 *      - `toast` from `sonner`: Library for displaying user-friendly notifications.
 * - **State (Zustand Stores)**:
 *      - `useHeaderStore`: For managing global header state, such as the selected store type.
 * - **Key Components**:
 *      - {@link StoreTypeSelectionSkeleton}: The skeleton loader component displayed while data is being fetched.
 * - **Types**:
 *      - {@link BrandType}, {@link SelectOption}: TypeScript types for defining the shape of store data and select options.
 * - **Utilities**:
 *      - `api` from `@/lib/axios`: The configured Axios instance for API calls.
 *      - `manrope` from `@/font`: Custom font for consistent typography.
 *
 * ## Key Data Structures
 * - **StoreTypeImage**: A local constant array that maps store type names to their static image icon URLs.
 *
 * ## API Calls
 * - `GET /stores/store_types`: Fetches the list of all available store types on mount.
 *
 * ## Props
 * - This component does not accept any props.
 *
 * @returns {JSX.Element} The rendered store type selection grid or its skeleton loader.
 */
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
        setStoreType(storeType);
        router.push('/store_listing');
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

    if (loading) {
        return <StoreTypeSelectionSkeleton />;
    }

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
                                        <Image
                                            src={storeImage?.url || '/Homepage/tailor.svg'}
                                            alt='Store Type'
                                            fill
                                            className="object-contain"
                                            sizes="95px"
                                        />

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