import { axiosInstance } from "@/axios/axiosInstance";
import { Client } from "@/types/Client";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  isLoadingInitialData: boolean;
  userLogged: Client | null;
  login: (email: string, password: string) => Promise<void>;
  getMe: () => Promise<void>;
  logout: () => Promise<void>;
  setUserLogged: (updatedData: Partial<Client>) => void;
}

export const useAuthUser = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  isLoadingInitialData: false,
  userLogged: null,

  login: async (email, password) => {
    try {
      const { data } = await axiosInstance.post("/api/auth/login", {
        email,
        password,
      });
      await SecureStore.setItemAsync("token", data.token);
      set({ userLogged: data.user, isAuthenticated: true });
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
      const response = await axiosInstance.get("/api/me");
      set({
        userLogged: response.data,
        isAuthenticated: true,
        isLoadingInitialData: false,
      });
    } catch {
      await get().logout();
      set({ isLoadingInitialData: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/api/logout");
    } catch (error) {
      console.error("Error al hacer logout:", error);
    } finally {
      await SecureStore.deleteItemAsync("token");
      set({ isAuthenticated: false, userLogged: null });
    }
  },

  setUserLogged: (updatedData) => {
    set((state) => ({
      userLogged: state.userLogged
        ? { ...state.userLogged, ...updatedData }
        : null,
    }));
  },
}));
