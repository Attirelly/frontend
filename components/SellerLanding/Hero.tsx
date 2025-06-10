'use client';
import React from "react";
import { useRouter } from 'next/navigation';


export default function Hero() {
  const router = useRouter();
  return (
    <section className="relative bg-cover bg-center bg-no-repeat min-h-[90vh] flex items-center justify-center px-6"
      style={{ backgroundImage: "url('/OnboardingSections/user_bg.png')" }}
    >
      {/* <div className="absolute inset-0 bg-orange- opacity-60 z-0" /> */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-white/70 rounded-lg pointer-events-none" />
      <div className="flex flex-col items-center space-y-4 ">
        <h1 className="text-5xl text-center  font-bold text-white mb-4">
          Partner with Attirely <br /> and grow your business
        </h1>
        <p className="mb-6 text-lg text-white font-bold">
          Become exclusive partners in select cities
        </p>
        <div className="flex gap-10 mt-6 flex-wrap">
          <button className="w-40 bg-black text-white px-6 py-3 rounded-lg font-medium "
            onClick={() => router.push("/seller_signup")}>
            Register
          </button>
          <button className="w-40 border border-white bg-none text-white px-6 py-3 rounded-lg font-medium"
            onClick={() => router.push("/seller_signin")}>
            Login
          </button>
        </div>


      </div>
    </section>
  );
}