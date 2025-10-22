"use client";

import { manrope } from "@/font";
import { useState, useEffect } from "react"; // Import useEffect
import { api } from "@/lib/axios";
import { toast } from "sonner";

// Updated interface for the new form data
interface BrideGroomFormData {
  title: string;
  name: string;
  marriageDate?: string;
  city: string;
  phone: string;
  optionsFor: string[]; // Array of selected options
  referredBy?: string;
  referrerName?: string;
}

export default function BrideAndGroomForm() {
  // States for new fields
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [marriageDate, setMarriageDate] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [optionsFor, setOptionsFor] = useState<string[]>([]);
  const [referredBy, setReferredBy] = useState("");
  const [referrerName, setReferrerName] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  // Validation
  const isPhoneValid = /^\d{10}$/.test(phone);
  const isFormValid =
    title && name && city && isPhoneValid && optionsFor.length > 0;

  // Effect to clear referrer name if 'referredBy' is deselected
  useEffect(() => {
    if (!referredBy) {
      setReferrerName("");
    }
  }, [referredBy]);

  // Handler for multi-select checkboxes
  const handleOptionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setOptionsFor((prev) =>
      checked ? [...prev, value] : prev.filter((option) => option !== value)
    );
  };

  // Handler for phone input
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/\D/g, "");
    if (digitsOnly.length <= 10) {
      setPhone(digitsOnly);
    }
  };

  // Async submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return; // Guard clause

    setIsLoading(true);
    const formData: BrideGroomFormData = {
      title,
      name,
      phone,
      city,
      optionsFor,
      ...(marriageDate && { marriageDate }), // Only add if not empty
      ...(referredBy && { referredBy }),     // Only add if not empty
      ...(referrerName && { referrerName }), // Only add if not empty
    };

    try {
      // Correctly await the API call
      await api.post("/ambassador/upload_data?context=bride_groom", formData);
      toast.success("Form submitted successfully!");

    console.log(formData);

      // Reset all form fields
      setTitle("");
      setName("");
      setMarriageDate("");
      setPhone("");
      setCity("");
      setOptionsFor([]);
      setReferredBy("");
      setReferrerName("");
    } catch (error) {
      console.error("Submission failed:", error); // Log error for debugging
      toast.error("Failed to submit form. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      className={`${manrope.className} bg-[#F7F9FC] px-6 py-12 md:px-[100px] lg:px-[161px] lg:py-[117px] mt-20`}
      style={{ fontWeight: 500 }}
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Left Side */}
        <div>
          <h2 className="text-3xl font-semibold text-[#1B1C57]">
            Get in touch with us
          </h2>
          <p className="mt-3 text-gray-500 text-base">
            Fill out the form to let us know you're interested, and we'll
            get back to you shortly!
          </p>
        </div>

        {/* Right Side Form */}
        <form onSubmit={handleSubmit} className="space-y-6 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title (Miss/Mr) */}
            <div>
              <label className="block text-sm text-[#1B1C57] mb-1">
                Title<span className="text-red-500">*</span>
              </label>
              <select
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="" disabled>
                  Select
                </option>
                <option value="Miss">Miss</option>
                <option value="Mr">Mr.</option>
              </select>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm text-[#1B1C57] mb-1">
                Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                placeholder="Enter 10-digit number"
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
                placeholder="Enter your city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Marriage Date (Optional) */}
            <div>
              <label className="block text-sm text-[#1B1C57] mb-1">
                Marriage Date
              </label>
              <input
                type="date"
                value={marriageDate}
                onChange={(e) => setMarriageDate(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Referred By (Optional) */}
            <div>
              <label className="block text-sm text-[#1B1C57] mb-1">
                Referred by
              </label>
              <select
                value={referredBy}
                onChange={(e) => setReferredBy(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="">Select (Optional)</option>
                <option value="Make Up Artist">Make Up Artist</option>
                <option value="Wedding Planner">Wedding Planner</option>
                <option value="Stylist">Stylist</option>
              </select>
            </div>

            {/* Referrer Name (Conditional) */}
            {referredBy && (
              <div className="md:col-span-2">
                <label className="block text-sm text-[#1B1C57] mb-1">
                  {referredBy}
's Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder={`Enter ${referredBy}'s name`}
                  value={referrerName}
                  onChange={(e) => setReferrerName(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  required // Make this required if the "Referred by" is filled
                />
              </div>
            )}

            {/* Options For (Multi-select) */}
            <div className="md:col-span-2">
              <label className="block text-sm text-[#1B1C57] mb-2">
                Opting for<span className="text-red-500">*</span>
              </label>
              <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-2 sm:space-y-0">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    value="QR Gifting"
                    checked={optionsFor.includes("QR Gifting")}
                    onChange={handleOptionsChange}
                    className="rounded text-black focus:ring-black"
                  />
                  <span className="text-sm text-gray-700">QR Gifting</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    value="Attirelly Photobooth"
                    checked={optionsFor.includes("Attirelly Photobooth")}
                    onChange={handleOptionsChange}
                    className="rounded text-black focus:ring-black"
                  />
                  <span className="text-sm text-gray-700">
                    Attirelly Photobooth
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className="bg-black text-white px-8 py-3 rounded-md text-sm font-medium hover:opacity-90 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed w-full md:w-auto"
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </section>
  );
}