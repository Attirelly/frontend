"use client"
import { manrope, rosario } from "@/font";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
const res = [
  { title: "Benefits", id: "Why Attirelly?" },
  { title: "How it works", id: "How it works" },
  { title: "Our Number", id: "Our Numbers" },
  { title: "Future Roadmap", id: "Future Roadmap" },
  { title: "Contact Us", id: "Contact Us" },
  { title: "FAQ", id: "FAQ" },
];

export default function SellerLandingHeader() {
  const [selected, setSelected] = useState<string>("");
  const [hamburgerMenu, setHamburgerMenu] = useState(false);

  const hamburgerRef = useRef<HTMLDivElement | null>(null);

  const handleClick = (title: string, id: string) => {
  setSelected(title);
  setHamburgerMenu(false);
  window.history.pushState(null, "", `#${id}`);
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
};
  return (
    <>
    <div className="w-full flex justify-between items-center text-black py-2 lg:hidden"
    style={{ fontWeight: 600 }}
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

        <div className="flex justify-center p-[5px]">
<Link href="/seller_signin" className=" text-[12px] md:text-[18px] text-white w-fit bg-black rounded px-[20px] py-[6px] md:px-[28px] md:py-[10px]">
        Seller Login
      </Link>
      </div>
    </div>
    <div
      className={`${manrope.className} w-full hidden lg:grid grid-cols-[1fr_2fr_1fr] text-black py-2`}
      style={{ fontWeight: 600 }}
    >
        <div className="flex justify-center"><span className={`${rosario.className} text-[34px]`}>Attirelly</span></div>
      
      <div className="flex gap-[24px] justify-center items-center">
        {res.map((item) => {
          const isSelected = selected === item.title;
          return (
            <span
              className={`text-base selected cursor-pointer ${
                isSelected ? "text-black text-semibold" : "text-gray-400"
              }`}
              style={{ fontWeight: 500 }}
              onClick={() => handleClick(item.title, item.id)}
            >
                {item.title}
            </span>
          );
        })}
      </div>
      <div className="flex justify-center">
<Link href="/seller_signin" className="text-[18px] text-white w-fit bg-black rounded px-[28px] py-[10px]">
        Seller Login
      </Link>
      </div>
      
    </div>

    {/* sidebar */}
    <div
        className={`fixed top-0 left-0 h-full w-64 bg-white p-4 flex flex-col shadow-lg transition-transform duration-300 z-50 ${
          hamburgerMenu ? 'transform translate-x-0' : 'transform -translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <Link
            href="/"
            className={`${rosario.className} text-[27px] text-black`}
            style={{ fontWeight: 600 }}
          >
            Attirelly
          </Link>
          {/* <button onClick={() => setHamburgerMenu(false)}> */}
            <Image
              src="/ListingMobileHeader/cross_button.svg"
              alt="Close"
              width={15}
              height={15}
              onClick={() => setHamburgerMenu(false)}
              className="cursor-pointer"
            />
          {/* </button> */}
        </div>
        <nav className="flex flex-col gap-4">
          {res.map((item) => (
            <span
              key={item.id}
              className={`text-lg cursor-pointer py-2 border-b border-gray-200 transition-colors duration-200 ${
                selected === item.title ? "text-black font-bold" : "text-gray-500 hover:text-black"
              }`}
              style={{ fontWeight: selected === item.title ? 600 : 500 }}
              onClick={() => handleClick(item.title, item.id)}
            >
              {item.title}
            </span>
          ))}
        </nav>
        <a
          href="/seller_signin"
          className="mt-8 text-center text-lg text-white bg-black rounded px-6 py-3 transition-colors duration-200 hover:bg-gray-800"
          onClick={() => setHamburgerMenu(false)}
        >
          Seller Login
        </a>
      </div>
      {/* Overlay to close sidebar */}
      {hamburgerMenu && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden" onClick={() => setHamburgerMenu(false)}></div>
      )}
    </>
  );
}
