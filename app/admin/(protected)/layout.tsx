"use client";

import { useState, ReactNode, useRef, useEffect } from "react";
import Sidebar from "@/components/admin/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useRouter } from "next/navigation";
import { logout } from "@/utils/logout";
import Link from "next/link";
// import { usePathname } from "next/navigation";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout("/admin/login");
  };

  return (
    <ProtectedRoute role="super_admin">
      <div className="h-screen flex flex-col">
        {/* ✅ Top Navigation Bar */}
        <header className="bg-white px-4 py-3 shadow flex items-center justify-between">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-700 hover:text-black font-medium"
          >
            {isOpen ? "←" : "→"}
          </button>
          {/* <h1 className="text-lg font-semibold">Admin Panel</h1> */}
          {/* ✅ Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="text-lg font-semibold focus:outline-none text-black"
            >
              Admin Panel ∨
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-md z-10 border">
                {/* <button
                  onClick={() => router.push("/admin/profile")}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Profile
                </button> */}
                <Link
                  href="/admin/profile"
                  className="w-full text-left block px-4 py-2 hover:bg-gray-100 text-black"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* ✅ Sidebar + Content */}
        <div className="flex flex-1">
          <Sidebar isOpen={isOpen} />
          <main className="flex-1 overflow-auto p-6 bg-gray-100">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
