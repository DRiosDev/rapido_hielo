// store/useProducts.ts
import { axiosInstance } from "@/axios/axiosInstance";
import { Product } from "@/types/Product";
import { create } from "zustand";

type ProductStore = {
  products: Product[];
  isLoading: boolean;
  fetchProducts: () => Promise<void>;
  clearProducts: () => void;
};

export const useProducts = create<ProductStore>((set) => ({
  products: [],
  isLoading: false,

  fetchProducts: async () => {
    set({ isLoading: true });
    try {
      const { data } = await axiosInstance.get("/api/products");
      set({ products: data.data });
    } finally {
      set({ isLoading: false });
    }
  },

  clearProducts: () => set({ products: [] }),
}));
