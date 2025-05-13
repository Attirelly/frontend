// components/Sidebar.tsx
'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isOpen: boolean;
}

export default function Sidebar({ isOpen } : SidebarProps) {
  const pathname = usePathname();

  const links = [
    { label: "Dashboard", path: "/admin/dashboard" },
    { label: "Users", path: "/admin/users" },
    { label: "Settings", path: "/admin/settings" },
    { label: "Section(Store Ranking)", path: "/admin/store-ranking"}
  ];

  return (
    <div className={`bg-gray-800 text-white h-full p-4 transition-all duration-300 ${isOpen ? 'w-60' : 'w-16'}`}>
      <h1 className="text-lg font-bold mb-6">{isOpen ? 'Admin Panel' : 'A'}</h1>
      <ul className="space-y-4">
        {links.map((link) => (
          <li key={link.path}>
            <Link
              href={link.path}
              className={`block ${pathname === link.path ? 'text-yellow-300' : 'hover:text-yellow-300'}`}
            >
              {isOpen ? link.label : link.label[0]}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
