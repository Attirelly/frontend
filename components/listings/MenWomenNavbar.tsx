"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { Category, SubCat1, SubCat2 } from "@/types/CategoryTypes";
import { manrope } from "@/font";
import Link from "next/link";
import { useHeaderStore } from "@/store/listing_header_store";
import { useProductFilterStore } from "@/store/filterStore";
import { useRouter } from "next/navigation";

/**
 * Utility function to split an array into multiple columns.
 * 
 * @template T - The type of array elements
 * @param arr - The input array
 * @param columns - Number of columns to split into
 * @returns An array of columns, each containing a portion of the original array
 */
export const chunkIntoColumns = <T,>(arr: T[], columns: number): T[][] => {
  const result = Array.from({ length: columns }, () => [] as T[]);
  arr.forEach((item, index) => {
    result[index % columns].push(item); // Distribute items column-wise
  });
  return result;
};

/**
 * MenWomenNavbar Component
 * 
 * This navigation component shows top-level categories for **Men** and **Women**.
 * On hover, it expands into a mega-menu with subcategories (Ethnic wear → SubCat2 → SubCat3).
 * 
 * Features:
 * - Fetches category data from backend API (`/categories/descendants/`).
 * - Splits subcategories into max 5 columns for clean layout.
 * - Supports navigation via Next.js router + dynamic links.
 * - Resets filters from product store when navigating.
 */
export default function MenWomenNavbar() {
  const router = useRouter();
  const { resetFilters } = useProductFilterStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [hoveredGender, setHoveredGender] = useState<"Men" | "Women" | null>(
    null
  );
  const { setQuery } = useHeaderStore();
  console.log();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("categories/descendants/");
        const data: Category[] = res.data;

        // Filter only "Men" and "Women" categories
        const menAndWomen = data.filter(
          (cat) =>
            cat.name.toLowerCase() === "men" ||
            cat.name.toLowerCase() === "women"
        );

        // Only keep Ethnic Wear children
        const result: Category[] = menAndWomen.map((genderCat) => {
          const ethnicWear = genderCat.children.find(
            (subcat1: SubCat1) => subcat1.name.toLowerCase() === "ethnic wear"
          );

          return {
            ...genderCat,
            children: ethnicWear?.children || [],
          };
        });

        setCategories(result);
      } catch (error) {
        toast.error("Failed to fetch categories");
      }
    };

    fetchCategories();
  }, []);

  /**
   * @internal
   * Find the category object for the currently hovered gender
   */
  const category = categories.find(
    (c) => c.name.toLowerCase() === hoveredGender?.toLowerCase()
  );

  // Determine number of columns (max 5)
  const columnCount = category ? Math.min(category.children.length, 5) : 0;
  const columns = category
    ? chunkIntoColumns(category.children, columnCount)
    : [];

  return (
    <nav className="relative z-50 h-full">
      {/* Top-level nav items: Men / Women */}
      <div
        className="flex text-base text-[#373737] h-full"
        onMouseLeave={() => setHoveredGender(null)}
      >
        {["Men", "Women"].map((gender) => (
          <div
            key={gender}
            className="h-full flex items-center px-4 cursor-pointer hover:bg-gray-100"
            onMouseEnter={() => setHoveredGender(gender as "Men" | "Women")}
          >
            <span className={`${manrope.className}`} style={{ fontWeight: 400 }}>
              {gender}
            </span>
          </div>
        ))}
      </div>

      {/* Mega menu when hovering */}
      {hoveredGender && category && (
        <div
          className="absolute left-0 top-full bg-white shadow-xl rounded-bl-xl rounded-br-xl border-t z-40 w-max max-w-screen-xl cursor-pointer"
          onMouseEnter={() => setHoveredGender(hoveredGender)}
          onMouseLeave={() => setHoveredGender(null)}
        >
          <div className="flex">
            {columns.map((column, colIndex) => (
              <div
                key={colIndex}
                className={`p-4 w-full ${colIndex === 0
                  ? "rounded-bl-xl"
                  : colIndex === Math.min(category.children.length - 1, 4)
                    ? "rounded-br-xl"
                    : ""
                  }`}
                style={{
                  backgroundColor: colIndex % 2 === 0 ? "#f9f9f9" : "#ffffff",
                }}
              >
                {column.map((subcat2: SubCat2) => (
                  <div key={subcat2.category_id} className="p-4">
                    {/* SubCat2 title */}
                    <h3
                      className={`${manrope.className} text-sm mb-2 text-[#121212]`}
                      style={{ fontWeight: 700 }}
                      onClick={() => {
                        router.push(
                          `/product_directory?categories=${encodeURIComponent(
                            subcat2.name
                          )}`
                        );
                      }}
                    >
                      {subcat2.name}
                    </h3>

                    {/* SubCat3 links */}
                    <ul className="space-y-1">
                      {subcat2.children.map((subcat3) => (
                        <li key={subcat3.category_id}>
                          <Link
                            href={`/product_directory?categories=${encodeURIComponent(
                              subcat3.name
                            )}`}
                            className={`${manrope.className} text-sm text-[#464646] hover:text-black whitespace-nowrap`}
                            style={{ fontWeight: 400 }}
                            onClick={() => {
                              setHoveredGender(null);
                            }}
                          >
                            {subcat3.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
