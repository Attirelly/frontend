import { api } from "@/lib/axios";
import { AxiosError } from "axios";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface UserSession {
  id: string;
  role: string;
}

type AuthState = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserSession | null;
  // setAuth: (isAuth: boolean, user: any) => void;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<UserSession>;
  refreshToken: () => Promise<boolean>;
  initializeAuth: () => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
  immer((set, get) => ({
    user: null,
    isLoading: false,
    isAuthenticated: false,
    error: null,

    login: async (email: string, password: string) => {
      set({ isLoading: true, error: null });
      try {
        const { data } = await api.post(
          "/api/auth/login",
          { email, password },
          {
            withCredentials: true,
          }
        );

        await get().fetchUser();
      } catch (error) {
        const err = error as AxiosError<{ message?: string }>;
        set({
          error: err.response?.data?.message || "Login failed",
          user: null,
          isAuthenticated: false,
        });
      } finally {
        set({ isLoading: false });
      }
    },

    logout: async () => {
      try {
        await api.post(
          "/api/auth/logout",
          {},
          {
            withCredentials: true,
          }
        );
        set({ user: null, isAuthenticated: false });
      } catch (error) {
        const err = error as AxiosError;
        console.error("Logout failed:", err.message);
        set({ error: "Logout failed" });
      }
    },

    fetchUser: async () => {
      try {
        const { data } = await api.get("/users/me", {
          withCredentials: true,
        });
        set({
          user: { id: data.id, role: data.role },
          isAuthenticated: true,
          error: null,
        });
        return {
          id: data.id,
          role: data.role,
        };
      } catch (error) {
        const err = error as AxiosError;
        console.log(err);

        set({
          user: null,
          isAuthenticated: false,
          error:
            err.response?.status === 401
              ? "Session expired"
              : "Failed to fetch user",
        });
        throw error;
      }
    },

    refreshToken: async () => {
      try {
        await api.post(
          "/users/refresh",
          {},
          {
            withCredentials: true,
          }
        );
        await get().fetchUser();
        return true;
      } catch (error) {
        return false;
      }
    },

    initializeAuth: async () => {
      set({ isLoading: true });
      try {
        await get().fetchUser();
      } catch {
        // Error already handled in fetchUser
      } finally {
        set({ isLoading: false });
      }
    },

    clearError: () => set({ error: null }),
  }))
);

// const useAuthStore = create<AuthState>((set) => ({
//   isAuthenticated: false,
//   isLoading: true,
//   user: null,
//   setAuth: (isAuth, user) =>
//     set({ isAuthenticated: isAuth, user, isLoading: false }),
// }));

export default useAuthStore;
