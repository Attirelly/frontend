"use client";
import { useState } from "react";

export default function UserForm() {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    role: "USER",
    provider: "",
    gender: "",
    birthday: "",
    location: "",
    profile_pic: "",
    contact_number: "",
    google_uid: "",
    meta_uid: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted:", formData);
    // Submit logic here
  };

  return (
    <div className="min-h-screen bg-[#fff8dc] flex items-center justify-center">
    <div className="w-2xl mx-auto mt-10 p-5 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">Provide Information</h2>
      <form onSubmit={handleSubmit} className="space-y-4 grid grid-cols-2 gap-4">
        {[
          { name: "email", type: "email", placeholder: "Email" },
          { name: "name", type: "text", placeholder: "Name" },
          { name: "password", type: "password", placeholder: "Password" },
          { name: "provider", type: "text", placeholder: "Provider" },
          { name: "gender", type: "text", placeholder: "Gender" },
          { name: "birthday", type: "date" },
          { name: "location", type: "text", placeholder: "Location" },
          { name: "profile_pic", type: "text", placeholder: "Profile Picture URL" },
          { name: "contact_number", type: "text", placeholder: "Contact Number" },
          { name: "google_uid", type: "text", placeholder: "Google UID" },
          { name: "meta_uid", type: "text", placeholder: "Meta UID" },
        ].map((input, idx) => (
          <input
            key={idx}
            type={input.type}
            name={input.name}
            placeholder={input.placeholder}
            value={(formData as any)[input.name]}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        ))}

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
    </div>
  );
}
