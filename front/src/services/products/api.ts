import { axiosInstance } from "../../axios/axiosInstance";
import { PaginatedResponse } from "../../types/pagination";
import { Product } from "../../types/Product";
import { QueryParamsBase } from "../../types/query";

//index
export const getProducts = async (
  params?: QueryParamsBase
): Promise<PaginatedResponse<Product>> => {
  const { data } = await axiosInstance.get("/api/products", {
    params,
  });
  return data;
};

//store
export async function createProduct(values: Product) {
  const { data } = await axiosInstance.post(`/api/products`, values);
  return data;
}

//update
export async function updateProduct(values: Product) {
  const { data } = await axiosInstance.put(
    `/api/products/${values.id}`,
    values
  );
  return data;
}

//delete
export async function deleteProduct(id: Product["id"]) {
  const { data } = await axiosInstance.patch(`/api/products/${id}`);
  return data;
}

export type UpdateQuantityPayload = {
  id: string;
  action: "add" | "subtract";
  quantity: number;
};

//update quantity
export async function updateProductQuantity(payload: UpdateQuantityPayload) {
  const { id, action, quantity } = payload;
  const { data } = await axiosInstance.patch(`/api/products/quantity/${id}`, {
    action,
    quantity,
  });
  return data;
}
