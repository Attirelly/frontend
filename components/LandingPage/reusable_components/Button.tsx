import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { rosario } from '@/font';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  withArrow?: boolean;
  variant?: 'primary' | 'secondary';
  className?: string;
}

// export const Button = ({ children, withArrow = false, variant = 'primary', ...props }: ButtonProps) => {
//   const baseStyles = "font-semibold py-3 px-8 rounded-lg flex items-center justify-center mx-auto transition-colors duration-300 disabled:opacity-50";
  
//   const variantStyles = {
//     primary: "bg-black text-white hover:bg-gray-800",
//     secondary: "bg-white text-black border border-gray-300 hover:bg-gray-100",
//   };

//   return (
//     <button className={`${baseStyles} ${variantStyles[variant]}`} {...props}>
//       {children}
//       {withArrow && <ArrowUpRight className="ml-2 h-5 w-5" />}
//     </button>
//   );
// };

export const Button = ({
  children,
  withArrow = false,
  variant = 'primary',
  className = '', // Default to empty string
  ...props
}: ButtonProps) => {
  
  // --- START OF CHANGES ---
  const baseStyles =
    'font-rosario  text-lg py-4 px-10 rounded-lg flex items-center justify-center mx-auto transition-colors duration-300 disabled:opacity-50';
  // --- END OF CHANGES ---

  const variantStyles = {
    primary: 'bg-black text-white hover:bg-gray-800',
    secondary: 'bg-white text-black border border-gray-300 hover:bg-gray-100',
  };

  return (
    <button
      // We combine the base styles, variant styles, and any custom classes
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
      {withArrow && <ArrowUpRight className="ml-2 h-5 w-5" />}
    </button>
  );
};