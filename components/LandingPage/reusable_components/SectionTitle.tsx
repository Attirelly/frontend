import React from 'react';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export const SectionTitle = ({ title, subtitle, className = '' }: SectionTitleProps) => {
  return (
    <div className={`text-center ${className}`}>
      <h2 className="text-3xl md:text-4xl lg:text-5xl  tracking-tighter" style={{fontWeight:800}}>{title}</h2>
      {subtitle && <p className="mt-4 text-lg text-black-500 max-w-3xl mx-auto">{subtitle}</p>}
    </div>
  );
};