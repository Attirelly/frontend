"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { api } from "@/lib/axios";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const code = searchParams.get("code");
  const state = searchParams.get("state");
  

  let instagramUrl = "";
  let storeId = "";

  try {
    const parsedState = JSON.parse(decodeURIComponent(state || ""));
    instagramUrl = parsedState.instagram_url;
    storeId = parsedState.store_id;
  } catch (err) {
    console.error("Invalid state param:", err);
  }


  useEffect(() => {
    const authenticate = async () => {
      try {
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );

        
        const response = await api.post(
          `${process.env.NEXT_PUBLIC_API_URL}/instagram/auth`,
          {
            code,
            instagram_url: instagramUrl,
            seller_id: storeId,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        console.log("response" , response) 
        const { user_id } = response.data;
        
        localStorage.setItem("instagram_connected", "true");
        router.push(`/seller_dashboard`);
      } catch (error: any) {
        localStorage.setItem("instagram_connected", "false")
        console.error("Authentication error:", error);
        router.push("/seller_dashboard?section=social");
        // router.push(`/?error=${encodeURIComponent(error.message)}`);
      }
    };

    if (code && state) {
      authenticate();
    } else {
      localStorage.setItem("instagram_connected", "false");
      router.push("/seller_dashboard?section=social");
    }
  }, [code, state, router]);

  return (
    <div className="loading-screen">
      <LoadingSpinner />
      <h2>Authenticating with Instagram...</h2>
    </div>
  );
}

// Wrap with <Suspense> to prevent the build error
export default function InstagramCallbackPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CallbackHandler />
    </Suspense>
  );
}
