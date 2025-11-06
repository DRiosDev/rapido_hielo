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
