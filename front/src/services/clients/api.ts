import { axiosInstance } from "../../axios/axiosInstance";
import { Client } from "../../types/Client";
import { PaginatedResponse } from "../../types/pagination";
import { QueryParamsBase } from "../../types/query";

//index
export const getClients = async (
  params?: QueryParamsBase
): Promise<PaginatedResponse<Client>> => {
  const { data } = await axiosInstance.get("/api/clients", {
    params,
  });
  return data;
};

//show
export const getClient = async (
  id: Client["id"],
  params?: QueryParamsBase
): Promise<Client> => {
  const { data } = await axiosInstance.get(`/api/clients/${id}`, {
    params,
  });

  return data;
};

//store
export async function createClient(values: Client) {
  const { data } = await axiosInstance.post(`/api/clients`, values);
  return data;
}

//update
export async function updateClient(values: Client) {
  const { data } = await axiosInstance.put(`/api/clients/${values.id}`, values);
  return data;
}

//delete
export async function deleteClient(id: Client["id"]) {
  const { data } = await axiosInstance.patch(`/api/clients/${id}`);
  return data;
}
