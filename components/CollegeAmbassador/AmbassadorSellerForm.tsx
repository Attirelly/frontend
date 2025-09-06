"use client";

import { manrope } from "@/font";
import { useState } from "react";
import { api } from "@/lib/axios";
import { toast } from "sonner";

interface SellerFormData {
  name: string;
  college?: string;
  phone: string;
  city: string;
}

export default function SellerForm() {
  const [name, setName] = useState("");
  const [college, setCollege] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");

  const isPhoneValid = /^\d{10}$/.test(phone);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPhoneValid) return;
    const sellerData: SellerFormData = { name, college, phone, city };
    try{
      const res = api.post("/ambassador/upload_data", sellerData);
      toast.success("Form submitted successfully!");
      setName("");
      setCollege("");
      setPhone("");
      setCity("");
    } catch (error) {
      toast.error("Failed to submit form. Please try again.");
      return;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/\D/g, "");
    if (digitsOnly.length <= 10) {
      setPhone(digitsOnly);
    }
  };

  return (
    <section
      className={`${manrope.className} bg-[#F7F9FC]  px-[100px] py-[20px] lg:px-[161px] lg:py-[117px] mt-20`}
      style={{ fontWeight: 500 }}
    >
      <div className=" mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Left Side */}
        <div>
          <h2 className="text-2xl font-semibold text-[#1B1C57]">
            Get in touch with us
          </h2>
          <p className="mt-2 text-gray-500 text-sm">
            something about program and contact response time goes here
          </p>
        </div>

        {/* Right Side Form */}
        <form onSubmit={handleSubmit} className="space-y-6 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm text-[#1B1C57] mb-1">
                Your Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* College */}
            <div>
              <label className="block text-sm text-[#1B1C57] mb-1">
                College
                {/* <span className="text-red-500">*</span> */}
              </label>
              <input
                type="text"
                placeholder="Enter"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm text-[#1B1C57] mb-1">
                Phone number<span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                placeholder="Enter"
                value={phone}
                onChange={handlePhoneChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm text-[#1B1C57] mb-1">
                City<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!name || !city || !isPhoneValid}
            className="bg-black text-white px-8 py-2 rounded-md text-sm hover:opacity-90 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            Submit
          </button>
        </form>
      </div>
    </section>
  );
}
