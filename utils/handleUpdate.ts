import { useSellerStore } from '@/store/sellerStore'
import { api } from '@/lib/axios';

export const useUpdateStore = () => {
    const {
        sellerId,
        storeId,
        businessDetailsValid,
        businessDetailsData,
        priceFiltersValid,
        whereToSellData,
        priceFiltersData,
        socialLinksData,
        storePhotosData,
        storePhotosValid
    } = useSellerStore();

    const handleUpdate = async () => {
        if (!businessDetailsValid || !businessDetailsData) {
            alert('Fill all mandatory fields of Business Details Section');
            return;
        }
        if (!priceFiltersValid || !priceFiltersData) {
            alert('Fill all mandatory fields of Price Filters Section');
            return;
        }
        if (!storePhotosValid || !storePhotosData) {
            alert('Fill all mandatory fields of Store Photos Section');
            return;
        }
        const seller_up_payload = {
            email: businessDetailsData.ownerEmail,
            name: businessDetailsData.ownerName,
        };
        const store_up_payload = {
            store_owner_id: sellerId,
            store_name: businessDetailsData.brandName,
            pincode: businessDetailsData.pinCode,
            whatsapp_number: businessDetailsData.businessWpNum,
            store_address: businessDetailsData.brandAddress,
            rental: businessDetailsData.rentOutfits === 'Yes',
            store_types: businessDetailsData.brandTypes,
            genders: businessDetailsData.genders,
            area: businessDetailsData.area[0],
            city: businessDetailsData.city[0],
            average_price_min: priceFiltersData.avgPriceMin,
            average_price_max: priceFiltersData.avgPriceMax,
            store_type_price_range_links: priceFiltersData.priceRanges,
            is_online: whereToSellData?.isOnline,
            instagram_link: socialLinksData?.instagramUrl,
            facebook_link: socialLinksData?.facebookUrl,
            shopify_url: socialLinksData?.websiteUrl,
            listing_page_image: storePhotosData.bannerUrl,
            profile_image: storePhotosData.profileUrl
        }
        console.log(store_up_payload);
        console.log(storeId);
        try {
            await api.put(`/users/update_user/${sellerId}`, seller_up_payload);
            await api.put(`/stores/${storeId}`, store_up_payload);
            alert('store updated');
        } catch (error) {
            alert(`Error : ${error}`);
        }

        console.log('store_updated');

    };
    return {handleUpdate}
};