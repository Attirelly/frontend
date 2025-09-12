'use client';
import React, { useState, useEffect } from "react";
import { useSellerStore } from "@/store/sellerStore";
import { toast } from "sonner";
import { api } from "@/lib/axios";

/**
 * SocialLinksComponent component
 * 
 * A form component within the seller onboarding/dashboard for managing social media
 * presence. It allows sellers to add their Instagram, Facebook, and website URLs, and handles
 * the entire OAuth 2.0 flow for connecting their Instagram Business account.
 *
 * ## Features
 * - Provides input fields for Instagram, Facebook, and Website links.
 * - **Instagram Integration**: A dedicated section to connect or disconnect an Instagram Business account.
 * - **OAuth Flow Management**: The "Integrate" button redirects the user to the Instagram authorization page with the necessary parameters.
 * - **Connection Status**: The UI dynamically changes to show a "Disconnect" button if an account is already linked, and the username input becomes read-only.
 * - **Callback Handling**: After the user returns from the Instagram authorization, a `useEffect` hook checks `localStorage` for the connection status and displays an appropriate success or error toast.
 * - **Real-time Validation & State Sync**: A `useEffect` hook continuously validates the form (ensuring the Instagram username is not empty) and syncs the data back to the `useSellerStore`.
 *
 * ## Logic Flow
 * 1.  On mount, a `useEffect` hook immediately checks `localStorage` for an `instagram_connected` flag. This flag is set by the OAuth callback page. If found, it shows a toast notification, updates the global state, and clears the flag.
 * 2.  Another `useEffect` hook fetches existing store data to pre-fill the form with any previously saved social links.
 * 3.  User input in the form fields updates the local component state. The Instagram username input has a specific handler that sanitizes the input.
 * 4.  A master `useEffect` hook watches for changes in the local state. It validates that the Instagram username is provided and, if valid, packages all links into an object and updates the `socialLinksData` slice in the global `useSellerStore`.
 * 5.  Clicking "Integrate" calls `handleInstagramConnect`. This function constructs the full Instagram OAuth authorization URL, encoding the `storeId` and `redirectUri` into the `state` parameter, and then redirects the user's browser to this URL.
 * 6.  Clicking "Disconnect" calls `handleInstagramDisConnect`, which triggers a `DELETE` API call to the backend to sever the connection, and then updates the UI.
 *
 * ## Imports
 * - **Core/Libraries**: `useState`, `useEffect` from `react`.
 * - **State (Zustand Stores)**:
 *      - `useSellerStore`: For reading and writing social link data and the Instagram connection status.
 * - **Utilities**:
 *      - `api` from `@/lib/axios`: The configured Axios instance for API calls.
 * - **External Libraries**:
 *      - `toast` from `sonner`: For displaying user-friendly notifications.
 *
 * ## API Calls
 * - GET `/stores/{storeId}`: Fetches existing store data to pre-fill the form.
 * - GET (via redirect) to `https://www.instagram.com/oauth/authorize`: The external call to initiate the Instagram connection flow.
 * - DELETE `/instagram/disconnect-instagram/{storeId}/{username}`: An API call to disconnect the store's Instagram account.
 *
 * ## Props
 * - This component does not accept any props.
 *
 * @returns {JSX.Element} The rendered social links form.
 */
