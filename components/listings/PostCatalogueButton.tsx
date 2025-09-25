"use client";

import { useHeaderStore } from "@/store/listing_header_store";
import React, { useEffect, useState } from "react";
import { manrope } from "@/font";
import Image from "next/image";
import { api } from "@/lib/axios"; // assuming you have api instance configured

/**
 * @interface PostCatalogueButtonProps
 * @description Defines the props for the PostCatalogueButton component.
 */
type PostCatalogueButtonProps = {
  /**
   * @description The default view to select when the component first renders, either 'Posts' or 'Products'.
   * @default 'Posts'
   */
  defaultValue?: string;
  /**
   * @description The unique ID of the store, used to check for product availability.
   */
  storeId: string;
};

/**
 * A toggle button component to switch between 'Posts' and 'Products' views on a store's profile page.
 *
 * This component is context-aware and dynamically renders its options. On mount, it makes an API
 * call to check if the given store has any products. The "Products" tab is only displayed if
 * products are available, ensuring a clean UI for stores that only have posts.
 *
 * ### State Management
 * - **Local State (`useState`)**: Manages the `selected` option for immediate UI feedback and the `hasProducts` boolean fetched from the API.
 * - **Global State (`useHeaderStore`)**: It syncs the user's selection to the global state by calling `setViewType`. This allows the parent component (`StoreProfilePage`) to conditionally render the correct content container.
 *
 * ### API Endpoint
 * **`GET /products/check_product_available/:storeId`**
 * This endpoint checks if a store has at least one product in its catalogue.
 * - **`:storeId`** (string): The unique ID of the store.
 * - **Returns**: `{ is_available: boolean }`
 *
 * @param {PostCatalogueButtonProps} props - The props for the component.
 * @returns {JSX.Element} A set of toggle buttons, conditionally rendering the 'Products' option.
 * @see {@link https://react.dev/reference/react/useEffect | React useEffect Hook}
 * @see {@link https://docs.pmnd.rs/zustand/getting-started/introduction | Zustand Documentation}
 */
export default function PostCatalogueButton({
  defaultValue = "Posts",
  storeId,
}: PostCatalogueButtonProps) {
  const [selected, setSelected] = useState(defaultValue);
  const [hasProducts, setHasProducts] = useState(false);
  const { setViewType } = useHeaderStore();

  /**
   * This effect runs on mount to check if the store has any products available.
   * It determines whether the "Products" tab should be rendered.
   */
  useEffect(() => {
    async function checkProducts() {
      try {
        const res = await api.get(
          `products/check_product_available/${storeId}`
        );

        setHasProducts(res.data.is_available); // true or false
      } catch (err) {
        console.error("Error checking products availability", err);
        setHasProducts(false);
      }
    }
    if (storeId) {
      checkProducts();
    }
  }, [storeId]);

  /**
   * This effect syncs the local `selected` state to the global `viewType` state.
   * This tells the parent component which view ('Posts' or 'Products') to display.
   */
  useEffect(() => {
    setViewType(selected);
  }, [selected]);

  // Build options based on availability
  const options: ("Posts" | "Products")[] = hasProducts
    ? ["Posts", "Products"]
    : ["Posts"];

  /**
   * A helper function to get the correct icon path for each option.
   * @param {'Posts' | 'Products'} option - The name of the option.
   * @returns {string} The path to the icon image.
   */
  const getIconPath = (option: "Posts" | "Products") => {
    if (option === "Posts") return "/ListingPageHeader/post_icon.svg";
    if (option === "Products") return "/ListingPageHeader/catalogue_logo.svg";
    return "";
  };

  return (
    <div className="flex justify-center border-t border-gray-200">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => setSelected(option)}
          className={`${manrope.className} relative px-6 pt-4 pb-3 flex flex-col items-center text-sm transition-colors duration-200`}
        >
          <div className="flex items-center gap-2">
            <Image
              src={getIconPath(option)}
              alt={option}
              width={20}
              height={20}
              className={option === 'Products' ? 'w-6 h-6' : 'w-5 h-5'}
            />
            <span
              className={`uppercase ${
                selected === option
                 ? "text-black font-bold"
                  : "text-gray-500" 
              }`}
            >
              {option}
            </span>
          </div>
          {/* This div acts as the active indicator underline, rendered only for the selected button. */}
          {selected === option && (
            <div className="absolute -top-[1px] left-0 w-full h-[2px] bg-black rounded-t-sm" />
          )}
        </button>
      ))}
    </div>
  );
}
