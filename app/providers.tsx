'use client';

import { useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';

declare global {
  interface Window {
    FB: any;
    fbAsyncInit: () => void;
  }
}


/**
 * Providers component
 * 
 * A client-side component that acts as a centralized wrapper for various
 * third-party context providers and SDK initializations for the application.
 *
 * ## Features
 * - **Google OAuth Provider**: Wraps the application in the `GoogleOAuthProvider`, making Google sign-in functionalities available to all descendant components.
 * - **Facebook SDK Initialization**: Uses a `useEffect` hook to dynamically load and initialize the Facebook SDK on the client-side. This ensures the SDK is only loaded in the browser environment.
 * - **Global Type Augmentation**: Extends the global `Window` interface to provide TypeScript with type information for the Facebook SDK objects (`window.FB` and `window.fbAsyncInit`).
 *
 * ## Logic Flow
 * 1.  The component is rendered as part of the root layout.
 * 2.  It immediately renders the `GoogleOAuthProvider`, passing its `children` inside to make the Google auth context available.
 * 3.  On the initial client-side render, a `useEffect` hook triggers the `loadFacebookSDK` function once.
 * 4.  `loadFacebookSDK` defines the required `window.fbAsyncInit` callback function. This function contains the configuration (`FB.init`) that will be executed once the SDK script has loaded.
 * 5.  It then programmatically creates a `<script>` tag, sets its source to the Facebook SDK URL, and appends it to the document body to initiate the download and initialization process.
 *
 * ## Imports
 * - **Core/Libraries**:
 *    - `useEffect` from `react`: For running the SDK initialization as a side effect on the client.
 *    - `GoogleOAuthProvider` from `@react-oauth/google`: The context provider for Google authentication.
 *
 * ## API Calls
 * - This component does not make any direct API calls itself but initializes third-party SDKs (Facebook, Google) that will make their own requests to their respective servers.
 *
 * ## Props
 * @param {object} props - The props for the component.
 * @param {React.ReactNode} props.children - The child components to be wrapped by the providers, typically the rest of the application.
 *
 * @returns {JSX.Element} The provider components wrapping their children.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Load Facebook SDK
    const loadFacebookSDK = () => {
      if (window.FB) return;

      window.fbAsyncInit = function () {
        window.FB.init({
          appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
          cookie: true,
          xfbml: true,
          version: 'v19.0', // Use latest Graph API version
        });
      };

      const script = document.createElement('script');
      script.src = 'https://connect.facebook.net/en_US/sdk.js';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    };

    loadFacebookSDK();
  }, []);
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      {children}
    </GoogleOAuthProvider>
  );
}