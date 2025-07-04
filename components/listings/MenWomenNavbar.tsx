import { manrope } from "@/font"
import { api } from "@/lib/axios";
import { useEffect } from "react"
import { toast } from "sonner";
export default function MenWomenNavbar() {
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoryRes = await api.get('categories/descendants/');
                console.log(categoryRes.data);
            }
            catch(error){
                toast.error('Failed to fetch categories');
            }
        }


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
    )
}