export default function SocialLinksComponent() {
    const {
        setSocialLinksData,
        setSocialLinksValid,
        socialLinksData,
        storeId,
        isInstagramConnected,
        setIsInstagramConnected,
    } = useSellerStore();

    const [instagramUsname, setInstagramUsname] = useState(
        socialLinksData?.instagramUsname || ""
    );
    const [instagramUrl, setInstagramUrl] = useState(
        socialLinksData?.instagramUrl || ""
    );
    const [websiteUrl, setWebsiteUrl] = useState(
        socialLinksData?.websiteUrl || ""
    );
    const [facebookUrl, setFacebookUrl] = useState(
        socialLinksData?.facebookUrl || ""
    );

    // This useEffect runs once on mount to check if user just returned from Instagram OAuth
    useEffect(() => {
        // Check localStorage flag set after OAuth callback
        if (localStorage.getItem("instagram_connected") === "true") {
            // Update Zustand store to reflect successful connection
            useSellerStore.getState().setIsInstagramConnected(true);
            toast.success("Instagram connected successfully");
            // Clear the flag so it doesn't run again on refresh
            localStorage.removeItem("instagram_connected");
        } else if (localStorage.getItem("instagram_connected") === "false") {
            // Update Zustand store to reflect failed connection
            useSellerStore.getState().setIsInstagramConnected(false);
            toast.error("Instagram connection failed");
            localStorage.removeItem("instagram_connected");
        }
    }, []);

    // This useEffect fetches Instagram details (username) for the current storeId
    useEffect(() => {
        const fetchInstaDetails = async () => {
            if (!storeId) return; // do not fetch if store id is not present
            try {
                const response = await api.get(`stores/${storeId}`);
                const storeData = response?.data;

                // Extract username from full Instagram link if present
                const instagramUsername = storeData?.instagram_link
                    ? new URL(storeData.instagram_link).pathname
                        .split("/")
                        .filter(Boolean)[0]
                    : "";

                // Update username and url state
                setInstagramUsname(instagramUsername);
                setInstagramUrl(`https://instagram.com/${instagramUsername}`);
            } catch (error) {
                console.error("Failed to fetch Instagram username", error);
                setInstagramUsname(""); // reset username on error
            }
        };

        fetchInstaDetails();
    }, [storeId]);

    // Handle manual input change for Instagram username field
    const handleInstagramChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const username = e.target.value
            .replace(/^@/, "") // Remove leading @
            .replace(/[^a-zA-Z0-9._]/g, "") // Allow only valid Instagram characters
            .slice(0, 30); // Max length for Instagram
        setInstagramUsname(username);
        setInstagramUrl(`https://instagram.com/${username}`);
    };

    // Whenever username or other social links change, update validation and socialLinksData
    useEffect(() => {
        // Check if username is not empty
        const isValid = instagramUsname.trim() !== "";
        setSocialLinksValid(isValid);
        if (isValid) {
            // Update parent state with all current social links
            setSocialLinksData({
                instagramUsname,
                instagramUrl: `https://instagram.com/${instagramUsname}`,
                facebookUrl,
                websiteUrl,
            });
        }
    }, [instagramUsname, websiteUrl, facebookUrl, setSocialLinksData]);

    // Called when user clicks "Connect Instagram" button
    const handleInstagramConnect = () => {
        try {
            let appId = process.env.NEXT_INSTAGRAM_APP_ID || "548897007892754";
            const redirectUri = `${window.location.origin}/auth/callback`;

            // Build state object to pass data through OAuth redirect
            const stateData = {
                instagram_url: instagramUrl,
                store_id: storeId,
                redirect_uri: redirectUri,
            };

            const encodedState = encodeURIComponent(JSON.stringify(stateData));

            // Redirect user to Instagram OAuth authorize page
            window.location.href = `https://www.instagram.com/oauth/authorize?client_id=${appId}&redirect_uri=${redirectUri}&scope=instagram_business_basic,instagram_business_manage_insights&response_type=code&state=${encodedState}`;
        } catch (error: any) {
            console.log(error.message);
        }
    };

    // Called when user clicks "Disconnect Instagram" button
    const handleInstagramDisConnect = async () => {
        try {
            // API call to backend to disconnect Instagram account for this store
            const response = await api.delete(
                `/instagram/disconnect-instagram/${storeId}/${instagramUsname}`
            );
            // Update state and show toast
            setIsInstagramConnected(false);
            toast.success("Instagram disconnected successfully");
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="space-y-6 text-black placeholder-gray-400">
            {/* Card for Social Links */}
            <div className="rounded-2xl p-4 sm:p-6 space-y-4 shadow-sm bg-white">
                <div>
                    <h2 className="text-base sm:text-lg font-semibold">Social Links</h2>
                    <p className="text-xs sm:text-sm text-gray-500">
                        Customers will see these details on Attirelly
                    </p>
                </div>
                <div className="-mx-4 sm:-mx-6 border-t border-gray-300"></div>

                {/* Instagram Username Input */}
                <div>
                    <label className="block text-xs sm:text-sm font-medium mb-1">
                        Instagram username<span className="text-red-500">*</span>
                    </label>
                    <div className="flex border border-gray-300 rounded-md overflow-hidden">
                        <span className="bg-gray-100 px-3 py-2 text-gray-500 select-none border-r border-gray-300 text-xs sm:text-sm">
                            instagram.com/
                        </span>
                        <input
                            type="text"
                            placeholder="your_username"
                            value={instagramUsname}
                            onChange={handleInstagramChange}
                            className="flex-1 px-3 py-2 outline-none text-xs sm:text-sm disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                            disabled={isInstagramConnected}
                        />
                    </div>
                </div>

                {/* Website URL */}
                <div>
                    <label className="block text-xs sm:text-sm font-medium mb-1">Website URL</label>
                    <input
                        type="url"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-xs sm:text-sm"
                        placeholder="https://yourwebsite.com"
                        value={websiteUrl}
                        onChange={(e) => setWebsiteUrl(e.target.value)}
                    />
                </div>

                {/* Facebook URL */}
                <div>
                    <label className="block text-xs sm:text-sm font-medium mb-1">Facebook URL</label>
                    <input
                        type="url"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-xs sm:text-sm"
                        placeholder="https://facebook.com/yourpage"
                        value={facebookUrl}
                        onChange={(e) => setFacebookUrl(e.target.value)}
                    />
                </div>
            </div>

            {/* Integrate Label */}
            <div className="text-lg sm:text-xl font-semibold">Integrate</div>

            {/* Instagram Integration Card */}
            <div className="bg-white shadow-sm space-y-4 rounded-2xl p-4 sm:p-6 flex flex-row justify-between items-center  ">
                <div className="space-y-3 md:w-2/3">
                    <h3 className="text-base sm:text-xl font-semibold">Integrate with Instagram</h3>
                    <p className="text-xs sm:text-sm text-gray-500">
                        Connect your Instagram, so Attirelly can engage
                    </p>

                    {!isInstagramConnected ? (
                        <button
                            className="bg-black text-white px-5 py-2 rounded-full cursor-pointer text-sm sm:text-base"
                            onClick={handleInstagramConnect}
                        >
                            Integrate
                        </button>
                    ) : (
                        <button
                            className="bg-black text-white px-5 py-2 rounded-full cursor-pointer text-sm sm:text-base"
                            onClick={handleInstagramDisConnect}
                        >
                            Disconnect
                        </button>
                    )}
                </div>
                <div className="">
                    <img
                        src="/OnboardingSections/instagram.svg"
                        alt="Instagram logo"
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl object-cover"
                    />
                </div>
            </div>
        </div>
    );
}
