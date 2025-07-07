// app/auth/callback/page.tsx
"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { api } from "@/lib/axios";
import { useSellerStore } from "@/store/sellerStore";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const code = searchParams.get("code");
  const state = searchParams.get("state");
  console.log("state", state);

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

        const { user_id } = response.data;
        console.log(response);

        router.push(`/seller_dashboard`);
      } catch (error: any) {
        console.error("Authentication error:", error);
        router.push("/seller_dashboard");
        // router.push(`/?error=${encodeURIComponent(error.message)}`);
      }
    };

    if (code && state) {
      authenticate();
    } else {
      router.push("/");
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
