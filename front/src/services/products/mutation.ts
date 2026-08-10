import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateCacheAfterCreate,
  updateCacheAfterUpdate,
} from "../../helpers/updateCacheMutation";
import { Product } from "../../types/Product";
import {
  createProduct,
  deleteProduct,
  updateProduct,
  updateProductQuantity,
  UpdateQuantityPayload,
  convertStock,
} from "./api";

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: Product) => createProduct(values),
    onSuccess: (data) => {
      console.log(data);

      const newItem = data.register as Product;
      updateCacheAfterCreate(queryClient, ["products", undefined], newItem);
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: Product) => updateProduct(values),
    onSuccess: (_response, values) => {
      updateCacheAfterUpdate(queryClient, ["products", undefined], values);
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: Product["id"]) => deleteProduct(id),
    onSuccess: (_response) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateProductQuantity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateQuantityPayload) => updateProductQuantity(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useConvertStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: convertStock,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
      queryClient.invalidateQueries({ queryKey: ["inventoryMovements"] });
    },
  });
}
