'use client';

import { useState, ReactNode } from "react";
import Sidebar from "@/components/Sidebar";
import { usePathname } from "next/navigation";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="h-screen flex flex-col">
      {/* ✅ Top Navigation Bar */}
      <header className="bg-white px-4 py-3 shadow flex items-center justify-between">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-700 hover:text-black font-medium"
        >
          {isOpen ? '←' : '→'}
        </button>
        <h1 className="text-lg font-semibold">Admin Panel</h1>
      </header>

      {/* ✅ Sidebar + Content */}
      <div className="flex flex-1">
        <Sidebar isOpen={isOpen} />
        <main className="flex-1 overflow-auto p-6 bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
}
