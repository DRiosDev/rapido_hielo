import { create } from "zustand";
import { axiosInstance } from "../axios/axiosInstance";
import { User } from "./../types/user";

interface AuthState {
  isAuthenticated: boolean;
  isLoadingInitialData: boolean;
  userLogged: User | null;
  login: (email: string, password: string) => Promise<void>;
  getMe: () => Promise<void>;
  logout: () => void;
}

export const useAuthUser = create<AuthState>((set, get) => ({
  isAuthenticated: !!localStorage.getItem("token"),
  isLoadingInitialData: false,
  userLogged: null,

  login: async (email, password) => {
    try {
      const { data } = await axiosInstance.post("/api/auth/staff-login", {
        email,
        password,
      });

      localStorage.setItem("token", data.token);

      set({
        userLogged: data.user,
        isAuthenticated: true,
      });

      await get().getMe();
    } catch (error: any) {
      set({ isAuthenticated: false });

      const message =
        error.response?.data?.message || "Error al iniciar sesión";
      throw new Error(message);
    }
  },

  getMe: async () => {
    set({ isLoadingInitialData: true });

    try {
      const response = await axiosInstance.get(`/api/me`);

      set({
        userLogged: response.data,
        isAuthenticated: true,
        isLoadingInitialData: false,
      });
    } catch (error) {
      get().logout();
      set({ isLoadingInitialData: false });
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({
      isAuthenticated: false,
      userLogged: null,
    });
  },
}));
