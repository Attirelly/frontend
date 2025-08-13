"use client"
import { manrope, rosario } from "@/font";
import Link from "next/link";
import { useState } from "react";
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

  const handleClick = (title: string, id: string) => {
  setSelected(title);
  window.history.pushState(null, "", `#${id}`);
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
};
  return (
    <div
      className={`${manrope.className} grid grid-cols-[1fr_2fr_1fr] text-black py-2`}
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
  );
}
