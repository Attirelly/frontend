"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import clsx from "clsx";
import { SelectOption, BrandType } from "@/types/SellerTypes";
import { useHeaderStore } from "@/store/listing_header_store";
import { event } from "@/lib/gtag";
import { manrope } from "@/font";
import StoreTypeTabsSkeleton from "./skeleton/StoreTypeHeaderSkeleton";
import { useFilterStore, useProductFilterStore } from "@/store/filterStore";

/**
 * @interface StoreTypeTabsProps
 * @description Defines the props for the StoreTypeTabs component.
 */
interface StoreTypeTabsProps {
  /**
   * @description The default value (ID) to select if no store type is already set in the global state.
   * This is used for initializing the component's state from a parent that isn't connected to the store.
   */
  defaultValue?: string;
  /**
   * @description A context string that alters the component's layout and available options.
   * - `'products'`: Filters tabs to "Retail Store" & "Designer Label" and uses a horizontal scroll layout.
   * - `'user'`: Shows all tabs in a 2-column grid layout on mobile.
   * - `undefined` (or other): Shows all tabs in the default horizontal scroll layout.
   */
  context?: string;
}


export default function StoreTypeTabs({
  defaultValue,
  context,
}: StoreTypeTabsProps) {
  const filterStore =
    context === "store" ? useFilterStore() : useProductFilterStore();

  const { storeTypes } = filterStore;
  const { setStoreType, storeType } = useHeaderStore();
  const [tabs, setTabs] = useState<SelectOption[]>([]);
  const [selectedStoreType, setSelectedStoreType] = useState<BrandType | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleTabClick = (value: SelectOption) => {
    const storeTypeObj: BrandType = {
      id: value.value,
      store_type: value.label,
    };

    event({
      action: "Store Type Select",
      params: { "Store Type": value.label },
    });

    setSelectedStoreType(storeTypeObj);
    setStoreType(storeTypeObj);
  };
  /**
   * This effect handles the scrolling behavior to center the active tab.
   * It runs synchronously after the DOM is updated to prevent visual flicker, which is
   * why `useLayoutEffect` is chosen over `useEffect`.
   */
  useLayoutEffect(() => {
    if (scrollContainerRef.current && selectedStoreType) {
      const container = scrollContainerRef.current;
      const activeTab = container.querySelector(
        `[data-id="${selectedStoreType.id}"]`
      ) as HTMLElement;

      if (activeTab) {
        const containerWidth = container.offsetWidth;
        const activeTabWidth = activeTab.offsetWidth;
        const activeTabLeft = activeTab.offsetLeft;

        // Calculate the position to scroll to center the tab
        const scrollPosition =
          activeTabLeft - containerWidth / 2 + activeTabWidth / 2;

        container.scrollTo({
          left: scrollPosition,
          behavior: "smooth",
        });
      }
    }
  }, [selectedStoreType]); // Re-run whenever the selected tab changes

  /**
   * This effect handles the initialization of the component's state.
   * It sets up the available tabs based on the context and determines the
   * initial selected tab from the global state or props.
   */
  useEffect(() => {
    setLoading(true);

    let options: SelectOption[];

    if (context?.toLowerCase() === "products") {
      options = storeTypes
        .filter(
          (st) =>
            st.store_type === "Retail Store" ||
            st.store_type === "Designer Label"
        )
        .map((t) => ({ label: t.store_type, value: t.id, count: t.count }));
    } else {
      options = storeTypes.map((t) => ({
        label: t.store_type,
        value: t.id,
        count: t.count,
      }));
    }
    console.log("store_type options", options);
    setTabs(options);

    // Set initial selected store type
    const initialId = storeType?.id ?? defaultValue;
    if (initialId) {
      const initialOption = storeTypes.find((t) => t.id === initialId);
      if (initialOption) {
        const storeTypeObj: BrandType = {
          id: initialOption.id,
          store_type: initialOption.store_type,
        };
        setSelectedStoreType(storeTypeObj);

        // safe call: only if exists
        if (setStoreType && storeType?.id !== storeTypeObj.id) {
          setStoreType(storeTypeObj);
        }
      }
    }

    setLoading(false);
  }, [defaultValue, storeType?.id, context,storeTypes]);

  if (loading) return <StoreTypeTabsSkeleton />;

  return (
    <>
      {context?.toLowerCase() === "user" ? (
        <div className="grid w-full max-w-sm grid-cols-2 gap-y-4 md:flex md:gap-2 md:w-fit md:max-w-fit md:items-center md:rounded-full md:p-2">
          {tabs.map((tab, index) => (
            <React.Fragment key={tab.value}>
              {/* Wrapper for button and mobile divider */}
              <div className="relative flex w-full justify-center">
                <button
                  className={clsx(
                    manrope.className,
                    "py-2 rounded-full transition-all duration-200 text-base text-center font-medium",
                    // Mobile-first sizing
                    "w-[150px]",
                    // Desktop sizing overrides
                    "md:py-2 md:px-4 md:mx-0",
                    // Conditional styling based on selection
                    selectedStoreType?.id === tab.value
                      ? // Selected styles: black on mobile, white w/ shadow on desktop
                        "bg-black text-white md:shadow"
                      : // Default styles: white w/ border on mobile, transparent on desktop
                        "bg-[#F5F5F5] text-black border border-gray-300 md:border-none md:text-[#565656] hover:md:text-black"
                  )}
                  onClick={() => handleTabClick(tab)}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span>{tab.label}</span>
                    {(tab.count ?? 0) > 0 && (
                      <span
                        className={clsx(
                          "text-xs font-medium rounded-full px-2 py-0.5",
                          selectedStoreType?.id === tab.value
                            ? "bg-white/20 text-white"
                            : "bg-gray-200 text-gray-600"
                        )}
                      >
                        {tab.count ?? 0}
                      </span>
                    )}
                  </div>
                </button>

                {/* --- Mobile Divider --- */}
                {/* This divider is only visible on mobile (md:hidden) */}
                {/* It appears on the right of the first item in each row (index 0 and 2) */}
                {index % 2 === 0 && (
                  <div className="absolute right-0 top-0 h-full w-px bg-gray-300 md:hidden" />
                )}
              </div>
            </React.Fragment>
          ))}
        </div>
      ) : (
        <div
          ref={scrollContainerRef}
          className={clsx(
            // Mobile: Flex container with horizontal scrolling
            "flex w-full items-center gap-2 overflow-x-auto px-2 scrollbar-none", // Conditionally center tabs ONLY for the 'products' context
            {
              "justify-center": context === "products",
            }, // Desktop: Overrides for the pill-style container
            "md:w-fit md:max-w-fit md:rounded-full md:overflow-x-visible"
          )}
        >
          {tabs.map((tab) => (
            <button
              key={tab.value}
              data-id={tab.value} // Add data-id for easy selection in useLayoutEffect
              className={clsx(
                manrope.className,
                // Common styles
                "py-1 rounded-full transition-all duration-300 text-base font-medium text-center",
                // Prevent buttons from shrinking in the flex container
                "flex-shrink-0",
                // Sizing
                "w-[125px] md:w-auto md:px-4",
                // Conditional styles based on selection
                selectedStoreType?.id === tab.value
                  ? "bg-black text-white md:shadow"
                  : "bg-[#F5F5F5] text-black border border-gray-300 md:border-none md:text-[#565656] hover:md:text-black"
              )}
              onClick={() => handleTabClick(tab)}
            >
              <div className="flex items-center justify-center gap-2">
                <span>{tab.label}</span>
                {(tab.count ?? 0) > 0 && (
                  <span
                    className={clsx(
                      "text-xs font-medium rounded-full px-2 py-0.5",
                      selectedStoreType?.id === tab.value
                        ? "bg-white/20 text-white"
                        : "bg-gray-200 text-gray-600"
                    )}
                  >
                    {tab.count}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </>
  );
}
