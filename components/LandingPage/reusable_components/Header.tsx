'use client';

import React from 'react';
import Link from 'next/link';
import { rosario, rubik } from '@/font';

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

export default function Header ({ title, actions, navLinks }: HeaderProps) { return (

    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left Side: Title/Logo */}
          <div className="flex-shrink-0"> 
            <Link href="/" className="text-[30px] md:text-[37px] text-[#373737] cursor-pointer font-rosario">
              {title}
            </Link>
          </div>

          {/* Center: Navigation Links (only if they exist) */}
          {navLinks && (
            <nav className="hidden md:flex md:space-x-10">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="font-medium text-gray-500 hover:text-black transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </nav>
          )}

          {/* Right Side: Actions (e.g., Join Button) */}
          <div className="flex items-center font-rosario">
            {actions}
          </div>
        </div>
      </div>
    </header>


);}