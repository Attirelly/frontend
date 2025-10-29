'use client';

import CurationListingPage from "@/app/admin/(protected)/curationModule/page";
import SellerCRM from "@/app/admin/(protected)/sellerCRM/page";
import CustomerPage from "@/app/admin/(protected)/customerCRM/page"; // Corrected import path
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * @interface SidebarProps
 * @description Defines the props for the Sidebar component.
 */
interface SidebarProps {
  /**
   * @description A boolean that controls the collapsed or expanded state of the sidebar.
   * `true` for expanded, `false` for collapsed.
   */
  isOpen: boolean;
}

// NOTE: The following arrays appear to be unused in the current implementation of the component.
// They might be intended for a different routing or component rendering strategy.
const sectionComponents =[
  SellerCRM,
  CustomerPage,
  CurationListingPage
]
const components = [
  { label: "Seller CRM", component_name: SellerCRM },
  { label: "Customer CRM", component_name: CustomerPage },
  { label: "Curation Module", component_name: CurationListingPage }
];


/**
 * A responsive navigation sidebar component for the admin dashboard.
 *
 * This component renders a list of navigation links for the main sections of the admin panel.
 * It features a collapsible design, controlled by the `isOpen` prop, which transitions between
 * a full-width view showing complete labels and a compact view showing only the first letter of each label.
 *
 * ### Active Link Highlighting
 * - It uses the `usePathname` hook from Next.js to get the current URL path.
 * - It compares the current path to each link's `path` property to dynamically apply an "active"
 * style (e.g., changing the text color) to the currently viewed page's link.
 *
 * @param {SidebarProps} props - The props for the component.
 * @returns {JSX.Element} A collapsible sidebar navigation menu.
 * @see {@link https://nextjs.org/docs/app/api-reference/functions/use-pathname | Next.js usePathname}
 * @see {@link https://nextjs.org/docs/pages/api-reference/components/link | Next.js Link Component}
 */
export default function Sidebar({ isOpen } : SidebarProps) {
  // --- Next.js Hooks ---
  // Gets the current URL path to determine which link is active.
  const pathname = usePathname();

  // An array of link objects, each with a display label and a navigation path.
  const links = [
    { label: "Seller CRM", path: "/admin/sellerCRM" },
    { label: "Customer CRM", path: "/admin/customerCRM" },
    { label: "Product CRM", path: "/admin/productCRM"},
    { label: "Curation Module", path: "/admin/curationModule" },
    { label: "Store CRM/Ranking", path: "/admin/storeRanking"},
    { label: "Bulk Upload Photos", path: "/admin/bulkPhotosUpload"},
    { label: "Influencer CRM", path: "/admin/influencerCRM"},
    { label: "Wedding Planner CRM", path: "/admin/weddingCRM"},
    { label: "MakeUp Artist CRM", path: "/admin/makeupCRM"}
  ];

  return (
    // The main container's width changes based on the `isOpen` prop, with a smooth transition.
    <div className={`bg-gray-800 text-white h-full p-4 transition-all duration-300 ${isOpen ? 'w-60' : 'w-16'}`}>
      {/* The title also changes based on the collapsed/expanded state. */}
      <h1 className="text-lg font-bold mb-6">{isOpen ? 'Admin Panel' : 'A'}</h1>
      <ul className="space-y-4">
        {links.map((link) => (
          <li key={link.path}>
            <Link
              href={link.path}
              // Dynamically apply a different text color if the link's path matches the current URL path.
              className={`block ${pathname === link.path ? 'text-yellow-300' : 'hover:text-yellow-300'}`}
            >
              {/* Show the full label when open, and only the first letter when collapsed. */}
              {isOpen ? link.label : link.label[0]}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
