// components/Header.tsx
import { rosario, rubik } from '@/font';
import React from 'react';

interface HeaderProps {
  title: string;
  actions?: React.ReactNode;
}

export default function Header({ title, actions }: HeaderProps) {
  return (
          
    <header className="flex justify-between items-center px-6 py-2 bg-white">
      <h1 className={`${rosario.className} text-[24px] md:text-[30px] text-[#373737] cursor-pointer font-[500px]`}>{title}</h1>
      <div className="px-2 md:px-4 rounded-full 
             bg-white border border-gray-300 
             text-gray-800 font-medium text-sm
             hover:border-gray-400 hover:cursor-pointer
             active:scale-95
             focus:outline-none focus:ring-2 focus:ring-offset-2">{actions}</div>
    </header>
  );
}


// export default function Header() {
//   return (
//     <header className="flex justify-between items-center px-6 py-4 border-b bg-white">
//       <h1 className="text-xl font-bold">Attirelly</h1>
//       <a href="tel:+919738383838" className="text-blue-500 text-sm hover:underline">
//         Need help? Call +91 97-38-38-38-38
//       </a>
//     </header>
//   );
// }