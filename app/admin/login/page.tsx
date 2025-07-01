"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSellerStore } from "@/store/sellerStore";
import { api } from "@/lib/axios";
import Header from "@/components/Header";
import axios, { AxiosError } from "axios";

export default function SellerSignup() {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [error, setError] = useState("");
  // const setUser = useSellerStore((state) => state.setUser);
  useEffect(() => {
    console.log("prefetching");
    router.prefetch("/admin");
    console.log("fetched");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("loggin you in..");
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
      console.log(response);
      router.push("/admin");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.log("Status Code:", error.response.status);
        console.log("Response Data:", error.response.data);
        alert(
          `Error : ${
            error.response.data?.message || "Something went wrong"
          }, Please Sign In`
        );
        return;
      } else {
        console.log("Unexpected error:", error);
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
          <h2 className="text-xl font-semibold mb-4">Sign in as Admin</h2>

          <div className="space-y-8">
            <label htmlFor="email" className="block font-medium text-sm mb-1">
              Email<span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email id"
              required
            />

            <label
              htmlFor="password"
              className="block font-medium text-sm mb-1"
            >
              Password<span className="text-red-500">*</span>
            </label>
            <input
              id="passwprd"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
