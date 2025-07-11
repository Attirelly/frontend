import { create } from 'zustand'

type AdminState = {
    sortBy : string;
    setSortBy : (sortBy : string) => void;
}

export const  useAdminStore = create<AdminState>((set) => ({
    sortBy: 'date_desc',
    setSortBy: (sortBy: string) => set({ sortBy })
}));