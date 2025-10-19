import { useSellerStore } from '@/store/sellerStore'
import { api } from '@/lib/axios';
import { useRouter } from 'next/navigation';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

/**
 * 
 * useUpdateStore Utility
 * 
 * A custom React hook that encapsulates all the logic for saving a seller's data
 * during the multi-step onboarding process. It reads data from the global Zustand store,
 * validates it, constructs section-specific payloads, and sends updates to the backend.
 *
 * ## Features
 * - **Centralized Logic**: Consolidates all `UPDATE` logic for the onboarding flow into a single, reusable hook.
 * - **Section-Specific Payloads**: Intelligently builds and sends only the data relevant to the currently active form section.
 * - **Data Validation**: Checks validity flags from the Zustand store before attempting to send data, preventing incomplete submissions.
 * - **Create vs. Update Handling**: For the initial 'brand' section, it handles both creating a new store (if one doesn't exist) and updating an existing one.
 * - **Asynchronous Operation**: The main `handleUpdate` function is `async` and returns a `Promise<boolean>` to indicate the success or failure of the update to the calling component.
 * - **Onboarding Completion**: On the final step, it triggers a login and redirects the user to their dashboard.
 *
 * ## Logic Flow
 * 1.  The hook is invoked in a component and pulls all necessary data slices and validation flags from the `useSellerStore`.
 * 2.  It returns a single function, `handleUpdate`.
 * 3.  When the `handleUpdate` function is called (typically when a user clicks "Next" in the onboarding flow), it receives the key of the `activeSection`.
 * 4.  Based on the `activeSection`, it performs a validation check for that section's data. If invalid, it returns `false`.
 * 5.  It then constructs a specific `payload` object containing only the data relevant to that section from the Zustand store.
 * 6.  It makes the appropriate API call(s) for that section (e.g., updating the user profile, creating/updating the store).
 * 7.  It handles API success by returning `true` and API errors by showing a toast notification and returning `false`.
 *
 * ## Imports
 * - **Core/Libraries**: `useEffect`, `useState` from `react`; `useRouter` from `next/navigation`; `toast` from `sonner`.
 * - **State (Zustand Stores)**:
 *      - `useSellerStore`: The central store for all seller and onboarding-related data.
 * - **Utilities**:
 *      - `api` from `@/lib/axios`: The configured Axios instance for API calls.
 *
 * ## API Calls
 * - PUT` /users/update_user/{user_id}`: Updates the seller's user profile (name, email). Called for the 'brand' section.
 * - POST `/stores/create`: Creates a new store for the seller. Called for the 'brand' section if no store yet exists.
 * - PUT `/stores/{store_id}`: The primary endpoint used to update an existing store with data from various sections (brand, price, market, social, photos).
 * - POST `/users/login`: Logs the user in to create a session upon completion of the final 'photos' section.
 *
 * ## Returned Function: handleUpdate
 * @param {string} [activeSection] - The key of the current onboarding section (e.g., 'brand', 'price').
 * @param {boolean} [onBoarding] - A flag to indicate if the call is part of the initial onboarding flow, used to trigger special logic on the final step.
 * @param {number} [curr_section] - The numerical step of the current progress to be saved to the database.
 * @returns {Promise<boolean>} A promise that resolves to `true` on a successful API update and `false` on failure.
 *
 * @returns {{ handleUpdate: Function }} An object containing the `handleUpdate` function.
 */
