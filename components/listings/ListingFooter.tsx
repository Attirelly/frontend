'use client';

import React from 'react';
import Image from 'next/image';
import { manrope, roboto, rosario } from '@/font';
import Link from 'next/link';

const socialPlatforms = [
  {
    name: 'instagram',
    href: 'https://www.instagram.com/attirelly/',
    hoverColor: 'hover:bg-[#E4405F]',
  },
  {
    name: 'instagram',
    href: 'https://www.instagram.com/attirelly.socials/',
    hoverColor: 'hover:bg-[#E4405F]',
  },
  {
    name: 'linkedin',
    href: 'https://www.linkedin.com/company/attirelly',
    hoverColor: 'hover:bg-[#1DA1F2]',
  },
  {
    name: 'whatsapp',
    href: 'https://wa.me/8699892707',
    hoverColor: 'hover:bg-[#25D366]',
  },
];

export default function ListingFooter() {
  return (
    <footer className="bg-[#F7F7F7] text-black px-8 md:px-20 pt-10 pb-6 text-sm">
      <div
        className={`${manrope.className} flex flex-col md:grid md:grid-cols-3 gap-10 md:gap-60`}
        style={{ fontWeight: 500 }}
      >
        {/* Left Column: Company Info */}
        <div className="space-y-4 text-center md:text-left">
          <Link href="/" className={`${rosario.className} text-3xl font-bold`} style={{ fontWeight: 700 }}>Attirelly</Link>


          <div className="flex flex-col items-center md:items-start gap-2 text-[#787A7C] text-base">
            <div className="flex items-start gap-2">
              <Image
                src="/ListingPageHeader/location_footer.svg"
                alt="location"
                width={16}
                height={16}
                className="mt-1"
              />
              <p>
                S-71, Adinath Nagar, J.L.N Marg, <br />
                Opposite World Trade Park, Jaipur,<br />
                Rajasthan, 302017
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-2 text-[#787A7C] text-base">
            <Image src="/ListingPageHeader/phone_footer.svg" alt="phone" width={16} height={16} />
            <span>8699892707</span>
          </div>

          <a href='mailto:info@attirelly.com' className="flex items-center justify-center md:justify-start gap-2 text-[#787A7C] text-base hover:underline">
            <Image src="/ListingPageHeader/email_footer.svg" alt="email" width={16} height={16} />
            <span>info@attirelly.com</span>
          </a>

          {/* Social Icons */}
          <div className="flex justify-center md:justify-start gap-3 pt-2">
            {socialPlatforms.map((platform, index) => (
              <a
                key={platform.name + index}
                href={platform.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Follow us on ${platform.name}`}
                className={`group w-9 h-9 rounded-full bg-white shadow flex items-center justify-center transition-colors duration-300 ${platform.hoverColor}`}
              >
                <Image
                  src={`/FooterIcons/${platform.name}.svg`}
                  alt={platform.name}
                  width={20}
                  height={20}
                  className="transition-all duration-300 group-hover:invert"
                />
              </a>
            ))}
          </div>
        </div>

        {/* Selling Store */}
        <div className="text-center md:text-left">
          <h3 className="mb-3 text-[#121212] text-sm" style={{ fontWeight: 600 }}>Selling Store</h3>
          <ul className="space-y-4 text-[#141414] text-sm" style={{ fontWeight: 400 }}>
            <li><Link href="/seller_signin" className='hover:underline'>Store Sign in</Link></li>
            <li><Link href="/User" className='hover:underline'>Store Sign up</Link></li>
            <li><Link href="/attirelly_ambassador" className='hover:underline'>Ambassador Program</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div className="text-center md:text-left">
          <h3 className="mb-3 text-[#121212] text-sm" style={{ fontWeight: 600 }}>Company</h3>
          <ul className="space-y-4 text-[#141414] text-sm" style={{ fontWeight: 400 }}>
            <li> <Link href="/privacy_policy" className='hover:underline'>Privacy Policy</Link></li>
            <li><Link href="/term_and_condition" className='hover:underline'>Terms & Conditions</Link></li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-300 mt-10 mb-6" />
    </footer>
  );
}