import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import StoreInfoPage from "./StoreInfoHeader";
import { MediaResponseType, StoreInfoType } from "@/types/SellerTypes";
import { useHeaderStore } from "@/store/listing_header_store";
import { toast } from "sonner";
import StoreInfoSkeleton from "./skeleton/store_desc/StoreInfoSkeleton";

/**
 * @interface StoreInfoContainerProps
 * @description Defines the props for the StoreInfoContainer component.
 */
type StoreInfoContainerProps = {
  /**
   * @description The unique identifier of the store whose information is to be fetched and displayed.
   */
  storeId: string;
};

/**
 * A data container component responsible for fetching all necessary information for a store's profile header.
 *
 * This component acts as a data provider for the presentational `StoreInfoPage`. On mount, it orchestrates
 * a series of API calls to gather store details, product counts, and Instagram data. It handles a complex
 * conditional logic for fetching Instagram media: it first checks for an official API connection and, if not
 * available, falls back to a secondary scraping service (Apify).
 *
 * ### State Management
 * - **Local State (`useState`)**: Manages the fetched `store` data object and the overall `loading` state, which is used to display a skeleton loader.
 * - **Global State (`useHeaderStore`)**: It is a major producer of global state, using the fetched data to populate the `useHeaderStore` with the store's Instagram media, profile picture, name, and more. This makes the data available to other components on the page without prop drilling.
 *
 * ### API Endpoints
 * **`GET /stores/:storeId`**: Fetches the main details of the store.
 * **`GET /stores/product_count/:storeId`**: Gets the total number of products for the store.
 * **`GET /instagram/connect_check/:storeId`**: Checks if the store has a valid, official Instagram API connection.
 * **`GET /instagram_apify/:storeId`**: (Fallback) Fetches Instagram data via a scraping service if the official connection is not present.
 * **`GET /instagram/seller/:storeId/data`**: Fetches Instagram data using the official API if the connection is present.
 *
 * @param {StoreInfoContainerProps} props - The props for the component.
 * @returns {JSX.Element} The `StoreInfoPage` with fetched data or a `StoreInfoSkeleton` while loading.
 * @see {@link StoreInfoPage}
 * @see {@link StoreInfoSkeleton}
 * @see {@link https://docs.pmnd.rs/zustand/getting-started/introduction | Zustand Documentation}
 */
export default function StoreInfoContainer({
  storeId,
}: StoreInfoContainerProps) {
  // --- Hooks for State Management ---
  // Global state setters from Zustand store.
  const {
    setInstaMedia,
    setProfilePic,
    setInstaMediaLoading,
    setInstaUsername,
    setInstaMediaApify,
    setStoreName,
  } = useHeaderStore();
  const [store, setStore] = useState<StoreInfoType>();
  const [productCount, setProductCount] = useState<number>(0);
  const [loading, setLoading] = useState(true); // ✅ Loading state

  /**
   * This effect orchestrates all data fetching for the component on mount.
   * It follows a sequence of API calls to progressively build the `store` object.
   */
  useEffect(() => {
    const fetchStore = async () => {
      // Fetch core store details and product count in parallel.
      try {
        const storeRes = await api.get(`/stores/${storeId}`);
        const productCountRes = await api.get(
          `/stores/product_count/${storeId}`
        );
        const storeData = storeRes.data;
        const sellerId = storeData.store_owner_id;
        setStoreName(storeData.store_name);
        setInstaUsername(storeData.instagram_link);

        const storeFinal: StoreInfoType = {
          id: storeData.store_id,
          imageUrl: storeData.profile_image,
          locationUrl: storeData.store_address,
          storeName: storeData.store_name,
          post_count: "",
          product_count: productCountRes.data.toString(),
          bio: "",
          storeTypes: storeData.store_types.map((item: any) => item.store_type),
          priceRanges: storeData.price_ranges.map((item: any) => item.label),
          instagramFollowers: "",
          city: storeData.city.name,
          area: storeData.area.name,
          phone_number: storeData.whatsapp_number,
        };
        setStore(storeFinal);

        setInstaMediaLoading(true);
        setInstaMediaApify([]);
        setInstaMedia([]);

        // Check if the store has an official Instagram API connection.
        const res = await api.get(`/instagram/connect_check/${storeId}`);

        if (!res.data) {
          // --- Fallback Logic: Use Apify (Scraping Service) ---
          const instaApify = await api.get(`/instagram_apify/${storeId}`);
          const apifyData = instaApify.data;

          setInstaMediaApify(apifyData.media);
          setProfilePic(apifyData.profile_pic_hd);

          // Enhance the store object with the new scraped Instagram data.
          const storeFinal3: StoreInfoType = {
            id: storeData.store_id,
            imageUrl: apifyData.profile_pic_hd,
            locationUrl: storeData.store_address,
            storeName: storeData.store_name,
            post_count: apifyData.post_count,
            product_count: productCountRes.data.toString(),
            bio: apifyData.biography,
            storeTypes: storeData.store_types.map(
              (item: any) => item.store_type
            ),
            priceRanges: storeData.price_ranges.map((item: any) => item.label),
            instagramFollowers: apifyData.followers_count,
            city: storeData.city.name,
            area: storeData.area.name,
            phone_number: storeData.whatsapp_number,
          };
          setStore(storeFinal3);
        } else {
          const instaRes = await api.get(`instagram/seller/${storeId}/data`);
          const instaData = instaRes.data;
          setInstaMedia(instaData.media);
          setProfilePic(instaData.profile_picture);

          const storeFinal2: StoreInfoType = {
            id: storeData.store_id,
            // imageUrl: storeData.profile_image,
            imageUrl: instaData.profile_picture,
            locationUrl: storeData.store_address,
            storeName: storeData.store_name,
            post_count: instaData.media_count,
            product_count: productCountRes.data.toString(),
            bio: instaData.biography,
            storeTypes: storeData.store_types.map(
              (item: any) => item.store_type
            ),
            priceRanges: [
              ...new Set(storeData.price_ranges.map((item: any) => item.label)),
            ] as string[],
            instagramFollowers: instaData.followers_count,
            city: storeData.city.name,
            area: storeData.area.name,
            phone_number: storeData.whatsapp_number,
          };
          setStore(storeFinal2);
        }
      } catch (error) {
        // instagram is not connected
      } finally {
        setInstaMediaLoading(false);
        setLoading(false);
      }
    };
    fetchStore();
  }, []);
  return (
    <div>
      {loading ? (
        // Show a skeleton loader while the initial data is being fetched.
        <StoreInfoSkeleton />
      ) : (
        // Once loading is complete, render the presentation component with the fetched data.
        store && (
          <StoreInfoPage
            id={store.id}
            imageUrl={store.imageUrl}
            priceRanges={store.priceRanges}
            post_count={store.post_count}
            bio={store.bio}
            product_count={store.product_count}
            locationUrl={store.locationUrl}
            storeTypes={store.storeTypes}
            instagramFollowers={store.instagramFollowers}
            storeName={store.storeName}
            city={store.city}
            area={store.area}
            phone_number={store.phone_number}
            key={store.id}
          />
        )
      )}
    </div>
  );
}
