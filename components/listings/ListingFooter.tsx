'use client';

import React from 'react';
import Image from 'next/image';

export default function ListingFooter() {
  return (
    <footer className="bg-[#F7F7F7] text-black px-8 md:px-20 pt-10 pb-6 text-sm">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Left Column */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Attirelly</h2>
          <div className="flex">
            <input
              type="email"
              placeholder="Get latest offers to your inbox"
              className="px-4 py-2 border border-gray-300 bg-transparent rounded-l-md text-sm focus:outline-none"
            />
            <button className="bg-black text-white px-4 rounded-r-md">
              {/* <span className="text-lg">{'>'}</span> */}
              <Image
              src="FooterIcons/arrow-right.svg"
              alt="arrow-right"
              width={8}
              height={8}
              />
            </button>
          </div>

          {/* Social Icons */}
          <div className="flex gap-3 pt-2">
            {['facebook', 'instagram', 'twitter', 'email'].map((platform) => (
              <button
                key={platform}
                className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center"
              >
                <Image
                  src={`/FooterIcons/${platform}.svg`}
                  alt={platform}
                  width={16}
                  height={16}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Links Columns */}
        <div>
          <h3 className="font-semibold mb-3">Shop</h3>
          <ul className="space-y-2 text-gray-600">
            <li>My account</li>
            <li>Login</li>
            <li>Wishlist</li>
            <li>Cart</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Information</h3>
          <ul className="space-y-2 text-gray-600">
            <li>Shipping Policy</li>
            <li>Returns & Refunds</li>
            <li>Cookies Policy</li>
            <li>Frequently asked</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Company</h3>
          <ul className="space-y-2 text-gray-600">
            <li>About us</li>
            <li>Privacy Policy</li>
            <li>Terms & Conditions</li>
            <li>Contact Us</li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-300 my-6" />

      {/* Bottom Row */}
      <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-600 gap-4">
        <div>© Attirelly 2001 - 2024</div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Image
              src="/FooterIcons/flag-us.svg"
              alt="flag"
              width={16}
              height={16}
            />
            <span>English</span>
            <Image
              src="/FooterIcons/arrow-down.svg"
              alt="down"
              width={12}
              height={12}
            />
          </div>

          <div className="flex items-center gap-1">
            <span>USD</span>
            <Image
              src="/FooterIcons/arrow-down.svg"
              alt="down"
              width={12}
              height={12}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
