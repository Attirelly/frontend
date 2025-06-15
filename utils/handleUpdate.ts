import { useSellerStore } from '@/store/sellerStore'
import { api } from '@/lib/axios';
import { useRouter } from 'next/navigation';

import { useEffect, useState } from 'react';

export const useUpdateStore = () => {
    const router = useRouter();
    useEffect(()=>{
       router.prefetch("/seller_dashboard")
    } , [])
    const {
        sellerId,
        storeId,
        sellerNumber,
        setSellerEmail,
        setSellerName,
        setStoreId,
        businessDetailsValid,
        businessDetailsData,
        priceFiltersValid,
        whereToSellData,
        priceFiltersData,
        socialLinksData,
        storePhotosData,
        storePhotosValid
    } = useSellerStore();
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState<"success" | "error">("success");

    const handleUpdate = async (activeSection?: string, onBoarding?: boolean, curr_section?: number) => {
        if (activeSection === 'brand' && businessDetailsValid && businessDetailsData) {
            console.log(activeSection);
            const seller_up_payload = {
                email: businessDetailsData.ownerEmail,
                name: businessDetailsData.ownerName,
            };
            const store_payload = {
                store_owner_id: sellerId,
                store_name: businessDetailsData.brandName,
                pincode_id: businessDetailsData.pinCode[0].id,
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
                registered_email: businessDetailsData.ownerEmail
            };

            try {
                await api.put(`/users/update_user/${sellerId}`, seller_up_payload);
                setSellerEmail(businessDetailsData?.ownerEmail || "");
                setSellerName(businessDetailsData?.ownerName || "");
                if (!storeId) {
                    const response = await api.post('/stores/create', store_payload);
                    setStoreId(response.data.store_id);
                }
                else {
                    await api.put(`/stores/${storeId}`, store_payload);
                }
                return true;
            } catch (error) {
                console.log('Seller not updated');
                return false;
            }
        }

        if (activeSection === 'price' && priceFiltersValid && priceFiltersData) {
            console.log(activeSection);
            const price_payload = {
                average_price_min: priceFiltersData.avgPriceMin,
                average_price_max: priceFiltersData.avgPriceMax,
                store_type_price_range_links: priceFiltersData.priceRanges,
                curr_section: curr_section,
            };
            try {
                await api.put(`/stores/${storeId}`, price_payload);
                console.log('store updated');
                return true;
            } catch (error) {
                console.log('Cannot update store');
                return false;
            }
        }

        if (activeSection === 'market' && whereToSellData) {
            console.log(activeSection);
            console.log(whereToSellData);
            const market_payload = {
                is_online : whereToSellData.isOnline,
                curr_section: curr_section,
            }
            try {
                await api.put(`/stores/${storeId}`, market_payload);
                console.log('store updated');
                return true;
            } catch (error) {
                console.log('Cannot update store');
                return false;
            }
        }
        if (activeSection === 'social' && socialLinksData) {
            console.log(activeSection);
            const social_payload = {
                instagram_link: socialLinksData.instagramUrl || '',
                facebook_link: socialLinksData.facebookUrl || '',
                shopify_url : socialLinksData.websiteUrl || '',
                curr_section: curr_section,
            }
            try {
                console.log('inside store');
                await api.put(`/stores/${storeId}`, social_payload);
                console.log('store updated')
                return true;
            } catch (error) {
                console.log('Cannot update store');
                return false;
            }
        }
        if (activeSection === 'photos' && storePhotosData) {
            console.log(activeSection);
            const photos_payload = {
                listing_page_image : storePhotosData.bannerUrl,
                profile_image : storePhotosData.profileUrl,
                curr_section: curr_section,
            }
            try {
                await api.put(`/stores/${storeId}`, photos_payload);
                console.log('store updated')
                if (onBoarding) {
                    try {
                        // here we will create jwt tokens
                        await api.post("/users/login", { contact_number: sellerNumber });
                        router.push('/seller_dashboard');
                    }
                    catch (error) {
                        console.error('Error fetching stores by section:', error);
                    }
                }
                return true;
            } catch (error) {
                console.log('Cannot update store');
                return false;
            }
        }    
    };
    return { handleUpdate }
};