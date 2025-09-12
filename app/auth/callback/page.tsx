'use client';
import React, { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/axios';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

/**
 * A client-side component that handles the final step of the Instagram OAuth 2.0 authentication flow.
 *
 * This component is the designated redirect URI for Instagram's authorization process. After a user
 * grants permission, Instagram redirects them here with an authorization `code` and a `state` parameter
 * in the URL. This component's primary job is to securely send these parameters to the backend,
 * which then exchanges the code for a permanent access token and links the Instagram account to the seller.
 *
 * ### OAuth 2.0 Flow
 * 1.  The user is redirected from our app to Instagram to grant permissions.
 * 2.  Instagram redirects the user back to this `/instagram/callback` page.
 * 3.  This component extracts the `code` and `state` from the URL.
 * 4.  It sends the `code` and other details (parsed from `state`) to our backend API.
 * 5.  The backend communicates with Instagram to get an access token and saves it.
 * 6.  This component then redirects the user back to their dashboard, indicating success or failure.
 *
 * ### State Management
 * - It uses `localStorage` to set a simple 'instagram_connected' flag (`true` or `false`). The seller dashboard page can read this flag to display an appropriate success or error message after the redirect.
 *
 * ### API Endpoint
 * **`POST /instagram/auth`**:
 * - **Request Body**: `{ code: string, instagram_url: string, seller_id: string, redirect_uri: string }`
 * - **Purpose**: Securely exchanges the authorization code for an access token on the server-side and links the Instagram profile to the seller's account.
 *
 * @returns {JSX.Element} A loading screen that is displayed while the authentication process completes.
 * @see {@link https://nextjs.org/docs/app/api-reference/functions/use-search-params | Next.js useSearchParams}
 * @see {@link https://developers.facebook.com/docs/instagram-basic-display-api/guides/getting-access-tokens-and-permissions/ | Instagram OAuth Documentation}
 */
function CallbackHandler() {
  // --- Next.js Hooks ---
  const router = useRouter();
  const searchParams = useSearchParams();

  // Extract the authorization code and state parameter from the URL query string.
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  // --- State Parsing ---
  // The 'state' parameter is a URI-encoded JSON string containing necessary context.
  // We parse it here to retrieve the original data.
  let instagramUrl = "";
  let storeId = "";
  let redirect_uri = "";
  try {
    const parsedState = JSON.parse(decodeURIComponent(state || ""));
    instagramUrl = parsedState.instagram_url;
    storeId = parsedState.store_id;
    redirect_uri = parsedState.redirect_uri;
  } catch (err) {
    console.error("Invalid state param:", err);
    // Handle cases where the state is missing or malformed.
  }

  /**
   * This effect orchestrates the entire authentication process.
   * It runs once when the component mounts and has access to the `code` and `state`.
   */
  useEffect(() => {
    const authenticate = async () => {
      try {
        // As a security measure, immediately remove the sensitive `code` and `state`
        // parameters from the browser's URL history.
        window.history.replaceState({}, document.title, window.location.pathname);

        // Proceed only if both required parameters are present.
        if (code && state) {
          // Make the API call to our backend to exchange the code for an access token.
          await api.post(
            `/instagram/auth`,
            {
              code,
              instagram_url: instagramUrl,
              seller_id: storeId,
              redirect_uri: redirect_uri,
            },
            {
              headers: { "Content-Type": "application/json" },
              withCredentials: true, // Ensures cookies are sent with the request if needed.
            }
          );

          // On success, set a flag in localStorage and redirect to the dashboard.
          localStorage.setItem("instagram_connected", "true");
          toast.success("Instagram connected successfully!");
          router.push("/seller_dashboard?section=social");
        }
      } catch (error: any) {
        // On failure, set a different flag, show an error toast, and still redirect.
        localStorage.setItem("instagram_connected", "false");
        toast.error("Failed to connect Instagram. Please try again.");
        console.error("Authentication error:", error);
        router.push("/seller_dashboard?section=social");
      }
    };

    // Immediately invoke the async authentication flow.
    authenticate();
  }, [code, state, router, instagramUrl, storeId, redirect_uri]); // Dependency array.

  // Display a loading screen to the user while the backend processing occurs.
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <LoadingSpinner />
      <h2 className="mt-4 text-lg text-gray-700">Authenticating with Instagram...</h2>
    </div>
  );
}

/**
 * A wrapper component that provides a React Suspense boundary for the CallbackHandler.
 *
 * This is necessary because `CallbackHandler` uses the `useSearchParams` hook, which requires
 * a `<Suspense>` boundary in the Next.js App Router.
 *
 * @returns {JSX.Element} The `CallbackHandler` component wrapped in `<Suspense>`.
 * @see {@link https://react.dev/reference/react/Suspense | React Suspense Documentation}
 */
export default function InstagramCallbackPage() {
  return (
    // The Suspense boundary ensures the page can render a fallback while `useSearchParams` is being resolved.
    <Suspense fallback={<LoadingSpinner />}>
      <CallbackHandler />
    </Suspense>
  );
}
