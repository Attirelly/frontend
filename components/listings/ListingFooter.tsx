// 'use client';

// import React from 'react';
// import Image from 'next/image';
// import {roboto} from '@/font';

// export default function ListingFooter() {
//   return (
//     <footer className="bg-[#F7F7F7] text-black px-8 md:px-20 pt-10 pb-6 text-sm">
//       <div className={`${roboto.className} grid grid-cols-1 md:grid-cols-4 gap-10`}
//       style={{fontWeight:400}}>
//         {/* Left Column */}
//         <div className="space-y-3">
//           <h2 className="text-3xl"
//           style={{fontWeight:700}}>Attirelly</h2>
//           <div className="flex mt-12"
//           style={{fontWeight:500}}>
//             <input
//               type="email"
//               placeholder="Get latest offers to your inbox"
//               className="px-4 py-2 border border-gray-300 bg-transparent rounded-l-md text-base focus:outline-none"
//             />
//             <button className="bg-black text-white px-4 rounded-r-md">
//               {/* <span className="text-lg">{'>'}</span> */}
//               <Image
//               src="FooterIcons/arrow-right.svg"
//               alt="arrow-right"
//               width={8}
//               height={8}
//               />
//             </button>
//           </div>

//           {/* Social Icons */}
//           <div className="flex gap-3 pt-2">
//             {['facebook', 'instagram', 'twitter', 'email'].map((platform) => (
//               <button
//                 key={platform}
//                 className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center"
//               >
//                 <Image
//                   src={`/FooterIcons/${platform}.svg`}
//                   alt={platform}
//                   width={16}
//                   height={16}
//                 />
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Links Columns */}
//         <div>
//           <h3 className="mb-3" style={{fontWeight:600}}>Shop</h3>
//           <ul className="space-y-4 text-[#141414]">
//             <li>My account</li>
//             <li>Login</li>
//             <li>Wishlist</li>
//             <li>Cart</li>
//           </ul>
//         </div>

//         <div>
//           <h3 className="mb-3" style={{fontWeight:600}}>Information</h3>
//           <ul className="space-y-4 text-[#141414]">
//             <li>Shipping Policy</li>
//             <li>Returns & Refunds</li>
//             <li>Cookies Policy</li>
//             <li>Frequently asked</li>
//           </ul>
//         </div>

//         <div>
//           <h3 className="mb-3" style={{fontWeight:600}}>Company</h3>
//           <ul className="space-y-4 text-[#141414]">
//             <li>About us</li>
//             <li>Privacy Policy</li>
//             <li>Terms & Conditions</li>
//             <li>Contact Us</li>
//           </ul>
//         </div>
//       </div>

//       {/* Divider */}
//       <div className="border-t border-gray-300 mt-18 mb-6" />

//       {/* Bottom Row */}
//       <div className="flex flex-col md:flex-row justify-between items-center text-xs text-[#3E3E59] gap-4">
//         <div>© Attirelly 2001 - 2024</div>

//         <div className="flex items-center gap-4">
//           <div className="flex items-center gap-1">
//             <Image
//               src="/FooterIcons/flag-us.svg"
//               alt="flag"
//               width={16}
//               height={16}
//             />
//             <span>English</span>
//             <Image
//               src="/FooterIcons/arrow-down.svg"
//               alt="down"
//               width={12}
//               height={12}
//             />
//           </div>

//           <div className="flex items-center gap-1">
//             <span>USD</span>
//             <Image
//               src="/FooterIcons/arrow-down.svg"
//               alt="down"
//               width={12}
//               height={12}
//             />
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }


'use client';

import React from 'react';
import Image from 'next/image';
import { manrope, roboto } from '@/font';
import Link from 'next/link';

export default function ListingFooter() {
  return (
    <footer className="bg-[#F7F7F7] text-black px-8 md:px-20 pt-10 pb-6 text-sm">
      <div
        className={`${manrope.className} grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-60`}
        style={{ fontWeight: 500 }}
      >
        {/* Left Column: Company Info */}
        <div className="space-y-4">
          <h2 className={`${roboto.className} text-3xl font-bold`} style={{fontWeight:700}}>Attirelly</h2>

          <div className="flex items-start gap-2 text-[#787A7C] text-base">
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

          <div className="flex items-center gap-2 text-[#787A7C] text-base">
            <Image src="/ListingPageHeader/phone_footer.svg" alt="phone" width={16} height={16} />
            <span>8699892707</span>
          </div>

          <a href='mailto:info@attirelly.com' className="flex items-center gap-2 text-[#787A7C] text-base hover:underline">
            <Image src="/ListingPageHeader/email_footer.svg" alt="email" width={16} height={16} />
            <span>info@attirelly.com</span>
          </a>

          {/* Social Icons */}
          <div className="flex gap-3 pt-2">
            {['facebook', 'instagram', 'twitter', 'whatsapp'].map((platform) => (
              <button
                key={platform}
                className="w-9 h-9 rounded-full bg-white shadow flex items-center justify-center"
              >
                <Image
                  src={`/FooterIcons/${platform}.svg`}
                  alt={platform}
                  width={20}
                  height={20}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Selling Store */}
        <div>
          <h3 className="mb-3 text-[#121212] text-sm" style={{fontWeight: 600}}>Selling Store</h3>
          <ul className="space-y-4 text-[#141414] text-sm" style={{fontWeight: 400}}>
            <li><Link href="/seller_signin" className='hover:underline'>Store Sign in</Link></li>
            <li><Link href="/User" className='hover:underline'>Store Sign up</Link></li>
            <li><Link href="/attirelly_ambassador" className='hover:underline'>Ambassador Program</Link></li>
          </ul>
        </div>

        {/* Information */}
        {/* <div>
          <h3 className="mb-3 font-semibold">Information</h3>
          <ul className="space-y-4 text-[#141414]">
            <li>Shipping Policy</li>
            <li>Returns & Refunds</li>
            <li>Cookies Policy</li>
          </ul>
        </div> */}

        {/* Company */}
        <div>
          <h3 className="mb-3 text-[#121212] text-sm" style={{fontWeight: 600}}>Company</h3>
          <ul className="space-y-4 text-[#141414] text-sm" style={{fontWeight: 400}}>
            <li> <Link href="/aboutus" className='hover:underline'>About us</Link></li>
            <li> <Link href="/privacy_policy" className='hover:underline'>Privacy Policy</Link></li>
            <li><Link href="/term_and_condition" className='hover:underline'>Terms & Conditions</Link></li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-300 mt-10 mb-6" />

      {/* Bottom Row */}
      {/* <div className="flex flex-col md:flex-row justify-between items-center text-xs text-[#3E3E59] gap-4">
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
      </div> */}
    </footer>
  );
}

