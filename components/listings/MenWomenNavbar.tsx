import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { Category, SubCat1 } from "@/types/CategoryTypes";
import { manrope } from "@/font";

export default function MenWomenNavbar() {
  const [indianEthnicWearCategories, setIndianEthnicWearCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryRes = await api.get('categories/descendants/');
        const data: Category[] = categoryRes.data;

        // Filter only Men and Women categories
        const menAndWomen = data.filter(
          (cat) => cat.name.toLowerCase() === "men" || cat.name.toLowerCase() === "women"
        );

        // For each of Men/Women, extract only "Indian & Ethnic Wear" from their children
        const result: Category[] = menAndWomen.map((cat) => {
          const indianEthnicWear = cat.children.find(
            (subcat1: SubCat1) => subcat1.name.toLowerCase() === "indian & ethnic wear"
          );

          return {
            category_id: cat.category_id,
            name: cat.name,
            parent_id: cat.parent_id,
            children: indianEthnicWear ? [indianEthnicWear] : [],
          };
        });

        setIndianEthnicWearCategories(result);
        console.log("Filtered Indian & Ethnic Wear Categories:", result);
      } catch (error) {
        toast.error("Failed to fetch categories");
      }
    };

    fetchCategories();
  }, []);

  return (
    <nav className="flex justify-center gap-8 py-2 text-base text-[#373737]">
      <a className={`${manrope.className}`} style={{ fontWeight: 400 }}>
        Men
      </a>
      <a className={`${manrope.className}`} style={{ fontWeight: 400 }}>
        Women
      </a>
    </nav>
  );
}
