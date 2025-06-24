"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { api } from "@/lib/axios";

export default function InstagramCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (!code || !state) {
      router.push("/");
      return;
    }

    const authenticate = async () => {
      try {
        // Clean the URL
        window.history.replaceState({}, document.title, window.location.pathname);

        const response = await api.post(
          `http://localhost:8000/instagram/auth`,
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

    authenticate();
  }, [searchParams, router]);

  return (
    <div className="loading-screen">
      <LoadingSpinner />
      <h2>Authenticating with Instagram...</h2>
    </div>
  );
}
