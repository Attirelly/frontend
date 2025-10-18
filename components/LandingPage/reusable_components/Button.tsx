import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  withArrow?: boolean;
  variant?: 'primary' | 'secondary';
}

export const Button = ({ children, withArrow = false, variant = 'primary', ...props }: ButtonProps) => {
  const baseStyles = "font-semibold py-3 px-8 rounded-lg flex items-center justify-center mx-auto transition-colors duration-300 disabled:opacity-50";
  
  const variantStyles = {
    primary: "bg-black text-white hover:bg-gray-800",
    secondary: "bg-white text-black border border-gray-300 hover:bg-gray-100",
  };

  return (
    <button className={`${baseStyles} ${variantStyles[variant]}`} {...props}>
      {children}
      {withArrow && <ArrowUpRight className="ml-2 h-5 w-5" />}
    </button>
  );
};