import { create } from 'zustand';

type AuthState = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: { id: string; role: string } | null;
  setAuth: (isAuth: boolean, user: any) => void;
};

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  setAuth: (isAuth, user) => set({ isAuthenticated: isAuth, user, isLoading: false }),
}));

export default useAuthStore;
