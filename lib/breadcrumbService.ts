import { BreadcrumbItem } from '@/types/breadcrumb';
import { Category } from '@/types/CategoryTypes';


export const getProductBreadcrumbs = async (productId: string): Promise<BreadcrumbItem[]> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/breadcrumbs/product/${productId}`);
    if (!res.ok) {
      console.error(`Error fetching breadcrumbs for product ${productId}:`, res.statusText);
      return []; // Return empty array on error
    }
    return res.json();
  } catch (error) {
    console.error("Failed to fetch product breadcrumbs:", error);
    return [];
  }
};

export const getCategoryBreadcrumbs = async (categoryId: string): Promise<BreadcrumbItem[]> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/breadcrumbs/category/${categoryId}`);
    if (!res.ok) {
      console.error(`Error fetching breadcrumbs for category ${categoryId}:`, res.statusText);
      return [];
    }
    return res.json();
  } catch (error) {
    console.error("Failed to fetch category breadcrumbs:", error);
    return [];
  }
};

// To get the category id by name 
export const getCategoryByName = async (categoryName: string): Promise<Category| null> => {
  try {
    const encodedName = encodeURIComponent(categoryName);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/breadcrumbs/by-name/${encodedName}`);
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Failed to fetch category by name:", error);
    return null;
  }
};

// to get category id by search param 
export const getCategoryBySname = async (categoryName: string): Promise<Category| null> => {
  try {
    const encodedName = encodeURIComponent(categoryName);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/breadcrumbs/by-search/${encodedName}`);
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Failed to fetch category by name:", error);
    return null;
  }
};