// components/ProtectedRoute.tsx
"use client";
import useAuthStore from "@/store/auth";
import { useRouter, usePathname } from "next/navigation";

import { useEffect } from "react";
import LoadingSpinner from "./ui/LoadingSpinner";

interface Props {
  children: React.ReactNode;
  requiredRole?: string; // Optional role restriction (e.g., 'admin')
}

export default function ProtectedRouteComp({ children, requiredRole }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { user , isAuthenticated, isLoading, fetchUser } = useAuthStore();

  useEffect(() => {
    if (isLoading) return;

    const verifyAuth = async () => {
      try {
        if (!isAuthenticated) {
          const res = await fetchUser();
          if (requiredRole && res?.role !== requiredRole) {
            router.push("/unauthorized"); // Or a "403 Forbidden" page
          }
        }
      } catch (error) {
        router.push(`/customer_signup`);
        return;
      }
    };

    verifyAuth();
  }, [
    isAuthenticated,
    isLoading,
    pathname,
    fetchUser,
    requiredRole,
    router,
    user,
  ]);

  if (
    isLoading ||
    !isAuthenticated ||
    (requiredRole && user?.role !== requiredRole)
  ) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    ); // Show a spinner
  }

  return <>{children}</>;
}
