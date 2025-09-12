"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSellerStore } from "@/store/sellerStore";
import { api } from "@/lib/axios";
import Header from "@/components/Header";
import axios, { AxiosError } from "axios";

/**
 * A page component that provides a sign-in form for super administrators.
 *
 * This component renders a simple form with email and password fields. On submission,
 * it sends a request to the backend to authenticate the user as a super admin. If the
 * login is successful, the user is redirected to the main admin dashboard.
 *
 * ### State Management
 * - **Local State (`useState`)**: Manages the `email` and `password` input fields and an `error` state for displaying login failures.
 *
 * ### Navigation
 * - It uses Next.js's `useRouter` hook for navigation.
 * - On successful login, it redirects the user to the `/admin` page.
 * - It also uses `router.prefetch('/admin')` to start loading the admin page in the background as soon as this login page is rendered, which can lead to a faster perceived navigation speed after login.
 *
 * ### API Endpoint
 * **`POST /users/login_super_admin`**
 * This endpoint is used to authenticate a super admin user.
 * - **Request Body**: `{ email: string, password: string }`
 * - **`withCredentials: true`** is used to ensure that cookies (like session tokens) are sent with the request.
 *
 * @returns {JSX.Element} The admin sign-in page.
 * @see {@link https://nextjs.org/docs/app/api-reference/functions/use-router | Next.js useRouter}
 * @see {@link https://axios-http.com/docs/intro | Axios Documentation}
 */
export default function SellerSignup() {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [error, setError] = useState("");

  /**
   * This effect runs once on component mount to prefetch the admin dashboard page.
   * This can make the navigation feel faster after a successful login.
   */
  useEffect(() => {
    router.prefetch("/admin");
  }, []);

  /**
   * Handles the form submission event.
   * It prevents the default form action, sends a login request to the API,
   * and handles either redirecting on success or showing an error on failure.
   * @param {React.FormEvent} e - The form submission event.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post(
        "/users/login_super_admin",
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      router.push("/admin");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        alert(
          `Error : ${
            error.response.data?.message || "Something went wrong"
          }, Please Sign In`
        );
        return;
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <Header
        title="Attirelly"
        // actions={
        //     <button
        //         className="border border-gray-600 px-4 py-1 shadow-lg text-sm rounded hover:bg-blue-100"
        //         onClick={() => router.push(`/seller_signup`)}>
        //         Sign Up
        //     </button>
        // }
      />

      <main className="flex-grow flex items-center justify-center px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md"
        >
          <h2 className="text-xl font-semibold mb-4 text-black">
            Sign in as Admin
          </h2>

          <div className="space-y-8">
            <label
              htmlFor="email"
              className="block font-medium text-sm mb-1 text-black"
            >
              Email<span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4 text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email id"
              required
            />

            <label
              htmlFor="password"
              className="block font-medium text-sm mb-1 text-black"
            >
              Password<span className="text-red-500">*</span>
            </label>
            <input
              id="passwprd"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4 text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Password"
              required
            />

            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
            >
              Sign In
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
