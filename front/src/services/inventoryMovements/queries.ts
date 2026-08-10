import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { QueryParamsBase } from "../../types/query";
import { getInventoryMovements, getProductMovements } from "./api";

export function useInventoryMovements(
  params?: QueryParamsBase & { product_id?: string; action?: string },
  options?: object
) {
  return useQuery({
    queryKey: ["inventoryMovements", params],
    queryFn: () => getInventoryMovements(params),
    placeholderData: keepPreviousData,
    ...options,
  });
}

export function useProductMovements(
  productId?: string,
  params?: QueryParamsBase,
  options?: object
) {
  return useQuery({
    queryKey: ["productMovements", productId, params],
    queryFn: () =>
      productId
        ? getProductMovements(productId, params)
        : Promise.reject("No product ID"),
    enabled: Boolean(productId),
    placeholderData: keepPreviousData,
    ...options,
  });
}
