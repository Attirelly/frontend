import { create } from 'zustand';
import { Category } from '@/types/CategoryTypes';

interface CategoryState {
  categories: Category[];
  setCategories: (categories: Category[]) => void;
}

const useCategoryStore = create<CategoryState>((set) => ({
  categories: [],
  setCategories: (categories) => set({ categories }),
}));

export default useCategoryStore;
