import React from 'react';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export const SectionTitle = ({ title, subtitle, className = '' }: SectionTitleProps) => {
  return (
    <div className={`text-center ${className}`}>
      <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">{title}</h2>
      {subtitle && <p className="mt-4 text-lg text-gray-500 max-w-3xl mx-auto">{subtitle}</p>}
    </div>
  );
};