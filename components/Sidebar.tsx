// components/Sidebar.tsx
'use client';

import CurationListingPage from "@/app/admin/curationModule/page";
import SellerCRM from "@/app/admin/sellerCRM/page";
import CustomerPage from "@/app/customer/page";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isOpen: boolean;
}
const sectionComponents =[
  SellerCRM,
  CustomerPage,
  CurationListingPage
]
export default function Sidebar({ isOpen } : SidebarProps) {
  const pathname = usePathname();

  const links = [
    { label: "Seller CRM", path: "/admin/sellerCRM" },
    { label: "Customer CRM", path: "/admin/customerCRM" },
    // { label: "Users", path: "/admin/users" },
    // { label: "Settings", path: "/admin/settings" },
    { label: "Curation Module", path: "/admin/curationModule" }
    // { label: "Section(Store Ranking)", path: "/admin/store-ranking"}
  ];
  
   const components = [
    { label: "Seller CRM", component_name: SellerCRM },
    { label: "Customer CRM", component_name: CustomerPage },
    // { label: "Users", path: "/admin/users" },
    // { label: "Settings", path: "/admin/settings" },
    { label: "Curation Module", component_name: CurationListingPage }
    // { label: "Section(Store Ranking)", path: "/admin/store-ranking"}
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
        {/* {components.map((component) => (
          <li key ={component.label}>
            <Link
              href={link.path}
              className={`block ${pathname === link.path ? 'text-yellow-300' : 'hover:text-yellow-300'}`}
            >
              {isOpen ? link.label : link.label[0]}
            </Link>
          </li>
        ))} */}
      </ul>
    </div>
  );
}