export const useUpdateStore = () => {
    const router = useRouter();
    useEffect(() => {
        router.prefetch("/seller_dashboard")
    }, [])
    const {
        sellerId,
        storeId,
        sellerNumber,
        setSellerEmail,
        setSellerName,
        setStoreId,
        businessDetailsValid,
        businessDetailsData,
        socialLinksValid,
        priceFiltersValid,
        whereToSellData,
        priceFiltersData,
        socialLinksData,
        storePhotosData,
        storePhotosValid
    } = useSellerStore();

    const handleUpdate = async (activeSection?: string, onBoarding?: boolean, curr_section?: number) => {
        if (activeSection === 'brand' && businessDetailsData) {
            if (!businessDetailsValid) {
                // toast.error("Please fill all the required fields");
                alert("Please fill all the required fields");
                return false;
            }
            // create seller payload
            const seller_up_payload = {
                email: businessDetailsData.ownerEmail,
                name: businessDetailsData.ownerName,
            };
            // create store payload
            const store_payload = {
                store_owner_id: sellerId,
                store_name: businessDetailsData.brandName,
                pincode_id: businessDetailsData.pinCode[0].id,
                mobile: sellerNumber,
                whatsapp_number: businessDetailsData.businessWpNum,
                store_address: businessDetailsData.brandAddress,
                // rental: businessDetailsData.rentOutfits === 'Yes',
                store_types: businessDetailsData.brandTypes,
                genders: businessDetailsData.genders,
                categories: businessDetailsData.categories,
                curr_section: curr_section,
                area: businessDetailsData.area[0],
                city: businessDetailsData.city[0],
                pincode: businessDetailsData.pinCode[0],
                registered_email: businessDetailsData.ownerEmail,
                return_days: businessDetailsData.returnDays || 0,
                exchange_days: businessDetailsData.exchangeDays || 0,
                // store_type_price_range_links: priceFiltersData?.priceRanges,
            };

            try {
                // call update api for user
                await api.put(`/users/update_user/${sellerId}`, seller_up_payload);
                setSellerEmail(businessDetailsData?.ownerEmail || "");
                setSellerName(businessDetailsData?.ownerName || "");
                // if store id is available, call Create API else call Update API
                if (!storeId) {
                    const response = await api.post('/stores/create', store_payload);
                    setStoreId(response.data.store_id);
                }
                else {
                    console.log("store payload",store_payload);
                    await api.put(`/stores/${storeId}`, store_payload);
                }
                return true;
            } catch (error: any) {
                setTimeout(() => {
                    toast.error(error.response?.data?.message);
                }, 1500)

                // toast.error(error.response);
                // console.log(error)
                return false;
            }
        }


        if (activeSection === 'price' && priceFiltersData) {
            if (!priceFiltersValid) {
                alert("Please fill all the required fields");
                return false;
            }
            // create price payload
            const price_payload = {
                average_price_min: priceFiltersData.avgPriceMin,
                average_price_max: priceFiltersData.avgPriceMax,
                store_type_price_range_links: priceFiltersData.priceRanges,
                price_ranges: priceFiltersData.priceRangesStr,
                curr_section: curr_section,
            };
            // call Update API for store
            try {
                await api.put(`/stores/${storeId}`, price_payload);

                return true;
            } catch (error) {

                return false;
            }
        }

        if (activeSection === 'market' && whereToSellData) {

            // create where to sell payload
            const market_payload = {
                is_online: whereToSellData.isOnline,
                is_both: whereToSellData.isBoth,
                curr_section: curr_section,
            }

            // call api for Update API 
            try {
                await api.put(`/stores/${storeId}`, market_payload);

                return true;
            } catch (error: any) {
                return false;
            }
        }
        if (activeSection === 'social' && socialLinksData) {
            if (!socialLinksValid) {
                // toast.error("Please fill all the required fields");
                alert("Please fill all the required fields");
                return false;
            }

            // create social links payload
            const social_payload = {
                instagram_link: socialLinksData.instagramUrl || '',
                facebook_link: socialLinksData.facebookUrl || '',
                shopify_url: socialLinksData.websiteUrl || '',
                curr_section: curr_section,
            }
            // create Update API for store
            try {

                await api.put(`/stores/${storeId}`, social_payload);
                console.log('store updated')
                return true;
            } catch (error) {

                return false;
            }
        }
        if (activeSection === 'photos' && storePhotosData) {
            console.log('storePhotosData', storePhotosData)
            
            // create photos payload
            const photos_payload = {
                listing_page_image: storePhotosData.bannerUrl,
                profile_image: storePhotosData.profileUrl,
                curr_section: curr_section,
            }

            // call Update API for stores
            try {
                await api.put(`/stores/${storeId}`, photos_payload);
                console.log('store updated')
                if (onBoarding) {
                    try {
                        // here we will create jwt tokens
                        await api.post("/users/login", { contact_number: sellerNumber });
                        toast.success("Onboarding Complete, Welcome to Attirelly!");
                        router.push('/seller_dashboard');
                    }
                    catch (error) {
                        console.error('Error fetching stores by section:', error);
                    }
                }
                return true;
            } catch (error) {

                return false;
            }
        }
    };
    return { handleUpdate }
};