import { axiosInstance } from "../../axios/axiosInstance";
import { Client } from "../../types/Client";
import { Order } from "../../types/Order";
import { PaginatedResponse } from "../../types/pagination";
import { Product } from "../../types/Product";
import { QueryParamsBase } from "../../types/query";

export interface OrderWithClient extends Order {
  client?: Partial<Client>; // solo los datos que te interesa del cliente
  items?: Product[];
}

//index
export const getOrders = async (
  params?: QueryParamsBase
): Promise<PaginatedResponse<OrderWithClient>> => {
  const { data } = await axiosInstance.get("/api/orders", {
    params,
  });
  return data;
};

export const getOrderItems = async (
  id: Order["id"],
  params?: QueryParamsBase
): Promise<PaginatedResponse<OrderWithClient>> => {
  const { data } = await axiosInstance.get(`/api/orders/items/${id}`, {
    params,
  });
  return data;
};
