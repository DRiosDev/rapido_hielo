import { create } from "zustand";
import { axiosInstance } from "@/axios/axiosInstance";

export interface OrderItem {
  id: string;
  fk_order_id: string;
  fk_product_id: string;
  name_product: string;
  price_product: number;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  number_order: number;
  status: string;
  date_dispatch: string | null;
  time_dispatch: string | null;
  method_payment: string;
  address_dispatch: string;
  url_vaucher: string | null;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

interface OrdersStore {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
}

export const useOrdersStore = create<OrdersStore>((set) => ({
  orders: [],
  isLoading: false,
  error: null,
  fetchOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/api/orders");
      set({ orders: response.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Error al obtener las órdenes",
        isLoading: false,
      });
    }
  },
}));
