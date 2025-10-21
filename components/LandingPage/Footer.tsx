import React from 'react';
import { Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => (
  <footer className="bg-gray-100 text-gray-600 pt-16 pb-8 px-4 mt-[59px]">
    <div className="max-w-7xl mx-auto grid grid-cols-1 mt-[59px] md:grid-cols-4 gap-8 ">
      <div className="md:col-span-2">
        <h3 className="text-2xl font-bold text-black mb-4">Attirelly</h3>
        <p>S-71, Adinath Nagar, J.L.N Marg, Opposite World Trade Park, Jaipur, Rajasthan, 302017</p>
        <p className="mt-2">7248455559</p>
        <p className="mt-2">attirelly@info.com</p>
        <div className="flex space-x-4 mt-6">
          <a href="#" aria-label="Facebook" className="hover:text-black"><Facebook /></a>
          <a href="#" aria-label="Twitter" className="hover:text-black"><Twitter /></a>
          <a href="#" aria-label="Instagram" className="hover:text-black"><Instagram /></a>
        </div>
      </div>
      <div>
        <h4 className="font-semibold text-black mb-4">Selling Store</h4>
        <ul className="space-y-2">
          <li><a href="#" className="hover:text-black">Store Sign In</a></li>
          <li><a href="#" className="hover:text-black">Store Sign Up</a></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold text-black mb-4">Company</h4>
        <ul className="space-y-2">
          <li><a href="#" className="hover:text-black">About us</a></li>
          <li><a href="#" className="hover:text-black">Privacy Policy</a></li>
          <li><a href="#" className="hover:text-black">Terms & Conditions</a></li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-200 text-center text-sm">
      <p>Copyright © {new Date().getFullYear()} Attirelly.com. All rights reserved.</p>
    </div>
  </footer>
);
export default Footer;