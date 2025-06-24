// app/auth/callback/page.tsx
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

  useEffect(() => {
    const authenticate = async () => {
      try {
        window.history.replaceState({}, document.title, window.location.pathname);

        const response = await api.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/instagram`,
          {
            code,
            instagram_url: state,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        const { user_id } = response.data;
        router.push(`/profile/${user_id}`);
      } catch (error: any) {
        console.error("Authentication error:", error);
        router.push(`/?error=${encodeURIComponent(error.message)}`);
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
