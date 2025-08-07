"use client";

import { manrope } from "@/font";
import { useState } from "react";
import Select from "react-select";

const sellerOptions = [
  { value: "designer_label", label: "Designer Label" },
  { value: "retail_store", label: "Retail Store" },
  { value: "tailor", label: "Tailor" },
  { value: "stylist", label: "Stylist" },
];

export default function SellerForm() {
  const [sellerType, setSellerType] = useState<{ value: string; label: string } | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const isPhoneValid = /^\d{10}$/.test(phone); // exactly 10 digits

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPhoneValid) return;
    console.log({ sellerType, name, phone });
    // handle form submission logic here
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/\D/g, ""); // Remove non-digits
    if (digitsOnly.length <= 10) {
      setPhone(digitsOnly);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`${manrope.className} flex w-[1329px] h-[133px] items-end justify-center gap-4 rounded-xl shadow mx-auto mt-10 px-6 pb-10`}
      style={{ fontWeight: 500 }}
    >
      {/* Seller Type */}
      <div className="flex flex-col w-[299px]">
        <label className="text-sm text-[#1B1C57] mb-1">Seller type</label>
        <Select
          options={sellerOptions}
          placeholder="Select Seller Type"
          onChange={(selected) => setSellerType(selected)}
          className="text-sm"
          classNamePrefix="react-select"
          isClearable
        />
      </div>

      {/* Name */}
      <div className="flex flex-col w-[299px]">
        <label className="text-sm text-[#1B1C57] mb-1">Name</label>
        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-[#D1D5DB] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      {/* Phone */}
      <div className="flex flex-col w-[347px]">
        <label className="text-sm text-[#1B1C57] mb-1">Phone Number</label>
        <div className="flex gap-[9px]">
          <span className="border border-[#D1D5DB] rounded-md px-3 py-2 text-sm text-gray-800 select-none">
            +91
          </span>
          <input
            type="tel"
            placeholder="Enter your phone"
            value={phone}
            onChange={handlePhoneChange}
            className="border border-[#D1D5DB] rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-black"
            inputMode="numeric"
            pattern="\d*"
          />
        </div>
        {/* {!isPhoneValid && phone.length > 0 && (
          <p className="text-xs text-red-600 mt-1">Phone number must be exactly 10 digits</p>
        )} */}
      </div>

      {/* Submit Button */}
      <div className="flex flex-col w-[120px]">
        <button
          type="submit"
          className="bg-black text-white px-6 py-2 rounded-md text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!name || !sellerType || !isPhoneValid}
        >
          Submit
        </button>
      </div>
    </form>
  );
}
