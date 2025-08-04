// components/Header.tsx
import { rubik } from '@/font';
import React from 'react';

interface HeaderProps {
  title: string;
  actions?: React.ReactNode;
}

export default function Header({ title, actions }: HeaderProps) {
  return (
    <header className="flex justify-between items-center px-6 py-4 border-b bg-white">
      <h1 className={`${rubik.className} text-[27px] font-bold text-[#373737]`} style={{fontWeight:700}}>{title}</h1>
      <div>{actions}</div>
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