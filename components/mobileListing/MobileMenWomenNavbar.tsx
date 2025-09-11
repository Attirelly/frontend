'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Category, SubCat1, SubCat2 } from '@/types/CategoryTypes';
import { manrope } from '@/font';
import Link from 'next/link';
import { useProductFilterStore } from '@/store/filterStore';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import useCategoryStore from '@/store/categoryStore';

// A simple utility to get the correct category data based on gender
const getCategoryByGender = (
  categoriesFiltered: Category[],
  gender: 'Men' | 'Women'
): Category | undefined => {
  return categoriesFiltered.find((c) => c.name.toLowerCase() === gender.toLowerCase());
};

/**
 * MobileMenWomenNavbar Component
 *
 * A responsive mobile navigation menu for browsing Men's and Women's **Ethnic Wear** categories.
 *
 * ## Features
 * - Provides collapsible, accordion-style navigation optimized for mobile devices.
 * - Allows switching between **Men** and **Women** tabs.
 * - Dynamically filters and renders categories from the global store.
 * - Supports nested subcategories with expand/collapse behavior.
 * - Navigates to a product listing page (`/product_directory`) when a category is selected.
 *
 * ## Imports
 * - **React**: `useEffect`, `useState`
 * - **Notification**: `toast` from `sonner`
 * - **Next.js**:
 *   - `Link` for client-side navigation
 *   - `Image` for optimized images
 *   - `useRouter` from `next/navigation` for programmatic routing
 * - **State Management (Zustand Stores)**:
 *   - `useCategoryStore` (provides categories)
 *   - `useProductFilterStore` (manages product filter state)
 * - **Fonts**: `manrope` from `@/font`
 * - **Types**: {@link Category}, {@link SubCat1}, {@link SubCat2} from `@/types/CategoryTypes`
 *
 * ## Utility
 * - `getCategoryByGender`: Helper to fetch the correct category tree for the selected gender.
 *
 * ## Types
 * - Category: {@link Category}
 * - Sub Category 1: {@link SubCat1}
 * - Sub Category 2: {@link SubCat2}
 *
 * @returns {JSX.Element | null} The rendered mobile navigation menu,
 *          or `null` if categories are not yet loaded.
 */
export default function MobileMenWomenNavbar() {
  const router = useRouter();
  const { categories } = useCategoryStore();
  const { resetFilters } = useProductFilterStore();
  const [categoriesFiltered, setCategoriesFiltered] = useState<Category[]>([]);
  const [selectedGender, setSelectedGender] = useState<'Men' | 'Women'>('Women');
  // Change state from a single string to an array of strings
  const [openSubcats, setOpenSubcats] = useState<string[]>([]);

  useEffect(() => {
    // Logic to filter the global categories for a cleaner mobile menu
    const fetchCategories = async () => {
      try {
        const menAndWomen = categories.filter(
          (cat) =>
            cat.name.toLowerCase() === 'men' ||
            cat.name.toLowerCase() === 'women'
        );

        const result: Category[] = menAndWomen.map((genderCat) => {
          const ethnicWear = genderCat.children.find(
            (subcat1: SubCat1) => subcat1.name.toLowerCase() === 'ethnic wear'
          );

          return {
            ...genderCat,
            children: ethnicWear?.children || [],
          };
        });

        setCategoriesFiltered(result);
      } catch (error) {
        toast.error('Failed to fetch categories');
      }
    };

    fetchCategories();
  }, [categories]);

  const selectedCategory = getCategoryByGender(categoriesFiltered, selectedGender);

  const handleSubcatToggle = (subcatId: string) => {
    // Toggles the visibility of a sub-category's children
    setOpenSubcats(prevOpenSubcats => 
        prevOpenSubcats.includes(subcatId)
            ? prevOpenSubcats.filter(id => id !== subcatId) // Remove if already open
            : [...prevOpenSubcats, subcatId] // Add if not open
    );
  };

  const handleLinkClick = (name: string) => {
    // resetFilters();
    router.push(`/product_directory?categories=${encodeURIComponent(name)}`);
  };

  if (categoriesFiltered.length === 0) {
    return null; // Don't render anything if categories haven't loaded yet
  }

  const isSubcatOpen = (subcatId: string) => openSubcats.includes(subcatId);

  return (
    <div className="w-full">
      {/* Gender Selection Buttons */}
      <div className="flex p-4 gap-4">
        <button
          className={`${manrope.className} ${
            selectedGender === 'Women'
              ? 'text-black font-bold border-b-2 border-black'
              : 'text-black font-normal'
          }`}
          onClick={() => setSelectedGender('Women')}
        >
          Women
        </button>
        <button
          className={`${manrope.className} ${
            selectedGender === 'Men'
              ? 'text-black font-bold border-b-2 border-black'
              : 'text-black font-normal'
          }`}
          onClick={() => setSelectedGender('Men')}
        >
          Men
        </button>
      </div>

      {/* Category List */}
      <div className="flex flex-col p-4">
        {selectedCategory?.children.map((subcat2: SubCat2) => (
          <div key={subcat2.category_id} className="border-b border-gray-200">
            <div
              className="flex justify-between items-center py-4 cursor-pointer"
              onClick={() => handleSubcatToggle(subcat2.category_id)}
            >
              <span
                className={`${manrope.className} text-sm text-[#121212]`}
                style={{ fontWeight: 600 }}
                onClick={(e) => {
                    e.stopPropagation();
                    handleLinkClick(subcat2.name);
                }}
              >
                {subcat2.name}
              </span>
              <Image
                src={
                  isSubcatOpen(subcat2.category_id)
                    ? '/ListingMobileHeader/up_arrow.svg'
                    : '/ListingMobileHeader/down_arrow.svg'
                }
                alt="Toggle"
                width={12}
                height={12}
                className="transition-transform duration-300"
              />
            </div>
            {isSubcatOpen(subcat2.category_id) && (
              <ul className="pl-4 space-y-2 pb-4">
                {subcat2.children.map((subcat3) => (
                  <li key={subcat3.category_id}>
                    <Link
                      href={`/product_directory?categories=${encodeURIComponent(
                        subcat3.name
                      )}`}
                      className={`${manrope.className} text-sm text-[#464646] hover:text-black`}
                      style={{ fontWeight: 400 }}
                    >
                      {subcat3.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}