// ListingMobileHeader.tsx
'use client';
import { manrope, rosario } from "@/font";
import useAuthStore from "@/store/auth";
import { logout } from "@/utils/logout";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import CustomerSignIn from "../Customer/CustomerSignIn";
import Link from "next/link";
import MobileSidebarMenu from "./MobileSidebarMenu";
import { motion, AnimatePresence } from "framer-motion";
import useCategoryStore from "@/store/categoryStore";
import { Category } from "@/types/CategoryTypes";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import MobileSearchContainer from "./MobileSearchContainer";

type Props = {
  className?: string;
  customerSignIn?: boolean;
};

export default function ListingMobileHeader({
  className,
  customerSignIn = false,
}: Props) {
  const { user } = useAuthStore();
  const { setCategories } = useCategoryStore();
  const [showLogout, setShowLogout] = useState(false);
  const [signIn, setSignIn] = useState(customerSignIn);
  const [hamburgerMenu, setHamburgerMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [search, setSearch] = useState(false);

  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const hamburgerRef = useRef<HTMLDivElement | null>(null);
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('categories/descendants/');
        const data: Category[] = res.data;
        setCategories(data);
      } catch (error) {
        toast.error('Failed to fetch categories');
      }
    };
    fetchCategories();
  }, [setCategories]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowLogout(false);
      }
      if (
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target as Node) &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setHamburgerMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [sidebarPosition, setSidebarPosition] = useState<'absolute' | 'fixed'>('absolute');
  const [sidebarTop, setSidebarTop] = useState(50);
  const headerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!headerRef.current) return;
      const rect = headerRef.current.getBoundingClientRect();
      if (rect.bottom > 25) {
        setSidebarPosition('absolute');
        setSidebarTop(rect.bottom);
      } else {
        setSidebarPosition('fixed');
        setSidebarTop(0);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`${manrope.className} relative w-full`}>
      {/* Header bar */}
      <div
        className={`${className} w-full flex justify-between px-[21px] py-[8px] text-black h-[50px]`}
        ref={headerRef}
      >
        <div className="flex items-center gap-[28px] p-[5px] ">
          <div ref={hamburgerRef}>
            <Image
              src="/ListingMobileHeader/quill_hamburger.svg"
              alt="hamburger"
              width={22}
              height={22}
              onClick={(e) => {
                e.stopPropagation();
                setHamburgerMenu((prev) => !prev);
              }}
              className="cursor-pointer"
            />
          </div>
          <Link
            href="/"
            className={`${rosario.className} text-[27px]`}
            style={{ fontWeight: 600 }}
          >
            Attirelly
          </Link>
        </div>
        <div className="flex items-center gap-[15px]">
          {/* {!user ? (
            <div className="flex items-center gap-2">
              <span
                className={`text-base text-[#373737] cursor-pointer`}
                style={{ fontWeight: 400 }}
                onClick={() => setSignIn(true)}
              >
                Login
              </span>
            </div>
          ) : (
            <div className="relative" ref={userMenuRef}>
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setShowLogout((prev) => !prev)}
              >
                <Image
                  src="/ListingPageHeader/user_logo.svg"
                  alt="User"
                  width={24}
                  height={24}
                  className="opacity-100"
                />
                <span
                  className={`${manrope.className} text-base text-[#373737] cursor-pointer`}
                  style={{ fontWeight: 400 }}
                  onClick={() => setSignIn(true)}
                >
                  {user.name}
                </span>
              </div>
              {showLogout && (
                <div className="absolute top-full right-0 mt-2 bg-white border rounded shadow-md z-50 p-2 w-32">
                  <button
                    className="w-full text-left text-[#373737] hover:bg-gray-100 px-2 py-1 text-sm"
                    onClick={() => {
                      logout();
                      setShowLogout(false);
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )} */}
          <Image
            src="/ListingMobileHeader/search_lens.svg"
            alt="Search Lens"
            width={30}
            height={26}
            className="rounded-xl bg-[#EEEEEE] px-[7px] py-[5px] cursor-pointer"
            onClick={() => setSearch(true)}
          />
        </div>
      </div>

      {/* Search container */}
      <AnimatePresence>
        {search && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-white"
          >
            <MobileSearchContainer onClose={() => setSearch(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sign In modal */}
      {signIn && !user?.id && (
        <CustomerSignIn
          onClose={() => setSignIn(false)}
          onSuccess={() => setSignIn(false)}
        />
      )}

      {/* Hamburger dropdown menu with animation */}
      <AnimatePresence>
        {hamburgerMenu && (
          <motion.div
            ref={sidebarRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full h-screen z-100"
            style={{
              position: sidebarPosition,
              top: sidebarTop,
              left: 0,
            }}
          >
            <MobileSidebarMenu
              onClose={() => setHamburgerMenu(false)}
              onLoginClick={() => {
                setHamburgerMenu(false);
                setSignIn(true);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}