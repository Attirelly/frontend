'use-client';

import Link from 'next/link';
import useAuthStore from '@/store/auth';
import { logout } from '@/utils/logout';
import Image from 'next/image';
import { useState } from 'react';
import MobileMenWomenNavbar from './MobileMenWomenNavbar';
import { ChevronDown, ChevronUp } from 'lucide-react'; // For the dropdown arrows

type Props = {
  onClose: () => void;
  onLoginClick: () => void;
};

/**
 * MobileSidebarMenu Component
 *
 * A mobile-friendly sidebar navigation drawer for authenticated and guest users.
 *
 * ## Features
 * - **Authentication-aware navigation**:
 *   - If logged out → shows "Login" option
 *   - If logged in → shows a collapsible user menu with logout option
 * - **Category navigation**: embeds {@link MobileMenWomenNavbar} for product browsing
 * - **Seller links**:
 *   - Seller Sign-In
 *   - Seller Sign-Up
 * - **Logout handling**: calls {@link logout} utility and clears user session
 * - Responsive design with a slide-in sidebar optimized for mobile devices
 *
 * ## Imports
 * - **Next.js**:
 *   - `Link` for navigation
 *   - `Image` for optimized images
 * - **React**: `useState`
 * - **State Management**: {@link useAuthStore} from `@/store/auth`
 * - **Utilities**: {@link logout} from `@/utils/logout`
 * - **Key Components**: {@link MobileMenWomenNavbar}
 * - **Icons**: `ChevronDown`, `ChevronUp` from `lucide-react`
 *
 * ## Props
 * @param {object} props - Component props
 * @param {() => void} props.onClose - Callback to close the sidebar
 * @param {() => void} props.onLoginClick - Callback to open the login modal
 *
 * @returns {JSX.Element} The rendered mobile sidebar menu
 */

export default function MobileSidebarMenu({ onClose, onLoginClick }: Props) {
  const { user } = useAuthStore();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  /**
   * This is OnClick function for logout button
   * it calls utility function ( logout ) to logout the user and clear user state
   * it triggers onClose callback function to close the Sidebar
   */
  const handleLogout = () => {
    logout(); // Trigger the logout function
    onClose();  // Close the sidebar after logging out
  };

  return (
    <div className="z-10 h-full w-full" onClick={onClose}>
      <div
        className="h-screen w-[70%] bg-[#F8F8F8] px-[24px] py-[12px] overflow-y-auto scrollbar-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col text-black">
          {/* 1. Conditionally render based on user state */}
          {user ? (
            // --- 3. LOGGED IN VIEW ---
            <div>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center justify-between w-full text-left"
              >
                <span className="text-[14px]" style={{ fontWeight: 600 }}>
                  {user.name}
                </span>
                {isUserMenuOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {/* 4. Collapsible Logout Section */}
              {isUserMenuOpen && (
                <div className="mt-2 pl-2">
                  <button
                    onClick={handleLogout} // 5. Trigger logout
                    className="cursor-pointer hover:underline text-[14px] text-red-600"
                    style={{ fontWeight: 600 }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            // --- 1 & 2. LOGGED OUT VIEW ---
            <div className="flex items-center gap-1">
              <span
                className="cursor-pointer hover:underline text-[14px]"
                onClick={onLoginClick}
                style={{ fontWeight: 600 }}
              >
                Login
              </span>
              <Image
                src="/SuggestionBox/top_right_arrow.svg"
                alt="top right arrow"
                width={10}
                height={10}
              />
            </div>
          )}

          <hr className="my-2 border border-[#D2D2D2]" />

          {/* category links */}
          <MobileMenWomenNavbar />

          {/* seller sign in link */}
          <div className="flex items-center gap-1">
            <Link href="/seller_signin" onClick={onClose} className="cursor-pointer hover:underline text-[14px]" style={{ fontWeight: 600 }}>
              Seller SignIn
            </Link>
            <Image
              src="/SuggestionBox/top_right_arrow.svg"
              alt="top right arrow"
              width={10}
              height={10}
            />
          </div>
          <hr className="my-2 border border-[#D2D2D2]" />

          {/* seller sign up link */}
          <div className="flex items-center gap-1">
            <Link href="/seller_signup" onClick={onClose} className="cursor-pointer hover:underline text-[14px]" style={{ fontWeight: 600 }}>
              Seller SignUp
            </Link>
            <Image
              src="/SuggestionBox/top_right_arrow.svg"
              alt="top right arrow"
              width={10}
              height={10}
            />
          </div>
          <hr className="my-2 border border-[#D2D2D2]" />
        </div>
      </div>
    </div>
  );
}