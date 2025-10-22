// 'use client';

// import React from 'react';
// import Link from 'next/link';
// import { rosario, rubik } from '@/font';

// // define the shape of the navigation link
// interface Navlink {
//     name: string;
//     href: string;
// }

// // defining the props our header can accept
// interface HeaderProps {
//     title: string;
//     actions: React.ReactNode;
//     navLinks?: Navlink[];
// }

// export default function Header ({ title, actions, navLinks }: HeaderProps) { return (

//     <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-20">
//           {/* Left Side: Title/Logo */}
//           <div className="flex-shrink-0"> 
//             <Link href="#hero" className="text-[30px] md:text-[37px] text-[#373737] cursor-pointer font-rosario">
//               {title}
//             </Link>
//           </div>

//           {/* Center: Navigation Links (only if they exist) */}
//           {navLinks && (
//             <nav className="hidden md:flex md:space-x-10">
//               {navLinks.map((link) => (
//                 <a
//                   key={link.name}
//                   href={link.href}
//                   className="font-medium text-gray-500 hover:text-black transition-colors"
//                 >
//                   {link.name}
//                 </a>
//               ))}
//             </nav>
//           )}

//           {/* Right Side: Actions (e.g., Join Button) */}
//           <div className="flex items-center font-rosario">
//             {actions}
//           </div>
//         </div>
//       </div>
//     </header>


// );}

'use client';

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { rosario, manrope } from '@/font'; // Import manrope
import { Menu, X } from 'lucide-react';

// define the shape of the navigation link
interface Navlink {
    name: string;
    href: string;
}

// defining the props our header can accept
interface HeaderProps {
    title: string;
    actions: React.ReactNode;
    navLinks?: Navlink[];
}

export default function Header ({ title, actions, navLinks }: HeaderProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* --- UPDATED HEADER LAYOUT --- */}
          <div className="flex items-center justify-between h-20">
            
            {/* Left Side: Hamburger (Mobile) or Title (Desktop) */}
            <div className="flex items-center"> 
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 -ml-2 rounded-md text-gray-700"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </button>
              <Link href="#hero" className="hidden md:block text-[30px] md:text-[37px] text-[#373737] cursor-pointer font-rosario font-bold">
                {title}
              </Link>
            </div>

            {/* Center: Title (Mobile) or Nav (Desktop) */}
            <div className="flex items-center">
              <Link href="#hero" className="md:hidden text-[30px] text-[#373737] cursor-pointer font-rosario font-bold">
                {title}
              </Link>
              {navLinks && (
                <nav className="hidden md:flex md:space-x-10">
                  {navLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      className={`font-medium text-gray-500 hover:text-black transition-colors ${manrope.className}`} // Added Manrope
                    >
                      {link.name}
                    </a>
                  ))}
                </nav>
              )}
            </div>

            {/* Right Side: Actions (e.g., Join Button) */}
            <div className={`flex items-center ${rosario.className}`}>
              {actions}
            </div>
          </div>
        </div>
      </header>

      {/* --- NEW BLACK SLIDE-OUT MENU --- */}
      
      {/* 1. Backdrop (the grayed-out background) */}
      <div 
        onClick={() => setIsMobileMenuOpen(false)}
        className={`md:hidden fixed inset-0 z-50 bg-black/30 backdrop-blur-sm transition-opacity duration-300
          ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
      />

      {/* 2. The Menu Panel Itself */}
      <div 
        className={`md:hidden fixed top-0 left-0 z-50 h-full w-3/4 max-w-sm bg-black p-6
          transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Close Button */}
        <div className="flex items-center justify-end">
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 -mr-2 rounded-md text-gray-400 hover:text-white"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Menu Links */}
        <nav className="mt-8 flex flex-col space-y-6">
          {navLinks && navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)} // Close on click
              // Use Manrope font, white text
              className={`text-xl font-medium text-gray-200 hover:text-white ${manrope.className}`}
            >
              {link.name}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}