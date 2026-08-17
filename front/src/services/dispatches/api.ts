import { axiosInstance } from "../../axios/axiosInstance";
import { DeliverySlot } from "../../types/DeliverySlot";
import { Dispatch } from "../../types/Dispatch";
import { PaginatedResponse } from "../../types/pagination";
import { QueryParamsBase } from "../../types/query";

// Obtener tabla de despachos
export const getDispatches = async (
  params?: QueryParamsBase
): Promise<PaginatedResponse<Dispatch>> => {
  const { data } = await axiosInstance.get("/api/dispatches", {
    params,
  });
  return data;
};

// Cambiar estado de un despacho
export const updateDispatchStatus = async (
  orderId: string,
  status_dispatch: string
) => {
  const { data } = await axiosInstance.patch(
    `/api/dispatches/${orderId}/status`,
    { status_dispatch }
  );
  return data;
};

// Obtener todos los rangos horarios (Admin/Owner)
export const getDeliverySlots = async (): Promise<DeliverySlot[]> => {
  const { data } = await axiosInstance.get("/api/delivery-slots");
  return data;
};

// Crear nuevo rango horario
export const createDeliverySlot = async (slot: string) => {
  const { data } = await axiosInstance.post("/api/delivery-slots", { slot });
  return data;
};

// Actualizar o cambiar estado de un rango horario
export const updateDeliverySlot = async (
  id: string,
  payload: Partial<DeliverySlot>
) => {
  const { data } = await axiosInstance.put(`/api/delivery-slots/${id}`, payload);
  return data;
};

// Eliminar un rango horario
export const deleteDeliverySlot = async (id: string) => {
  const { data } = await axiosInstance.delete(`/api/delivery-slots/${id}`);
  return data;
};
