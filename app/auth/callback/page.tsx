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
    console.log(code);
    console.log(state);

    const authenticate = async () => {
      try {
        // Clean URL
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );

        const response = await api.post(
          `http://localhost:8000/auth/instagram`,
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


        const { user_id } = response.data ; 
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
  }, [searchParams , router]);

  return (
    <div className="loading-screen">
      <LoadingSpinner />
      <h2>Authenticating with Instagram...</h2>
    </div>
  );
}
