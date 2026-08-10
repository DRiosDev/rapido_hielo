import { axiosInstance } from "../../axios/axiosInstance";
import { InventoryMovement } from "../../types/InventoryMovement";
import { PaginatedResponse } from "../../types/pagination";
import { QueryParamsBase } from "../../types/query";

export const getInventoryMovements = async (
  params?: QueryParamsBase & { product_id?: string; action?: string }
): Promise<PaginatedResponse<InventoryMovement>> => {
  const { data } = await axiosInstance.get("/api/inventory-movements", {
    params,
  });
  return data;
};

export const getProductMovements = async (
  productId: string,
  params?: QueryParamsBase
): Promise<PaginatedResponse<InventoryMovement>> => {
  const { data } = await axiosInstance.get(`/api/products/${productId}/movements`, {
    params,
  });
  return data;
};
