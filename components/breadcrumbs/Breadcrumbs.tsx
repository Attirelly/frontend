import Link from 'next/link';
import React from 'react';
import { BreadcrumbItem } from '@/types/breadcrumb';

// Define the type for the component's props
interface BreadcrumbsProps {
  trail: BreadcrumbItem[];
}

const ChevronIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M6 12L10 8L6 4" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ trail }) => {
  console.log("trail:", {trail});
  if (!trail || trail.length <= 1) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm">
        {trail.map((item, index) => {
          const isLast = index === trail.length - 1;
          return (
            <li key={item.url} className="flex items-center">
              {isLast ? (
                <span className="font-medium text-gray-800" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <Link href={item.url} className="text-gray-500 hover:text-gray-900">
                  {item.name}
                </Link>
              )}
              {!isLast && (
                <div className="ml-2">
                  <ChevronIcon />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;