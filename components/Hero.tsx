'use client';
import React from "react";
import { useRouter } from 'next/navigation';


export default function Hero() {
  const router = useRouter();
  return (
    <section className="bg-orange-100 py-20 text-center px-6">
      <h1 className="text-4xl font-bold mb-4">
        Partner with Attirely and grow your business
      </h1>
      <p className="mb-6 text-lg">
        Get discovered by 1L+ weekly visitors in selected cities
      </p>
      <button className="bg-black text-white px-6 py-3 rounded-lg font-medium"
      onClick={() => router.push("/seller_signup")}>
        Get Started
      </button>
    </section>
  );
}